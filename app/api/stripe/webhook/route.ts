import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Next.js must not parse body for signature verification — we read raw body
export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string | null;

        if (!userId || !customerId) {
          console.error("checkout.session.completed missing client_reference_id or customer");
          return NextResponse.json({ error: "Bad payload" }, { status: 400 });
        }

        const email = (session.customer_email ?? session.customer_details?.email) as string | undefined;
        if (email) {
          const profileInsert: Database["public"]["Tables"]["profiles"]["Insert"] = {
            id: userId,
            email,
            full_name: session.customer_details?.name ?? null,
            updated_at: new Date().toISOString(),
          };
          await supabaseAdmin.from("profiles").upsert(profileInsert, { onConflict: "id" });
        }

        let status: string = "active";
        let currentPeriodEnd: string | null = null;
        let cancelAtPeriodEnd = false;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          status = subscription.status;
          currentPeriodEnd = subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null;
          cancelAtPeriodEnd = subscription.cancel_at_period_end;
        }

        const subInsert: Database["public"]["Tables"]["subscriptions"]["Insert"] = {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status,
          current_period_end: currentPeriodEnd,
          cancel_at_period_end: cancelAtPeriodEnd,
        };
        await supabaseAdmin.from("subscriptions").upsert(subInsert, {
          onConflict: "user_id",
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const currentPeriodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_end: currentPeriodEnd,
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("subscriptions update error:", error);
          return NextResponse.json({ error: "Update failed" }, { status: 500 });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("subscriptions delete update error:", error);
          return NextResponse.json({ error: "Update failed" }, { status: 500 });
        }
        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

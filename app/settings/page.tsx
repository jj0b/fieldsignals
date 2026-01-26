import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server-auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { SettingsForm } from "./SettingsForm";

const DEFAULT_TIMEZONE = "America/Toronto";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?reason=settings");
  }

  // Ensure profile exists so user_settings can reference it (FK)
  const profileInsert: Database["public"]["Tables"]["profiles"]["Insert"] = {
    id: user.id,
    email: user.email ?? "",
    full_name: (user.user_metadata?.full_name as string | null) ?? null,
    updated_at: new Date().toISOString(),
  };
  await supabaseAdmin.from("profiles").upsert(profileInsert, { onConflict: "id" });

  const { data: settings } = await supabaseAdmin
    .from("user_settings")
    .select("weekly_brief_email, timezone")
    .eq("user_id", user.id)
    .maybeSingle();

  const weeklyBriefEmail = settings?.weekly_brief_email ?? user.email ?? "";
  const timezone = settings?.timezone ?? DEFAULT_TIMEZONE;

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();

  const isSubscribed = subscription?.status === "active" || subscription?.status === "trialing";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="font-semibold">
            FieldSignals
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col items-center justify-center p-4 gap-8">
          <SettingsForm
            weeklyBriefEmail={weeklyBriefEmail}
            timezone={timezone}
          />
          {!isSubscribed && (
            <section className="w-full max-w-sm rounded-lg border bg-card p-4">
              <h2 className="font-semibold mb-2">Subscription</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Subscribe to get your weekly decision brief by email.
              </p>
              <form action="/api/stripe/checkout-session" method="POST">
                <Button type="submit">Subscribe</Button>
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

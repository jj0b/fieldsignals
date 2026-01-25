import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server-auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { JOBBER_TOKEN_URL, JOBBER_STATE_COOKIE } from "@/lib/jobber/constants";
import { cookies } from "next/headers";

const callbackSchema = z.object({
  code: z.string().optional(),
  state: z.string().optional(),
  error: z.string().optional(),
});

function getExpiresAtFromJwt(token: string): string {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf8")
    );
    if (typeof payload.exp === "number") {
      return new Date(payload.exp * 1000).toISOString();
    }
  } catch {
    // fallback: 1 hour from now
  }
  return new Date(Date.now() + 60 * 60 * 1000).toISOString();
}

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const onboardingUrl = new URL("/onboarding", baseUrl);

  const { searchParams } = new URL(request.url);
  const parsed = callbackSchema.safeParse({
    code: searchParams.get("code") ?? undefined,
    state: searchParams.get("state") ?? undefined,
    error: searchParams.get("error") ?? undefined,
  });

  if (!parsed.success) {
    onboardingUrl.searchParams.set("error", "invalid_callback");
    return NextResponse.redirect(onboardingUrl);
  }

  const { code, state, error } = parsed.data;

  if (error || !code) {
    onboardingUrl.searchParams.set("error", error ?? "denied");
    return NextResponse.redirect(onboardingUrl);
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get(JOBBER_STATE_COOKIE)?.value;
  cookieStore.delete(JOBBER_STATE_COOKIE);

  if (!storedState || state !== storedState) {
    onboardingUrl.searchParams.set("error", "invalid_state");
    return NextResponse.redirect(onboardingUrl);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    onboardingUrl.searchParams.set("error", "session_expired");
    return NextResponse.redirect(onboardingUrl);
  }

  const clientId = process.env.JOBBER_CLIENT_ID;
  const clientSecret = process.env.JOBBER_CLIENT_SECRET;
  const redirectUri = process.env.JOBBER_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    onboardingUrl.searchParams.set("error", "config");
    return NextResponse.redirect(onboardingUrl);
  }

  const tokenRes = await fetch(JOBBER_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    console.error("Jobber token exchange failed:", tokenRes.status, errText);
    onboardingUrl.searchParams.set("error", "token_exchange");
    return NextResponse.redirect(onboardingUrl);
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token: string;
  };

  const expiresAt = getExpiresAtFromJwt(tokens.access_token);

  // Upsert profile (idempotent)
  const profileInsert: Database["public"]["Tables"]["profiles"]["Insert"] = {
    id: user.id,
    email: user.email ?? "",
    full_name: (user.user_metadata?.full_name as string | null) ?? null,
    updated_at: new Date().toISOString(),
  };
  await supabaseAdmin.from("profiles").upsert(profileInsert, { onConflict: "id" });

  // Jobber user id: we don't have it from token response; use a placeholder until we call GraphQL account query
  const jobberUserId = "pending"; // TODO: fetch from Jobber account query

  const connectionInsert: Database["public"]["Tables"]["jobber_connections"]["Insert"] = {
    user_id: user.id,
    jobber_user_id: jobberUserId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: expiresAt,
    connected_at: new Date().toISOString(),
    is_active: true,
  };
  await supabaseAdmin.from("jobber_connections").upsert(connectionInsert, { onConflict: "user_id" });

  onboardingUrl.searchParams.set("connected", "1");
  return NextResponse.redirect(onboardingUrl);
}

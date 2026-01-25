import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-auth";
import { JOBBER_AUTHORIZE_URL, JOBBER_STATE_COOKIE } from "@/lib/jobber/constants";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/sign-in?reason=connect&redirect=/api/jobber/authorize", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
    );
  }

  const clientId = process.env.JOBBER_CLIENT_ID;
  const redirectUri = process.env.JOBBER_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.redirect(
      new URL("/onboarding?error=config", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
    );
  }

  const state = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(JOBBER_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  });

  return NextResponse.redirect(`${JOBBER_AUTHORIZE_URL}?${params.toString()}`);
}

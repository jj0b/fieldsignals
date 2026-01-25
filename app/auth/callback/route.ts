import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const nextUrl = searchParams.get("next") ?? "/onboarding";

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=missing_code", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error.message);
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }

  return NextResponse.redirect(new URL(nextUrl, request.url));
}

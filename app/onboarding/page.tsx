import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server-auth";

const ERROR_MESSAGES: Record<string, string> = {
  denied: "You denied access to Jobber.",
  invalid_state: "Invalid or expired security state. Please try again.",
  invalid_callback: "Invalid callback parameters.",
  session_expired: "Your session expired. Please sign in again.",
  config: "Server configuration error. Please try again later.",
  token_exchange: "Could not connect to Jobber. Please try again.",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const params = await searchParams;
  const connected = params.connected === "1";
  const errorCode = params.error;
  const errorMessage = errorCode ? ERROR_MESSAGES[errorCode] ?? "Something went wrong." : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
          <CardDescription>
            {user ? `Signed in as ${user.email}` : "Sign in to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connected && (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
              Jobber is connected. You’re all set for now.
            </div>
          )}
          {errorMessage && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              {errorMessage}
            </div>
          )}
          {!user ? (
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild variant={connected ? "outline" : "default"} className="w-full">
                <Link href="/api/jobber/authorize">
                  {connected ? "Reconnect Jobber" : "Connect Jobber"}
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

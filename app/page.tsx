import Link from "next/link";
import { createClient } from "@/lib/supabase/server-auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasJobberConnection = false;
  if (user) {
    const { data } = await supabaseAdmin
      .from("jobber_connections")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();
    hasJobberConnection = !!data;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="font-semibold">
            FieldSignals
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <form action="/api/auth/signout" method="POST">
                  <Button type="submit" variant="ghost" size="sm">
                    Sign out
                  </Button>
                </form>
              </div>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            )}
            <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground">
              Settings
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Your weekly decision brief for Jobber
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a concise email every week with early warnings, schedule gaps, and what to do next—no dashboards, no logging in.
          </p>

          <Card className="max-w-md mx-auto text-left">
            <CardHeader>
              <CardTitle>Get started</CardTitle>
              <CardDescription>
                Connect your Jobber account so we can send you your weekly brief.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {!user ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Sign in first, then connect Jobber.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                </>
              ) : hasJobberConnection ? (
                <>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Jobber is connected.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/onboarding">Manage connection</Link>
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/api/jobber/authorize">Connect to Jobber</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function SignInForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Check your email for the magic link.");
  }

  const reason = searchParams.get("reason");
  const errorParam = searchParams.get("error");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          {reason === "connect"
            ? "Sign in to connect your Jobber account."
            : "Enter your email for a magic link."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorParam && (
          <p className="mb-4 text-sm text-destructive">
            {errorParam === "missing_code"
              ? "Invalid or expired link. Request a new one."
              : errorParam}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
            />
          </div>
          <Button type="submit" className="w-full" disabled={status === "loading" || status === "success"}>
            {status === "loading" ? "Sending…" : status === "success" ? "Check your email" : "Send magic link"}
          </Button>
          {message && (
            <p className={`text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
              {message}
            </p>
          )}
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/" className="underline hover:text-foreground">
            Back to home
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Suspense fallback={<Card className="w-full max-w-md"><CardHeader><CardTitle>Sign in</CardTitle><CardDescription>Loading…</CardDescription></CardHeader><CardContent><div className="h-10 animate-pulse rounded bg-muted" /></CardContent></Card>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSettings, type SettingsState } from "./actions";
import { TIMEZONE_OPTIONS } from "./constants";

interface SettingsFormProps {
  weeklyBriefEmail: string;
  timezone: string;
}

export function SettingsForm({ weeklyBriefEmail, timezone }: SettingsFormProps) {
  const [timezoneValue, setTimezoneValue] = useState(timezone);
  const [state, formAction, isPending] = useActionState<SettingsState, FormData>(
    updateSettings,
    {}
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Where and when to send your weekly decision brief.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        {state?.success && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Settings saved.
          </p>
        )}
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weekly_brief_email">Weekly brief email</Label>
            <Input
              id="weekly_brief_email"
              name="weekly_brief_email"
              type="email"
              placeholder="you@example.com"
              defaultValue={weeklyBriefEmail}
              required
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              We’ll send your brief to this address every week.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <input type="hidden" name="timezone" value={timezoneValue} />
            <Select
              value={timezoneValue}
              onValueChange={setTimezoneValue}
              disabled={isPending}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="ghost" asChild>
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

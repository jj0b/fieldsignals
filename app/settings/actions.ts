"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server-auth";
import type { Database } from "@/lib/supabase/database.types";

const settingsSchema = z.object({
  weekly_brief_email: z.string().email("Enter a valid email address"),
  timezone: z.string().min(1, "Select a timezone"),
});

export type SettingsState = {
  error?: string;
  success?: boolean;
};

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const parsed = settingsSchema.safeParse({
    weekly_brief_email: formData.get("weekly_brief_email")?.toString()?.trim(),
    timezone: formData.get("timezone")?.toString()?.trim(),
  });

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message =
      first.weekly_brief_email?.[0] ?? first.timezone?.[0] ?? "Invalid input.";
    return { error: message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?reason=settings");
  }

  const insert: Database["public"]["Tables"]["user_settings"]["Insert"] = {
    user_id: user.id,
    weekly_brief_email: parsed.data.weekly_brief_email,
    timezone: parsed.data.timezone,
  };

  const { error } = await supabase
    .from("user_settings")
    .upsert(insert, { onConflict: "user_id" });

  if (error) {
    return { error: "Failed to save settings. Please try again." };
  }

  return { success: true };
}

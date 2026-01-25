// TypeScript types for Supabase database
// These will be auto-generated later using: supabase gen types typescript --project-id <project-id>
// For now, basic types to get started

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobber_connections: {
        Row: {
          id: string;
          user_id: string;
          jobber_user_id: string;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          connected_at: string;
          last_synced_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          jobber_user_id: string;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          connected_at?: string;
          last_synced_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          jobber_user_id?: string;
          access_token?: string;
          refresh_token?: string;
          expires_at?: string;
          connected_at?: string;
          last_synced_at?: string | null;
          is_active?: boolean;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid' | 'paused';
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid' | 'paused';
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string | null;
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid' | 'paused';
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          weekly_brief_email: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weekly_brief_email: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weekly_brief_email?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      weekly_snapshots: {
        Row: {
          id: string;
          user_id: string;
          week_start_date: string;
          snapshot_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start_date: string;
          snapshot_data?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start_date?: string;
          snapshot_data?: Json;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

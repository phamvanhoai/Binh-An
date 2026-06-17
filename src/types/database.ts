export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      daily_messages: {
        Row: {
          id: string;
          message: string;
          reflection_question: string | null;
          category: string;
          active_date: string | null;
          is_active: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          message: string;
          reflection_question?: string | null;
          category: string;
          active_date?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["daily_messages"]["Insert"]>;
      };
      user_daily_messages: {
        Row: {
          id: string;
          user_id: string | null;
          message_id: string | null;
          opened_date: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          message_id?: string | null;
          opened_date: string;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["user_daily_messages"]["Insert"]>;
      };
      prayers: {
        Row: {
          id: string;
          user_id: string | null;
          content: string;
          type: string;
          visibility: string;
          allow_reactions: boolean | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          content: string;
          type: string;
          visibility?: string;
          allow_reactions?: boolean | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["prayers"]["Insert"]>;
      };
      prayer_reactions: {
        Row: {
          id: string;
          prayer_id: string | null;
          user_id: string | null;
          reaction_type: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          prayer_id?: string | null;
          user_id?: string | null;
          reaction_type: string;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["prayer_reactions"]["Insert"]>;
      };
      future_letters: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          content: string;
          open_at: string;
          opened_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          content: string;
          open_at: string;
          opened_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["future_letters"]["Insert"]>;
      };
      memorials: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          relationship: string | null;
          birth_date: string | null;
          death_date: string | null;
          avatar_url: string | null;
          message: string | null;
          visibility: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          relationship?: string | null;
          birth_date?: string | null;
          death_date?: string | null;
          avatar_url?: string | null;
          message?: string | null;
          visibility?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["memorials"]["Insert"]>;
      };
      gratitude_entries: {
        Row: {
          id: string;
          user_id: string | null;
          content: string;
          entry_date: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          content: string;
          entry_date?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["gratitude_entries"]["Insert"]>;
      };
      memorial_candles: {
        Row: {
          id: string;
          memorial_id: string | null;
          user_id: string | null;
          message: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          memorial_id?: string | null;
          user_id?: string | null;
          message?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["memorial_candles"]["Insert"]>;
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string | null;
          target_type: string;
          target_id: string;
          reason: string;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          reporter_id?: string | null;
          target_type: string;
          target_id: string;
          reason: string;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

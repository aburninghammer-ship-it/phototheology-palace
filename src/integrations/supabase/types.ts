export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          points: number | null
          requirement_count: number | null
          requirement_type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          points?: number | null
          requirement_count?: number | null
          requirement_type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          points?: number | null
          requirement_count?: number | null
          requirement_type?: string | null
        }
        Relationships: []
      }
      bible_images: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          is_favorite: boolean
          room_type: string
          updated_at: string
          user_id: string
          verse_reference: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url: string
          is_favorite?: boolean
          room_type: string
          updated_at?: string
          user_id: string
          verse_reference?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          is_favorite?: boolean
          room_type?: string
          updated_at?: string
          user_id?: string
          verse_reference?: string | null
        }
        Relationships: []
      }
      challenge_submissions: {
        Row: {
          ai_feedback: string | null
          challenge_id: string | null
          content: string
          id: string
          rating: number | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_feedback?: string | null
          challenge_id?: string | null
          content: string
          id?: string
          rating?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_feedback?: string | null
          challenge_id?: string | null
          content?: string
          id?: string
          rating?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: string | null
          ends_at: string | null
          id: string
          starts_at: string | null
          title: string
          verses: string[]
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          title: string
          verses: string[]
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          title?: string
          verses?: string[]
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          likes: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          id: string
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      flashcard_sets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_ai_generated: boolean
          is_public: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_ai_generated?: boolean
          is_public?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_ai_generated?: boolean
          is_public?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          answer: string
          created_at: string
          id: string
          order_index: number
          question: string
          set_id: string
          verse_reference: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          order_index?: number
          question: string
          set_id: string
          verse_reference?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          order_index?: number
          question?: string
          set_id?: string
          verse_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "flashcard_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      game_chat: {
        Row: {
          created_at: string | null
          game_id: string | null
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_chat_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_moves: {
        Row: {
          created_at: string | null
          game_id: string | null
          id: string
          move_data: Json
          player_id: string | null
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          move_data: Json
          player_id?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          move_data?: Json
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_moves_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          age_group: string | null
          created_at: string | null
          current_turn: string | null
          game_state: Json | null
          game_type: string
          id: string
          player1_id: string | null
          player2_id: string | null
          status: string | null
          updated_at: string | null
          winner_id: string | null
        }
        Insert: {
          age_group?: string | null
          created_at?: string | null
          current_turn?: string | null
          game_state?: Json | null
          game_type: string
          id?: string
          player1_id?: string | null
          player2_id?: string | null
          status?: string | null
          updated_at?: string | null
          winner_id?: string | null
        }
        Update: {
          age_group?: string | null
          created_at?: string | null
          current_turn?: string | null
          game_state?: Json | null
          game_type?: string
          id?: string
          player1_id?: string | null
          player2_id?: string | null
          status?: string | null
          updated_at?: string | null
          winner_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          last_seen: string | null
          level: number | null
          points: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          last_seen?: string | null
          level?: number | null
          points?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          last_seen?: string | null
          level?: number | null
          points?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          request_count: number
          updated_at: string
          user_id: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          request_count?: number
          updated_at?: string
          user_id: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          request_count?: number
          updated_at?: string
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          bridges: Json | null
          created_at: string
          current_step: number
          id: string
          movie_structure: Json | null
          sermon_style: string
          smooth_stones: Json | null
          status: string
          theme_passage: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bridges?: Json | null
          created_at?: string
          current_step?: number
          id?: string
          movie_structure?: Json | null
          sermon_style: string
          smooth_stones?: Json | null
          status?: string
          theme_passage: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bridges?: Json | null
          created_at?: string
          current_step?: number
          id?: string
          movie_structure?: Json | null
          sermon_style?: string
          smooth_stones?: Json | null
          status?: string
          theme_passage?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_room_chat: {
        Row: {
          created_at: string | null
          id: string
          message: string
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_room_chat_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "study_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      study_room_participants: {
        Row: {
          id: string
          joined_at: string | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "study_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      study_rooms: {
        Row: {
          created_at: string | null
          current_verse: string | null
          host_id: string | null
          id: string
          is_public: boolean | null
          max_participants: number | null
          name: string
        }
        Insert: {
          created_at?: string | null
          current_verse?: string | null
          host_id?: string | null
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          name: string
        }
        Update: {
          created_at?: string | null
          current_verse?: string | null
          host_id?: string | null
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          name?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

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
      bookmarks: {
        Row: {
          book: string
          chapter: number
          color: string | null
          created_at: string
          id: string
          note: string | null
          user_id: string
          verse: number | null
        }
        Insert: {
          book: string
          chapter: number
          color?: string | null
          created_at?: string
          id?: string
          note?: string | null
          user_id: string
          verse?: number | null
        }
        Update: {
          book?: string
          chapter?: number
          color?: string | null
          created_at?: string
          id?: string
          note?: string | null
          user_id?: string
          verse?: number | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_data: Json
          certificate_type: string
          course_name: string
          id: string
          is_public: boolean
          issued_at: string
          share_token: string | null
          user_id: string
        }
        Insert: {
          certificate_data?: Json
          certificate_type: string
          course_name: string
          id?: string
          is_public?: boolean
          issued_at?: string
          share_token?: string | null
          user_id: string
        }
        Update: {
          certificate_data?: Json
          certificate_type?: string
          course_name?: string
          id?: string
          is_public?: boolean
          issued_at?: string
          share_token?: string | null
          user_id?: string
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
      course_progress: {
        Row: {
          completed_at: string | null
          completed_lessons: Json
          course_name: string
          current_lesson: string | null
          id: string
          last_accessed_at: string
          progress_percentage: number
          started_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_lessons?: Json
          course_name: string
          current_lesson?: string | null
          id?: string
          last_accessed_at?: string
          progress_percentage?: number
          started_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_lessons?: Json
          course_name?: string
          current_lesson?: string | null
          id?: string
          last_accessed_at?: string
          progress_percentage?: number
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      drill_results: {
        Row: {
          completed_at: string
          created_at: string
          drill_data: Json
          drill_type: string
          floor_number: number
          id: string
          max_score: number
          room_id: string
          score: number
          time_seconds: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          drill_data?: Json
          drill_type: string
          floor_number: number
          id?: string
          max_score: number
          room_id: string
          score?: number
          time_seconds?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          drill_data?: Json
          drill_type?: string
          floor_number?: number
          id?: string
          max_score?: number
          room_id?: string
          score?: number
          time_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
      equation_codes: {
        Row: {
          biblical_reference: string | null
          category: string
          code: string
          created_at: string | null
          description: string
          floor_association: string | null
          id: string
          name: string
        }
        Insert: {
          biblical_reference?: string | null
          category: string
          code: string
          created_at?: string | null
          description: string
          floor_association?: string | null
          id?: string
          name: string
        }
        Update: {
          biblical_reference?: string | null
          category?: string
          code?: string
          created_at?: string | null
          description?: string
          floor_association?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      escape_room_attempts: {
        Row: {
          completed_at: string | null
          created_at: string
          hints_used: number
          id: string
          is_team: boolean
          room_id: string
          score: number
          started_at: string
          team_members: string[] | null
          time_elapsed_seconds: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          hints_used?: number
          id?: string
          is_team?: boolean
          room_id: string
          score?: number
          started_at?: string
          team_members?: string[] | null
          time_elapsed_seconds?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          hints_used?: number
          id?: string
          is_team?: boolean
          room_id?: string
          score?: number
          started_at?: string
          team_members?: string[] | null
          time_elapsed_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "escape_room_attempts_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "escape_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      escape_room_puzzles: {
        Row: {
          created_at: string
          expected_verses: string[]
          floor_number: number | null
          id: string
          points_partial: number
          points_perfect: number
          principle: string
          prompt: string
          puzzle_number: number
          room_id: string
          room_tag: string
          time_cap_minutes: number | null
          typology_notes: string | null
        }
        Insert: {
          created_at?: string
          expected_verses: string[]
          floor_number?: number | null
          id?: string
          points_partial?: number
          points_perfect?: number
          principle: string
          prompt: string
          puzzle_number: number
          room_id: string
          room_tag: string
          time_cap_minutes?: number | null
          typology_notes?: string | null
        }
        Update: {
          created_at?: string
          expected_verses?: string[]
          floor_number?: number | null
          id?: string
          points_partial?: number
          points_perfect?: number
          principle?: string
          prompt?: string
          puzzle_number?: number
          room_id?: string
          room_tag?: string
          time_cap_minutes?: number | null
          typology_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escape_room_puzzles_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "escape_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      escape_room_solutions: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          is_correct: boolean
          points_earned: number
          principle_used: string
          puzzle_id: string
          room_justification: string
          submitted_at: string
          submitted_verses: string[]
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          is_correct?: boolean
          points_earned?: number
          principle_used: string
          puzzle_id: string
          room_justification: string
          submitted_at?: string
          submitted_verses: string[]
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          points_earned?: number
          principle_used?: string
          puzzle_id?: string
          room_justification?: string
          submitted_at?: string
          submitted_verses?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "escape_room_solutions_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "escape_room_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escape_room_solutions_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "escape_room_puzzles"
            referencedColumns: ["id"]
          },
        ]
      }
      escape_rooms: {
        Row: {
          biblical_conclusion: string | null
          category: string | null
          created_at: string
          difficulty: string
          expires_at: string
          id: string
          max_hints: number
          mode: string
          time_limit_minutes: number
          title: string
        }
        Insert: {
          biblical_conclusion?: string | null
          category?: string | null
          created_at?: string
          difficulty?: string
          expires_at: string
          id?: string
          max_hints?: number
          mode: string
          time_limit_minutes?: number
          title: string
        }
        Update: {
          biblical_conclusion?: string | null
          category?: string | null
          created_at?: string
          difficulty?: string
          expires_at?: string
          id?: string
          max_hints?: number
          mode?: string
          time_limit_minutes?: number
          title?: string
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
      game_ratings: {
        Row: {
          created_at: string | null
          feedback: string | null
          game_id: string
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          game_id: string
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          game_id?: string
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_ratings_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "monthly_games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scores: {
        Row: {
          created_at: string
          game_type: string
          id: string
          metadata: Json | null
          mode: string | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game_type: string
          id?: string
          metadata?: Json | null
          mode?: string | null
          score?: number
          user_id: string
        }
        Update: {
          created_at?: string
          game_type?: string
          id?: string
          metadata?: Json | null
          mode?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
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
      memorization_verses: {
        Row: {
          added_at: string
          book: string
          chapter: number
          id: string
          last_reviewed: string | null
          mastery_level: number
          notes: string | null
          review_count: number
          user_id: string
          verse: number
          verse_reference: string
          verse_text: string
        }
        Insert: {
          added_at?: string
          book: string
          chapter: number
          id?: string
          last_reviewed?: string | null
          mastery_level?: number
          notes?: string | null
          review_count?: number
          user_id: string
          verse: number
          verse_reference: string
          verse_text: string
        }
        Update: {
          added_at?: string
          book?: string
          chapter?: number
          id?: string
          last_reviewed?: string | null
          mastery_level?: number
          notes?: string | null
          review_count?: number
          user_id?: string
          verse?: number
          verse_reference?: string
          verse_text?: string
        }
        Relationships: []
      }
      monthly_games: {
        Row: {
          average_rating: number | null
          categories: Json
          created_at: string | null
          difficulty: string
          expires_at: string | null
          game_description: string
          game_name: string
          game_rules: Json
          game_type: string
          id: string
          is_active: boolean | null
          month_year: string
          play_count: number | null
        }
        Insert: {
          average_rating?: number | null
          categories: Json
          created_at?: string | null
          difficulty: string
          expires_at?: string | null
          game_description: string
          game_name: string
          game_rules: Json
          game_type: string
          id?: string
          is_active?: boolean | null
          month_year: string
          play_count?: number | null
        }
        Update: {
          average_rating?: number | null
          categories?: Json
          created_at?: string | null
          difficulty?: string
          expires_at?: string | null
          game_description?: string
          game_name?: string
          game_rules?: Json
          game_type?: string
          id?: string
          is_active?: boolean | null
          month_year?: string
          play_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_code_used: string | null
          avatar_url: string | null
          chain_chess_streak: number | null
          created_at: string | null
          daily_study_streak: number | null
          display_name: string | null
          equations_streak: number | null
          gem_creation_streak: number | null
          has_lifetime_access: boolean
          id: string
          is_student: boolean | null
          last_seen: string | null
          level: number | null
          lifetime_access_granted_at: string | null
          longest_chess_streak: number | null
          longest_equations_streak: number | null
          longest_gem_streak: number | null
          longest_study_streak: number | null
          points: number | null
          referral_code: string | null
          stripe_customer_id: string | null
          student_expires_at: string | null
          student_verified_at: string | null
          subscription_status: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
          trial_started_at: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          access_code_used?: string | null
          avatar_url?: string | null
          chain_chess_streak?: number | null
          created_at?: string | null
          daily_study_streak?: number | null
          display_name?: string | null
          equations_streak?: number | null
          gem_creation_streak?: number | null
          has_lifetime_access?: boolean
          id: string
          is_student?: boolean | null
          last_seen?: string | null
          level?: number | null
          lifetime_access_granted_at?: string | null
          longest_chess_streak?: number | null
          longest_equations_streak?: number | null
          longest_gem_streak?: number | null
          longest_study_streak?: number | null
          points?: number | null
          referral_code?: string | null
          stripe_customer_id?: string | null
          student_expires_at?: string | null
          student_verified_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          access_code_used?: string | null
          avatar_url?: string | null
          chain_chess_streak?: number | null
          created_at?: string | null
          daily_study_streak?: number | null
          display_name?: string | null
          equations_streak?: number | null
          gem_creation_streak?: number | null
          has_lifetime_access?: boolean
          id?: string
          is_student?: boolean | null
          last_seen?: string | null
          level?: number | null
          lifetime_access_granted_at?: string | null
          longest_chess_streak?: number | null
          longest_equations_streak?: number | null
          longest_gem_streak?: number | null
          longest_study_streak?: number | null
          points?: number | null
          referral_code?: string | null
          stripe_customer_id?: string | null
          student_expires_at?: string | null
          student_verified_at?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
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
      reading_history: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          last_read_at: string
          user_id: string
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          last_read_at?: string
          user_id: string
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          last_read_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_email: string | null
          referred_user_id: string | null
          referrer_id: string
          reward_given: boolean | null
          status: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id: string
          reward_given?: boolean | null
          status?: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_email?: string | null
          referred_user_id?: string | null
          referrer_id?: string
          reward_given?: boolean | null
          status?: string
        }
        Relationships: []
      }
      room_progress: {
        Row: {
          best_drill_score: number
          completed_at: string | null
          created_at: string
          drill_attempts: number
          exercises_completed: Json
          floor_number: number
          id: string
          notes: string | null
          room_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          best_drill_score?: number
          completed_at?: string | null
          created_at?: string
          drill_attempts?: number
          exercises_completed?: Json
          floor_number: number
          id?: string
          notes?: string | null
          room_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          best_drill_score?: number
          completed_at?: string | null
          created_at?: string
          drill_attempts?: number
          exercises_completed?: Json
          floor_number?: number
          id?: string
          notes?: string | null
          room_id?: string
          updated_at?: string
          user_id?: string
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
      spaced_repetition_items: {
        Row: {
          content: Json
          created_at: string
          ease_factor: number
          id: string
          interval_days: number
          item_id: string
          item_type: string
          last_reviewed_at: string | null
          next_review_date: string
          repetitions: number
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          item_id: string
          item_type: string
          last_reviewed_at?: string | null
          next_review_date?: string
          repetitions?: number
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          item_id?: string
          item_type?: string
          last_reviewed_at?: string | null
          next_review_date?: string
          repetitions?: number
          user_id?: string
        }
        Relationships: []
      }
      special_access_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          is_active: boolean
          max_uses: number | null
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          expires_at: string
          id?: string
          is_active?: boolean
          max_uses?: number | null
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          max_uses?: number | null
          used_count?: number
        }
        Relationships: []
      }
      study_activities: {
        Row: {
          activity_data: Json
          activity_type: string
          created_at: string
          id: string
          is_public: boolean
          user_id: string
        }
        Insert: {
          activity_data?: Json
          activity_type: string
          created_at?: string
          id?: string
          is_public?: boolean
          user_id: string
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          created_at?: string
          id?: string
          is_public?: boolean
          user_id?: string
        }
        Relationships: []
      }
      study_partners: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          partner_id: string
          status: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          partner_id: string
          status?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          partner_id?: string
          status?: string
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
      training_drills: {
        Row: {
          created_at: string | null
          description: string
          drill_number: number
          id: string
          prompt: string
          room_tag: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          drill_number: number
          id?: string
          prompt: string
          room_tag: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          drill_number?: number
          id?: string
          prompt?: string
          room_tag?: string
          title?: string
        }
        Relationships: []
      }
      treasure_hunt_answers: {
        Row: {
          clue_id: string
          hunt_id: string
          id: string
          is_correct: boolean
          submitted_at: string | null
          user_answer: string
          user_id: string
        }
        Insert: {
          clue_id: string
          hunt_id: string
          id?: string
          is_correct: boolean
          submitted_at?: string | null
          user_answer: string
          user_id: string
        }
        Update: {
          clue_id?: string
          hunt_id?: string
          id?: string
          is_correct?: boolean
          submitted_at?: string | null
          user_answer?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treasure_hunt_answers_clue_id_fkey"
            columns: ["clue_id"]
            isOneToOne: false
            referencedRelation: "treasure_hunt_clues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treasure_hunt_answers_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "treasure_hunts"
            referencedColumns: ["id"]
          },
        ]
      }
      treasure_hunt_clues: {
        Row: {
          clue_number: number
          correct_answer: string
          created_at: string | null
          hint: string
          hunt_id: string
          id: string
          principle: string
          room_tag: string
        }
        Insert: {
          clue_number: number
          correct_answer: string
          created_at?: string | null
          hint: string
          hunt_id: string
          id?: string
          principle: string
          room_tag: string
        }
        Update: {
          clue_number?: number
          correct_answer?: string
          created_at?: string | null
          hint?: string
          hunt_id?: string
          id?: string
          principle?: string
          room_tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "treasure_hunt_clues_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "treasure_hunts"
            referencedColumns: ["id"]
          },
        ]
      }
      treasure_hunt_participants: {
        Row: {
          completed_at: string | null
          completion_time_seconds: number | null
          current_clue: number | null
          hunt_id: string
          id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_time_seconds?: number | null
          current_clue?: number | null
          hunt_id: string
          id?: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_time_seconds?: number | null
          current_clue?: number | null
          hunt_id?: string
          id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treasure_hunt_participants_hunt_id_fkey"
            columns: ["hunt_id"]
            isOneToOne: false
            referencedRelation: "treasure_hunts"
            referencedColumns: ["id"]
          },
        ]
      }
      treasure_hunts: {
        Row: {
          biblical_conclusion: string
          created_at: string | null
          created_by: string | null
          difficulty: string
          expires_at: string
          id: string
          title: string
          total_clues: number
        }
        Insert: {
          biblical_conclusion: string
          created_at?: string | null
          created_by?: string | null
          difficulty: string
          expires_at: string
          id?: string
          title: string
          total_clues: number
        }
        Update: {
          biblical_conclusion?: string
          created_at?: string | null
          created_by?: string | null
          difficulty?: string
          expires_at?: string
          id?: string
          title?: string
          total_clues?: number
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
      user_drill_completions: {
        Row: {
          completed_at: string | null
          drill_id: string
          id: string
          response: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          drill_id: string
          id?: string
          response?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          drill_id?: string
          id?: string
          response?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_drill_completions_drill_id_fkey"
            columns: ["drill_id"]
            isOneToOne: false
            referencedRelation: "training_drills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          bible_font_size: string | null
          bible_translation: string | null
          id: string
          reading_mode: string | null
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bible_font_size?: string | null
          bible_translation?: string | null
          id?: string
          reading_mode?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bible_font_size?: string | null
          bible_translation?: string | null
          id?: string
          reading_mode?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      generate_referral_code: { Args: { user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_access_code: { Args: { access_code: string }; Returns: Json }
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

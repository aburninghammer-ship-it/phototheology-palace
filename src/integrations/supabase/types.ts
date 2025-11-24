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
          category: string | null
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
          category?: string | null
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
          category?: string | null
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
      app_update_ideas: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
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
          is_public: boolean
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
          is_public?: boolean
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
          is_public?: boolean
          room_type?: string
          updated_at?: string
          user_id?: string
          verse_reference?: string | null
        }
        Relationships: []
      }
      bible_study_lessons: {
        Row: {
          big_idea: string | null
          christ_emphasis: string | null
          core_points: string[] | null
          created_at: string | null
          discussion_questions: string[] | null
          id: string
          key_passages: string | null
          key_rooms: string[] | null
          lesson_number: number
          main_floors: string[] | null
          palace_activity: string | null
          palace_mapping_notes: string | null
          series_id: string
          take_home_challenge: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          big_idea?: string | null
          christ_emphasis?: string | null
          core_points?: string[] | null
          created_at?: string | null
          discussion_questions?: string[] | null
          id?: string
          key_passages?: string | null
          key_rooms?: string[] | null
          lesson_number: number
          main_floors?: string[] | null
          palace_activity?: string | null
          palace_mapping_notes?: string | null
          series_id: string
          take_home_challenge?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          big_idea?: string | null
          christ_emphasis?: string | null
          core_points?: string[] | null
          created_at?: string | null
          discussion_questions?: string[] | null
          id?: string
          key_passages?: string | null
          key_rooms?: string[] | null
          lesson_number?: number
          main_floors?: string[] | null
          palace_activity?: string | null
          palace_mapping_notes?: string | null
          series_id?: string
          take_home_challenge?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_study_lessons_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "bible_study_series"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_study_series: {
        Row: {
          audience_type: string
          context: string
          created_at: string | null
          description: string | null
          id: string
          is_template: boolean | null
          lesson_count: number
          primary_goal: string
          status: string | null
          theme_subject: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audience_type: string
          context: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          lesson_count: number
          primary_goal: string
          status?: string | null
          theme_subject: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audience_type?: string
          context?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          lesson_count?: number
          primary_goal?: string
          status?: string | null
          theme_subject?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bible_verses_tokenized: {
        Row: {
          book: string
          chapter: number
          created_at: string | null
          id: string
          text_kjv: string
          tokens: Json
          verse_num: number
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string | null
          id?: string
          text_kjv: string
          tokens: Json
          verse_num: number
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string | null
          id?: string
          text_kjv?: string
          tokens?: Json
          verse_num?: number
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
          created_at: string
          id: string
          principle_applied: string | null
          rating: number | null
          submission_data: Json | null
          submitted_at: string | null
          time_spent: number | null
          user_id: string
        }
        Insert: {
          ai_feedback?: string | null
          challenge_id?: string | null
          content: string
          created_at?: string
          id?: string
          principle_applied?: string | null
          rating?: number | null
          submission_data?: Json | null
          submitted_at?: string | null
          time_spent?: number | null
          user_id: string
        }
        Update: {
          ai_feedback?: string | null
          challenge_id?: string | null
          content?: string
          created_at?: string
          id?: string
          principle_applied?: string | null
          rating?: number | null
          submission_data?: Json | null
          submitted_at?: string | null
          time_spent?: number | null
          user_id?: string
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
          challenge_subtype: string | null
          challenge_tier: string | null
          challenge_type: string
          created_at: string | null
          created_by: string | null
          day_in_rotation: number | null
          description: string | null
          difficulty: string | null
          ends_at: string | null
          id: string
          instructions: Json | null
          principle_used: string | null
          room_codes: string[] | null
          search_timestamp: string | null
          source_url: string | null
          starts_at: string | null
          title: string
          ui_config: Json | null
          verses: string[]
        }
        Insert: {
          challenge_subtype?: string | null
          challenge_tier?: string | null
          challenge_type: string
          created_at?: string | null
          created_by?: string | null
          day_in_rotation?: number | null
          description?: string | null
          difficulty?: string | null
          ends_at?: string | null
          id?: string
          instructions?: Json | null
          principle_used?: string | null
          room_codes?: string[] | null
          search_timestamp?: string | null
          source_url?: string | null
          starts_at?: string | null
          title: string
          ui_config?: Json | null
          verses: string[]
        }
        Update: {
          challenge_subtype?: string | null
          challenge_tier?: string | null
          challenge_type?: string
          created_at?: string | null
          created_by?: string | null
          day_in_rotation?: number | null
          description?: string | null
          difficulty?: string | null
          ends_at?: string | null
          id?: string
          instructions?: Json | null
          principle_used?: string | null
          room_codes?: string[] | null
          search_timestamp?: string | null
          source_url?: string | null
          starts_at?: string | null
          title?: string
          ui_config?: Json | null
          verses?: string[]
        }
        Relationships: []
      }
      christ_chapter_findings: {
        Row: {
          book: string
          chapter: number
          christ_action: string
          christ_name: string
          created_at: string
          crosslink_verses: string[]
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book: string
          chapter: number
          christ_action: string
          christ_name: string
          created_at?: string
          crosslink_verses?: string[]
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book?: string
          chapter?: number
          christ_action?: string
          christ_name?: string
          created_at?: string
          crosslink_verses?: string[]
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      church_campaign_participation: {
        Row: {
          campaign_id: string
          completed_at: string | null
          created_at: string
          id: string
          time_spent: number | null
          user_id: string
        }
        Insert: {
          campaign_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          time_spent?: number | null
          user_id: string
        }
        Update: {
          campaign_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          time_spent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_campaign_participation_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "church_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      church_campaigns: {
        Row: {
          challenge_id: string | null
          church_id: string
          created_at: string
          created_by: string
          description: string | null
          ends_at: string
          id: string
          is_active: boolean
          starts_at: string
          title: string
        }
        Insert: {
          challenge_id?: string | null
          church_id: string
          created_at?: string
          created_by: string
          description?: string | null
          ends_at: string
          id?: string
          is_active?: boolean
          starts_at?: string
          title: string
        }
        Update: {
          challenge_id?: string | null
          church_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean
          starts_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_campaigns_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_campaigns_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_invitations: {
        Row: {
          accepted_at: string | null
          church_id: string
          created_at: string
          expires_at: string
          id: string
          invitation_code: string
          invited_by: string
          invited_email: string
          role: Database["public"]["Enums"]["church_member_role"]
          status: string
        }
        Insert: {
          accepted_at?: string | null
          church_id: string
          created_at?: string
          expires_at: string
          id?: string
          invitation_code: string
          invited_by: string
          invited_email: string
          role?: Database["public"]["Enums"]["church_member_role"]
          status?: string
        }
        Update: {
          accepted_at?: string | null
          church_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          invitation_code?: string
          invited_by?: string
          invited_email?: string
          role?: Database["public"]["Enums"]["church_member_role"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_invitations_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_members: {
        Row: {
          church_id: string
          id: string
          invited_by: string | null
          joined_at: string
          role: Database["public"]["Enums"]["church_member_role"]
          user_id: string
        }
        Insert: {
          church_id: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: Database["public"]["Enums"]["church_member_role"]
          user_id: string
        }
        Update: {
          church_id?: string
          id?: string
          invited_by?: string | null
          joined_at?: string
          role?: Database["public"]["Enums"]["church_member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_members_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          billing_email: string
          branded_name: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          id: string
          logo_url: string | null
          max_seats: number
          name: string
          stripe_customer_id: string | null
          subscription_ends_at: string | null
          subscription_started_at: string
          subscription_status: string
          tier: Database["public"]["Enums"]["church_tier"]
          updated_at: string
        }
        Insert: {
          billing_email: string
          branded_name?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          max_seats?: number
          name: string
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string
          subscription_status?: string
          tier?: Database["public"]["Enums"]["church_tier"]
          updated_at?: string
        }
        Update: {
          billing_email?: string
          branded_name?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          max_seats?: number
          name?: string
          stripe_customer_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string
          subscription_status?: string
          tier?: Database["public"]["Enums"]["church_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      community_challenge_responses: {
        Row: {
          created_at: string
          grade_score: number | null
          graded_at: string | null
          highlighted_parts: string[] | null
          id: string
          jeeves_grade: Json | null
          post_id: string
          response_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          grade_score?: number | null
          graded_at?: string | null
          highlighted_parts?: string[] | null
          id?: string
          jeeves_grade?: Json | null
          post_id: string
          response_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          grade_score?: number | null
          graded_at?: string | null
          highlighted_parts?: string[] | null
          id?: string
          jeeves_grade?: Json | null
          post_id?: string
          response_text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_challenge_responses_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          post_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          participant1_id: string
          participant2_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant1_id: string
          participant2_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant1_id?: string
          participant2_id?: string
          updated_at?: string
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
      daily_reading_completions: {
        Row: {
          completed_at: string
          created_at: string | null
          day_number: number
          floor_responses: Json | null
          floors_completed: string[] | null
          id: string
          notes: string | null
          user_progress_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string | null
          day_number: number
          floor_responses?: Json | null
          floors_completed?: string[] | null
          id?: string
          notes?: string | null
          user_progress_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string | null
          day_number?: number
          floor_responses?: Json | null
          floors_completed?: string[] | null
          id?: string
          notes?: string | null
          user_progress_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_reading_completions_user_progress_id_fkey"
            columns: ["user_progress_id"]
            isOneToOne: false
            referencedRelation: "user_reading_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_verses: {
        Row: {
          breakdown: Json
          created_at: string | null
          date: string
          id: string
          principles_used: string[]
          verse_reference: string
          verse_text: string
        }
        Insert: {
          breakdown: Json
          created_at?: string | null
          date: string
          id?: string
          principles_used: string[]
          verse_reference: string
          verse_text: string
        }
        Update: {
          breakdown?: Json
          created_at?: string | null
          date?: string
          id?: string
          principles_used?: string[]
          verse_reference?: string
          verse_text?: string
        }
        Relationships: []
      }
      dojo_challenges: {
        Row: {
          challenge_type: string
          completed_at: string | null
          created_at: string | null
          day_number: number
          id: string
          reflection: string | null
          user_id: string
        }
        Insert: {
          challenge_type: string
          completed_at?: string | null
          created_at?: string | null
          day_number: number
          id?: string
          reflection?: string | null
          user_id: string
        }
        Update: {
          challenge_type?: string
          completed_at?: string | null
          created_at?: string | null
          day_number?: number
          id?: string
          reflection?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dojo_lessons: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string
          notes?: string | null
          updated_at?: string | null
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
      email_campaigns: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          trigger_condition: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          trigger_condition: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          trigger_condition?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          email_address: string
          error_message: string | null
          id: string
          opened_at: string | null
          sent_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          email_address: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          email_address?: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      encyclopedia_articles: {
        Row: {
          adventist_apologetics_chains: Json | null
          adventist_controversies: string[] | null
          adventist_doctrinal_position: string | null
          chains: Json | null
          created_at: string | null
          created_by: string | null
          cross_refs: string[] | null
          cultural_notes: string | null
          historical_background: string | null
          id: string
          is_priority: boolean | null
          is_published: boolean | null
          lexical_data: Json | null
          primary_verses: string[]
          pt_codes: string[] | null
          pt_commentary: Json | null
          pt_floors: string[] | null
          pt_rooms: string[] | null
          related_game_topics: string[] | null
          search_vector: unknown
          slug: string
          summary_1d: string
          title: string
          topic_type: string[]
          updated_at: string | null
          visual_hooks: Json | null
        }
        Insert: {
          adventist_apologetics_chains?: Json | null
          adventist_controversies?: string[] | null
          adventist_doctrinal_position?: string | null
          chains?: Json | null
          created_at?: string | null
          created_by?: string | null
          cross_refs?: string[] | null
          cultural_notes?: string | null
          historical_background?: string | null
          id?: string
          is_priority?: boolean | null
          is_published?: boolean | null
          lexical_data?: Json | null
          primary_verses?: string[]
          pt_codes?: string[] | null
          pt_commentary?: Json | null
          pt_floors?: string[] | null
          pt_rooms?: string[] | null
          related_game_topics?: string[] | null
          search_vector?: unknown
          slug: string
          summary_1d: string
          title: string
          topic_type?: string[]
          updated_at?: string | null
          visual_hooks?: Json | null
        }
        Update: {
          adventist_apologetics_chains?: Json | null
          adventist_controversies?: string[] | null
          adventist_doctrinal_position?: string | null
          chains?: Json | null
          created_at?: string | null
          created_by?: string | null
          cross_refs?: string[] | null
          cultural_notes?: string | null
          historical_background?: string | null
          id?: string
          is_priority?: boolean | null
          is_published?: boolean | null
          lexical_data?: Json | null
          primary_verses?: string[]
          pt_codes?: string[] | null
          pt_commentary?: Json | null
          pt_floors?: string[] | null
          pt_rooms?: string[] | null
          related_game_topics?: string[] | null
          search_vector?: unknown
          slug?: string
          summary_1d?: string
          title?: string
          topic_type?: string[]
          updated_at?: string | null
          visual_hooks?: Json | null
        }
        Relationships: []
      }
      equation_challenges: {
        Row: {
          created_at: string | null
          created_by: string
          difficulty: string
          equation: string
          explanation: string
          id: string
          is_public: boolean | null
          share_code: string
          solve_count: number | null
          symbols: string[]
          title: string
          updated_at: string | null
          verse: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          difficulty: string
          equation: string
          explanation: string
          id?: string
          is_public?: boolean | null
          share_code: string
          solve_count?: number | null
          symbols: string[]
          title: string
          updated_at?: string | null
          verse: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          difficulty?: string
          equation?: string
          explanation?: string
          id?: string
          is_public?: boolean | null
          share_code?: string
          solve_count?: number | null
          symbols?: string[]
          title?: string
          updated_at?: string | null
          verse?: string
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
      floor_assessments: {
        Row: {
          ai_feedback: Json
          assessment_type: string
          attempt_number: number
          completed_at: string
          created_at: string
          floor_number: number
          id: string
          passed: boolean
          questions_data: Json
          score: number
          user_answers: Json
          user_id: string
        }
        Insert: {
          ai_feedback?: Json
          assessment_type: string
          attempt_number?: number
          completed_at?: string
          created_at?: string
          floor_number: number
          id?: string
          passed: boolean
          questions_data?: Json
          score: number
          user_answers?: Json
          user_id: string
        }
        Update: {
          ai_feedback?: Json
          assessment_type?: string
          attempt_number?: number
          completed_at?: string
          created_at?: string
          floor_number?: number
          id?: string
          passed?: boolean
          questions_data?: Json
          score?: number
          user_answers?: Json
          user_id?: string
        }
        Relationships: []
      }
      game_chat: {
        Row: {
          created_at: string | null
          game_id: string | null
          id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          message?: string
          user_id?: string
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
        Relationships: [
          {
            foreignKeyName: "fk_game_scores_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          player1_id: string
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
          player1_id: string
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
          player1_id?: string
          player2_id?: string | null
          status?: string | null
          updated_at?: string | null
          winner_id?: string | null
        }
        Relationships: []
      }
      genesis_challenge_daily_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          day_number: number
          floors_completed: number[] | null
          id: string
          participant_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          day_number: number
          floors_completed?: number[] | null
          id?: string
          participant_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          day_number?: number
          floors_completed?: number[] | null
          id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "genesis_challenge_daily_progress_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "genesis_challenge_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      genesis_challenge_participants: {
        Row: {
          completed_at: string | null
          completed_floors: number[] | null
          created_at: string | null
          current_day: number | null
          email: string
          id: string
          last_active_at: string | null
          name: string | null
          started_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_floors?: number[] | null
          created_at?: string | null
          current_day?: number | null
          email: string
          id?: string
          last_active_at?: string | null
          name?: string | null
          started_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_floors?: number[] | null
          created_at?: string | null
          current_day?: number | null
          email?: string
          id?: string
          last_active_at?: string | null
          name?: string | null
          started_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      global_master_titles: {
        Row: {
          black_master_exam_passed_at: string | null
          created_at: string
          current_floor: number
          floors_completed: number
          global_streak_days: number
          id: string
          last_global_practice_date: string | null
          master_title: string | null
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          black_master_exam_passed_at?: string | null
          created_at?: string
          current_floor?: number
          floors_completed?: number
          global_streak_days?: number
          id?: string
          last_global_practice_date?: string | null
          master_title?: string | null
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          black_master_exam_passed_at?: string | null
          created_at?: string
          current_floor?: number
          floors_completed?: number
          global_streak_days?: number
          id?: string
          last_global_practice_date?: string | null
          master_title?: string | null
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      guild_activities: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          guild_id: string
          id: string
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          guild_id: string
          id?: string
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          guild_id?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guild_activities_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_challenge_participants: {
        Row: {
          challenge_id: string | null
          completed_at: string | null
          contribution_count: number | null
          id: string
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed_at?: string | null
          contribution_count?: number | null
          id?: string
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed_at?: string | null
          contribution_count?: number | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guild_challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "guild_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_challenge_participation: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "guild_challenge_participation_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "guild_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_challenges: {
        Row: {
          challenge_description: string | null
          challenge_title: string
          created_at: string | null
          current_completions: number | null
          ends_at: string
          guild_id: string | null
          id: string
          is_completed: boolean | null
          reward_xp: number | null
          room_id: string
          starts_at: string | null
          target_completions: number | null
        }
        Insert: {
          challenge_description?: string | null
          challenge_title: string
          created_at?: string | null
          current_completions?: number | null
          ends_at: string
          guild_id?: string | null
          id?: string
          is_completed?: boolean | null
          reward_xp?: number | null
          room_id: string
          starts_at?: string | null
          target_completions?: number | null
        }
        Update: {
          challenge_description?: string | null
          challenge_title?: string
          created_at?: string | null
          current_completions?: number | null
          ends_at?: string
          guild_id?: string | null
          id?: string
          is_completed?: boolean | null
          reward_xp?: number | null
          room_id?: string
          starts_at?: string | null
          target_completions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "guild_challenges_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_members: {
        Row: {
          contribution_xp: number | null
          guild_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          contribution_xp?: number | null
          guild_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          contribution_xp?: number | null
          guild_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guild_members_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_streak: number | null
          description: string | null
          focus_rooms: string[] | null
          guild_image_url: string | null
          guild_type: string
          id: string
          is_active: boolean | null
          max_members: number | null
          name: string
          total_xp: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_streak?: number | null
          description?: string | null
          focus_rooms?: string[] | null
          guild_image_url?: string | null
          guild_type: string
          id?: string
          is_active?: boolean | null
          max_members?: number | null
          name: string
          total_xp?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_streak?: number | null
          description?: string | null
          focus_rooms?: string[] | null
          guild_image_url?: string | null
          guild_type?: string
          id?: string
          is_active?: boolean | null
          max_members?: number | null
          name?: string
          total_xp?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_predictions: {
        Row: {
          actual_outcome: string | null
          based_on_patterns: Json | null
          confidence_score: number
          created_at: string
          expires_at: string | null
          id: string
          predicted_at: string
          prediction_type: string
          principle_code: string | null
          reasoning: string
          room_id: string
          user_feedback: string | null
          user_id: string
          validated_at: string | null
          verse_reference: string | null
          was_accurate: boolean | null
        }
        Insert: {
          actual_outcome?: string | null
          based_on_patterns?: Json | null
          confidence_score: number
          created_at?: string
          expires_at?: string | null
          id?: string
          predicted_at?: string
          prediction_type: string
          principle_code?: string | null
          reasoning: string
          room_id: string
          user_feedback?: string | null
          user_id: string
          validated_at?: string | null
          verse_reference?: string | null
          was_accurate?: boolean | null
        }
        Update: {
          actual_outcome?: string | null
          based_on_patterns?: Json | null
          confidence_score?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          predicted_at?: string
          prediction_type?: string
          principle_code?: string | null
          reasoning?: string
          room_id?: string
          user_feedback?: string | null
          user_id?: string
          validated_at?: string | null
          verse_reference?: string | null
          was_accurate?: boolean | null
        }
        Relationships: []
      }
      marriage_blueprint_progress: {
        Row: {
          article_id: number
          completed_at: string
          created_at: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: number
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: number
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mastery_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string
          longest_streak: number
          total_active_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string
          longest_streak?: number
          total_active_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string
          longest_streak?: number
          total_active_days?: number
          updated_at?: string
          user_id?: string
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
          next_review_date: string | null
          notes: string | null
          review_count: number
          review_interval_days: number | null
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
          next_review_date?: string | null
          notes?: string | null
          review_count?: number
          review_interval_days?: number | null
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
          next_review_date?: string | null
          notes?: string | null
          review_count?: number
          review_interval_days?: number | null
          user_id?: string
          verse?: number
          verse_reference?: string
          verse_text?: string
        }
        Relationships: []
      }
      mental_health_blueprint_progress: {
        Row: {
          article_id: number
          completed_at: string
          created_at: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: number
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: number
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      message_read_status: {
        Row: {
          id: string
          message_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          message_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          message_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_read_status_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          edited_at: string | null
          id: string
          images: string[] | null
          is_deleted: boolean
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          edited_at?: string | null
          id?: string
          images?: string[] | null
          is_deleted?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          images?: string[] | null
          is_deleted?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      microlearning_content: {
        Row: {
          content: string
          created_at: string
          estimated_minutes: number
          floor_number: number
          id: string
          lesson_number: number
          mastery_level: number
          principle_focus: string | null
          room_id: string
          title: string
          verse_reference: string | null
        }
        Insert: {
          content: string
          created_at?: string
          estimated_minutes?: number
          floor_number: number
          id?: string
          lesson_number: number
          mastery_level: number
          principle_focus?: string | null
          room_id: string
          title: string
          verse_reference?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          estimated_minutes?: number
          floor_number?: number
          id?: string
          lesson_number?: number
          mastery_level?: number
          principle_focus?: string | null
          room_id?: string
          title?: string
          verse_reference?: string | null
        }
        Relationships: []
      }
      microlearning_progress: {
        Row: {
          completed_at: string
          content_id: string
          created_at: string
          id: string
          time_spent_seconds: number | null
          user_id: string
          user_response: string | null
        }
        Insert: {
          completed_at?: string
          content_id: string
          created_at?: string
          id?: string
          time_spent_seconds?: number | null
          user_id: string
          user_response?: string | null
        }
        Update: {
          completed_at?: string
          content_id?: string
          created_at?: string
          id?: string
          time_spent_seconds?: number | null
          user_id?: string
          user_response?: string | null
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
      notification_preferences: {
        Row: {
          christ_chapter_challenges: boolean
          community_posts: boolean
          connect6_challenges: boolean
          created_at: string
          daily_verse: boolean | null
          dimension_challenges: boolean
          equation_challenges: boolean
          fruit_check_challenges: boolean
          id: string
          renewal_reminders: boolean
          sanctuary_challenges: boolean
          study_reminders: boolean
          updated_at: string
          user_id: string
          video_tutorials: boolean | null
        }
        Insert: {
          christ_chapter_challenges?: boolean
          community_posts?: boolean
          connect6_challenges?: boolean
          created_at?: string
          daily_verse?: boolean | null
          dimension_challenges?: boolean
          equation_challenges?: boolean
          fruit_check_challenges?: boolean
          id?: string
          renewal_reminders?: boolean
          sanctuary_challenges?: boolean
          study_reminders?: boolean
          updated_at?: string
          user_id: string
          video_tutorials?: boolean | null
        }
        Update: {
          christ_chapter_challenges?: boolean
          community_posts?: boolean
          connect6_challenges?: boolean
          created_at?: string
          daily_verse?: boolean | null
          dimension_challenges?: boolean
          equation_challenges?: boolean
          fruit_check_challenges?: boolean
          id?: string
          renewal_reminders?: boolean
          sanctuary_challenges?: boolean
          study_reminders?: boolean
          updated_at?: string
          user_id?: string
          video_tutorials?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      personalized_drills: {
        Row: {
          addresses_weakness: boolean | null
          attempts_count: number | null
          avg_time_seconds: number | null
          completed_at: string | null
          created_at: string
          difficulty_level: string
          drill_type: string
          expected_answer: string | null
          expires_at: string | null
          floor_number: number
          generated_reason: string | null
          hints: Json | null
          id: string
          is_completed: boolean | null
          principles_tested: string[] | null
          priority: number | null
          prompt: string
          reinforces_strength: boolean | null
          room_id: string
          scheduled_for: string | null
          success_rate: number | null
          target_skill: string
          tests_prediction: boolean | null
          updated_at: string
          user_id: string
          verses_involved: string[] | null
        }
        Insert: {
          addresses_weakness?: boolean | null
          attempts_count?: number | null
          avg_time_seconds?: number | null
          completed_at?: string | null
          created_at?: string
          difficulty_level: string
          drill_type: string
          expected_answer?: string | null
          expires_at?: string | null
          floor_number: number
          generated_reason?: string | null
          hints?: Json | null
          id?: string
          is_completed?: boolean | null
          principles_tested?: string[] | null
          priority?: number | null
          prompt: string
          reinforces_strength?: boolean | null
          room_id: string
          scheduled_for?: string | null
          success_rate?: number | null
          target_skill: string
          tests_prediction?: boolean | null
          updated_at?: string
          user_id: string
          verses_involved?: string[] | null
        }
        Update: {
          addresses_weakness?: boolean | null
          attempts_count?: number | null
          avg_time_seconds?: number | null
          completed_at?: string | null
          created_at?: string
          difficulty_level?: string
          drill_type?: string
          expected_answer?: string | null
          expires_at?: string | null
          floor_number?: number
          generated_reason?: string | null
          hints?: Json | null
          id?: string
          is_completed?: boolean | null
          principles_tested?: string[] | null
          priority?: number | null
          prompt?: string
          reinforces_strength?: boolean | null
          room_id?: string
          scheduled_for?: string | null
          success_rate?: number | null
          target_skill?: string
          tests_prediction?: boolean | null
          updated_at?: string
          user_id?: string
          verses_involved?: string[] | null
        }
        Relationships: []
      }
      practice_schedules: {
        Row: {
          adjusts_to_progress: boolean | null
          completion_rate: number | null
          created_at: string
          daily_goals: Json | null
          difficulty_progression: string | null
          end_date: string | null
          focus_rooms: string[]
          id: string
          is_active: boolean | null
          schedule_name: string
          schedule_type: string
          start_date: string
          updated_at: string
          user_id: string
          weekly_milestones: Json | null
        }
        Insert: {
          adjusts_to_progress?: boolean | null
          completion_rate?: number | null
          created_at?: string
          daily_goals?: Json | null
          difficulty_progression?: string | null
          end_date?: string | null
          focus_rooms: string[]
          id?: string
          is_active?: boolean | null
          schedule_name: string
          schedule_type: string
          start_date: string
          updated_at?: string
          user_id: string
          weekly_milestones?: Json | null
        }
        Update: {
          adjusts_to_progress?: boolean | null
          completion_rate?: number | null
          created_at?: string
          daily_goals?: Json | null
          difficulty_progression?: string | null
          end_date?: string | null
          focus_rooms?: string[]
          id?: string
          is_active?: boolean | null
          schedule_name?: string
          schedule_type?: string
          start_date?: string
          updated_at?: string
          user_id?: string
          weekly_milestones?: Json | null
        }
        Relationships: []
      }
      prayer_interactions: {
        Row: {
          created_at: string
          id: string
          prayer_request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          prayer_request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          prayer_request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_interactions_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          content: string
          created_at: string
          id: string
          is_answered: boolean
          is_public: boolean
          prayer_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_answered?: boolean
          is_public?: boolean
          prayer_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_answered?: boolean
          is_public?: boolean
          prayer_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      principle_card_games: {
        Row: {
          created_at: string
          current_round: number
          ended_at: string | null
          host_user_id: string
          id: string
          max_players: number
          room_id: string
          started_at: string | null
          status: string
          total_rounds: number
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          current_round?: number
          ended_at?: string | null
          host_user_id: string
          id?: string
          max_players?: number
          room_id: string
          started_at?: string | null
          status?: string
          total_rounds?: number
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          current_round?: number
          ended_at?: string | null
          host_user_id?: string
          id?: string
          max_players?: number
          room_id?: string
          started_at?: string | null
          status?: string
          total_rounds?: number
          winner_id?: string | null
        }
        Relationships: []
      }
      principle_card_players: {
        Row: {
          cards_won: number
          game_id: string
          id: string
          joined_at: string
          score: number
          user_id: string
        }
        Insert: {
          cards_won?: number
          game_id: string
          id?: string
          joined_at?: string
          score?: number
          user_id: string
        }
        Update: {
          cards_won?: number
          game_id?: string
          id?: string
          joined_at?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "principle_card_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "principle_card_games"
            referencedColumns: ["id"]
          },
        ]
      }
      principle_card_rounds: {
        Row: {
          card_description: string
          card_principle: string
          completed_at: string | null
          correct_player_id: string | null
          created_at: string
          game_id: string
          id: string
          round_number: number
          scenario_text: string
        }
        Insert: {
          card_description: string
          card_principle: string
          completed_at?: string | null
          correct_player_id?: string | null
          created_at?: string
          game_id: string
          id?: string
          round_number: number
          scenario_text: string
        }
        Update: {
          card_description?: string
          card_principle?: string
          completed_at?: string | null
          correct_player_id?: string | null
          created_at?: string
          game_id?: string
          id?: string
          round_number?: number
          scenario_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "principle_card_rounds_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "principle_card_games"
            referencedColumns: ["id"]
          },
        ]
      }
      principle_tournament_matches: {
        Row: {
          completed_at: string | null
          game_id: string | null
          id: string
          match_number: number
          next_match_id: string | null
          player1_id: string | null
          player1_score: number | null
          player2_id: string | null
          player2_score: number | null
          round_number: number
          scheduled_at: string | null
          started_at: string | null
          status: string
          tournament_id: string
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          game_id?: string | null
          id?: string
          match_number: number
          next_match_id?: string | null
          player1_id?: string | null
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          round_number: number
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          tournament_id: string
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          game_id?: string | null
          id?: string
          match_number?: number
          next_match_id?: string | null
          player1_id?: string | null
          player1_score?: number | null
          player2_id?: string | null
          player2_score?: number | null
          round_number?: number
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          tournament_id?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "principle_tournament_matches_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "principle_card_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "principle_tournament_matches_next_match_id_fkey"
            columns: ["next_match_id"]
            isOneToOne: false
            referencedRelation: "principle_tournament_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "principle_tournament_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "principle_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      principle_tournament_participants: {
        Row: {
          final_placement: number | null
          id: string
          is_eliminated: boolean
          joined_at: string
          matches_lost: number
          matches_won: number
          seed_number: number | null
          total_score: number
          tournament_id: string
          user_id: string
        }
        Insert: {
          final_placement?: number | null
          id?: string
          is_eliminated?: boolean
          joined_at?: string
          matches_lost?: number
          matches_won?: number
          seed_number?: number | null
          total_score?: number
          tournament_id: string
          user_id: string
        }
        Update: {
          final_placement?: number | null
          id?: string
          is_eliminated?: boolean
          joined_at?: string
          matches_lost?: number
          matches_won?: number
          seed_number?: number | null
          total_score?: number
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "principle_tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "principle_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      principle_tournaments: {
        Row: {
          created_at: string
          current_round: number
          description: string | null
          ends_at: string | null
          host_user_id: string
          id: string
          max_participants: number
          prize_pool: Json
          registration_ends_at: string
          starts_at: string
          status: string
          title: string
          total_rounds: number
        }
        Insert: {
          created_at?: string
          current_round?: number
          description?: string | null
          ends_at?: string | null
          host_user_id: string
          id?: string
          max_participants?: number
          prize_pool?: Json
          registration_ends_at: string
          starts_at: string
          status?: string
          title: string
          total_rounds: number
        }
        Update: {
          created_at?: string
          current_round?: number
          description?: string | null
          ends_at?: string | null
          host_user_id?: string
          id?: string
          max_participants?: number
          prize_pool?: Json
          registration_ends_at?: string
          starts_at?: string
          status?: string
          title?: string
          total_rounds?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_code_used: string | null
          avatar_url: string | null
          bio: string | null
          chain_chess_streak: number | null
          created_at: string | null
          daily_study_streak: number | null
          display_name: string | null
          equations_streak: number | null
          focused_room_floor: number | null
          focused_room_id: string | null
          focused_room_set_at: string | null
          gem_creation_streak: number | null
          has_lifetime_access: boolean
          id: string
          is_recurring: boolean | null
          is_student: boolean | null
          last_seen: string | null
          learning_style: string | null
          level: number | null
          lifetime_access_granted_at: string | null
          location: string | null
          longest_chess_streak: number | null
          longest_equations_streak: number | null
          longest_gem_streak: number | null
          longest_study_streak: number | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          payment_source: string | null
          points: number | null
          preferred_features: string[] | null
          primary_role: string | null
          promotional_access_expires_at: string | null
          referral_code: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          student_expires_at: string | null
          student_verified_at: string | null
          subscription_cancelled_at: string | null
          subscription_renewal_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
          trial_started_at: string | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          access_code_used?: string | null
          avatar_url?: string | null
          bio?: string | null
          chain_chess_streak?: number | null
          created_at?: string | null
          daily_study_streak?: number | null
          display_name?: string | null
          equations_streak?: number | null
          focused_room_floor?: number | null
          focused_room_id?: string | null
          focused_room_set_at?: string | null
          gem_creation_streak?: number | null
          has_lifetime_access?: boolean
          id: string
          is_recurring?: boolean | null
          is_student?: boolean | null
          last_seen?: string | null
          learning_style?: string | null
          level?: number | null
          lifetime_access_granted_at?: string | null
          location?: string | null
          longest_chess_streak?: number | null
          longest_equations_streak?: number | null
          longest_gem_streak?: number | null
          longest_study_streak?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          payment_source?: string | null
          points?: number | null
          preferred_features?: string[] | null
          primary_role?: string | null
          promotional_access_expires_at?: string | null
          referral_code?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          student_expires_at?: string | null
          student_verified_at?: string | null
          subscription_cancelled_at?: string | null
          subscription_renewal_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          access_code_used?: string | null
          avatar_url?: string | null
          bio?: string | null
          chain_chess_streak?: number | null
          created_at?: string | null
          daily_study_streak?: number | null
          display_name?: string | null
          equations_streak?: number | null
          focused_room_floor?: number | null
          focused_room_id?: string | null
          focused_room_set_at?: string | null
          gem_creation_streak?: number | null
          has_lifetime_access?: boolean
          id?: string
          is_recurring?: boolean | null
          is_student?: boolean | null
          last_seen?: string | null
          learning_style?: string | null
          level?: number | null
          lifetime_access_granted_at?: string | null
          location?: string | null
          longest_chess_streak?: number | null
          longest_equations_streak?: number | null
          longest_gem_streak?: number | null
          longest_study_streak?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          payment_source?: string | null
          points?: number | null
          preferred_features?: string[] | null
          primary_role?: string | null
          promotional_access_expires_at?: string | null
          referral_code?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          student_expires_at?: string | null
          student_verified_at?: string | null
          subscription_cancelled_at?: string | null
          subscription_renewal_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
          username?: string
          website?: string | null
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
      reading_plan_daily_exercises: {
        Row: {
          created_at: string | null
          day_number: number
          floor_exercises: Json
          id: string
          passages: Json
          updated_at: string | null
          user_progress_id: string
        }
        Insert: {
          created_at?: string | null
          day_number: number
          floor_exercises: Json
          id?: string
          passages: Json
          updated_at?: string | null
          user_progress_id: string
        }
        Update: {
          created_at?: string | null
          day_number?: number
          floor_exercises?: Json
          id?: string
          passages?: Json
          updated_at?: string | null
          user_progress_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_daily_exercises_user_progress_id_fkey"
            columns: ["user_progress_id"]
            isOneToOne: false
            referencedRelation: "user_reading_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plans: {
        Row: {
          created_at: string | null
          daily_schedule: Json
          depth_mode: string
          description: string | null
          duration_days: number
          id: string
          name: string
          plan_type: string
        }
        Insert: {
          created_at?: string | null
          daily_schedule: Json
          depth_mode?: string
          description?: string | null
          duration_days: number
          id?: string
          name: string
          plan_type: string
        }
        Update: {
          created_at?: string | null
          daily_schedule?: Json
          depth_mode?: string
          description?: string | null
          duration_days?: number
          id?: string
          name?: string
          plan_type?: string
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
      renewal_reminders: {
        Row: {
          billing_period: string
          created_at: string
          id: string
          reminder_sent_at: string
          renewal_date: string
          subscription_type: string
          user_id: string
        }
        Insert: {
          billing_period: string
          created_at?: string
          id?: string
          reminder_sent_at?: string
          renewal_date: string
          subscription_type: string
          user_id: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          id?: string
          reminder_sent_at?: string
          renewal_date?: string
          subscription_type?: string
          user_id?: string
        }
        Relationships: []
      }
      research_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_research: string
          sub_topic: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_research: string
          sub_topic: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_research?: string
          sub_topic?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      room_curriculum_progress: {
        Row: {
          completed_activities: Json | null
          created_at: string | null
          current_activity_index: number | null
          curriculum_completed: boolean | null
          floor_number: number
          id: string
          last_activity_at: string | null
          milestone_tests_passed: Json | null
          room_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_activities?: Json | null
          created_at?: string | null
          current_activity_index?: number | null
          curriculum_completed?: boolean | null
          floor_number: number
          id?: string
          last_activity_at?: string | null
          milestone_tests_passed?: Json | null
          room_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_activities?: Json | null
          created_at?: string | null
          current_activity_index?: number | null
          curriculum_completed?: boolean | null
          floor_number?: number
          id?: string
          last_activity_at?: string | null
          milestone_tests_passed?: Json | null
          room_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      room_exercises: {
        Row: {
          created_at: string | null
          exercise_content: string
          exercise_title: string
          floor_number: number
          id: string
          room_id: string
          updated_at: string | null
          user_id: string
          verse_reference: string
        }
        Insert: {
          created_at?: string | null
          exercise_content: string
          exercise_title: string
          floor_number: number
          id?: string
          room_id: string
          updated_at?: string | null
          user_id: string
          verse_reference: string
        }
        Update: {
          created_at?: string | null
          exercise_content?: string
          exercise_title?: string
          floor_number?: number
          id?: string
          room_id?: string
          updated_at?: string | null
          user_id?: string
          verse_reference?: string
        }
        Relationships: []
      }
      room_mastery_levels: {
        Row: {
          created_at: string
          floor_number: number
          id: string
          last_activity_at: string | null
          mastery_level: number
          perfect_scores_count: number
          room_id: string
          total_drills_completed: number
          total_exercises_completed: number
          updated_at: string
          user_id: string
          xp_current: number
          xp_required: number
        }
        Insert: {
          created_at?: string
          floor_number: number
          id?: string
          last_activity_at?: string | null
          mastery_level?: number
          perfect_scores_count?: number
          room_id: string
          total_drills_completed?: number
          total_exercises_completed?: number
          updated_at?: string
          user_id: string
          xp_current?: number
          xp_required?: number
        }
        Update: {
          created_at?: string
          floor_number?: number
          id?: string
          last_activity_at?: string | null
          mastery_level?: number
          perfect_scores_count?: number
          room_id?: string
          total_drills_completed?: number
          total_exercises_completed?: number
          updated_at?: string
          user_id?: string
          xp_current?: number
          xp_required?: number
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
      room_report_cards: {
        Row: {
          created_at: string
          id: string
          mastery_level: number
          report_data: Json
          room_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mastery_level: number
          report_data: Json
          room_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mastery_level?: number
          report_data?: Json
          room_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      room_scope_configs: {
        Row: {
          created_at: string
          curriculum_percentage_required: number
          floor_number: number
          id: string
          room_id: string
          scope_data: Json
          scope_description: string
          streak_requirement: number
          xp_requirement: number
        }
        Insert: {
          created_at?: string
          curriculum_percentage_required?: number
          floor_number: number
          id?: string
          room_id: string
          scope_data?: Json
          scope_description: string
          streak_requirement: number
          xp_requirement: number
        }
        Update: {
          created_at?: string
          curriculum_percentage_required?: number
          floor_number?: number
          id?: string
          room_id?: string
          scope_data?: Json
          scope_description?: string
          streak_requirement?: number
          xp_requirement?: number
        }
        Relationships: []
      }
      sermon_titles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_ai_generated: boolean | null
          scripture_references: string[] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_ai_generated?: boolean | null
          scripture_references?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_ai_generated?: boolean | null
          scripture_references?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
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
      social_media_connections: {
        Row: {
          access_token: string
          created_at: string | null
          id: string
          is_active: boolean | null
          platform: string
          platform_user_id: string | null
          platform_username: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          platform_user_id?: string | null
          platform_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          platform_user_id?: string | null
          platform_username?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
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
          access_duration_months: number | null
          code: string
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          is_active: boolean
          is_lifetime: boolean | null
          max_uses: number | null
          used_count: number
        }
        Insert: {
          access_duration_months?: number | null
          code: string
          created_at?: string
          created_by?: string | null
          expires_at: string
          id?: string
          is_active?: boolean
          is_lifetime?: boolean | null
          max_uses?: number | null
          used_count?: number
        }
        Update: {
          access_duration_months?: number | null
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          is_lifetime?: boolean | null
          max_uses?: number | null
          used_count?: number
        }
        Relationships: []
      }
      strongs_dictionary: {
        Row: {
          created_at: string
          cycle_code: string | null
          definition: string
          dimension_code: string | null
          id: string
          kjv_translation: string | null
          language: string
          occurrences: number | null
          pronunciation: string | null
          prophecy_link: string | null
          pt_notes: string | null
          sanctuary_link: string | null
          strongs_number: string
          time_zone_code: string | null
          transliteration: string | null
          word: string
        }
        Insert: {
          created_at?: string
          cycle_code?: string | null
          definition: string
          dimension_code?: string | null
          id?: string
          kjv_translation?: string | null
          language: string
          occurrences?: number | null
          pronunciation?: string | null
          prophecy_link?: string | null
          pt_notes?: string | null
          sanctuary_link?: string | null
          strongs_number: string
          time_zone_code?: string | null
          transliteration?: string | null
          word: string
        }
        Update: {
          created_at?: string
          cycle_code?: string | null
          definition?: string
          dimension_code?: string | null
          id?: string
          kjv_translation?: string | null
          language?: string
          occurrences?: number | null
          pronunciation?: string | null
          prophecy_link?: string | null
          pt_notes?: string | null
          sanctuary_link?: string | null
          strongs_number?: string
          time_zone_code?: string | null
          transliteration?: string | null
          word?: string
        }
        Relationships: []
      }
      strongs_entries: {
        Row: {
          created_at: string | null
          cycle_association: string | null
          definition: string
          dimension_code: string | null
          floor_rooms: string[] | null
          id: string
          kjv_translations: string | null
          language: string
          occurrences: number | null
          pronunciation: string | null
          sanctuary_link: string | null
          strongs_number: string
          time_zone_code: string | null
          transliteration: string | null
          updated_at: string | null
          usage: string | null
          word: string
        }
        Insert: {
          created_at?: string | null
          cycle_association?: string | null
          definition: string
          dimension_code?: string | null
          floor_rooms?: string[] | null
          id?: string
          kjv_translations?: string | null
          language: string
          occurrences?: number | null
          pronunciation?: string | null
          sanctuary_link?: string | null
          strongs_number: string
          time_zone_code?: string | null
          transliteration?: string | null
          updated_at?: string | null
          usage?: string | null
          word: string
        }
        Update: {
          created_at?: string | null
          cycle_association?: string | null
          definition?: string
          dimension_code?: string | null
          floor_rooms?: string[] | null
          id?: string
          kjv_translations?: string | null
          language?: string
          occurrences?: number | null
          pronunciation?: string | null
          sanctuary_link?: string | null
          strongs_number?: string
          time_zone_code?: string | null
          transliteration?: string | null
          updated_at?: string | null
          usage?: string | null
          word?: string
        }
        Relationships: []
      }
      strongs_verses: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          verse: number
          verse_text: string
          words: Json
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          verse: number
          verse_text: string
          words?: Json
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          verse?: number
          verse_text?: string
          words?: Json
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
      study_collaborators: {
        Row: {
          id: string
          invited_at: string
          invited_by: string
          permission: string
          study_id: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_at?: string
          invited_by: string
          permission: string
          study_id: string
          user_id: string
        }
        Update: {
          id?: string
          invited_at?: string
          invited_by?: string
          permission?: string
          study_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_collaborators_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "user_studies"
            referencedColumns: ["id"]
          },
        ]
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
      training_videos: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_seconds: number | null
          id: string
          is_published: boolean | null
          order_index: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
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
        Relationships: []
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
        Relationships: []
      }
      treasure_hunt_participations: {
        Row: {
          clues_completed: Json
          completed_at: string | null
          current_clue_number: number
          hints_used: number
          hunt_id: string
          id: string
          is_completed: boolean
          started_at: string
          time_elapsed_seconds: number | null
          total_attempts: number
          user_id: string
        }
        Insert: {
          clues_completed?: Json
          completed_at?: string | null
          current_clue_number?: number
          hints_used?: number
          hunt_id: string
          id?: string
          is_completed?: boolean
          started_at?: string
          time_elapsed_seconds?: number | null
          total_attempts?: number
          user_id: string
        }
        Update: {
          clues_completed?: Json
          completed_at?: string | null
          current_clue_number?: number
          hints_used?: number
          hunt_id?: string
          id?: string
          is_completed?: boolean
          started_at?: string
          time_elapsed_seconds?: number | null
          total_attempts?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treasure_hunt_participations_hunt_id_fkey"
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
          category: string
          clues: Json
          created_at: string
          difficulty: string
          expires_at: string
          final_verse: string
          final_verse_text: string
          id: string
          is_active: boolean
          time_limit_hours: number
          title: string
        }
        Insert: {
          biblical_conclusion: string
          category: string
          clues?: Json
          created_at?: string
          difficulty: string
          expires_at: string
          final_verse: string
          final_verse_text: string
          id?: string
          is_active?: boolean
          time_limit_hours?: number
          title: string
        }
        Update: {
          biblical_conclusion?: string
          category?: string
          clues?: Json
          created_at?: string
          difficulty?: string
          expires_at?: string
          final_verse?: string
          final_verse_text?: string
          id?: string
          is_active?: boolean
          time_limit_hours?: number
          title?: string
        }
        Relationships: []
      }
      typing_indicators: {
        Row: {
          conversation_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "typing_indicators_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
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
      user_engagement: {
        Row: {
          created_at: string | null
          id: string
          last_activity_at: string | null
          last_login_at: string | null
          login_streak: number | null
          total_sessions: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          last_login_at?: string | null
          login_streak?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          last_login_at?: string | null
          login_streak?: number | null
          total_sessions?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_floor_progress: {
        Row: {
          created_at: string
          floor_assessment_passed_at: string | null
          floor_assessment_score: number | null
          floor_completed_at: string | null
          floor_number: number
          id: string
          is_unlocked: boolean
          rooms_completed: number
          rooms_required: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          floor_assessment_passed_at?: string | null
          floor_assessment_score?: number | null
          floor_completed_at?: string | null
          floor_number: number
          id?: string
          is_unlocked?: boolean
          rooms_completed?: number
          rooms_required: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          floor_assessment_passed_at?: string | null
          floor_assessment_score?: number | null
          floor_completed_at?: string | null
          floor_number?: number
          id?: string
          is_unlocked?: boolean
          rooms_completed?: number
          rooms_required?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_gems: {
        Row: {
          category: string | null
          created_at: string
          floor_number: number
          gem_content: string
          gem_name: string
          id: string
          room_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          floor_number: number
          gem_content: string
          gem_name: string
          id?: string
          room_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          floor_number?: number
          gem_content?: string
          gem_name?: string
          id?: string
          room_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_learning_profiles: {
        Row: {
          accuracy_trend: Json | null
          attention_span_minutes: number | null
          auto_adjust_difficulty: boolean | null
          best_study_times: string[] | null
          blind_spots: Json | null
          consistency_score: number | null
          created_at: string
          id: string
          identified_weaknesses: Json | null
          last_analysis_at: string | null
          learning_style: string | null
          next_challenge_level: string | null
          optimal_difficulty: string | null
          personalization_level: string | null
          predicted_struggles: Json | null
          recommended_focus_areas: string[] | null
          speed_improvement: Json | null
          top_strengths: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_trend?: Json | null
          attention_span_minutes?: number | null
          auto_adjust_difficulty?: boolean | null
          best_study_times?: string[] | null
          blind_spots?: Json | null
          consistency_score?: number | null
          created_at?: string
          id?: string
          identified_weaknesses?: Json | null
          last_analysis_at?: string | null
          learning_style?: string | null
          next_challenge_level?: string | null
          optimal_difficulty?: string | null
          personalization_level?: string | null
          predicted_struggles?: Json | null
          recommended_focus_areas?: string[] | null
          speed_improvement?: Json | null
          top_strengths?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_trend?: Json | null
          attention_span_minutes?: number | null
          auto_adjust_difficulty?: boolean | null
          best_study_times?: string[] | null
          blind_spots?: Json | null
          consistency_score?: number | null
          created_at?: string
          id?: string
          identified_weaknesses?: Json | null
          last_analysis_at?: string | null
          learning_style?: string | null
          next_challenge_level?: string | null
          optimal_difficulty?: string | null
          personalization_level?: string | null
          predicted_struggles?: Json | null
          recommended_focus_areas?: string[] | null
          speed_improvement?: Json | null
          top_strengths?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          bible_font_size: string | null
          bible_translation: string | null
          id: string
          navigation_style: string | null
          reading_mode: string | null
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bible_font_size?: string | null
          bible_translation?: string | null
          id?: string
          navigation_style?: string | null
          reading_mode?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bible_font_size?: string | null
          bible_translation?: string | null
          id?: string
          navigation_style?: string | null
          reading_mode?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reading_progress: {
        Row: {
          created_at: string | null
          current_day: number
          custom_settings: Json | null
          id: string
          is_active: boolean | null
          last_completed_day: number | null
          plan_id: string
          preferred_translation: string | null
          started_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_day?: number
          custom_settings?: Json | null
          id?: string
          is_active?: boolean | null
          last_completed_day?: number | null
          plan_id: string
          preferred_translation?: string | null
          started_at?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_day?: number
          custom_settings?: Json | null
          id?: string
          is_active?: boolean | null
          last_completed_day?: number | null
          plan_id?: string
          preferred_translation?: string | null
          started_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reading_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
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
      user_studies: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_favorite: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_verse_readings: {
        Row: {
          id: string
          read_at: string | null
          user_id: string
          verse_id: string
        }
        Insert: {
          id?: string
          read_at?: string | null
          user_id: string
          verse_id: string
        }
        Update: {
          id?: string
          read_at?: string | null
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_verse_readings_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "daily_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      verses_strongs: {
        Row: {
          book: string
          chapter: number
          created_at: string | null
          id: string
          position: number
          strongs_number: string | null
          testament: string
          verse: number
          word: string
          word_position: number
          word_text: string
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string | null
          id?: string
          position?: number
          strongs_number?: string | null
          testament?: string
          verse: number
          word?: string
          word_position: number
          word_text: string
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string | null
          id?: string
          position?: number
          strongs_number?: string | null
          testament?: string
          verse?: number
          word?: string
          word_position?: number
          word_text?: string
        }
        Relationships: []
      }
      warrior_characteristics: {
        Row: {
          characteristic_name: string
          created_at: string | null
          id: string
          last_practiced_at: string | null
          level: number | null
          practices_completed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          characteristic_name: string
          created_at?: string | null
          id?: string
          last_practiced_at?: string | null
          level?: number | null
          practices_completed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          characteristic_name?: string
          created_at?: string | null
          id?: string
          last_practiced_at?: string | null
          level?: number | null
          practices_completed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      weight_loss_blueprint_progress: {
        Row: {
          article_id: number
          completed_at: string
          created_at: string
          id: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: number
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: number
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_growth_journal: {
        Row: {
          challenge_id: string | null
          challenge_subtype: string | null
          challenge_tier: string | null
          challenge_title: string | null
          challenge_type: string | null
          content: string | null
          created_at: string | null
          id: string | null
          principle_applied: string | null
          principle_used: string | null
          room_codes: string[] | null
          submission_data: Json | null
          time_spent: number | null
          user_id: string | null
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
    }
    Functions: {
      accept_church_invitation: {
        Args: { _invitation_code: string }
        Returns: Json
      }
      award_room_xp: {
        Args: {
          p_drill_completed?: boolean
          p_exercise_completed?: boolean
          p_floor_number: number
          p_perfect_score?: boolean
          p_room_id: string
          p_user_id: string
          p_xp_amount: number
        }
        Returns: Json
      }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      cleanup_old_typing_indicators: { Args: never; Returns: undefined }
      delete_cancelled_user_data: { Args: never; Returns: undefined }
      generate_challenge_share_code: { Args: never; Returns: string }
      generate_referral_code: { Args: { user_id: string }; Returns: string }
      get_available_seats: { Args: { _church_id: string }; Returns: number }
      get_or_create_conversation: {
        Args: { other_user_id: string }
        Returns: string
      }
      has_church_access: {
        Args: { _user_id: string }
        Returns: {
          church_id: string
          church_tier: string
          has_access: boolean
          role: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_study_access: {
        Args: { study_id_param: string; user_id_param: string }
        Returns: boolean
      }
      has_study_edit_access: {
        Args: { study_id_param: string; user_id_param: string }
        Returns: boolean
      }
      increment_user_points: {
        Args: { points_to_add: number; user_id: string }
        Returns: undefined
      }
      is_church_admin: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      is_study_owner: {
        Args: { study_id_param: string; user_id_param: string }
        Returns: boolean
      }
      is_video_admin: { Args: { _user_id: string }; Returns: boolean }
      redeem_access_code: { Args: { code_input: string }; Returns: Json }
      search_encyclopedia_articles: {
        Args: { limit_count?: number; search_query: string }
        Returns: {
          id: string
          pt_floors: string[]
          relevance: number
          slug: string
          summary_1d: string
          title: string
          topic_type: string[]
        }[]
      }
      update_mastery_streak: { Args: { p_user_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "video_admin"
      church_member_role: "admin" | "leader" | "member"
      church_tier: "tier1" | "tier2" | "tier3"
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
      app_role: ["admin", "moderator", "user", "video_admin"],
      church_member_role: ["admin", "leader", "member"],
      church_tier: ["tier1", "tier2", "tier3"],
    },
  },
} as const

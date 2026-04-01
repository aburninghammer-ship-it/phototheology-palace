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
          tier: string | null
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
          tier?: string | null
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
          tier?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_credit_balances: {
        Row: {
          created_at: string
          credits_balance: number
          has_unlimited: boolean
          id: string
          lifetime_purchased: number
          unlimited_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_balance?: number
          has_unlimited?: boolean
          id?: string
          lifetime_purchased?: number
          unlimited_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_balance?: number
          has_unlimited?: boolean
          id?: string
          lifetime_purchased?: number
          unlimited_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_credit_purchases: {
        Row: {
          created_at: string
          credits_added: number
          id: string
          pack_id: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_added: number
          id?: string
          pack_id: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          credits_added?: number
          id?: string
          pack_id?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_log: {
        Row: {
          completion_tokens: number | null
          created_at: string
          estimated_cost_cents: number | null
          function_name: string
          id: string
          metadata: Json | null
          model: string | null
          prompt_tokens: number | null
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string
          estimated_cost_cents?: number | null
          function_name: string
          id?: string
          metadata?: Json | null
          model?: string | null
          prompt_tokens?: number | null
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string
          estimated_cost_cents?: number | null
          function_name?: string
          id?: string
          metadata?: Json | null
          model?: string | null
          prompt_tokens?: number | null
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_snapshots: {
        Row: {
          active_churches: number
          created_at: string
          id: string
          lifetime_access: number
          mrr_cents: number
          new_signups_today: number
          patreon_active: number
          pickaxe_count: number
          snapshot_date: string
          stripe_active: number
          stripe_cancelled: number
          stripe_trialing: number
          tier_church: number
          tier_essential: number
          tier_premium: number
          tier_student: number
          total_users: number
        }
        Insert: {
          active_churches?: number
          created_at?: string
          id?: string
          lifetime_access?: number
          mrr_cents?: number
          new_signups_today?: number
          patreon_active?: number
          pickaxe_count?: number
          snapshot_date: string
          stripe_active?: number
          stripe_cancelled?: number
          stripe_trialing?: number
          tier_church?: number
          tier_essential?: number
          tier_premium?: number
          tier_student?: number
          total_users?: number
        }
        Update: {
          active_churches?: number
          created_at?: string
          id?: string
          lifetime_access?: number
          mrr_cents?: number
          new_signups_today?: number
          patreon_active?: number
          pickaxe_count?: number
          snapshot_date?: string
          stripe_active?: number
          stripe_cancelled?: number
          stripe_trialing?: number
          tier_church?: number
          tier_essential?: number
          tier_premium?: number
          tier_student?: number
          total_users?: number
        }
        Relationships: []
      }
      announcement_dismissals: {
        Row: {
          announcement_id: string
          dismissed_at: string
          id: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          dismissed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          dismissed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_dismissals_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          message: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          title?: string
          type?: string
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
      baptism_candidate_progress: {
        Row: {
          candidate_id: string
          completion_date: string | null
          confidence: number | null
          created_at: string
          id: string
          last_active_at: string | null
          last_step: string | null
          lesson_id: string
          pastoral_flags: string[]
          percent_complete: number
          quiz_best_score: number | null
          state: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          completion_date?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          last_active_at?: string | null
          last_step?: string | null
          lesson_id: string
          pastoral_flags?: string[]
          percent_complete?: number
          quiz_best_score?: number | null
          state?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          completion_date?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          last_active_at?: string | null
          last_step?: string | null
          lesson_id?: string
          pastoral_flags?: string[]
          percent_complete?: number
          quiz_best_score?: number | null
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "baptism_candidate_progress_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "baptism_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baptism_candidate_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "baptism_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      baptism_candidates: {
        Row: {
          actual_baptism_date: string | null
          baptism_class_completed: boolean | null
          baptism_location: string | null
          bible_worker_id: string | null
          certificate_issued: boolean | null
          church_id: string
          created_at: string
          doctrinal_studies_completed: string[] | null
          email: string | null
          follow_up_assigned_to: string | null
          id: string
          interest_id: string | null
          name: string
          notes: string | null
          pastor_id: string | null
          pastoral_interview_date: string | null
          pastoral_interview_notes: string | null
          phone: string | null
          scheduled_baptism_date: string | null
          stage: string
          testimony_reviewed: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          actual_baptism_date?: string | null
          baptism_class_completed?: boolean | null
          baptism_location?: string | null
          bible_worker_id?: string | null
          certificate_issued?: boolean | null
          church_id: string
          created_at?: string
          doctrinal_studies_completed?: string[] | null
          email?: string | null
          follow_up_assigned_to?: string | null
          id?: string
          interest_id?: string | null
          name: string
          notes?: string | null
          pastor_id?: string | null
          pastoral_interview_date?: string | null
          pastoral_interview_notes?: string | null
          phone?: string | null
          scheduled_baptism_date?: string | null
          stage?: string
          testimony_reviewed?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          actual_baptism_date?: string | null
          baptism_class_completed?: boolean | null
          baptism_location?: string | null
          bible_worker_id?: string | null
          certificate_issued?: boolean | null
          church_id?: string
          created_at?: string
          doctrinal_studies_completed?: string[] | null
          email?: string | null
          follow_up_assigned_to?: string | null
          id?: string
          interest_id?: string | null
          name?: string
          notes?: string | null
          pastor_id?: string | null
          pastoral_interview_date?: string | null
          pastoral_interview_notes?: string | null
          phone?: string | null
          scheduled_baptism_date?: string | null
          stage?: string
          testimony_reviewed?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "baptism_candidates_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baptism_candidates_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baptism_candidates_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "evangelism_interests"
            referencedColumns: ["id"]
          },
        ]
      }
      baptism_lesson_attempts: {
        Row: {
          candidate_id: string
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          mode: string
          started_at: string
        }
        Insert: {
          candidate_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          mode?: string
          started_at?: string
        }
        Update: {
          candidate_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          mode?: string
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "baptism_lesson_attempts_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "baptism_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "baptism_lesson_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "baptism_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      baptism_lesson_responses: {
        Row: {
          attempt_id: string
          created_at: string
          id: string
          step_id: string
          tags: string[]
          user_response: string
        }
        Insert: {
          attempt_id: string
          created_at?: string
          id?: string
          step_id: string
          tags?: string[]
          user_response: string
        }
        Update: {
          attempt_id?: string
          created_at?: string
          id?: string
          step_id?: string
          tags?: string[]
          user_response?: string
        }
        Relationships: [
          {
            foreignKeyName: "baptism_lesson_responses_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "baptism_lesson_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      baptism_lessons: {
        Row: {
          created_at: string
          description: string | null
          estimated_minutes: number
          fundamental_number: number
          id: string
          prerequisites: string[]
          pt_map: Json
          scripture_pack: Json
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number
          fundamental_number: number
          id?: string
          prerequisites?: string[]
          pt_map?: Json
          scripture_pack?: Json
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number
          fundamental_number?: number
          id?: string
          prerequisites?: string[]
          pt_map?: Json
          scripture_pack?: Json
          title?: string
        }
        Relationships: []
      }
      baptism_readiness_assessments: {
        Row: {
          assessed_at: string
          candidate_id: string
          created_at: string
          heart_score: number | null
          id: string
          knowledge_score: number | null
          mentor_notes: string | null
          practice_score: number | null
          recommendation: string | null
        }
        Insert: {
          assessed_at?: string
          candidate_id: string
          created_at?: string
          heart_score?: number | null
          id?: string
          knowledge_score?: number | null
          mentor_notes?: string | null
          practice_score?: number | null
          recommendation?: string | null
        }
        Update: {
          assessed_at?: string
          candidate_id?: string
          created_at?: string
          heart_score?: number | null
          id?: string
          knowledge_score?: number | null
          mentor_notes?: string | null
          practice_score?: number | null
          recommendation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "baptism_readiness_assessments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "baptism_candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      baptism_study_audio: {
        Row: {
          created_at: string
          duration_seconds: number | null
          error_message: string | null
          file_size_bytes: number | null
          fundamental_number: number
          generated_by: string | null
          id: string
          lesson_id: string
          public_url: string | null
          share_token: string | null
          status: string
          storage_path: string
          title: string
          updated_at: string
          voice: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          file_size_bytes?: number | null
          fundamental_number: number
          generated_by?: string | null
          id?: string
          lesson_id: string
          public_url?: string | null
          share_token?: string | null
          status?: string
          storage_path: string
          title: string
          updated_at?: string
          voice?: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          error_message?: string | null
          file_size_bytes?: number | null
          fundamental_number?: number
          generated_by?: string | null
          id?: string
          lesson_id?: string
          public_url?: string | null
          share_token?: string | null
          status?: string
          storage_path?: string
          title?: string
          updated_at?: string
          voice?: string
        }
        Relationships: [
          {
            foreignKeyName: "baptism_study_audio_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "baptism_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_audio_cache: {
        Row: {
          book: string
          chapter: number
          created_at: string
          duration_ms: number | null
          file_size_bytes: number | null
          id: string
          storage_path: string
          verse: number
          voice_id: string
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          duration_ms?: number | null
          file_size_bytes?: number | null
          id?: string
          storage_path: string
          verse: number
          voice_id?: string
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          duration_ms?: number | null
          file_size_bytes?: number | null
          id?: string
          storage_path?: string
          verse?: number
          voice_id?: string
        }
        Relationships: []
      }
      bible_commentaries: {
        Row: {
          audio_url: string | null
          book: string
          chapter: number
          commentary_text: string
          created_at: string
          id: string
          tier: string
          updated_at: string
          verse: number
        }
        Insert: {
          audio_url?: string | null
          book: string
          chapter: number
          commentary_text: string
          created_at?: string
          id?: string
          tier?: string
          updated_at?: string
          verse: number
        }
        Update: {
          audio_url?: string | null
          book?: string
          chapter?: number
          commentary_text?: string
          created_at?: string
          id?: string
          tier?: string
          updated_at?: string
          verse?: number
        }
        Relationships: []
      }
      bible_images: {
        Row: {
          book: string | null
          chapter: number | null
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
          book?: string | null
          chapter?: number | null
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
          book?: string | null
          chapter?: number | null
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
          is_public: boolean | null
          is_template: boolean | null
          lesson_count: number
          primary_goal: string
          share_token: string | null
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
          is_public?: boolean | null
          is_template?: boolean | null
          lesson_count: number
          primary_goal: string
          share_token?: string | null
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
          is_public?: boolean | null
          is_template?: boolean | null
          lesson_count?: number
          primary_goal?: string
          share_token?: string | null
          status?: string | null
          theme_subject?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bible_study_series_enrollments: {
        Row: {
          enrolled_at: string
          id: string
          is_active: boolean
          last_accessed_at: string | null
          series_id: string
          user_id: string
        }
        Insert: {
          enrolled_at?: string
          id?: string
          is_active?: boolean
          last_accessed_at?: string | null
          series_id: string
          user_id: string
        }
        Update: {
          enrolled_at?: string
          id?: string
          is_active?: boolean
          last_accessed_at?: string | null
          series_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_study_series_enrollments_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "bible_study_series"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_study_series_progress: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          lesson_id: string
          notes: string | null
          series_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id: string
          notes?: string | null
          series_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          lesson_id?: string
          notes?: string | null
          series_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_study_series_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "bible_study_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_study_series_progress_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "bible_study_series"
            referencedColumns: ["id"]
          },
        ]
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
      bible_worker_study_releases: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          church_id: string
          created_at: string
          created_by: string | null
          description: string | null
          doctrinal_topics: string[] | null
          id: string
          status: string
          study_content: Json
          target_audience: string | null
          title: string
          updated_at: string
          version: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          church_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          doctrinal_topics?: string[] | null
          id?: string
          status?: string
          study_content: Json
          target_audience?: string | null
          title: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          church_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          doctrinal_topics?: string[] | null
          id?: string
          status?: string
          study_content?: Json
          target_audience?: string | null
          title?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_worker_study_releases_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_worker_study_releases_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
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
      challenge_leaderboard: {
        Row: {
          challenge_type: string
          content: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          jeeves_feedback: string | null
          jeeves_highlights: string[] | null
          jeeves_score: number | null
          title: string
          user_id: string
        }
        Insert: {
          challenge_type: string
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          jeeves_feedback?: string | null
          jeeves_highlights?: string[] | null
          jeeves_score?: number | null
          title: string
          user_id: string
        }
        Update: {
          challenge_type?: string
          content?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          jeeves_feedback?: string | null
          jeeves_highlights?: string[] | null
          jeeves_score?: number | null
          title?: string
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
      chapter_commentary_cache: {
        Row: {
          audio_storage_path: string | null
          book: string
          chapter: number
          commentary_text: string
          created_at: string
          id: string
          updated_at: string
          voice_id: string | null
        }
        Insert: {
          audio_storage_path?: string | null
          book: string
          chapter: number
          commentary_text: string
          created_at?: string
          id?: string
          updated_at?: string
          voice_id?: string | null
        }
        Update: {
          audio_storage_path?: string | null
          book?: string
          chapter?: number
          commentary_text?: string
          created_at?: string
          id?: string
          updated_at?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      character_deep_analyses: {
        Row: {
          analysis_text: string
          character_id: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          analysis_text: string
          character_id: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          analysis_text?: string
          character_id?: string
          created_at?: string
          id?: string
          updated_at?: string
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
      church_announcement_dismissals: {
        Row: {
          announcement_id: string
          dismissed_at: string
          id: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          dismissed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          dismissed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_announcement_dismissals_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "church_announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      church_announcements: {
        Row: {
          church_id: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          is_pinned: boolean
          message: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          church_id: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          message: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          church_id?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          message?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_announcements_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_announcements_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_branding: {
        Row: {
          accent_color: string | null
          banner_url: string | null
          church_id: string
          created_at: string | null
          custom_css: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          banner_url?: string | null
          church_id: string
          created_at?: string | null
          custom_css?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          banner_url?: string | null
          church_id?: string
          created_at?: string | null
          custom_css?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_branding_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: true
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_branding_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: true
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
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
          {
            foreignKeyName: "church_campaigns_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_central_studies: {
        Row: {
          action_challenge: string
          christ_synthesis: string
          church_id: string
          created_at: string
          description: string | null
          guided_questions: string[]
          id: string
          key_passages: string[]
          prayer_focus: string
          seeker_friendly_framing: string | null
          sermon_id: string | null
          share_token: string | null
          status: string
          title: string
          updated_at: string
          week_end: string
          week_start: string
        }
        Insert: {
          action_challenge?: string
          christ_synthesis?: string
          church_id: string
          created_at?: string
          description?: string | null
          guided_questions?: string[]
          id?: string
          key_passages?: string[]
          prayer_focus?: string
          seeker_friendly_framing?: string | null
          sermon_id?: string | null
          share_token?: string | null
          status?: string
          title: string
          updated_at?: string
          week_end: string
          week_start: string
        }
        Update: {
          action_challenge?: string
          christ_synthesis?: string
          church_id?: string
          created_at?: string
          description?: string | null
          guided_questions?: string[]
          id?: string
          key_passages?: string[]
          prayer_focus?: string
          seeker_friendly_framing?: string | null
          sermon_id?: string | null
          share_token?: string | null
          status?: string
          title?: string
          updated_at?: string
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_central_studies_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_central_studies_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "church_chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      church_chat_room_members: {
        Row: {
          id: string
          joined_at: string | null
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_chat_room_members_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "church_chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      church_chat_rooms: {
        Row: {
          church_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_private: boolean | null
          name: string
          room_type: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          room_type?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          room_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_chat_rooms_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_chat_rooms_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "church_community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "church_community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_community_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_community_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_community_posts: {
        Row: {
          category: string | null
          church_id: string
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
          church_id: string
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
          church_id?: string
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
            foreignKeyName: "church_community_posts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_community_posts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_devotional_entries: {
        Row: {
          anchor_scripture: string
          church_devotional_id: string
          closing_prayer: string
          communal_practice: string
          created_at: string
          day_theme: string | null
          entry_date: string
          id: string
          is_published: boolean | null
          meditation: string
          scripture_text: string | null
          title: string
        }
        Insert: {
          anchor_scripture: string
          church_devotional_id: string
          closing_prayer: string
          communal_practice: string
          created_at?: string
          day_theme?: string | null
          entry_date?: string
          id?: string
          is_published?: boolean | null
          meditation: string
          scripture_text?: string | null
          title: string
        }
        Update: {
          anchor_scripture?: string
          church_devotional_id?: string
          closing_prayer?: string
          communal_practice?: string
          created_at?: string
          day_theme?: string | null
          entry_date?: string
          id?: string
          is_published?: boolean | null
          meditation?: string
          scripture_text?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_devotional_entries_church_devotional_id_fkey"
            columns: ["church_devotional_id"]
            isOneToOne: false
            referencedRelation: "church_devotionals"
            referencedColumns: ["id"]
          },
        ]
      }
      church_devotional_templates: {
        Row: {
          church_devotional_id: string
          created_at: string
          day_of_week: string
          id: string
          sample_topics: string[] | null
          theme_description: string | null
          theme_name: string
        }
        Insert: {
          church_devotional_id: string
          created_at?: string
          day_of_week: string
          id?: string
          sample_topics?: string[] | null
          theme_description?: string | null
          theme_name: string
        }
        Update: {
          church_devotional_id?: string
          created_at?: string
          day_of_week?: string
          id?: string
          sample_topics?: string[] | null
          theme_description?: string | null
          theme_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_devotional_templates_church_devotional_id_fkey"
            columns: ["church_devotional_id"]
            isOneToOne: false
            referencedRelation: "church_devotionals"
            referencedColumns: ["id"]
          },
        ]
      }
      church_devotionals: {
        Row: {
          church_id: string | null
          church_name: string
          created_at: string
          day_of_week: string | null
          id: string
          theme_cycle: string | null
          theological_frame: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          church_id?: string | null
          church_name: string
          created_at?: string
          day_of_week?: string | null
          id?: string
          theme_cycle?: string | null
          theological_frame?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          church_id?: string | null
          church_name?: string
          created_at?: string
          day_of_week?: string | null
          id?: string
          theme_cycle?: string | null
          theological_frame?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_devotionals_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_devotionals_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_email_log: {
        Row: {
          church_id: string
          id: string
          notification_type: string
          recipient_email: string
          recipient_user_id: string
          reference_id: string | null
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          church_id: string
          id?: string
          notification_type: string
          recipient_email: string
          recipient_user_id: string
          reference_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          church_id?: string
          id?: string
          notification_type?: string
          recipient_email?: string
          recipient_user_id?: string
          reference_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_email_log_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_email_log_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_event_rsvps: {
        Row: {
          created_at: string | null
          event_id: string
          guest_count: number | null
          id: string
          notes: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          guest_count?: number | null
          id?: string
          notes?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          guest_count?: number | null
          id?: string
          notes?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "church_events"
            referencedColumns: ["id"]
          },
        ]
      }
      church_events: {
        Row: {
          category: string | null
          church_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          is_recurring: boolean | null
          location: string | null
          max_attendees: number | null
          parent_event_id: string | null
          recurrence_end_date: string | null
          recurrence_rule: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          church_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          max_attendees?: number | null
          parent_event_id?: string | null
          recurrence_end_date?: string | null
          recurrence_rule?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          church_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          max_attendees?: number | null
          parent_event_id?: string | null
          recurrence_end_date?: string | null
          recurrence_rule?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_events_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "church_events"
            referencedColumns: ["id"]
          },
        ]
      }
      church_guest_access: {
        Row: {
          access_token: string
          church_id: string
          converted_to_member_at: string | null
          created_at: string
          email: string | null
          expires_at: string
          group_id: string | null
          id: string
          invited_by: string
          is_active: boolean
          user_id: string | null
        }
        Insert: {
          access_token?: string
          church_id: string
          converted_to_member_at?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string
          group_id?: string | null
          id?: string
          invited_by: string
          is_active?: boolean
          user_id?: string | null
        }
        Update: {
          access_token?: string
          church_id?: string
          converted_to_member_at?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string
          group_id?: string | null
          id?: string
          invited_by?: string
          is_active?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_guest_access_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_guest_access_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
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
          {
            foreignKeyName: "church_invitations_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_livestreams: {
        Row: {
          church_id: string
          created_at: string | null
          created_by: string | null
          embed_url: string
          ended_at: string | null
          id: string
          is_live: boolean | null
          platform: string
          scheduled_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          created_by?: string | null
          embed_url: string
          ended_at?: string | null
          id?: string
          is_live?: boolean | null
          platform: string
          scheduled_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          created_by?: string | null
          embed_url?: string
          ended_at?: string | null
          id?: string
          is_live?: boolean | null
          platform?: string
          scheduled_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_livestreams_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_livestreams_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
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
          {
            foreignKeyName: "church_members_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_permissions: {
        Row: {
          church_id: string
          created_at: string | null
          id: string
          permission: string
          role: string
        }
        Insert: {
          church_id: string
          created_at?: string | null
          id?: string
          permission: string
          role: string
        }
        Update: {
          church_id?: string
          created_at?: string | null
          id?: string
          permission?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_permissions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_permissions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_prayer_requests: {
        Row: {
          answer_testimony: string | null
          answered_at: string | null
          assigned_to: string | null
          category: string | null
          church_id: string | null
          content: string
          created_at: string
          follow_up_date: string | null
          id: string
          is_answered: boolean | null
          is_public: boolean | null
          prayer_count: number | null
          team_id: string | null
          title: string
          updated_at: string
          urgency: string | null
          user_id: string | null
        }
        Insert: {
          answer_testimony?: string | null
          answered_at?: string | null
          assigned_to?: string | null
          category?: string | null
          church_id?: string | null
          content: string
          created_at?: string
          follow_up_date?: string | null
          id?: string
          is_answered?: boolean | null
          is_public?: boolean | null
          prayer_count?: number | null
          team_id?: string | null
          title: string
          updated_at?: string
          urgency?: string | null
          user_id?: string | null
        }
        Update: {
          answer_testimony?: string | null
          answered_at?: string | null
          assigned_to?: string | null
          category?: string | null
          church_id?: string | null
          content?: string
          created_at?: string
          follow_up_date?: string | null
          id?: string
          is_answered?: boolean | null
          is_public?: boolean | null
          prayer_count?: number | null
          team_id?: string | null
          title?: string
          updated_at?: string
          urgency?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_prayer_requests_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_prayer_requests_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_prayer_requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "prayer_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      church_preapproved_members: {
        Row: {
          church_id: string
          claimed_at: string | null
          created_at: string
          email: string
          id: string
          invited_by: string | null
          role: string
        }
        Insert: {
          church_id: string
          claimed_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          role?: string
        }
        Update: {
          church_id?: string
          claimed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_preapproved_members_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_preapproved_members_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_sermons: {
        Row: {
          church_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          preacher: string | null
          pt_framing: string | null
          scripture_focus: string | null
          sermon_date: string
          thumbnail_url: string | null
          title: string
          youtube_url: string
        }
        Insert: {
          church_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          preacher?: string | null
          pt_framing?: string | null
          scripture_focus?: string | null
          sermon_date: string
          thumbnail_url?: string | null
          title: string
          youtube_url: string
        }
        Update: {
          church_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          preacher?: string | null
          pt_framing?: string | null
          scripture_focus?: string | null
          sermon_date?: string
          thumbnail_url?: string | null
          title?: string
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_sermons_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_sermons_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_stream_platforms: {
        Row: {
          church_id: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          platform_name: string
          rtmp_url: string
          stream_key: string
          updated_at: string
        }
        Insert: {
          church_id: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          platform_name: string
          rtmp_url?: string
          stream_key?: string
          updated_at?: string
        }
        Update: {
          church_id?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          platform_name?: string
          rtmp_url?: string
          stream_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_stream_platforms_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_stream_platforms_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      church_survey_questions: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          options: Json | null
          question_text: string
          question_type: string | null
          sort_order: number | null
          survey_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          question_text: string
          question_type?: string | null
          sort_order?: number | null
          survey_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          question_text?: string
          question_type?: string | null
          sort_order?: number | null
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "church_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      church_survey_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string
          response_data: Json | null
          response_value: string | null
          survey_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id: string
          response_data?: Json | null
          response_value?: string | null
          survey_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string
          response_data?: Json | null
          response_value?: string | null
          survey_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_survey_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "church_survey_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "church_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      church_surveys: {
        Row: {
          church_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          ends_at: string | null
          id: string
          is_anonymous: boolean | null
          starts_at: string | null
          status: string | null
          survey_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          starts_at?: string | null
          status?: string | null
          survey_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          starts_at?: string | null
          status?: string | null
          survey_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_surveys_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "church_surveys_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
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
          youtube_channel_name: string | null
          youtube_channel_url: string | null
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
          youtube_channel_name?: string | null
          youtube_channel_url?: string | null
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
          youtube_channel_name?: string | null
          youtube_channel_url?: string | null
        }
        Relationships: []
      }
      claim_ladders: {
        Row: {
          claim: string
          created_at: string
          historical_anchor: Json | null
          id: string
          logical_move: string | null
          risk_counterpoint: Json | null
          status: Database["public"]["Enums"]["claim_ladder_status"] | null
          textual_basis: Json | null
          theological_implication: string | null
          updated_at: string | null
          user_id: string
          validation_notes: string | null
        }
        Insert: {
          claim: string
          created_at?: string
          historical_anchor?: Json | null
          id?: string
          logical_move?: string | null
          risk_counterpoint?: Json | null
          status?: Database["public"]["Enums"]["claim_ladder_status"] | null
          textual_basis?: Json | null
          theological_implication?: string | null
          updated_at?: string | null
          user_id: string
          validation_notes?: string | null
        }
        Update: {
          claim?: string
          created_at?: string
          historical_anchor?: Json | null
          id?: string
          logical_move?: string | null
          risk_counterpoint?: Json | null
          status?: Database["public"]["Enums"]["claim_ladder_status"] | null
          textual_basis?: Json | null
          theological_implication?: string | null
          updated_at?: string | null
          user_id?: string
          validation_notes?: string | null
        }
        Relationships: []
      }
      cohort_attendance: {
        Row: {
          attendance_status: string
          cohort_id: string
          created_at: string
          id: string
          notes: string | null
          participation_level: string | null
          recorded_by: string | null
          session_date: string
          user_id: string
          week_number: number | null
        }
        Insert: {
          attendance_status?: string
          cohort_id: string
          created_at?: string
          id?: string
          notes?: string | null
          participation_level?: string | null
          recorded_by?: string | null
          session_date: string
          user_id: string
          week_number?: number | null
        }
        Update: {
          attendance_status?: string
          cohort_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          participation_level?: string | null
          recorded_by?: string | null
          session_date?: string
          user_id?: string
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cohort_attendance_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "discipleship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_members: {
        Row: {
          attendance_count: number | null
          cohort_id: string
          id: string
          is_active: boolean | null
          joined_at: string
          last_attendance: string | null
          member_pathway: string
          notes: string | null
          user_id: string
        }
        Insert: {
          attendance_count?: number | null
          cohort_id: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          last_attendance?: string | null
          member_pathway?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          attendance_count?: number | null
          cohort_id?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          last_attendance?: string | null
          member_pathway?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohort_members_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "discipleship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_armory: {
        Row: {
          analysis: string
          argument: string
          created_at: string
          id: string
          image_url: string | null
          is_curated: boolean
          likes: number
          score: number
          subtitle: string | null
          topic: string
          updated_at: string
          user_id: string
          weapon_emoji: string
          weapon_name: string
        }
        Insert: {
          analysis: string
          argument: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_curated?: boolean
          likes?: number
          score: number
          subtitle?: string | null
          topic: string
          updated_at?: string
          user_id: string
          weapon_emoji?: string
          weapon_name: string
        }
        Update: {
          analysis?: string
          argument?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_curated?: boolean
          likes?: number
          score?: number
          subtitle?: string | null
          topic?: string
          updated_at?: string
          user_id?: string
          weapon_emoji?: string
          weapon_name?: string
        }
        Relationships: []
      }
      community_armory_likes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          weapon_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          weapon_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          weapon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_armory_likes_weapon_id_fkey"
            columns: ["weapon_id"]
            isOneToOne: false
            referencedRelation: "community_armory"
            referencedColumns: ["id"]
          },
        ]
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
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          updated_at?: string | null
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
          {
            foreignKeyName: "community_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_notifications: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          post_id: string
          type: string
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          post_id: string
          type: string
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          post_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_notifications_post_id_fkey"
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
          search_vector: unknown
          shared_content: Json | null
          tags: string[] | null
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
          search_vector?: unknown
          shared_content?: Json | null
          tags?: string[] | null
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
          search_vector?: unknown
          shared_content?: Json | null
          tags?: string[] | null
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
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      content_analytics: {
        Row: {
          avg_time_spent: number | null
          church_id: string
          completions: number | null
          content_id: string
          content_type: string
          created_at: string | null
          date: string
          id: string
          shares: number | null
          unique_views: number | null
          views: number | null
        }
        Insert: {
          avg_time_spent?: number | null
          church_id: string
          completions?: number | null
          content_id: string
          content_type: string
          created_at?: string | null
          date?: string
          id?: string
          shares?: number | null
          unique_views?: number | null
          views?: number | null
        }
        Update: {
          avg_time_spent?: number | null
          church_id?: string
          completions?: number | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          date?: string
          id?: string
          shares?: number | null
          unique_views?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_analytics_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_analytics_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
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
      course_discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          parent_reply_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          parent_reply_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          parent_reply_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "course_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "course_discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      course_discussions: {
        Row: {
          church_id: string | null
          content: string
          course_id: string
          course_type: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          church_id?: string | null
          content: string
          course_id: string
          course_type: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          church_id?: string | null
          content?: string
          course_id?: string
          course_type?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_discussions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_discussions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
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
      cycle_enrollments: {
        Row: {
          cohort_id: string | null
          completed_at: string | null
          current_week: number | null
          cycle_id: string
          id: string
          started_at: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          cohort_id?: string | null
          completed_at?: string | null
          current_week?: number | null
          cycle_id: string
          id?: string
          started_at?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          cohort_id?: string | null
          completed_at?: string | null
          current_week?: number | null
          cycle_id?: string
          id?: string
          started_at?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cycle_enrollments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "discipleship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cycle_enrollments_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "six_week_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_audio_devotionals: {
        Row: {
          app_feature_cta: string | null
          audio_duration_seconds: number | null
          audio_storage_path: string | null
          audio_url: string | null
          call_to_action: string | null
          created_at: string | null
          day_number: number
          devotional_text: string
          error_message: string | null
          id: string
          palace_room: string | null
          prayer: string | null
          scripture_reference: string
          scripture_text: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          app_feature_cta?: string | null
          audio_duration_seconds?: number | null
          audio_storage_path?: string | null
          audio_url?: string | null
          call_to_action?: string | null
          created_at?: string | null
          day_number: number
          devotional_text: string
          error_message?: string | null
          id?: string
          palace_room?: string | null
          prayer?: string | null
          scripture_reference: string
          scripture_text?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          app_feature_cta?: string | null
          audio_duration_seconds?: number | null
          audio_storage_path?: string | null
          audio_url?: string | null
          call_to_action?: string | null
          created_at?: string | null
          day_number?: number
          devotional_text?: string
          error_message?: string | null
          id?: string
          palace_room?: string | null
          prayer?: string | null
          scripture_reference?: string
          scripture_text?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_devotional_sms_log: {
        Row: {
          day_number: number
          devotional_id: string
          error_message: string | null
          id: string
          message_body: string | null
          phone_number: string
          sent_at: string | null
          sns_message_id: string | null
          status: string
          subscriber_id: string
        }
        Insert: {
          day_number: number
          devotional_id: string
          error_message?: string | null
          id?: string
          message_body?: string | null
          phone_number: string
          sent_at?: string | null
          sns_message_id?: string | null
          status?: string
          subscriber_id: string
        }
        Update: {
          day_number?: number
          devotional_id?: string
          error_message?: string | null
          id?: string
          message_body?: string | null
          phone_number?: string
          sent_at?: string | null
          sns_message_id?: string | null
          status?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_devotional_sms_log_devotional_id_fkey"
            columns: ["devotional_id"]
            isOneToOne: false
            referencedRelation: "daily_audio_devotionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_devotional_sms_log_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "daily_devotional_sms_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_devotional_sms_subscribers: {
        Row: {
          created_at: string | null
          current_day: number
          id: string
          is_active: boolean
          last_sent_at: string | null
          phone_country_code: string
          phone_number: string
          preferred_send_hour: number
          timezone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_day?: number
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          phone_country_code?: string
          phone_number: string
          preferred_send_hour?: number
          timezone?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_day?: number
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          phone_country_code?: string
          phone_number?: string
          preferred_send_hour?: number
          timezone?: string
          updated_at?: string | null
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
      daily_reading_log: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          read_date: string
          time_spent_seconds: number | null
          user_id: string
          verses_read: number
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          read_date?: string
          time_spent_seconds?: number | null
          user_id: string
          verses_read?: number
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          read_date?: string
          time_spent_seconds?: number | null
          user_id?: string
          verses_read?: number
        }
        Relationships: []
      }
      daily_tip_logs: {
        Row: {
          delivery_status: string | null
          id: string
          sent_at: string
          tip_content: string
          tip_type: string
          user_id: string
        }
        Insert: {
          delivery_status?: string | null
          id?: string
          sent_at?: string
          tip_content: string
          tip_type: string
          user_id: string
        }
        Update: {
          delivery_status?: string | null
          id?: string
          sent_at?: string
          tip_content?: string
          tip_type?: string
          user_id?: string
        }
        Relationships: []
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
      day_passes: {
        Row: {
          audio_plays_limit: number
          audio_plays_used: number
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          pass_token: string
          recipient_identifier: string | null
          redeemed_at: string | null
          status: string
        }
        Insert: {
          audio_plays_limit?: number
          audio_plays_used?: number
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          pass_token?: string
          recipient_identifier?: string | null
          redeemed_at?: string | null
          status?: string
        }
        Update: {
          audio_plays_limit?: number
          audio_plays_used?: number
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          pass_token?: string
          recipient_identifier?: string | null
          redeemed_at?: string | null
          status?: string
        }
        Relationships: []
      }
      debate_analyses: {
        Row: {
          analysis_text: string | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          session_id: string
          status: string
          user_id: string
        }
        Insert: {
          analysis_text?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          session_id: string
          status?: string
          user_id: string
        }
        Update: {
          analysis_text?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          session_id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      debate_challenge_badges: {
        Row: {
          badge_description: string | null
          badge_icon: string
          badge_name: string
          badge_type: string
          earned_at: string
          enrollment_id: string
          id: string
          user_id: string
        }
        Insert: {
          badge_description?: string | null
          badge_icon: string
          badge_name: string
          badge_type: string
          earned_at?: string
          enrollment_id: string
          id?: string
          user_id: string
        }
        Update: {
          badge_description?: string | null
          badge_icon?: string
          badge_name?: string
          badge_type?: string
          earned_at?: string
          enrollment_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debate_challenge_badges_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "debate_challenge_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_challenge_enrollments: {
        Row: {
          completed_at: string | null
          completed_days: number
          created_at: string
          current_day: number
          difficulty: string
          grace_days_used: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          max_grace_days: number
          missed_days: number
          started_at: string
          status: string
          streak: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_days?: number
          created_at?: string
          current_day?: number
          difficulty: string
          grace_days_used?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          max_grace_days?: number
          missed_days?: number
          started_at?: string
          status?: string
          streak?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_days?: number
          created_at?: string
          current_day?: number
          difficulty?: string
          grace_days_used?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          max_grace_days?: number
          missed_days?: number
          started_at?: string
          status?: string
          streak?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      debate_challenge_sessions: {
        Row: {
          ai_verdict: string | null
          completed_at: string | null
          created_at: string
          day_number: number
          difficulty: string
          enrollment_id: string
          id: string
          is_public: boolean | null
          messages: Json
          opponent_id: string
          opponent_name: string
          outcome: string | null
          rounds_completed: number
          session_date: string
          share_token: string | null
          started_at: string
          topic_id: string
          topic_name: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          ai_verdict?: string | null
          completed_at?: string | null
          created_at?: string
          day_number: number
          difficulty: string
          enrollment_id: string
          id?: string
          is_public?: boolean | null
          messages?: Json
          opponent_id: string
          opponent_name: string
          outcome?: string | null
          rounds_completed?: number
          session_date?: string
          share_token?: string | null
          started_at?: string
          topic_id: string
          topic_name: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          ai_verdict?: string | null
          completed_at?: string | null
          created_at?: string
          day_number?: number
          difficulty?: string
          enrollment_id?: string
          id?: string
          is_public?: boolean | null
          messages?: Json
          opponent_id?: string
          opponent_name?: string
          outcome?: string | null
          rounds_completed?: number
          session_date?: string
          share_token?: string | null
          started_at?: string
          topic_id?: string
          topic_name?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "debate_challenge_sessions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "debate_challenge_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      debate_turn_analyses: {
        Row: {
          analysis_text: string | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          session_id: string
          status: string
          turn_index: number
          turn_role: string
          user_id: string
        }
        Insert: {
          analysis_text?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          session_id: string
          status?: string
          turn_index: number
          turn_role: string
          user_id: string
        }
        Update: {
          analysis_text?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          session_id?: string
          status?: string
          turn_index?: number
          turn_role?: string
          user_id?: string
        }
        Relationships: []
      }
      deck_studies: {
        Row: {
          cards_used: Json
          conversation_history: Json
          created_at: string | null
          gem_notes: string | null
          gem_title: string | null
          id: string
          is_gem: boolean | null
          updated_at: string | null
          user_id: string
          verse_reference: string | null
          verse_text: string
        }
        Insert: {
          cards_used?: Json
          conversation_history?: Json
          created_at?: string | null
          gem_notes?: string | null
          gem_title?: string | null
          id?: string
          is_gem?: boolean | null
          updated_at?: string | null
          user_id: string
          verse_reference?: string | null
          verse_text: string
        }
        Update: {
          cards_used?: Json
          conversation_history?: Json
          created_at?: string | null
          gem_notes?: string | null
          gem_title?: string | null
          id?: string
          is_gem?: boolean | null
          updated_at?: string | null
          user_id?: string
          verse_reference?: string | null
          verse_text?: string
        }
        Relationships: []
      }
      defense_arsenal: {
        Row: {
          analysis: string
          argument: string
          created_at: string
          id: string
          image_url: string | null
          name: string | null
          saved_at: string
          subtitle: string | null
          topic: string
          user_id: string
        }
        Insert: {
          analysis: string
          argument: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string | null
          saved_at?: string
          subtitle?: string | null
          topic?: string
          user_id: string
        }
        Update: {
          analysis?: string
          argument?: string
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string | null
          saved_at?: string
          subtitle?: string | null
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      defense_battle_spectator_comments: {
        Row: {
          battle_id: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          battle_id: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          battle_id?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "defense_battle_spectator_comments_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "defense_battles"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_battles: {
        Row: {
          balanced_participation: boolean | null
          battle_date: string | null
          battle_log: Json | null
          created_at: string
          difficulty: string
          full_attendance: boolean | null
          id: string
          points_earned: number | null
          result: string | null
          season_id: string
          squad_id: string
          status: string
          topic: string
          weapons_used: number | null
          week_number: number
        }
        Insert: {
          balanced_participation?: boolean | null
          battle_date?: string | null
          battle_log?: Json | null
          created_at?: string
          difficulty?: string
          full_attendance?: boolean | null
          id?: string
          points_earned?: number | null
          result?: string | null
          season_id: string
          squad_id: string
          status?: string
          topic: string
          weapons_used?: number | null
          week_number: number
        }
        Update: {
          balanced_participation?: boolean | null
          battle_date?: string | null
          battle_log?: Json | null
          created_at?: string
          difficulty?: string
          full_attendance?: boolean | null
          id?: string
          points_earned?: number | null
          result?: string | null
          season_id?: string
          squad_id?: string
          status?: string
          topic?: string
          weapons_used?: number | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "defense_battles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "defense_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_battles_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_bounties: {
        Row: {
          bounty_type: string
          created_at: string
          description: string
          difficulty: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          points_reward: number
          requirements: Json | null
          season_id: string
          title: string
        }
        Insert: {
          bounty_type?: string
          created_at?: string
          description: string
          difficulty?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          points_reward?: number
          requirements?: Json | null
          season_id: string
          title: string
        }
        Update: {
          bounty_type?: string
          created_at?: string
          description?: string
          difficulty?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          points_reward?: number
          requirements?: Json | null
          season_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "defense_bounties_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "defense_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_bounty_completions: {
        Row: {
          bounty_id: string
          created_at: string
          id: string
          points_awarded: number | null
          squad_id: string
          submission: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          bounty_id: string
          created_at?: string
          id?: string
          points_awarded?: number | null
          squad_id: string
          submission: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          bounty_id?: string
          created_at?: string
          id?: string
          points_awarded?: number | null
          squad_id?: string
          submission?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "defense_bounty_completions_bounty_id_fkey"
            columns: ["bounty_id"]
            isOneToOne: false
            referencedRelation: "defense_bounties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_bounty_completions_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_doctrine_mastery: {
        Row: {
          avg_score: number | null
          battles_in_category: number | null
          category: string
          id: string
          mastery_score: number | null
          season_id: string
          squad_id: string | null
          updated_at: string | null
        }
        Insert: {
          avg_score?: number | null
          battles_in_category?: number | null
          category: string
          id?: string
          mastery_score?: number | null
          season_id: string
          squad_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avg_score?: number | null
          battles_in_category?: number | null
          category?: string
          id?: string
          mastery_score?: number | null
          season_id?: string
          squad_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "defense_doctrine_mastery_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_legacy_wall: {
        Row: {
          achievement_icon: string | null
          achievement_name: string
          achievement_type: string
          banner_emoji: string | null
          created_at: string | null
          details: Json | null
          id: string
          season_id: string
          season_number: number | null
          squad_id: string | null
          squad_name: string
        }
        Insert: {
          achievement_icon?: string | null
          achievement_name: string
          achievement_type: string
          banner_emoji?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          season_id: string
          season_number?: number | null
          squad_id?: string | null
          squad_name: string
        }
        Update: {
          achievement_icon?: string | null
          achievement_name?: string
          achievement_type?: string
          banner_emoji?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          season_id?: string
          season_number?: number | null
          squad_id?: string | null
          squad_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "defense_legacy_wall_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_member_weekly_activity: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          points_earned: number
          squad_id: string
          topic_id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          points_earned?: number
          squad_id: string
          topic_id: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          points_earned?: number
          squad_id?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "defense_member_weekly_activity_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_member_weekly_activity_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "defense_weekly_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_personal_stats: {
        Row: {
          accuracy_rating: number | null
          battles_fought: number | null
          battles_won: number | null
          best_round_score: number | null
          created_at: string | null
          drills_completed: number | null
          id: string
          legendary_weapons: number | null
          scriptures_cited: number | null
          season_id: string
          squad_id: string | null
          total_score: number | null
          updated_at: string | null
          user_id: string
          weapons_forged: number | null
        }
        Insert: {
          accuracy_rating?: number | null
          battles_fought?: number | null
          battles_won?: number | null
          best_round_score?: number | null
          created_at?: string | null
          drills_completed?: number | null
          id?: string
          legendary_weapons?: number | null
          scriptures_cited?: number | null
          season_id: string
          squad_id?: string | null
          total_score?: number | null
          updated_at?: string | null
          user_id: string
          weapons_forged?: number | null
        }
        Update: {
          accuracy_rating?: number | null
          battles_fought?: number | null
          battles_won?: number | null
          best_round_score?: number | null
          created_at?: string | null
          drills_completed?: number | null
          id?: string
          legendary_weapons?: number | null
          scriptures_cited?: number | null
          season_id?: string
          squad_id?: string | null
          total_score?: number | null
          updated_at?: string | null
          user_id?: string
          weapons_forged?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "defense_personal_stats_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_redemption_challenges: {
        Row: {
          challenge_type: string
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          is_completed: boolean
          points_earned: number
          points_required: number
          season_id: string
          squad_id: string
          title: string
        }
        Insert: {
          challenge_type?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          points_earned?: number
          points_required?: number
          season_id: string
          squad_id: string
          title: string
        }
        Update: {
          challenge_type?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean
          points_earned?: number
          points_required?: number
          season_id?: string
          squad_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "defense_redemption_challenges_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "defense_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_redemption_challenges_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_season_events: {
        Row: {
          created_at: string | null
          event_icon: string | null
          event_message: string
          event_type: string
          id: string
          season_id: string
          squad_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_icon?: string | null
          event_message: string
          event_type: string
          id?: string
          season_id: string
          squad_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_icon?: string | null
          event_message?: string
          event_type?: string
          id?: string
          season_id?: string
          squad_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "defense_season_events_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_season_participants: {
        Row: {
          experience_level: string | null
          id: string
          joined_at: string
          preferred_doctrine: string | null
          season_id: string
          skill_strength: string | null
          squad_id: string | null
          user_id: string
        }
        Insert: {
          experience_level?: string | null
          id?: string
          joined_at?: string
          preferred_doctrine?: string | null
          season_id: string
          skill_strength?: string | null
          squad_id?: string | null
          user_id: string
        }
        Update: {
          experience_level?: string | null
          id?: string
          joined_at?: string
          preferred_doctrine?: string | null
          season_id?: string
          skill_strength?: string | null
          squad_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "defense_season_participants_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "defense_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_season_participants_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_seasons: {
        Row: {
          army_health: number | null
          army_morale: number | null
          church_id: string | null
          config_mode: string | null
          created_at: string
          created_by: string
          current_week: number
          description: string | null
          doctrines: string[] | null
          ends_at: string | null
          id: string
          is_global: boolean | null
          opponents: string[] | null
          season_number: number | null
          squads_survived: number | null
          starts_at: string | null
          status: string
          title: string
          total_army_points: number | null
          updated_at: string
          week_count: number
        }
        Insert: {
          army_health?: number | null
          army_morale?: number | null
          church_id?: string | null
          config_mode?: string | null
          created_at?: string
          created_by: string
          current_week?: number
          description?: string | null
          doctrines?: string[] | null
          ends_at?: string | null
          id?: string
          is_global?: boolean | null
          opponents?: string[] | null
          season_number?: number | null
          squads_survived?: number | null
          starts_at?: string | null
          status?: string
          title: string
          total_army_points?: number | null
          updated_at?: string
          week_count?: number
        }
        Update: {
          army_health?: number | null
          army_morale?: number | null
          church_id?: string | null
          config_mode?: string | null
          created_at?: string
          created_by?: string
          current_week?: number
          description?: string | null
          doctrines?: string[] | null
          ends_at?: string | null
          id?: string
          is_global?: boolean | null
          opponents?: string[] | null
          season_number?: number | null
          squads_survived?: number | null
          starts_at?: string | null
          status?: string
          title?: string
          total_army_points?: number | null
          updated_at?: string
          week_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "defense_seasons_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_seasons_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_sparring_matches: {
        Row: {
          ai_verdict: string | null
          challenger_argument: string | null
          challenger_id: string
          challenger_score: number | null
          completed_at: string | null
          created_at: string
          defender_argument: string | null
          defender_id: string
          defender_score: number | null
          id: string
          points_each: number | null
          season_id: string
          squad_id: string
          status: string
          topic: string
        }
        Insert: {
          ai_verdict?: string | null
          challenger_argument?: string | null
          challenger_id: string
          challenger_score?: number | null
          completed_at?: string | null
          created_at?: string
          defender_argument?: string | null
          defender_id: string
          defender_score?: number | null
          id?: string
          points_each?: number | null
          season_id: string
          squad_id: string
          status?: string
          topic: string
        }
        Update: {
          ai_verdict?: string | null
          challenger_argument?: string | null
          challenger_id?: string
          challenger_score?: number | null
          completed_at?: string | null
          created_at?: string
          defender_argument?: string | null
          defender_id?: string
          defender_score?: number | null
          id?: string
          points_each?: number | null
          season_id?: string
          squad_id?: string
          status?: string
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "defense_sparring_matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "defense_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_sparring_matches_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_squad_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          evolution_count: number | null
          id: string
          metadata: Json | null
          parent_weapon_id: string | null
          points_earned: number
          rarity: string | null
          season_id: string
          squad_id: string
          title: string | null
          topic_id: string | null
          user_id: string
          weapon_tier: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          evolution_count?: number | null
          id?: string
          metadata?: Json | null
          parent_weapon_id?: string | null
          points_earned?: number
          rarity?: string | null
          season_id: string
          squad_id: string
          title?: string | null
          topic_id?: string | null
          user_id: string
          weapon_tier?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          evolution_count?: number | null
          id?: string
          metadata?: Json | null
          parent_weapon_id?: string | null
          points_earned?: number
          rarity?: string | null
          season_id?: string
          squad_id?: string
          title?: string | null
          topic_id?: string | null
          user_id?: string
          weapon_tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "defense_squad_activities_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "defense_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_squad_activities_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_squad_activities_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "defense_weekly_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_squad_members: {
        Row: {
          id: string
          is_captain: boolean | null
          joined_at: string
          role: string
          squad_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_captain?: boolean | null
          joined_at?: string
          role?: string
          squad_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_captain?: boolean | null
          joined_at?: string
          role?: string
          squad_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "defense_squad_members_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_squad_rewards: {
        Row: {
          earned_at: string
          id: string
          reward_description: string | null
          reward_icon: string | null
          reward_name: string
          reward_type: string
          season_id: string
          squad_id: string
        }
        Insert: {
          earned_at?: string
          id?: string
          reward_description?: string | null
          reward_icon?: string | null
          reward_name: string
          reward_type: string
          season_id: string
          squad_id: string
        }
        Update: {
          earned_at?: string
          id?: string
          reward_description?: string | null
          reward_icon?: string | null
          reward_name?: string
          reward_type?: string
          season_id?: string
          squad_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "defense_squad_rewards_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "defense_seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_squad_rewards_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_squad_weekly_scores: {
        Row: {
          battle_points: number
          battle_summary: string | null
          bonus_points: number
          created_at: string
          id: string
          members_participated: number
          prep_points: number
          squad_id: string
          topic_id: string
          total_points: number
          updated_at: string
          weapons_used: number
        }
        Insert: {
          battle_points?: number
          battle_summary?: string | null
          bonus_points?: number
          created_at?: string
          id?: string
          members_participated?: number
          prep_points?: number
          squad_id: string
          topic_id: string
          total_points?: number
          updated_at?: string
          weapons_used?: number
        }
        Update: {
          battle_points?: number
          battle_summary?: string | null
          bonus_points?: number
          created_at?: string
          id?: string
          members_participated?: number
          prep_points?: number
          squad_id?: string
          topic_id?: string
          total_points?: number
          updated_at?: string
          weapons_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "defense_squad_weekly_scores_squad_id_fkey"
            columns: ["squad_id"]
            isOneToOne: false
            referencedRelation: "defense_squads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defense_squad_weekly_scores_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "defense_weekly_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_squads: {
        Row: {
          ai_enemy: string
          banner_emoji: string | null
          created_at: string
          eliminated_at: string | null
          elimination_week: number | null
          id: string
          is_eliminated: boolean | null
          losses: number
          motto: string | null
          name: string
          rank_position: number | null
          redeemed_at: string | null
          redemption_points: number
          redemption_unlocked: boolean
          season_id: string
          season_title: string | null
          tier: string
          total_points: number
          updated_at: string
          war_cry: string | null
          wins: number
        }
        Insert: {
          ai_enemy?: string
          banner_emoji?: string | null
          created_at?: string
          eliminated_at?: string | null
          elimination_week?: number | null
          id?: string
          is_eliminated?: boolean | null
          losses?: number
          motto?: string | null
          name: string
          rank_position?: number | null
          redeemed_at?: string | null
          redemption_points?: number
          redemption_unlocked?: boolean
          season_id: string
          season_title?: string | null
          tier?: string
          total_points?: number
          updated_at?: string
          war_cry?: string | null
          wins?: number
        }
        Update: {
          ai_enemy?: string
          banner_emoji?: string | null
          created_at?: string
          eliminated_at?: string | null
          elimination_week?: number | null
          id?: string
          is_eliminated?: boolean | null
          losses?: number
          motto?: string | null
          name?: string
          rank_position?: number | null
          redeemed_at?: string | null
          redemption_points?: number
          redemption_unlocked?: boolean
          season_id?: string
          season_title?: string | null
          tier?: string
          total_points?: number
          updated_at?: string
          war_cry?: string | null
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "defense_squads_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "defense_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      defense_weekly_topics: {
        Row: {
          battle_ends_at: string | null
          battle_starts_at: string | null
          briefing_codename: string | null
          created_at: string
          description: string | null
          id: string
          is_boss_battle: boolean | null
          mission_briefing: string | null
          phase: string
          prep_starts_at: string | null
          scripture_focus: string | null
          season_id: string
          topic: string
          week_number: number
        }
        Insert: {
          battle_ends_at?: string | null
          battle_starts_at?: string | null
          briefing_codename?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_boss_battle?: boolean | null
          mission_briefing?: string | null
          phase?: string
          prep_starts_at?: string | null
          scripture_focus?: string | null
          season_id: string
          topic: string
          week_number: number
        }
        Update: {
          battle_ends_at?: string | null
          battle_starts_at?: string | null
          briefing_codename?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_boss_battle?: boolean | null
          mission_briefing?: string | null
          phase?: string
          prep_starts_at?: string | null
          scripture_focus?: string | null
          season_id?: string
          topic?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "defense_weekly_topics_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "defense_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_days: {
        Row: {
          additional_content: Json | null
          application: string | null
          challenge: string | null
          christ_connection: string
          created_at: string | null
          cross_references: string[] | null
          day_number: number
          devotional_text: string | null
          floor_number: number | null
          id: string
          journal_prompt: string | null
          memory_hook: string | null
          plan_id: string
          prayer: string | null
          room_assignment: string | null
          sanctuary_station: string | null
          scripture_reference: string
          scripture_text: string | null
          title: string
          visual_imagery: string | null
        }
        Insert: {
          additional_content?: Json | null
          application?: string | null
          challenge?: string | null
          christ_connection: string
          created_at?: string | null
          cross_references?: string[] | null
          day_number: number
          devotional_text?: string | null
          floor_number?: number | null
          id?: string
          journal_prompt?: string | null
          memory_hook?: string | null
          plan_id: string
          prayer?: string | null
          room_assignment?: string | null
          sanctuary_station?: string | null
          scripture_reference: string
          scripture_text?: string | null
          title: string
          visual_imagery?: string | null
        }
        Update: {
          additional_content?: Json | null
          application?: string | null
          challenge?: string | null
          christ_connection?: string
          created_at?: string | null
          cross_references?: string[] | null
          day_number?: number
          devotional_text?: string | null
          floor_number?: number | null
          id?: string
          journal_prompt?: string | null
          memory_hook?: string | null
          plan_id?: string
          prayer?: string | null
          room_assignment?: string | null
          sanctuary_station?: string | null
          scripture_reference?: string
          scripture_text?: string | null
          title?: string
          visual_imagery?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devotional_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "devotional_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_enrollments: {
        Row: {
          current_day: number | null
          enrolled_at: string | null
          id: string
          is_active: boolean | null
          plan_id: string
          user_id: string
        }
        Insert: {
          current_day?: number | null
          enrolled_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_id: string
          user_id: string
        }
        Update: {
          current_day?: number | null
          enrolled_at?: string | null
          id?: string
          is_active?: boolean | null
          plan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "devotional_enrollments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "devotional_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_plans: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_day: number | null
          description: string | null
          duration: number
          format: string
          id: string
          is_public: boolean | null
          share_token: string | null
          started_at: string | null
          status: string | null
          study_style: string | null
          theme: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_day?: number | null
          description?: string | null
          duration: number
          format: string
          id?: string
          is_public?: boolean | null
          share_token?: string | null
          started_at?: string | null
          status?: string | null
          study_style?: string | null
          theme: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_day?: number | null
          description?: string | null
          duration?: number
          format?: string
          id?: string
          is_public?: boolean | null
          share_token?: string | null
          started_at?: string | null
          status?: string | null
          study_style?: string | null
          theme?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      devotional_profile_history: {
        Row: {
          ai_suggested_message: string | null
          completed_at: string | null
          day_id: string | null
          id: string
          personal_message: string | null
          profile_id: string
          shared_at: string | null
          shared_via: string
          used_ai_suggestion: boolean | null
          viewed_at: string | null
        }
        Insert: {
          ai_suggested_message?: string | null
          completed_at?: string | null
          day_id?: string | null
          id?: string
          personal_message?: string | null
          profile_id: string
          shared_at?: string | null
          shared_via?: string
          used_ai_suggestion?: boolean | null
          viewed_at?: string | null
        }
        Update: {
          ai_suggested_message?: string | null
          completed_at?: string | null
          day_id?: string | null
          id?: string
          personal_message?: string | null
          profile_id?: string
          shared_at?: string | null
          shared_via?: string
          used_ai_suggestion?: boolean | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devotional_profile_history_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "devotional_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devotional_profile_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "devotional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_profile_insights: {
        Row: {
          areas_improving: string[] | null
          areas_needing_prayer: string[] | null
          created_at: string | null
          emotional_patterns: Json | null
          id: string
          insight_period_end: string
          insight_period_start: string
          profile_id: string
          recurring_scriptures: string[] | null
          spiritual_themes: Json | null
          suggested_message: string | null
          suggested_next_plan: string | null
          suggested_next_theme: string | null
          weekly_summary: string | null
        }
        Insert: {
          areas_improving?: string[] | null
          areas_needing_prayer?: string[] | null
          created_at?: string | null
          emotional_patterns?: Json | null
          id?: string
          insight_period_end: string
          insight_period_start: string
          profile_id: string
          recurring_scriptures?: string[] | null
          spiritual_themes?: Json | null
          suggested_message?: string | null
          suggested_next_plan?: string | null
          suggested_next_theme?: string | null
          weekly_summary?: string | null
        }
        Update: {
          areas_improving?: string[] | null
          areas_needing_prayer?: string[] | null
          created_at?: string | null
          emotional_patterns?: Json | null
          id?: string
          insight_period_end?: string
          insight_period_start?: string
          profile_id?: string
          recurring_scriptures?: string[] | null
          spiritual_themes?: Json | null
          suggested_message?: string | null
          suggested_next_plan?: string | null
          suggested_next_theme?: string | null
          weekly_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devotional_profile_insights_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "devotional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_profile_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          note_type: string
          profile_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          note_type?: string
          profile_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          note_type?: string
          profile_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "devotional_profile_notes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "devotional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_profile_schedules: {
        Row: {
          created_at: string | null
          custom_message: string | null
          day_id: string | null
          id: string
          is_recurring: boolean | null
          is_sent: boolean | null
          profile_id: string
          recurrence_pattern: string | null
          schedule_type: string
          scheduled_for: string
          sent_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_message?: string | null
          day_id?: string | null
          id?: string
          is_recurring?: boolean | null
          is_sent?: boolean | null
          profile_id: string
          recurrence_pattern?: string | null
          schedule_type?: string
          scheduled_for: string
          sent_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_message?: string | null
          day_id?: string | null
          id?: string
          is_recurring?: boolean | null
          is_sent?: boolean | null
          profile_id?: string
          recurrence_pattern?: string | null
          schedule_type?: string
          scheduled_for?: string
          sent_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "devotional_profile_schedules_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "devotional_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devotional_profile_schedules_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "devotional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_profiles: {
        Row: {
          active_plan_id: string | null
          age_group: string | null
          avatar_emoji: string | null
          created_at: string | null
          current_situation: string | null
          id: string
          invite_accepted_at: string | null
          invite_sent_at: string | null
          invite_token: string | null
          is_active: boolean | null
          issue_description: string | null
          issue_description_encrypted: string | null
          issue_severity: string | null
          last_devotional_sent_at: string | null
          linked_user_id: string | null
          name: string
          pastoral_notes: Json | null
          pastoral_notes_encrypted: string | null
          phone_country_code: string | null
          phone_number: string | null
          preferred_rooms: string[] | null
          preferred_themes: string[] | null
          preferred_tone: string | null
          primary_issue: string | null
          relationship: string
          sms_opt_in: boolean | null
          spiritual_goals: string[] | null
          struggles: string[] | null
          total_devotionals_sent: number | null
          updated_at: string | null
          user_id: string
          warning_flags: string[] | null
        }
        Insert: {
          active_plan_id?: string | null
          age_group?: string | null
          avatar_emoji?: string | null
          created_at?: string | null
          current_situation?: string | null
          id?: string
          invite_accepted_at?: string | null
          invite_sent_at?: string | null
          invite_token?: string | null
          is_active?: boolean | null
          issue_description?: string | null
          issue_description_encrypted?: string | null
          issue_severity?: string | null
          last_devotional_sent_at?: string | null
          linked_user_id?: string | null
          name: string
          pastoral_notes?: Json | null
          pastoral_notes_encrypted?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          preferred_rooms?: string[] | null
          preferred_themes?: string[] | null
          preferred_tone?: string | null
          primary_issue?: string | null
          relationship: string
          sms_opt_in?: boolean | null
          spiritual_goals?: string[] | null
          struggles?: string[] | null
          total_devotionals_sent?: number | null
          updated_at?: string | null
          user_id: string
          warning_flags?: string[] | null
        }
        Update: {
          active_plan_id?: string | null
          age_group?: string | null
          avatar_emoji?: string | null
          created_at?: string | null
          current_situation?: string | null
          id?: string
          invite_accepted_at?: string | null
          invite_sent_at?: string | null
          invite_token?: string | null
          is_active?: boolean | null
          issue_description?: string | null
          issue_description_encrypted?: string | null
          issue_severity?: string | null
          last_devotional_sent_at?: string | null
          linked_user_id?: string | null
          name?: string
          pastoral_notes?: Json | null
          pastoral_notes_encrypted?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          preferred_rooms?: string[] | null
          preferred_themes?: string[] | null
          preferred_tone?: string | null
          primary_issue?: string | null
          relationship?: string
          sms_opt_in?: boolean | null
          spiritual_goals?: string[] | null
          struggles?: string[] | null
          total_devotionals_sent?: number | null
          updated_at?: string | null
          user_id?: string
          warning_flags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "devotional_profiles_active_plan_id_fkey"
            columns: ["active_plan_id"]
            isOneToOne: false
            referencedRelation: "devotional_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_progress: {
        Row: {
          completed_at: string | null
          day_id: string
          id: string
          journal_entry: string | null
          plan_id: string
          rating: number | null
          reflection_notes: string | null
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          day_id: string
          id?: string
          journal_entry?: string | null
          plan_id: string
          rating?: number | null
          reflection_notes?: string | null
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          day_id?: string
          id?: string
          journal_entry?: string | null
          plan_id?: string
          rating?: number | null
          reflection_notes?: string | null
          time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "devotional_progress_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "devotional_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devotional_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "devotional_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_text_highlights: {
        Row: {
          color: string
          created_at: string
          devotional_day_id: string | null
          end_offset: number
          id: string
          section_key: string | null
          start_offset: number
          text_content: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          devotional_day_id?: string | null
          end_offset: number
          id?: string
          section_key?: string | null
          start_offset: number
          text_content: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          devotional_day_id?: string | null
          end_offset?: number
          id?: string
          section_key?: string | null
          start_offset?: number
          text_content?: string
          user_id?: string
        }
        Relationships: []
      }
      disciple_training_enrollments: {
        Row: {
          cohort_id: string | null
          completed_at: string | null
          created_at: string | null
          current_week: number | null
          id: string
          program_id: string | null
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          cohort_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_week?: number | null
          id?: string
          program_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          cohort_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_week?: number | null
          id?: string
          program_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disciple_training_enrollments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "discipleship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disciple_training_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "discipleship_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      disciple_training_weeks: {
        Row: {
          church_id: string | null
          created_at: string | null
          discussion_questions: Json | null
          facilitator_notes: string | null
          goal: string | null
          id: string
          is_template: boolean | null
          key_truth: string | null
          life_application: string | null
          practices: string[] | null
          prayer_focus: string | null
          program_id: string | null
          pt_rooms: string[] | null
          sanctuary_focus: string | null
          scripture_focus: string[] | null
          theme: string | null
          title: string
          updated_at: string | null
          week_number: number
        }
        Insert: {
          church_id?: string | null
          created_at?: string | null
          discussion_questions?: Json | null
          facilitator_notes?: string | null
          goal?: string | null
          id?: string
          is_template?: boolean | null
          key_truth?: string | null
          life_application?: string | null
          practices?: string[] | null
          prayer_focus?: string | null
          program_id?: string | null
          pt_rooms?: string[] | null
          sanctuary_focus?: string | null
          scripture_focus?: string[] | null
          theme?: string | null
          title: string
          updated_at?: string | null
          week_number: number
        }
        Update: {
          church_id?: string | null
          created_at?: string | null
          discussion_questions?: Json | null
          facilitator_notes?: string | null
          goal?: string | null
          id?: string
          is_template?: boolean | null
          key_truth?: string | null
          life_application?: string | null
          practices?: string[] | null
          prayer_focus?: string | null
          program_id?: string | null
          pt_rooms?: string[] | null
          sanctuary_focus?: string | null
          scripture_focus?: string[] | null
          theme?: string | null
          title?: string
          updated_at?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "disciple_training_weeks_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disciple_training_weeks_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disciple_training_weeks_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "discipleship_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      discipleship_cohorts: {
        Row: {
          church_id: string | null
          co_leader_id: string | null
          created_at: string
          current_week: number | null
          description: string | null
          id: string
          is_online: boolean | null
          leader_id: string | null
          max_members: number | null
          meeting_day: string | null
          meeting_link: string | null
          meeting_location: string | null
          meeting_time: string | null
          name: string
          program_id: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          church_id?: string | null
          co_leader_id?: string | null
          created_at?: string
          current_week?: number | null
          description?: string | null
          id?: string
          is_online?: boolean | null
          leader_id?: string | null
          max_members?: number | null
          meeting_day?: string | null
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name: string
          program_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          church_id?: string | null
          co_leader_id?: string | null
          created_at?: string
          current_week?: number | null
          description?: string | null
          id?: string
          is_online?: boolean | null
          leader_id?: string | null
          max_members?: number | null
          meeting_day?: string | null
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name?: string
          program_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discipleship_cohorts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipleship_cohorts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipleship_cohorts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "discipleship_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      discipleship_packages: {
        Row: {
          church_id: string | null
          completion_benefits: string[] | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          package_type: string
          title: string
          updated_at: string | null
          week_content: Json
        }
        Insert: {
          church_id?: string | null
          completion_benefits?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          package_type?: string
          title: string
          updated_at?: string | null
          week_content?: Json
        }
        Update: {
          church_id?: string | null
          completion_benefits?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          package_type?: string
          title?: string
          updated_at?: string | null
          week_content?: Json
        }
        Relationships: [
          {
            foreignKeyName: "discipleship_packages_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipleship_packages_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      discipleship_programs: {
        Row: {
          church_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          ellen_white_emphasis: string[] | null
          id: string
          key_truth: string | null
          phototheology_emphasis: string[] | null
          practices: string[] | null
          program_type: string
          sanctuary_focus: string | null
          scripture_focus: string[] | null
          status: string
          theme: string | null
          title: string
          updated_at: string
          week_number: number | null
        }
        Insert: {
          church_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ellen_white_emphasis?: string[] | null
          id?: string
          key_truth?: string | null
          phototheology_emphasis?: string[] | null
          practices?: string[] | null
          program_type?: string
          sanctuary_focus?: string | null
          scripture_focus?: string[] | null
          status?: string
          theme?: string | null
          title: string
          updated_at?: string
          week_number?: number | null
        }
        Update: {
          church_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ellen_white_emphasis?: string[] | null
          id?: string
          key_truth?: string | null
          phototheology_emphasis?: string[] | null
          practices?: string[] | null
          program_type?: string
          sanctuary_focus?: string | null
          scripture_focus?: string[] | null
          status?: string
          theme?: string | null
          title?: string
          updated_at?: string
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discipleship_programs_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipleship_programs_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
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
      drill_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number | null
          drill_data: Json | null
          id: string
          is_abandoned: boolean | null
          last_room: string | null
          mode: string
          name: string | null
          resume_data: Json | null
          total_steps: number | null
          updated_at: string
          user_id: string
          verse_reference: string
          verse_text: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          drill_data?: Json | null
          id?: string
          is_abandoned?: boolean | null
          last_room?: string | null
          mode: string
          name?: string | null
          resume_data?: Json | null
          total_steps?: number | null
          updated_at?: string
          user_id: string
          verse_reference: string
          verse_text?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          drill_data?: Json | null
          id?: string
          is_abandoned?: boolean | null
          last_room?: string | null
          mode?: string
          name?: string | null
          resume_data?: Json | null
          total_steps?: number | null
          updated_at?: string
          user_id?: string
          verse_reference?: string
          verse_text?: string | null
        }
        Relationships: []
      }
      early_landings: {
        Row: {
          converted: boolean | null
          converted_at: string | null
          created_at: string
          id: string
          is_mobile: boolean | null
          landing_page: string
          referrer: string | null
          screen_width: number | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          converted?: boolean | null
          converted_at?: string | null
          created_at?: string
          id?: string
          is_mobile?: boolean | null
          landing_page: string
          referrer?: string | null
          screen_width?: number | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          converted?: boolean | null
          converted_at?: string | null
          created_at?: string
          id?: string
          is_mobile?: boolean | null
          landing_page?: string
          referrer?: string | null
          screen_width?: number | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      egw_chapter_cache: {
        Row: {
          book_id: string
          chapter_number: number
          chapter_title: string
          created_at: string
          id: string
          paragraphs: Json
          updated_at: string
        }
        Insert: {
          book_id: string
          chapter_number: number
          chapter_title: string
          created_at?: string
          id?: string
          paragraphs?: Json
          updated_at?: string
        }
        Update: {
          book_id?: string
          chapter_number?: number
          chapter_title?: string
          created_at?: string
          id?: string
          paragraphs?: Json
          updated_at?: string
        }
        Relationships: []
      }
      email_campaign_logs: {
        Row: {
          campaign_name: string
          created_at: string
          email_type: string
          error_message: string | null
          id: string
          open_count: number | null
          opened_at: string | null
          recipient_email: string
          recipient_name: string | null
          resend_email_id: string | null
          sent_at: string | null
          status: string | null
        }
        Insert: {
          campaign_name: string
          created_at?: string
          email_type: string
          error_message?: string | null
          id?: string
          open_count?: number | null
          opened_at?: string | null
          recipient_email: string
          recipient_name?: string | null
          resend_email_id?: string | null
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          campaign_name?: string
          created_at?: string
          email_type?: string
          error_message?: string | null
          id?: string
          open_count?: number | null
          opened_at?: string | null
          recipient_email?: string
          recipient_name?: string | null
          resend_email_id?: string | null
          sent_at?: string | null
          status?: string | null
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
          campaign_type: string | null
          created_at: string | null
          day_number: number | null
          email_address: string
          error_message: string | null
          id: string
          opened_at: string | null
          sent_at: string | null
          status: string
          subject: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          campaign_type?: string | null
          created_at?: string | null
          day_number?: number | null
          email_address: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          status: string
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          campaign_type?: string | null
          created_at?: string | null
          day_number?: number | null
          email_address?: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
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
      email_send_log: {
        Row: {
          day_number: number
          email_subject: string
          error_message: string | null
          id: string
          metadata: Json | null
          sent_at: string
          sequence_type: string
          status: string
          user_id: string
        }
        Insert: {
          day_number: number
          email_subject: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string
          sequence_type: string
          status?: string
          user_id: string
        }
        Update: {
          day_number?: number
          email_subject?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string
          sequence_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      email_sequence_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          current_day: number
          id: string
          is_active: boolean
          is_completed: boolean
          last_email_sent_at: string | null
          metadata: Json | null
          next_email_due_at: string | null
          sequence_type: string
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_day?: number
          id?: string
          is_active?: boolean
          is_completed?: boolean
          last_email_sent_at?: string | null
          metadata?: Json | null
          next_email_due_at?: string | null
          sequence_type?: string
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_day?: number
          id?: string
          is_active?: boolean
          is_completed?: boolean
          last_email_sent_at?: string | null
          metadata?: Json | null
          next_email_due_at?: string | null
          sequence_type?: string
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      epic_commentaries: {
        Row: {
          audio_duration_ms: number | null
          audio_file_size_bytes: number | null
          audio_storage_path: string | null
          book: string
          chapter: number
          commentary_mode: string
          commentary_text: string
          created_at: string
          error_message: string | null
          id: string
          status: string
          updated_at: string
          version: number
          voice_id: string
        }
        Insert: {
          audio_duration_ms?: number | null
          audio_file_size_bytes?: number | null
          audio_storage_path?: string | null
          book: string
          chapter: number
          commentary_mode?: string
          commentary_text: string
          created_at?: string
          error_message?: string | null
          id?: string
          status?: string
          updated_at?: string
          version?: number
          voice_id?: string
        }
        Update: {
          audio_duration_ms?: number | null
          audio_file_size_bytes?: number | null
          audio_storage_path?: string | null
          book?: string
          chapter?: number
          commentary_mode?: string
          commentary_text?: string
          created_at?: string
          error_message?: string | null
          id?: string
          status?: string
          updated_at?: string
          version?: number
          voice_id?: string
        }
        Relationships: []
      }
      epic_playlist_items: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          playlist_id: string
          position: number
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          playlist_id: string
          position?: number
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          playlist_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "epic_playlist_items_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "epic_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      epic_playlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          music_track_id: string | null
          music_volume: number | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          music_track_id?: string | null
          music_volume?: number | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          music_track_id?: string | null
          music_volume?: number | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      equation_battle_games: {
        Row: {
          combined_result: string | null
          combined_score: number | null
          completed_at: string | null
          created_at: string
          difficulty: string
          equation: string
          explanation: string
          game_mode: string
          host_id: string
          id: string
          max_players: number
          room_code: string
          started_at: string | null
          status: string
          symbols: string[]
          time_limit_seconds: number | null
          updated_at: string
          verse: string
        }
        Insert: {
          combined_result?: string | null
          combined_score?: number | null
          completed_at?: string | null
          created_at?: string
          difficulty?: string
          equation: string
          explanation?: string
          game_mode?: string
          host_id: string
          id?: string
          max_players?: number
          room_code?: string
          started_at?: string | null
          status?: string
          symbols?: string[]
          time_limit_seconds?: number | null
          updated_at?: string
          verse: string
        }
        Update: {
          combined_result?: string | null
          combined_score?: number | null
          completed_at?: string | null
          created_at?: string
          difficulty?: string
          equation?: string
          explanation?: string
          game_mode?: string
          host_id?: string
          id?: string
          max_players?: number
          room_code?: string
          started_at?: string | null
          status?: string
          symbols?: string[]
          time_limit_seconds?: number | null
          updated_at?: string
          verse?: string
        }
        Relationships: []
      }
      equation_battle_players: {
        Row: {
          answer: string | null
          assigned_portion: string | null
          assigned_symbols: string[]
          display_name: string
          feedback: string | null
          game_id: string
          id: string
          is_done: boolean
          joined_at: string
          score: number | null
          submitted_at: string | null
          team_name: string | null
          user_id: string
        }
        Insert: {
          answer?: string | null
          assigned_portion?: string | null
          assigned_symbols?: string[]
          display_name?: string
          feedback?: string | null
          game_id: string
          id?: string
          is_done?: boolean
          joined_at?: string
          score?: number | null
          submitted_at?: string | null
          team_name?: string | null
          user_id: string
        }
        Update: {
          answer?: string | null
          assigned_portion?: string | null
          assigned_symbols?: string[]
          display_name?: string
          feedback?: string | null
          game_id?: string
          id?: string
          is_done?: boolean
          joined_at?: string
          score?: number | null
          submitted_at?: string | null
          team_name?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equation_battle_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "equation_battle_games"
            referencedColumns: ["id"]
          },
        ]
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
      evangelism_campaigns: {
        Row: {
          campaign_type: string
          church_id: string
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          is_online: boolean | null
          location: string | null
          meeting_link: string | null
          series_content: Json | null
          start_date: string | null
          status: string
          target_audience: string | null
          title: string
          updated_at: string
        }
        Insert: {
          campaign_type: string
          church_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_link?: string | null
          series_content?: Json | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          campaign_type?: string
          church_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_link?: string | null
          series_content?: Json | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evangelism_campaigns_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evangelism_campaigns_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      evangelism_interests: {
        Row: {
          address: string | null
          assigned_bible_worker: string | null
          baptism_date: string | null
          baptism_interest: boolean | null
          campaign_id: string | null
          church_id: string
          created_at: string
          email: string | null
          first_contact: string | null
          id: string
          interest_level: string | null
          last_contact: string | null
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string | null
          total_studies: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          assigned_bible_worker?: string | null
          baptism_date?: string | null
          baptism_interest?: boolean | null
          campaign_id?: string | null
          church_id: string
          created_at?: string
          email?: string | null
          first_contact?: string | null
          id?: string
          interest_level?: string | null
          last_contact?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          total_studies?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          assigned_bible_worker?: string | null
          baptism_date?: string | null
          baptism_interest?: boolean | null
          campaign_id?: string | null
          church_id?: string
          created_at?: string
          email?: string | null
          first_contact?: string | null
          id?: string
          interest_level?: string | null
          last_contact?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          total_studies?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evangelism_interests_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "evangelism_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evangelism_interests_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evangelism_interests_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      experiment_assignments: {
        Row: {
          assigned_at: string | null
          converted_at: string | null
          experiment_id: string | null
          id: string
          user_id: string | null
          variant: string
        }
        Insert: {
          assigned_at?: string | null
          converted_at?: string | null
          experiment_id?: string | null
          id?: string
          user_id?: string | null
          variant: string
        }
        Update: {
          assigned_at?: string | null
          converted_at?: string | null
          experiment_id?: string | null
          id?: string
          user_id?: string | null
          variant?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiment_assignments_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      experiments: {
        Row: {
          created_at: string | null
          description: string | null
          ended_at: string | null
          id: string
          is_active: boolean | null
          name: string
          traffic_percentage: number | null
          variants: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          traffic_percentage?: number | null
          variants?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          traffic_percentage?: number | null
          variants?: Json
        }
        Relationships: []
      }
      feature_tags: {
        Row: {
          created_at: string
          feature_label: string
          feature_path: string
          id: string
          is_read: boolean | null
          message: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          feature_label: string
          feature_path: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          feature_label?: string
          feature_path?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      feed_reposts: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          original_entry_id: string
          original_type: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          original_entry_id: string
          original_type: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          original_entry_id?: string
          original_type?: string
          user_id?: string
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
      game_night_follow_ups: {
        Row: {
          created_at: string
          follow_up_type: string
          guest_id: string
          id: string
          scheduled_for: string
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          follow_up_type: string
          guest_id: string
          id?: string
          scheduled_for: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          follow_up_type?: string
          guest_id?: string
          id?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_night_follow_ups_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "game_night_guests"
            referencedColumns: ["id"]
          },
        ]
      }
      game_night_guests: {
        Row: {
          converted_at: string | null
          converted_to_user: boolean
          converted_user_id: string | null
          first_played_at: string
          games_played: string[]
          guest_email: string
          guest_name: string | null
          id: string
          invite_id: string
          last_active_at: string
          session_token: string
          total_play_time_minutes: number
        }
        Insert: {
          converted_at?: string | null
          converted_to_user?: boolean
          converted_user_id?: string | null
          first_played_at?: string
          games_played?: string[]
          guest_email: string
          guest_name?: string | null
          id?: string
          invite_id: string
          last_active_at?: string
          session_token: string
          total_play_time_minutes?: number
        }
        Update: {
          converted_at?: string | null
          converted_to_user?: boolean
          converted_user_id?: string | null
          first_played_at?: string
          games_played?: string[]
          guest_email?: string
          guest_name?: string | null
          id?: string
          invite_id?: string
          last_active_at?: string
          session_token?: string
          total_play_time_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_night_guests_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "game_night_invites"
            referencedColumns: ["id"]
          },
        ]
      }
      game_night_invites: {
        Row: {
          allowed_games: string[]
          created_at: string
          expires_at: string | null
          guest_email: string | null
          guest_name: string | null
          host_user_id: string
          id: string
          invite_code: string
          is_active: boolean
          max_uses: number
          times_used: number
        }
        Insert: {
          allowed_games?: string[]
          created_at?: string
          expires_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          host_user_id: string
          id?: string
          invite_code: string
          is_active?: boolean
          max_uses?: number
          times_used?: number
        }
        Update: {
          allowed_games?: string[]
          created_at?: string
          expires_at?: string | null
          guest_email?: string | null
          guest_name?: string | null
          host_user_id?: string
          id?: string
          invite_code?: string
          is_active?: boolean
          max_uses?: number
          times_used?: number
        }
        Relationships: []
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
      game_room_players: {
        Row: {
          display_name: string
          id: string
          is_active: boolean
          joined_at: string
          player_data: Json
          player_index: number
          room_id: string
          score: number
          user_id: string
        }
        Insert: {
          display_name: string
          id?: string
          is_active?: boolean
          joined_at?: string
          player_data?: Json
          player_index?: number
          room_id: string
          score?: number
          user_id: string
        }
        Update: {
          display_name?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          player_data?: Json
          player_index?: number
          room_id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_room_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          created_at: string
          current_turn_user_id: string | null
          game_state: Json
          game_type: string
          host_id: string
          id: string
          max_players: number
          room_code: string
          settings: Json
          status: string
          updated_at: string
          winner_user_id: string | null
        }
        Insert: {
          created_at?: string
          current_turn_user_id?: string | null
          game_state?: Json
          game_type: string
          host_id: string
          id?: string
          max_players?: number
          room_code: string
          settings?: Json
          status?: string
          updated_at?: string
          winner_user_id?: string | null
        }
        Update: {
          created_at?: string
          current_turn_user_id?: string | null
          game_state?: Json
          game_type?: string
          host_id?: string
          id?: string
          max_players?: number
          room_code?: string
          settings?: Json
          status?: string
          updated_at?: string
          winner_user_id?: string | null
        }
        Relationships: []
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
          {
            foreignKeyName: "fk_game_scores_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      game_session_messages: {
        Row: {
          created_at: string
          display_name: string
          id: string
          message: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id?: string
          message: string
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          message?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_session_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          completed_at: string | null
          current_step: number | null
          game_state: Json
          game_type: string
          id: string
          is_abandoned: boolean | null
          is_completed: boolean | null
          score: number | null
          started_at: string
          total_steps: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_step?: number | null
          game_state?: Json
          game_type: string
          id?: string
          is_abandoned?: boolean | null
          is_completed?: boolean | null
          score?: number | null
          started_at?: string
          total_steps?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_step?: number | null
          game_state?: Json
          game_type?: string
          id?: string
          is_abandoned?: boolean | null
          is_completed?: boolean | null
          score?: number | null
          started_at?: string
          total_steps?: number | null
          updated_at?: string
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
      gems: {
        Row: {
          connection_explanation: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          principle_codes: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          verse1: string
          verse2: string
          verse3: string
        }
        Insert: {
          connection_explanation: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          principle_codes?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          verse1: string
          verse2: string
          verse3: string
        }
        Update: {
          connection_explanation?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          principle_codes?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          verse1?: string
          verse2?: string
          verse3?: string
        }
        Relationships: []
      }
      generated_gems: {
        Row: {
          content: string
          content_hash: string
          created_at: string
          generated_for_user_id: string | null
          id: string
          title: string | null
        }
        Insert: {
          content: string
          content_hash: string
          created_at?: string
          generated_for_user_id?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          content?: string
          content_hash?: string
          created_at?: string
          generated_for_user_id?: string | null
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      generated_study_paths: {
        Row: {
          category: string
          created_at: string
          description: string
          estimated_sessions: number
          generation_date: string
          icon: string
          id: string
          is_active: boolean
          steps: Json
          theme_keyword: string
          theme_type: string
          title: string
          view_count: number
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          estimated_sessions?: number
          generation_date?: string
          icon?: string
          id?: string
          is_active?: boolean
          steps?: Json
          theme_keyword: string
          theme_type: string
          title: string
          view_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          estimated_sessions?: number
          generation_date?: string
          icon?: string
          id?: string
          is_active?: boolean
          steps?: Json
          theme_keyword?: string
          theme_type?: string
          title?: string
          view_count?: number
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
      gift_purchases: {
        Row: {
          amount_cents: number
          created_at: string
          expires_at: string
          gift_token: string
          gifter_email: string
          gifter_user_id: string
          id: string
          personal_message: string | null
          plan_type: string
          recipient_email: string
          redeemed_at: string | null
          redeemed_by: string | null
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          expires_at?: string
          gift_token?: string
          gifter_email: string
          gifter_user_id: string
          id?: string
          personal_message?: string | null
          plan_type: string
          recipient_email: string
          redeemed_at?: string | null
          redeemed_by?: string | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          expires_at?: string
          gift_token?: string
          gifter_email?: string
          gifter_user_id?: string
          id?: string
          personal_message?: string | null
          plan_type?: string
          recipient_email?: string
          redeemed_at?: string | null
          redeemed_by?: string | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
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
      group_study_sessions: {
        Row: {
          content_reference: string | null
          content_text: string | null
          content_type: string
          created_at: string
          current_phase: string
          ended_at: string | null
          host_id: string
          id: string
          phase_ends_at: string | null
          room_code: string
          scheduled_study_id: string | null
          started_at: string
          status: string
          total_insights: number
          total_votes: number
        }
        Insert: {
          content_reference?: string | null
          content_text?: string | null
          content_type?: string
          created_at?: string
          current_phase?: string
          ended_at?: string | null
          host_id: string
          id?: string
          phase_ends_at?: string | null
          room_code: string
          scheduled_study_id?: string | null
          started_at?: string
          status?: string
          total_insights?: number
          total_votes?: number
        }
        Update: {
          content_reference?: string | null
          content_text?: string | null
          content_type?: string
          created_at?: string
          current_phase?: string
          ended_at?: string | null
          host_id?: string
          id?: string
          phase_ends_at?: string | null
          room_code?: string
          scheduled_study_id?: string | null
          started_at?: string
          status?: string
          total_insights?: number
          total_votes?: number
        }
        Relationships: []
      }
      guesthouse_events: {
        Row: {
          access_code: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          game_config: Json | null
          game_type: string | null
          host_user_id: string | null
          id: string
          max_guests: number
          requires_access_code: boolean
          scheduled_at: string
          session_type: string
          social_share_image_url: string | null
          social_share_text: string | null
          status: string
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          game_config?: Json | null
          game_type?: string | null
          host_user_id?: string | null
          id?: string
          max_guests?: number
          requires_access_code?: boolean
          scheduled_at: string
          session_type?: string
          social_share_image_url?: string | null
          social_share_text?: string | null
          status?: string
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          access_code?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          game_config?: Json | null
          game_type?: string | null
          host_user_id?: string | null
          id?: string
          max_guests?: number
          requires_access_code?: boolean
          scheduled_at?: string
          session_type?: string
          social_share_image_url?: string | null
          social_share_text?: string | null
          status?: string
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      guesthouse_game_library: {
        Row: {
          content: Json
          created_at: string
          difficulty: string
          game_type: string
          id: string
          last_used_at: string | null
          scripture_reference: string | null
          theme: string | null
          title: string
          used_count: number
        }
        Insert: {
          content?: Json
          created_at?: string
          difficulty?: string
          game_type: string
          id?: string
          last_used_at?: string | null
          scripture_reference?: string | null
          theme?: string | null
          title: string
          used_count?: number
        }
        Update: {
          content?: Json
          created_at?: string
          difficulty?: string
          game_type?: string
          id?: string
          last_used_at?: string | null
          scripture_reference?: string | null
          theme?: string | null
          title?: string
          used_count?: number
        }
        Relationships: []
      }
      guesthouse_group_results: {
        Row: {
          completion_time_seconds: number | null
          created_at: string
          discoveries: Json
          event_id: string
          group_name: string
          id: string
          total_score: number | null
        }
        Insert: {
          completion_time_seconds?: number | null
          created_at?: string
          discoveries?: Json
          event_id: string
          group_name: string
          id?: string
          total_score?: number | null
        }
        Update: {
          completion_time_seconds?: number | null
          created_at?: string
          discoveries?: Json
          event_id?: string
          group_name?: string
          id?: string
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "guesthouse_group_results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_events"
            referencedColumns: ["id"]
          },
        ]
      }
      guesthouse_guests: {
        Row: {
          checked_in_at: string | null
          correct_answers: number | null
          created_at: string
          display_name: string
          email: string | null
          event_id: string
          group_color: string | null
          group_name: string | null
          id: string
          is_checked_in: boolean
          rounds_played: number | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          correct_answers?: number | null
          created_at?: string
          display_name: string
          email?: string | null
          event_id: string
          group_color?: string | null
          group_name?: string | null
          id?: string
          is_checked_in?: boolean
          rounds_played?: number | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          correct_answers?: number | null
          created_at?: string
          display_name?: string
          email?: string | null
          event_id?: string
          group_color?: string | null
          group_name?: string | null
          id?: string
          is_checked_in?: boolean
          rounds_played?: number | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guesthouse_guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_events"
            referencedColumns: ["id"]
          },
        ]
      }
      guesthouse_prompt_responses: {
        Row: {
          created_at: string
          guest_id: string
          id: string
          prompt_id: string
          response_data: Json
          response_type: string
        }
        Insert: {
          created_at?: string
          guest_id: string
          id?: string
          prompt_id: string
          response_data?: Json
          response_type: string
        }
        Update: {
          created_at?: string
          guest_id?: string
          id?: string
          prompt_id?: string
          response_data?: Json
          response_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "guesthouse_prompt_responses_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guesthouse_prompt_responses_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_session_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      guesthouse_reactions: {
        Row: {
          created_at: string
          emoji: string
          event_id: string
          guest_id: string
          id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          event_id: string
          guest_id: string
          id?: string
        }
        Update: {
          created_at?: string
          emoji?: string
          event_id?: string
          guest_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guesthouse_reactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guesthouse_reactions_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_guests"
            referencedColumns: ["id"]
          },
        ]
      }
      guesthouse_responses: {
        Row: {
          created_at: string
          graded_at: string | null
          guest_id: string
          id: string
          is_correct: boolean | null
          points_earned: number | null
          prompt_id: string
          response_data: Json
        }
        Insert: {
          created_at?: string
          graded_at?: string | null
          guest_id: string
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          prompt_id: string
          response_data?: Json
        }
        Update: {
          created_at?: string
          graded_at?: string | null
          guest_id?: string
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          prompt_id?: string
          response_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "guesthouse_responses_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guesthouse_responses_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_session_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      guesthouse_session_prompts: {
        Row: {
          created_at: string
          ended_at: string | null
          event_id: string
          id: string
          is_active: boolean
          prompt_data: Json
          prompt_type: string
          sequence_order: number
          started_at: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          event_id: string
          id?: string
          is_active?: boolean
          prompt_data?: Json
          prompt_type: string
          sequence_order: number
          started_at?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          event_id?: string
          id?: string
          is_active?: boolean
          prompt_data?: Json
          prompt_type?: string
          sequence_order?: number
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guesthouse_session_prompts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "guesthouse_events"
            referencedColumns: ["id"]
          },
        ]
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
      hallucination_audit_logs: {
        Row: {
          id: string
          run_at: string
          status: string
          summary: string | null
          total_scanned: number
          violations: Json
          violations_found: number
        }
        Insert: {
          id?: string
          run_at?: string
          status?: string
          summary?: string | null
          total_scanned?: number
          violations?: Json
          violations_found?: number
        }
        Update: {
          id?: string
          run_at?: string
          status?: string
          summary?: string | null
          total_scanned?: number
          violations?: Json
          violations_found?: number
        }
        Relationships: []
      }
      image_bible_cache: {
        Row: {
          book: string
          chapter: number
          generated_at: string | null
          id: string
          prompt_used: string | null
          public_url: string
          storage_path: string
          theme: string
        }
        Insert: {
          book: string
          chapter: number
          generated_at?: string | null
          id?: string
          prompt_used?: string | null
          public_url: string
          storage_path: string
          theme: string
        }
        Update: {
          book?: string
          chapter?: number
          generated_at?: string | null
          id?: string
          prompt_used?: string | null
          public_url?: string
          storage_path?: string
          theme?: string
        }
        Relationships: []
      }
      insight_votes: {
        Row: {
          created_at: string
          id: string
          insight_id: string
          user_id: string
          vote: number
        }
        Insert: {
          created_at?: string
          id?: string
          insight_id: string
          user_id: string
          vote?: number
        }
        Update: {
          created_at?: string
          id?: string
          insight_id?: string
          user_id?: string
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "insight_votes_insight_id_fkey"
            columns: ["insight_id"]
            isOneToOne: false
            referencedRelation: "study_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_study_sessions: {
        Row: {
          bible_worker_id: string
          created_at: string
          decision_made: string | null
          duration_minutes: number | null
          id: string
          interest_id: string
          next_session_date: string | null
          notes: string | null
          scripture_covered: string[] | null
          session_date: string
          topic: string | null
        }
        Insert: {
          bible_worker_id: string
          created_at?: string
          decision_made?: string | null
          duration_minutes?: number | null
          id?: string
          interest_id: string
          next_session_date?: string | null
          notes?: string | null
          scripture_covered?: string[] | null
          session_date: string
          topic?: string | null
        }
        Update: {
          bible_worker_id?: string
          created_at?: string
          decision_made?: string | null
          duration_minutes?: number | null
          id?: string
          interest_id?: string
          next_session_date?: string | null
          notes?: string | null
          scripture_covered?: string[] | null
          session_date?: string
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interest_study_sessions_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "evangelism_interests"
            referencedColumns: ["id"]
          },
        ]
      }
      jeeves_feedback: {
        Row: {
          context_type: string
          created_at: string
          id: string
          jeeves_response: string | null
          original_context: Json | null
          user_id: string | null
          user_question: string | null
          was_helpful: boolean
        }
        Insert: {
          context_type: string
          created_at?: string
          id?: string
          jeeves_response?: string | null
          original_context?: Json | null
          user_id?: string | null
          user_question?: string | null
          was_helpful: boolean
        }
        Update: {
          context_type?: string
          created_at?: string
          id?: string
          jeeves_response?: string | null
          original_context?: Json | null
          user_id?: string | null
          user_question?: string | null
          was_helpful?: boolean
        }
        Relationships: []
      }
      jeeves_interactions: {
        Row: {
          created_at: string
          feature_used: string
          id: string
          page_context: string | null
          question: string
          response_preview: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feature_used: string
          id?: string
          page_context?: string | null
          question: string
          response_preview?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feature_used?: string
          id?: string
          page_context?: string | null
          question?: string
          response_preview?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      jeeves_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jeeves_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      leader_certifications: {
        Row: {
          certified_at: string | null
          certified_by: string | null
          church_id: string
          created_at: string
          id: string
          is_certified: boolean
          notes: string | null
          updated_at: string
          user_id: string
          week1_completed_at: string | null
          week2_completed_at: string | null
          week3_completed_at: string | null
          week4_completed_at: string | null
        }
        Insert: {
          certified_at?: string | null
          certified_by?: string | null
          church_id: string
          created_at?: string
          id?: string
          is_certified?: boolean
          notes?: string | null
          updated_at?: string
          user_id: string
          week1_completed_at?: string | null
          week2_completed_at?: string | null
          week3_completed_at?: string | null
          week4_completed_at?: string | null
        }
        Update: {
          certified_at?: string | null
          certified_by?: string | null
          church_id?: string
          created_at?: string
          id?: string
          is_certified?: boolean
          notes?: string | null
          updated_at?: string
          user_id?: string
          week1_completed_at?: string | null
          week2_completed_at?: string | null
          week3_completed_at?: string | null
          week4_completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leader_certifications_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leader_certifications_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      leader_escalations: {
        Row: {
          assigned_to: string | null
          church_id: string
          cohort_id: string | null
          created_at: string
          description: string
          escalation_type: string
          id: string
          member_id: string | null
          priority: string | null
          raised_by: string
          resolution: string | null
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          church_id: string
          cohort_id?: string | null
          created_at?: string
          description: string
          escalation_type: string
          id?: string
          member_id?: string | null
          priority?: string | null
          raised_by: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          church_id?: string
          cohort_id?: string | null
          created_at?: string
          description?: string
          escalation_type?: string
          id?: string
          member_id?: string | null
          priority?: string | null
          raised_by?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leader_escalations_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leader_escalations_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leader_escalations_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "discipleship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      leader_onboarding_progress: {
        Row: {
          church_id: string | null
          completed_at: string | null
          completed_days: number[] | null
          completed_weeks: number[] | null
          created_at: string | null
          current_week: number | null
          id: string
          is_certified: boolean | null
          started_at: string | null
          track_id: string | null
          user_id: string
        }
        Insert: {
          church_id?: string | null
          completed_at?: string | null
          completed_days?: number[] | null
          completed_weeks?: number[] | null
          created_at?: string | null
          current_week?: number | null
          id?: string
          is_certified?: boolean | null
          started_at?: string | null
          track_id?: string | null
          user_id: string
        }
        Update: {
          church_id?: string | null
          completed_at?: string | null
          completed_days?: number[] | null
          completed_weeks?: number[] | null
          created_at?: string | null
          current_week?: number | null
          id?: string
          is_certified?: boolean | null
          started_at?: string | null
          track_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leader_onboarding_progress_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leader_onboarding_progress_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leader_onboarding_progress_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "leader_onboarding_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      leader_onboarding_tracks: {
        Row: {
          church_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
          week_content: Json
        }
        Insert: {
          church_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          week_content?: Json
        }
        Update: {
          church_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          week_content?: Json
        }
        Relationships: [
          {
            foreignKeyName: "leader_onboarding_tracks_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leader_onboarding_tracks_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
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
      live_demo_sessions: {
        Row: {
          created_at: string
          description: string | null
          ended_at: string | null
          host_id: string
          id: string
          scheduled_for: string | null
          started_at: string | null
          status: string
          title: string
          viewer_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          host_id: string
          id?: string
          scheduled_for?: string | null
          started_at?: string | null
          status?: string
          title?: string
          viewer_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          host_id?: string
          id?: string
          scheduled_for?: string | null
          started_at?: string | null
          status?: string
          title?: string
          viewer_count?: number | null
        }
        Relationships: []
      }
      live_demo_viewers: {
        Row: {
          display_name: string | null
          id: string
          joined_at: string
          left_at: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          display_name?: string | null
          id?: string
          joined_at?: string
          left_at?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          display_name?: string | null
          id?: string
          joined_at?: string
          left_at?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_demo_viewers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_demo_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sermon_sessions: {
        Row: {
          church_id: string
          created_at: string
          ended_at: string | null
          id: string
          key_passages: string[] | null
          pastor_id: string
          pt_rooms_focus: string[] | null
          sermon_date: string
          sermon_outline: Json | null
          started_at: string | null
          status: string
          title: string
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          church_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          key_passages?: string[] | null
          pastor_id: string
          pt_rooms_focus?: string[] | null
          sermon_date?: string
          sermon_outline?: Json | null
          started_at?: string | null
          status?: string
          title: string
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          key_passages?: string[] | null
          pastor_id?: string
          pt_rooms_focus?: string[] | null
          sermon_date?: string
          sermon_outline?: Json | null
          started_at?: string | null
          status?: string
          title?: string
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_sermon_sessions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sermon_sessions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      lock_in_missions: {
        Row: {
          completed_at: string | null
          created_at: string
          day_number: number
          id: string
          is_completed: boolean
          mission_description: string
          mission_title: string
          pass_id: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          day_number: number
          id?: string
          is_completed?: boolean
          mission_description: string
          mission_title: string
          pass_id: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          day_number?: number
          id?: string
          is_completed?: boolean
          mission_description?: string
          mission_title?: string
          pass_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lock_in_missions_pass_id_fkey"
            columns: ["pass_id"]
            isOneToOne: false
            referencedRelation: "lock_in_passes"
            referencedColumns: ["id"]
          },
        ]
      }
      lock_in_monthly_usage: {
        Row: {
          created_at: string
          id: string
          month_year: string
          passes_created: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          month_year: string
          passes_created?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          month_year?: string
          passes_created?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lock_in_passes: {
        Row: {
          activated_at: string | null
          commentary_book: string | null
          commentary_chapter: number | null
          commentary_mode: string | null
          conversion_status: string
          converted_at: string | null
          created_at: string
          created_by: string
          expires_at: string | null
          follow_up_sent_at: string | null
          guest_name: string | null
          id: string
          last_active_at: string | null
          pass_token: string
          personal_message: string | null
          recipient_email: string | null
          recipient_user_id: string | null
          status: string
        }
        Insert: {
          activated_at?: string | null
          commentary_book?: string | null
          commentary_chapter?: number | null
          commentary_mode?: string | null
          conversion_status?: string
          converted_at?: string | null
          created_at?: string
          created_by: string
          expires_at?: string | null
          follow_up_sent_at?: string | null
          guest_name?: string | null
          id?: string
          last_active_at?: string | null
          pass_token?: string
          personal_message?: string | null
          recipient_email?: string | null
          recipient_user_id?: string | null
          status?: string
        }
        Update: {
          activated_at?: string | null
          commentary_book?: string | null
          commentary_chapter?: number | null
          commentary_mode?: string | null
          conversion_status?: string
          converted_at?: string | null
          created_at?: string
          created_by?: string
          expires_at?: string | null
          follow_up_sent_at?: string | null
          guest_name?: string | null
          id?: string
          last_active_at?: string | null
          pass_token?: string
          personal_message?: string | null
          recipient_email?: string | null
          recipient_user_id?: string | null
          status?: string
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
      master_exam_attempts: {
        Row: {
          answers_data: Json | null
          attempt_number: number
          category_scores: Json | null
          completed_at: string | null
          created_at: string
          diagnostic_report: Json | null
          error_patterns: Json | null
          exam_type: string
          id: string
          questions_data: Json | null
          results: Json | null
          score: number | null
          started_at: string | null
          status: string
          time_used_seconds: number | null
          total_correct: number | null
          total_questions: number | null
          updated_at: string
          user_id: string
          weekly_plan_id: string | null
        }
        Insert: {
          answers_data?: Json | null
          attempt_number?: number
          category_scores?: Json | null
          completed_at?: string | null
          created_at?: string
          diagnostic_report?: Json | null
          error_patterns?: Json | null
          exam_type?: string
          id?: string
          questions_data?: Json | null
          results?: Json | null
          score?: number | null
          started_at?: string | null
          status?: string
          time_used_seconds?: number | null
          total_correct?: number | null
          total_questions?: number | null
          updated_at?: string
          user_id: string
          weekly_plan_id?: string | null
        }
        Update: {
          answers_data?: Json | null
          attempt_number?: number
          category_scores?: Json | null
          completed_at?: string | null
          created_at?: string
          diagnostic_report?: Json | null
          error_patterns?: Json | null
          exam_type?: string
          id?: string
          questions_data?: Json | null
          results?: Json | null
          score?: number | null
          started_at?: string | null
          status?: string
          time_used_seconds?: number | null
          total_correct?: number | null
          total_questions?: number | null
          updated_at?: string
          user_id?: string
          weekly_plan_id?: string | null
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
      member_pathway_progress: {
        Row: {
          baptism_date: string | null
          church_id: string | null
          current_level: string
          cycles_completed: number | null
          disciple_started_at: string | null
          guest_started_at: string | null
          id: string
          leader_started_at: string | null
          notes: string | null
          people_discipled: number | null
          programs_completed: number | null
          trainer_started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          baptism_date?: string | null
          church_id?: string | null
          current_level?: string
          cycles_completed?: number | null
          disciple_started_at?: string | null
          guest_started_at?: string | null
          id?: string
          leader_started_at?: string | null
          notes?: string | null
          people_discipled?: number | null
          programs_completed?: number | null
          trainer_started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          baptism_date?: string | null
          church_id?: string | null
          current_level?: string
          cycles_completed?: number | null
          disciple_started_at?: string | null
          guest_started_at?: string | null
          id?: string
          leader_started_at?: string | null
          notes?: string | null
          people_discipled?: number | null
          programs_completed?: number | null
          trainer_started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_pathway_progress_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_pathway_progress_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
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
      memory_game_sessions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          game_type: string
          id: string
          list_id: string
          score: number | null
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          game_type: string
          id?: string
          list_id: string
          score?: number | null
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          game_type?: string
          id?: string
          list_id?: string
          score?: number | null
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_game_sessions_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "memory_verse_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_list_collaborators: {
        Row: {
          id: string
          joined_at: string | null
          list_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          list_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          list_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_list_collaborators_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "memory_verse_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_palace_locations: {
        Row: {
          created_at: string
          id: string
          list_id: string
          location_name: string
          order_index: number
          updated_at: string
          user_id: string
          verse_id: string
          verse_reference: string
          verse_text: string | null
          visualization: string
        }
        Insert: {
          created_at?: string
          id?: string
          list_id: string
          location_name: string
          order_index?: number
          updated_at?: string
          user_id: string
          verse_id: string
          verse_reference: string
          verse_text?: string | null
          visualization: string
        }
        Update: {
          created_at?: string
          id?: string
          list_id?: string
          location_name?: string
          order_index?: number
          updated_at?: string
          user_id?: string
          verse_id?: string
          verse_reference?: string
          verse_text?: string | null
          visualization?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_palace_locations_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "memory_verse_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_palace_locations_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "memory_verse_list_items"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_verse_list_items: {
        Row: {
          created_at: string | null
          discovery_unlocked_at: string | null
          hebrew_greek: Json | null
          id: string
          list_id: string
          order_index: number
          pt_discovered: boolean | null
          pt_insights: Json | null
          verse_reference: string
          verse_text: string
        }
        Insert: {
          created_at?: string | null
          discovery_unlocked_at?: string | null
          hebrew_greek?: Json | null
          id?: string
          list_id: string
          order_index: number
          pt_discovered?: boolean | null
          pt_insights?: Json | null
          verse_reference: string
          verse_text: string
        }
        Update: {
          created_at?: string | null
          discovery_unlocked_at?: string | null
          hebrew_greek?: Json | null
          id?: string
          list_id?: string
          order_index?: number
          pt_discovered?: boolean | null
          pt_insights?: Json | null
          verse_reference?: string
          verse_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_verse_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "memory_verse_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_verse_lists: {
        Row: {
          bible_version: string | null
          created_at: string | null
          description: string | null
          id: string
          is_collaborative: boolean | null
          is_public: boolean | null
          is_template: boolean | null
          pt_principles: Json | null
          target_verse_count: number | null
          title: string
          topic: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bible_version?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_collaborative?: boolean | null
          is_public?: boolean | null
          is_template?: boolean | null
          pt_principles?: Json | null
          target_verse_count?: number | null
          title: string
          topic?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bible_version?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_collaborative?: boolean | null
          is_public?: boolean | null
          is_template?: boolean | null
          pt_principles?: Json | null
          target_verse_count?: number | null
          title?: string
          topic?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      memory_verse_mastery: {
        Row: {
          created_at: string | null
          id: string
          last_practiced_at: string | null
          list_id: string
          mastery_level: number | null
          next_review_at: string | null
          times_practiced: number | null
          user_id: string
          verse_reference: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_practiced_at?: string | null
          list_id: string
          mastery_level?: number | null
          next_review_at?: string | null
          times_practiced?: number | null
          user_id: string
          verse_reference: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_practiced_at?: string | null
          list_id?: string
          mastery_level?: number | null
          next_review_at?: string | null
          times_practiced?: number | null
          user_id?: string
          verse_reference?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_verse_mastery_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "memory_verse_lists"
            referencedColumns: ["id"]
          },
        ]
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
      message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
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
      mind_maps: {
        Row: {
          analysis_summary: string | null
          created_at: string
          id: string
          map_data: Json
          mode: string
          name: string
          parent_map_id: string | null
          source_reference: string | null
          source_text: string
          source_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_summary?: string | null
          created_at?: string
          id?: string
          map_data: Json
          mode?: string
          name: string
          parent_map_id?: string | null
          source_reference?: string | null
          source_text: string
          source_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_summary?: string | null
          created_at?: string
          id?: string
          map_data?: Json
          mode?: string
          name?: string
          parent_map_id?: string | null
          source_reference?: string | null
          source_text?: string
          source_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mind_maps_parent_map_id_fkey"
            columns: ["parent_map_id"]
            isOneToOne: false
            referencedRelation: "mind_maps"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_launches: {
        Row: {
          actual_budget: number | null
          church_id: string
          created_at: string
          description: string | null
          id: string
          launch_date: string | null
          leader_id: string | null
          metrics: Json | null
          milestone_progress: Json | null
          name: string
          status: string
          team_members: Json | null
          template_id: string | null
          updated_at: string
        }
        Insert: {
          actual_budget?: number | null
          church_id: string
          created_at?: string
          description?: string | null
          id?: string
          launch_date?: string | null
          leader_id?: string | null
          metrics?: Json | null
          milestone_progress?: Json | null
          name: string
          status?: string
          team_members?: Json | null
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          actual_budget?: number | null
          church_id?: string
          created_at?: string
          description?: string | null
          id?: string
          launch_date?: string | null
          leader_id?: string | null
          metrics?: Json | null
          milestone_progress?: Json | null
          name?: string
          status?: string
          team_members?: Json | null
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministry_launches_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministry_launches_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministry_launches_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "ministry_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_leaders: {
        Row: {
          assigned_by: string | null
          assigned_group_id: string | null
          church_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["ministry_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          assigned_group_id?: string | null
          church_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["ministry_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          assigned_group_id?: string | null
          church_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["ministry_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministry_leaders_assigned_group_id_fkey"
            columns: ["assigned_group_id"]
            isOneToOne: false
            referencedRelation: "small_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministry_leaders_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministry_leaders_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      ministry_templates: {
        Row: {
          budget_estimate: number | null
          church_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_template: boolean | null
          milestones: Json | null
          ministry_type: string
          resources_needed: string[] | null
          team_roles: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_estimate?: number | null
          church_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          milestones?: Json | null
          ministry_type: string
          resources_needed?: string[] | null
          team_roles?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_estimate?: number | null
          church_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          milestones?: Json | null
          ministry_type?: string
          resources_needed?: string[] | null
          team_roles?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministry_templates_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministry_templates_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
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
      monthly_gates: {
        Row: {
          attempts: number | null
          created_at: string | null
          flagged_for_review: boolean | null
          id: string
          last_attempt_at: string | null
          month: number
          passed: boolean | null
          passed_at: string | null
          path_type: string
          score: number | null
          time_spent_seconds: number | null
          user_id: string
          year: number
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          flagged_for_review?: boolean | null
          id?: string
          last_attempt_at?: string | null
          month: number
          passed?: boolean | null
          passed_at?: string | null
          path_type: string
          score?: number | null
          time_spent_seconds?: number | null
          user_id: string
          year: number
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          flagged_for_review?: boolean | null
          id?: string
          last_attempt_at?: string | null
          month?: number
          passed?: boolean | null
          passed_at?: string | null
          path_type?: string
          score?: number | null
          time_spent_seconds?: number | null
          user_id?: string
          year?: number
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
          devotional_reminders: boolean | null
          dimension_challenges: boolean
          equation_challenges: boolean
          fruit_check_challenges: boolean
          global_live_chat: boolean
          id: string
          memory_challenge_reminders: boolean | null
          palace_practice_reminders: boolean | null
          reading_plan_reminders: boolean | null
          renewal_reminders: boolean
          sanctuary_challenges: boolean
          streak_protection_alerts: boolean | null
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
          devotional_reminders?: boolean | null
          dimension_challenges?: boolean
          equation_challenges?: boolean
          fruit_check_challenges?: boolean
          global_live_chat?: boolean
          id?: string
          memory_challenge_reminders?: boolean | null
          palace_practice_reminders?: boolean | null
          reading_plan_reminders?: boolean | null
          renewal_reminders?: boolean
          sanctuary_challenges?: boolean
          streak_protection_alerts?: boolean | null
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
          devotional_reminders?: boolean | null
          dimension_challenges?: boolean
          equation_challenges?: boolean
          fruit_check_challenges?: boolean
          global_live_chat?: boolean
          id?: string
          memory_challenge_reminders?: boolean | null
          palace_practice_reminders?: boolean | null
          reading_plan_reminders?: boolean | null
          renewal_reminders?: boolean
          sanctuary_challenges?: boolean
          streak_protection_alerts?: boolean | null
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
      package_progress: {
        Row: {
          completed_at: string | null
          completed_weeks: number[] | null
          created_at: string | null
          current_week: number | null
          id: string
          package_id: string | null
          started_at: string | null
          unlocked_benefits: string[] | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_weeks?: number[] | null
          created_at?: string | null
          current_week?: number | null
          id?: string
          package_id?: string | null
          started_at?: string | null
          unlocked_benefits?: string[] | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_weeks?: number[] | null
          created_at?: string | null
          current_week?: number | null
          id?: string
          package_id?: string | null
          started_at?: string | null
          unlocked_benefits?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_progress_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "discipleship_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page_path: string
          page_title: string | null
          referrer: string | null
          scroll_depth: number | null
          session_duration_ms: number | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          page_title?: string | null
          referrer?: string | null
          scroll_depth?: number | null
          session_duration_ms?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          scroll_depth?: number | null
          session_duration_ms?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      partnership_daily_activity: {
        Row: {
          activity_date: string
          bonus_applied: boolean | null
          completed_challenge: boolean | null
          completed_mastery: boolean | null
          completed_reading: boolean | null
          created_at: string
          id: string
          partnership_id: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          activity_date?: string
          bonus_applied?: boolean | null
          completed_challenge?: boolean | null
          completed_mastery?: boolean | null
          completed_reading?: boolean | null
          created_at?: string
          id?: string
          partnership_id: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          activity_date?: string
          bonus_applied?: boolean | null
          completed_challenge?: boolean | null
          completed_mastery?: boolean | null
          completed_reading?: boolean | null
          created_at?: string
          id?: string
          partnership_id?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partnership_daily_activity_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "study_partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_nudges: {
        Row: {
          created_at: string
          id: string
          message: string | null
          nudge_type: string
          partnership_id: string
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          nudge_type?: string
          partnership_id: string
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          nudge_type?: string
          partnership_id?: string
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_nudges_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "study_partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      path_activity_completions: {
        Row: {
          activity_id: string
          completed_at: string
          created_at: string
          id: string
          path_id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          completed_at?: string
          created_at?: string
          id?: string
          path_id: string
          user_id: string
        }
        Update: {
          activity_id?: string
          completed_at?: string
          created_at?: string
          id?: string
          path_id?: string
          user_id?: string
        }
        Relationships: []
      }
      path_activity_responses: {
        Row: {
          activity_id: string
          created_at: string
          id: string
          path_type: string
          response_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          id?: string
          path_type: string
          response_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          id?: string
          path_type?: string
          response_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      path_completions: {
        Row: {
          certificate_url: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          master_level: number
          path_type: string
          started_at: string
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          master_level: number
          path_type: string
          started_at: string
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          master_level?: number
          path_type?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      patreon_connections: {
        Row: {
          access_expires_at: string | null
          access_token: string | null
          connected_at: string | null
          entitled_cents: number | null
          id: string
          is_active_patron: boolean | null
          patreon_email: string | null
          patreon_name: string | null
          patreon_user_id: string
          pledge_status: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_expires_at?: string | null
          access_token?: string | null
          connected_at?: string | null
          entitled_cents?: number | null
          id?: string
          is_active_patron?: boolean | null
          patreon_email?: string | null
          patreon_name?: string | null
          patreon_user_id: string
          pledge_status?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_expires_at?: string | null
          access_token?: string | null
          connected_at?: string | null
          entitled_cents?: number | null
          id?: string
          is_active_patron?: boolean | null
          patreon_email?: string | null
          patreon_name?: string | null
          patreon_user_id?: string
          pledge_status?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      patreon_members: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_follower: boolean | null
          joined_at: string | null
          last_charge_date: string | null
          last_charge_status: string | null
          lifetime_support_cents: number | null
          patreon_id: string
          patron_status: string | null
          pledge_cents: number | null
          synced_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_follower?: boolean | null
          joined_at?: string | null
          last_charge_date?: string | null
          last_charge_status?: string | null
          lifetime_support_cents?: number | null
          patreon_id: string
          patron_status?: string | null
          pledge_cents?: number | null
          synced_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_follower?: boolean | null
          joined_at?: string | null
          last_charge_date?: string | null
          last_charge_status?: string | null
          lifetime_support_cents?: number | null
          patreon_id?: string
          patron_status?: string | null
          pledge_cents?: number | null
          synced_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pdf_email_logs: {
        Row: {
          checkout_session_id: string | null
          created_at: string
          email: string
          error_message: string | null
          id: string
          product_key: string
          sent_at: string
          success: boolean
        }
        Insert: {
          checkout_session_id?: string | null
          created_at?: string
          email: string
          error_message?: string | null
          id?: string
          product_key: string
          sent_at?: string
          success?: boolean
        }
        Update: {
          checkout_session_id?: string | null
          created_at?: string
          email?: string
          error_message?: string | null
          id?: string
          product_key?: string
          sent_at?: string
          success?: boolean
        }
        Relationships: []
      }
      pending_lifetime_grants: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          email: string
          granted_by: string | null
          id: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          email: string
          granted_by?: string | null
          id?: string
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          email?: string
          granted_by?: string | null
          id?: string
        }
        Relationships: []
      }
      pending_student_verifications: {
        Row: {
          attempts: number
          created_at: string
          edu_email: string
          expires_at: string
          id: string
          user_id: string
          verification_code: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          edu_email: string
          expires_at?: string
          id?: string
          user_id: string
          verification_code: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string
          edu_email?: string
          expires_at?: string
          id?: string
          user_id?: string
          verification_code?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      personal_devotional_diary: {
        Row: {
          created_at: string
          entry_date: string
          gratitude_notes: string | null
          id: string
          prayer_points: string[] | null
          reflection: string
          scripture_reference: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_date?: string
          gratitude_notes?: string | null
          id?: string
          prayer_points?: string[] | null
          reflection: string
          scripture_reference?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          gratitude_notes?: string | null
          id?: string
          prayer_points?: string[] | null
          reflection?: string
          scripture_reference?: string | null
          title?: string
          updated_at?: string
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
      pickaxe_connections: {
        Row: {
          access_granted_at: string | null
          created_at: string
          email_sent_at: string | null
          id: string
          is_paid_user: boolean | null
          pickaxe_active_at: string | null
          pickaxe_created_at: string | null
          pickaxe_email: string
          pickaxe_name: string | null
          pickaxe_picture: string | null
          spend_cents: number | null
          synced_at: string | null
          total_uses: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_granted_at?: string | null
          created_at?: string
          email_sent_at?: string | null
          id?: string
          is_paid_user?: boolean | null
          pickaxe_active_at?: string | null
          pickaxe_created_at?: string | null
          pickaxe_email: string
          pickaxe_name?: string | null
          pickaxe_picture?: string | null
          spend_cents?: number | null
          synced_at?: string | null
          total_uses?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_granted_at?: string | null
          created_at?: string
          email_sent_at?: string | null
          id?: string
          is_paid_user?: boolean | null
          pickaxe_active_at?: string | null
          pickaxe_created_at?: string | null
          pickaxe_email?: string
          pickaxe_name?: string | null
          pickaxe_picture?: string | null
          spend_cents?: number | null
          synced_at?: string | null
          total_uses?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pinned_posts: {
        Row: {
          created_at: string
          entry_id: string
          entry_type: string
          id: string
          pin_order: number
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          entry_type: string
          id?: string
          pin_order?: number
          user_id: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          entry_type?: string
          id?: string
          pin_order?: number
          user_id?: string
        }
        Relationships: []
      }
      polish_stories: {
        Row: {
          closing_reflection: string | null
          created_at: string
          id: string
          input_text: string
          narrative: string | null
          scenes: Json | null
          tagline: string | null
          title: string | null
          user_id: string
          verses_used: string[] | null
        }
        Insert: {
          closing_reflection?: string | null
          created_at?: string
          id?: string
          input_text: string
          narrative?: string | null
          scenes?: Json | null
          tagline?: string | null
          title?: string | null
          user_id: string
          verses_used?: string[] | null
        }
        Update: {
          closing_reflection?: string | null
          created_at?: string
          id?: string
          input_text?: string
          narrative?: string | null
          scenes?: Json | null
          tagline?: string | null
          title?: string | null
          user_id?: string
          verses_used?: string[] | null
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
      prayer_activity_log: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          notes: string | null
          request_id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          notes?: string | null
          request_id: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_activity_log_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "church_prayer_requests"
            referencedColumns: ["id"]
          },
        ]
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
      prayer_responses: {
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
            foreignKeyName: "prayer_responses_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_team_members: {
        Row: {
          id: string
          is_active: boolean | null
          joined_at: string | null
          role: string | null
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          role?: string | null
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          role?: string | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "prayer_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_teams: {
        Row: {
          church_id: string
          created_at: string
          description: string | null
          focus_area: string | null
          id: string
          is_active: boolean | null
          leader_id: string | null
          meeting_schedule: string | null
          name: string
        }
        Insert: {
          church_id: string
          created_at?: string
          description?: string | null
          focus_area?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          meeting_schedule?: string | null
          name: string
        }
        Update: {
          church_id?: string
          created_at?: string
          description?: string | null
          focus_area?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          meeting_schedule?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_teams_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_teams_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_approved_emails: {
        Row: {
          access_type: string
          created_at: string
          email: string
          granted_by: string | null
          id: string
          redeemed_at: string | null
          redeemed_by: string | null
          winback_email_sent_at: string | null
        }
        Insert: {
          access_type?: string
          created_at?: string
          email: string
          granted_by?: string | null
          id?: string
          redeemed_at?: string | null
          redeemed_by?: string | null
          winback_email_sent_at?: string | null
        }
        Update: {
          access_type?: string
          created_at?: string
          email?: string
          granted_by?: string | null
          id?: string
          redeemed_at?: string | null
          redeemed_by?: string | null
          winback_email_sent_at?: string | null
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
      profile_devotions: {
        Row: {
          application: string | null
          christ_action: string | null
          christ_name: string | null
          created_at: string
          cross_references: string[] | null
          cycle_placement: string | null
          devotional_body: string
          generated_at: string
          id: string
          is_shared: boolean
          memory_hook: string | null
          prayer: string | null
          profile_id: string
          sanctuary_connection: string | null
          scripture_reference: string
          scripture_text: string
          shared_at: string | null
          strike_line: string | null
          theme_used: string | null
          title: string
          types_and_symbols: string[] | null
          user_id: string
        }
        Insert: {
          application?: string | null
          christ_action?: string | null
          christ_name?: string | null
          created_at?: string
          cross_references?: string[] | null
          cycle_placement?: string | null
          devotional_body: string
          generated_at?: string
          id?: string
          is_shared?: boolean
          memory_hook?: string | null
          prayer?: string | null
          profile_id: string
          sanctuary_connection?: string | null
          scripture_reference: string
          scripture_text: string
          shared_at?: string | null
          strike_line?: string | null
          theme_used?: string | null
          title: string
          types_and_symbols?: string[] | null
          user_id: string
        }
        Update: {
          application?: string | null
          christ_action?: string | null
          christ_name?: string | null
          created_at?: string
          cross_references?: string[] | null
          cycle_placement?: string | null
          devotional_body?: string
          generated_at?: string
          id?: string
          is_shared?: boolean
          memory_hook?: string | null
          prayer?: string | null
          profile_id?: string
          sanctuary_connection?: string | null
          scripture_reference?: string
          scripture_text?: string
          shared_at?: string | null
          strike_line?: string | null
          theme_used?: string | null
          title?: string
          types_and_symbols?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_devotions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "devotional_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          access_code_used: string | null
          avatar_url: string | null
          bio: string | null
          chain_chess_streak: number | null
          change_phase: string | null
          cohort_date: string | null
          cover_photo_url: string | null
          created_at: string | null
          current_floor: number | null
          daily_study_streak: number | null
          days_active: number | null
          display_name: string | null
          email: string | null
          equations_streak: number | null
          first_meaningful_action_at: string | null
          first_win_achieved_at: string | null
          first_win_type: string | null
          focused_room_floor: number | null
          focused_room_id: string | null
          focused_room_set_at: string | null
          gamma_api_key: string | null
          gamma_api_key_encrypted: string | null
          gem_creation_streak: number | null
          guided_path_completed_at: string | null
          guided_path_step: number | null
          has_achieved_first_win: boolean | null
          has_completed_orientation: boolean | null
          has_entered_palace: boolean | null
          has_lifetime_access: boolean
          has_seen_community_guidelines: boolean | null
          id: string
          interests: string[] | null
          is_kid_mode: boolean | null
          is_profile_public: boolean | null
          is_recurring: boolean | null
          is_student: boolean | null
          last_activity_date: string | null
          last_seen: string | null
          learning_style: string | null
          level: number | null
          lifetime_access_granted_at: string | null
          location: string | null
          longest_chess_streak: number | null
          longest_equations_streak: number | null
          longest_gem_streak: number | null
          longest_study_streak: number | null
          looking_for_partner: boolean | null
          master_title: string | null
          ministry_tags: string[] | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          onboarding_step: number | null
          orientation_completed_at: string | null
          palace_entered_at: string | null
          path_master_level: number | null
          payment_source: string | null
          points: number | null
          preferred_features: string[] | null
          primary_role: string | null
          promotional_access_expires_at: string | null
          recovery_email_count: number | null
          referral_code: string | null
          selected_path: string | null
          social_links: Json | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          student_expires_at: string | null
          student_verified_at: string | null
          subscription_cancelled_at: string | null
          subscription_renewal_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          surface_study_only: boolean | null
          total_gems_saved: number | null
          total_sessions_completed: number | null
          total_studies_saved: number | null
          trial_ends_at: string | null
          trial_started_at: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          access_code_used?: string | null
          avatar_url?: string | null
          bio?: string | null
          chain_chess_streak?: number | null
          change_phase?: string | null
          cohort_date?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          current_floor?: number | null
          daily_study_streak?: number | null
          days_active?: number | null
          display_name?: string | null
          email?: string | null
          equations_streak?: number | null
          first_meaningful_action_at?: string | null
          first_win_achieved_at?: string | null
          first_win_type?: string | null
          focused_room_floor?: number | null
          focused_room_id?: string | null
          focused_room_set_at?: string | null
          gamma_api_key?: string | null
          gamma_api_key_encrypted?: string | null
          gem_creation_streak?: number | null
          guided_path_completed_at?: string | null
          guided_path_step?: number | null
          has_achieved_first_win?: boolean | null
          has_completed_orientation?: boolean | null
          has_entered_palace?: boolean | null
          has_lifetime_access?: boolean
          has_seen_community_guidelines?: boolean | null
          id: string
          interests?: string[] | null
          is_kid_mode?: boolean | null
          is_profile_public?: boolean | null
          is_recurring?: boolean | null
          is_student?: boolean | null
          last_activity_date?: string | null
          last_seen?: string | null
          learning_style?: string | null
          level?: number | null
          lifetime_access_granted_at?: string | null
          location?: string | null
          longest_chess_streak?: number | null
          longest_equations_streak?: number | null
          longest_gem_streak?: number | null
          longest_study_streak?: number | null
          looking_for_partner?: boolean | null
          master_title?: string | null
          ministry_tags?: string[] | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_step?: number | null
          orientation_completed_at?: string | null
          palace_entered_at?: string | null
          path_master_level?: number | null
          payment_source?: string | null
          points?: number | null
          preferred_features?: string[] | null
          primary_role?: string | null
          promotional_access_expires_at?: string | null
          recovery_email_count?: number | null
          referral_code?: string | null
          selected_path?: string | null
          social_links?: Json | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          student_expires_at?: string | null
          student_verified_at?: string | null
          subscription_cancelled_at?: string | null
          subscription_renewal_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          surface_study_only?: boolean | null
          total_gems_saved?: number | null
          total_sessions_completed?: number | null
          total_studies_saved?: number | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          access_code_used?: string | null
          avatar_url?: string | null
          bio?: string | null
          chain_chess_streak?: number | null
          change_phase?: string | null
          cohort_date?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          current_floor?: number | null
          daily_study_streak?: number | null
          days_active?: number | null
          display_name?: string | null
          email?: string | null
          equations_streak?: number | null
          first_meaningful_action_at?: string | null
          first_win_achieved_at?: string | null
          first_win_type?: string | null
          focused_room_floor?: number | null
          focused_room_id?: string | null
          focused_room_set_at?: string | null
          gamma_api_key?: string | null
          gamma_api_key_encrypted?: string | null
          gem_creation_streak?: number | null
          guided_path_completed_at?: string | null
          guided_path_step?: number | null
          has_achieved_first_win?: boolean | null
          has_completed_orientation?: boolean | null
          has_entered_palace?: boolean | null
          has_lifetime_access?: boolean
          has_seen_community_guidelines?: boolean | null
          id?: string
          interests?: string[] | null
          is_kid_mode?: boolean | null
          is_profile_public?: boolean | null
          is_recurring?: boolean | null
          is_student?: boolean | null
          last_activity_date?: string | null
          last_seen?: string | null
          learning_style?: string | null
          level?: number | null
          lifetime_access_granted_at?: string | null
          location?: string | null
          longest_chess_streak?: number | null
          longest_equations_streak?: number | null
          longest_gem_streak?: number | null
          longest_study_streak?: number | null
          looking_for_partner?: boolean | null
          master_title?: string | null
          ministry_tags?: string[] | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          onboarding_step?: number | null
          orientation_completed_at?: string | null
          palace_entered_at?: string | null
          path_master_level?: number | null
          payment_source?: string | null
          points?: number | null
          preferred_features?: string[] | null
          primary_role?: string | null
          promotional_access_expires_at?: string | null
          recovery_email_count?: number | null
          referral_code?: string | null
          selected_path?: string | null
          social_links?: Json | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          student_expires_at?: string | null
          student_verified_at?: string | null
          subscription_cancelled_at?: string | null
          subscription_renewal_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          surface_study_only?: boolean | null
          total_gems_saved?: number | null
          total_sessions_completed?: number | null
          total_studies_saved?: number | null
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      pt_battle_moves: {
        Row: {
          battle_id: string
          bonuses: Json | null
          card_used: string
          created_at: string
          id: string
          judge_feedback: string
          judge_verdict: string
          move_number: number
          player_id: string
          points_awarded: number
          response_text: string
        }
        Insert: {
          battle_id: string
          bonuses?: Json | null
          card_used: string
          created_at?: string
          id?: string
          judge_feedback: string
          judge_verdict: string
          move_number: number
          player_id: string
          points_awarded?: number
          response_text: string
        }
        Update: {
          battle_id?: string
          bonuses?: Json | null
          card_used?: string
          created_at?: string
          id?: string
          judge_feedback?: string
          judge_verdict?: string
          move_number?: number
          player_id?: string
          points_awarded?: number
          response_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "pt_battle_moves_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "pt_card_battles"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_battle_players: {
        Row: {
          battle_id: string
          cards_in_hand: Json
          cards_played: Json
          challenges_remaining: number
          display_name: string
          id: string
          is_active: boolean | null
          joined_at: string
          player_id: string
          player_type: string
          score: number
          team_name: string | null
          user_id: string | null
        }
        Insert: {
          battle_id: string
          cards_in_hand?: Json
          cards_played?: Json
          challenges_remaining?: number
          display_name: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          player_id: string
          player_type: string
          score?: number
          team_name?: string | null
          user_id?: string | null
        }
        Update: {
          battle_id?: string
          cards_in_hand?: Json
          cards_played?: Json
          challenges_remaining?: number
          display_name?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          player_id?: string
          player_type?: string
          score?: number
          team_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pt_battle_players_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "pt_card_battles"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_card_battles: {
        Row: {
          battle_code: string | null
          created_at: string
          current_turn_player: string
          game_mode: string
          game_settings: Json | null
          host_user_id: string | null
          id: string
          is_saved: boolean | null
          saved_by_user_id: string | null
          status: string
          story_reference: string | null
          story_text: string
          updated_at: string
          winner: string | null
        }
        Insert: {
          battle_code?: string | null
          created_at?: string
          current_turn_player: string
          game_mode: string
          game_settings?: Json | null
          host_user_id?: string | null
          id?: string
          is_saved?: boolean | null
          saved_by_user_id?: string | null
          status?: string
          story_reference?: string | null
          story_text: string
          updated_at?: string
          winner?: string | null
        }
        Update: {
          battle_code?: string | null
          created_at?: string
          current_turn_player?: string
          game_mode?: string
          game_settings?: Json | null
          host_user_id?: string | null
          id?: string
          is_saved?: boolean | null
          saved_by_user_id?: string | null
          status?: string
          story_reference?: string | null
          story_text?: string
          updated_at?: string
          winner?: string | null
        }
        Relationships: []
      }
      pt_cross_references: {
        Row: {
          connection_type: string
          created_at: string | null
          explanation: string | null
          id: string
          principle_codes: string[]
          source_verse: string
          strength: number | null
          target_verse: string
        }
        Insert: {
          connection_type: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          principle_codes: string[]
          source_verse: string
          strength?: number | null
          target_verse: string
        }
        Update: {
          connection_type?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          principle_codes?: string[]
          source_verse?: string
          strength?: number | null
          target_verse?: string
        }
        Relationships: []
      }
      pt_knowledge_bank: {
        Row: {
          approved_at: string
          approved_by: string
          categories: Json | null
          created_at: string
          deeper_insights: Json | null
          id: string
          input_text: string
          key_insights: Json | null
          palace_rooms: Json | null
          scripture_connections: Json | null
          source_analysis_id: string | null
          summary: string | null
          tags: string[] | null
          typology_layers: Json | null
          updated_at: string
        }
        Insert: {
          approved_at?: string
          approved_by: string
          categories?: Json | null
          created_at?: string
          deeper_insights?: Json | null
          id?: string
          input_text: string
          key_insights?: Json | null
          palace_rooms?: Json | null
          scripture_connections?: Json | null
          source_analysis_id?: string | null
          summary?: string | null
          tags?: string[] | null
          typology_layers?: Json | null
          updated_at?: string
        }
        Update: {
          approved_at?: string
          approved_by?: string
          categories?: Json | null
          created_at?: string
          deeper_insights?: Json | null
          id?: string
          input_text?: string
          key_insights?: Json | null
          palace_rooms?: Json | null
          scripture_connections?: Json | null
          source_analysis_id?: string | null
          summary?: string | null
          tags?: string[] | null
          typology_layers?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pt_knowledge_bank_source_analysis_id_fkey"
            columns: ["source_analysis_id"]
            isOneToOne: false
            referencedRelation: "thought_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_mastery: {
        Row: {
          created_at: string | null
          first_encountered_at: string | null
          id: string
          last_practiced_at: string | null
          mastery_level: number | null
          principle_code: string
          principle_type: string
          updated_at: string | null
          user_id: string
          verses_memorized: string[] | null
        }
        Insert: {
          created_at?: string | null
          first_encountered_at?: string | null
          id?: string
          last_practiced_at?: string | null
          mastery_level?: number | null
          principle_code: string
          principle_type: string
          updated_at?: string | null
          user_id: string
          verses_memorized?: string[] | null
        }
        Update: {
          created_at?: string | null
          first_encountered_at?: string | null
          id?: string
          last_practiced_at?: string | null
          mastery_level?: number | null
          principle_code?: string
          principle_type?: string
          updated_at?: string | null
          user_id?: string
          verses_memorized?: string[] | null
        }
        Relationships: []
      }
      pt_multiplayer_deck: {
        Row: {
          card_data: Json
          card_type: string
          drawn_at: string | null
          drawn_by: string | null
          game_id: string
          id: string
          is_drawn: boolean | null
        }
        Insert: {
          card_data: Json
          card_type: string
          drawn_at?: string | null
          drawn_by?: string | null
          game_id: string
          id?: string
          is_drawn?: boolean | null
        }
        Update: {
          card_data?: Json
          card_type?: string
          drawn_at?: string | null
          drawn_by?: string | null
          game_id?: string
          id?: string
          is_drawn?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pt_multiplayer_deck_drawn_by_fkey"
            columns: ["drawn_by"]
            isOneToOne: false
            referencedRelation: "pt_multiplayer_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pt_multiplayer_deck_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "pt_multiplayer_games"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_multiplayer_games: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_turn_player_id: string | null
          game_mode: string
          generated_study: Json | null
          host_id: string
          id: string
          max_players: number | null
          settings: Json | null
          status: string | null
          study_topic: string
          updated_at: string | null
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_turn_player_id?: string | null
          game_mode: string
          generated_study?: Json | null
          host_id: string
          id?: string
          max_players?: number | null
          settings?: Json | null
          status?: string | null
          study_topic: string
          updated_at?: string | null
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_turn_player_id?: string | null
          game_mode?: string
          generated_study?: Json | null
          host_id?: string
          id?: string
          max_players?: number | null
          settings?: Json | null
          status?: string | null
          study_topic?: string
          updated_at?: string | null
          winner_id?: string | null
        }
        Relationships: []
      }
      pt_multiplayer_moves: {
        Row: {
          card_data: Json
          card_type: string
          clarification_attempt_at: string | null
          clarification_text: string | null
          combo_cards: Json | null
          created_at: string | null
          explanation: string
          game_id: string
          id: string
          is_combo: boolean | null
          jeeves_feedback: string | null
          jeeves_verdict: string | null
          move_number: number
          player_id: string
          points_awarded: number | null
        }
        Insert: {
          card_data: Json
          card_type: string
          clarification_attempt_at?: string | null
          clarification_text?: string | null
          combo_cards?: Json | null
          created_at?: string | null
          explanation: string
          game_id: string
          id?: string
          is_combo?: boolean | null
          jeeves_feedback?: string | null
          jeeves_verdict?: string | null
          move_number: number
          player_id: string
          points_awarded?: number | null
        }
        Update: {
          card_data?: Json
          card_type?: string
          clarification_attempt_at?: string | null
          clarification_text?: string | null
          combo_cards?: Json | null
          created_at?: string | null
          explanation?: string
          game_id?: string
          id?: string
          is_combo?: boolean | null
          jeeves_feedback?: string | null
          jeeves_verdict?: string | null
          move_number?: number
          player_id?: string
          points_awarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pt_multiplayer_moves_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "pt_multiplayer_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pt_multiplayer_moves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "pt_multiplayer_players"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_multiplayer_players: {
        Row: {
          cards_remaining: number | null
          consecutive_rejections: number | null
          display_name: string
          game_id: string
          hand: Json | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          score: number | null
          skip_next_turn: boolean | null
          team: string | null
          user_id: string
        }
        Insert: {
          cards_remaining?: number | null
          consecutive_rejections?: number | null
          display_name: string
          game_id: string
          hand?: Json | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          score?: number | null
          skip_next_turn?: boolean | null
          team?: string | null
          user_id: string
        }
        Update: {
          cards_remaining?: number | null
          consecutive_rejections?: number | null
          display_name?: string
          game_id?: string
          hand?: Json | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          score?: number | null
          skip_next_turn?: boolean | null
          team?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pt_multiplayer_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "pt_multiplayer_games"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_recalibration_requests: {
        Row: {
          approved: boolean | null
          created_at: string
          evaluation_result: Json | null
          id: string
          new_level: Database["public"]["Enums"]["pt_mastery_level"] | null
          path_id: string | null
          processed_at: string | null
          reason: string | null
          requested_level:
            | Database["public"]["Enums"]["pt_mastery_level"]
            | null
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          evaluation_result?: Json | null
          id?: string
          new_level?: Database["public"]["Enums"]["pt_mastery_level"] | null
          path_id?: string | null
          processed_at?: string | null
          reason?: string | null
          requested_level?:
            | Database["public"]["Enums"]["pt_mastery_level"]
            | null
          user_id: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          evaluation_result?: Json | null
          id?: string
          new_level?: Database["public"]["Enums"]["pt_mastery_level"] | null
          path_id?: string | null
          processed_at?: string | null
          reason?: string | null
          requested_level?:
            | Database["public"]["Enums"]["pt_mastery_level"]
            | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pt_recalibration_requests_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "user_study_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_scenario_evaluations: {
        Row: {
          ai_evaluation: Json | null
          created_at: string
          floors_tested: number[] | null
          id: string
          passed: boolean | null
          rooms_tested: string[] | null
          scenario_prompt: string
          scenario_type: string
          score: number | null
          session_id: string | null
          user_id: string
          user_response: string | null
        }
        Insert: {
          ai_evaluation?: Json | null
          created_at?: string
          floors_tested?: number[] | null
          id?: string
          passed?: boolean | null
          rooms_tested?: string[] | null
          scenario_prompt: string
          scenario_type: string
          score?: number | null
          session_id?: string | null
          user_id: string
          user_response?: string | null
        }
        Update: {
          ai_evaluation?: Json | null
          created_at?: string
          floors_tested?: number[] | null
          id?: string
          passed?: boolean | null
          rooms_tested?: string[] | null
          scenario_prompt?: string
          scenario_type?: string
          score?: number | null
          session_id?: string | null
          user_id?: string
          user_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pt_scenario_evaluations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "pt_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_scrabble_games: {
        Row: {
          board_state: Json
          created_at: string
          current_move_id: string | null
          deck_remaining: string[]
          ended_at: string | null
          game_mode: string
          host_user_id: string
          id: string
          max_players: number
          room_code: string
          seed_card_id: string
          seed_verse: string | null
          started_at: string | null
          status: string
          vote_timeout_seconds: number
        }
        Insert: {
          board_state?: Json
          created_at?: string
          current_move_id?: string | null
          deck_remaining?: string[]
          ended_at?: string | null
          game_mode?: string
          host_user_id: string
          id?: string
          max_players?: number
          room_code: string
          seed_card_id: string
          seed_verse?: string | null
          started_at?: string | null
          status?: string
          vote_timeout_seconds?: number
        }
        Update: {
          board_state?: Json
          created_at?: string
          current_move_id?: string | null
          deck_remaining?: string[]
          ended_at?: string | null
          game_mode?: string
          host_user_id?: string
          id?: string
          max_players?: number
          room_code?: string
          seed_card_id?: string
          seed_verse?: string | null
          started_at?: string | null
          status?: string
          vote_timeout_seconds?: number
        }
        Relationships: []
      }
      pt_scrabble_moves: {
        Row: {
          card_code: string
          card_id: string
          card_name: string
          connections: Json
          created_at: string
          explanation: string | null
          game_id: string
          id: string
          is_christ_connection: boolean
          player_id: string
          points_awarded: number
          points_base: number
          position_x: number
          position_y: number
          validation_status: string
          votes_approve: number
          votes_reject: number
          voting_ends_at: string | null
        }
        Insert: {
          card_code: string
          card_id: string
          card_name: string
          connections?: Json
          created_at?: string
          explanation?: string | null
          game_id: string
          id?: string
          is_christ_connection?: boolean
          player_id: string
          points_awarded?: number
          points_base?: number
          position_x: number
          position_y: number
          validation_status?: string
          votes_approve?: number
          votes_reject?: number
          voting_ends_at?: string | null
        }
        Update: {
          card_code?: string
          card_id?: string
          card_name?: string
          connections?: Json
          created_at?: string
          explanation?: string | null
          game_id?: string
          id?: string
          is_christ_connection?: boolean
          player_id?: string
          points_awarded?: number
          points_base?: number
          position_x?: number
          position_y?: number
          validation_status?: string
          votes_approve?: number
          votes_reject?: number
          voting_ends_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pt_scrabble_moves_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "pt_scrabble_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pt_scrabble_moves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "pt_scrabble_players"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_scrabble_players: {
        Row: {
          avatar_url: string | null
          cards_played: number
          display_name: string
          game_id: string
          hand: Json
          id: string
          is_connected: boolean
          joined_at: string
          last_seen_at: string
          score: number
          team_id: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          cards_played?: number
          display_name: string
          game_id: string
          hand?: Json
          id?: string
          is_connected?: boolean
          joined_at?: string
          last_seen_at?: string
          score?: number
          team_id?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          cards_played?: number
          display_name?: string
          game_id?: string
          hand?: Json
          id?: string
          is_connected?: boolean
          joined_at?: string
          last_seen_at?: string
          score?: number
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pt_scrabble_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "pt_scrabble_games"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_scrabble_teams: {
        Row: {
          game_id: string
          id: string
          team_name: string
          team_number: number
          total_score: number
        }
        Insert: {
          game_id: string
          id?: string
          team_name: string
          team_number: number
          total_score?: number
        }
        Update: {
          game_id?: string
          id?: string
          team_name?: string
          team_number?: number
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "pt_scrabble_teams_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "pt_scrabble_games"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_scrabble_votes: {
        Row: {
          created_at: string
          id: string
          move_id: string
          player_id: string
          vote: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          move_id: string
          player_id: string
          vote: boolean
        }
        Update: {
          created_at?: string
          id?: string
          move_id?: string
          player_id?: string
          vote?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "pt_scrabble_votes_move_id_fkey"
            columns: ["move_id"]
            isOneToOne: false
            referencedRelation: "pt_scrabble_moves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pt_scrabble_votes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "pt_scrabble_players"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_sessions: {
        Row: {
          competency_check_passed: boolean | null
          competency_feedback: string | null
          completed_at: string | null
          completion_score: number | null
          confidence_targets: string[] | null
          content: Json
          created_at: string
          floor_numbers: number[] | null
          id: string
          path_id: string
          primary_room_codes: string[] | null
          secondary_room_codes: string[] | null
          session_number: number
          session_type: string
          skill_focus: string | null
          started_at: string | null
          time_spent_minutes: number | null
          title: string
        }
        Insert: {
          competency_check_passed?: boolean | null
          competency_feedback?: string | null
          completed_at?: string | null
          completion_score?: number | null
          confidence_targets?: string[] | null
          content?: Json
          created_at?: string
          floor_numbers?: number[] | null
          id?: string
          path_id: string
          primary_room_codes?: string[] | null
          secondary_room_codes?: string[] | null
          session_number: number
          session_type: string
          skill_focus?: string | null
          started_at?: string | null
          time_spent_minutes?: number | null
          title: string
        }
        Update: {
          competency_check_passed?: boolean | null
          competency_feedback?: string | null
          completed_at?: string | null
          completion_score?: number | null
          confidence_targets?: string[] | null
          content?: Json
          created_at?: string
          floor_numbers?: number[] | null
          id?: string
          path_id?: string
          primary_room_codes?: string[] | null
          secondary_room_codes?: string[] | null
          session_number?: number
          session_type?: string
          skill_focus?: string | null
          started_at?: string | null
          time_spent_minutes?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "pt_sessions_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "user_study_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      pt_study_tracks: {
        Row: {
          burden_alignment: Database["public"]["Enums"]["pt_study_burden"][]
          created_at: string
          description: string | null
          floor_focus: number[] | null
          id: string
          min_confidence_level: number
          name: string
          room_focus: string[] | null
        }
        Insert: {
          burden_alignment?: Database["public"]["Enums"]["pt_study_burden"][]
          created_at?: string
          description?: string | null
          floor_focus?: number[] | null
          id?: string
          min_confidence_level?: number
          name: string
          room_focus?: string[] | null
        }
        Update: {
          burden_alignment?: Database["public"]["Enums"]["pt_study_burden"][]
          created_at?: string
          description?: string | null
          floor_focus?: number[] | null
          id?: string
          min_confidence_level?: number
          name?: string
          room_focus?: string[] | null
        }
        Relationships: []
      }
      public_challenge_responses: {
        Row: {
          challenge_id: string
          created_at: string
          grade_score: number | null
          guest_name: string | null
          id: string
          jeeves_feedback: string | null
          response_text: string
          user_id: string | null
        }
        Insert: {
          challenge_id: string
          created_at?: string
          grade_score?: number | null
          guest_name?: string | null
          id?: string
          jeeves_feedback?: string | null
          response_text: string
          user_id?: string | null
        }
        Update: {
          challenge_id?: string
          created_at?: string
          grade_score?: number | null
          guest_name?: string | null
          id?: string
          jeeves_feedback?: string | null
          response_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_challenge_responses_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "equation_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      public_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          images: string[] | null
          is_deleted: boolean
          is_pinned: boolean
          reply_to_id: string | null
          room_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          is_deleted?: boolean
          is_pinned?: boolean
          reply_to_id?: string | null
          room_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          is_deleted?: boolean
          is_pinned?: boolean
          reply_to_id?: string | null
          room_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "public_chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "public_chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      public_chat_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_chat_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "public_chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      public_chat_rooms: {
        Row: {
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      push_notification_preferences: {
        Row: {
          announcements_enabled: boolean | null
          created_at: string | null
          events_enabled: boolean | null
          id: string
          messages_enabled: boolean | null
          prayer_requests_enabled: boolean | null
          study_reminders_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          announcements_enabled?: boolean | null
          created_at?: string | null
          events_enabled?: boolean | null
          id?: string
          messages_enabled?: boolean | null
          prayer_requests_enabled?: boolean | null
          study_reminders_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          announcements_enabled?: boolean | null
          created_at?: string | null
          events_enabled?: boolean | null
          id?: string
          messages_enabled?: boolean | null
          prayer_requests_enabled?: boolean | null
          study_reminders_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      push_notification_tokens: {
        Row: {
          created_at: string | null
          id: string
          platform: string | null
          token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform?: string | null
          token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string | null
          token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quick_devotion_history: {
        Row: {
          created_at: string
          depth_level: string
          description: string | null
          devotion_content: string
          id: string
          scripture_reference: string | null
          theme: string
          user_id: string
          writing_style: string
        }
        Insert: {
          created_at?: string
          depth_level: string
          description?: string | null
          devotion_content: string
          id?: string
          scripture_reference?: string | null
          theme: string
          user_id: string
          writing_style: string
        }
        Update: {
          created_at?: string
          depth_level?: string
          description?: string | null
          devotion_content?: string
          id?: string
          scripture_reference?: string | null
          theme?: string
          user_id?: string
          writing_style?: string
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      reading_sequences: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          play_count: number | null
          room_tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          play_count?: number | null
          room_tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          play_count?: number | null
          room_tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_read_date: string | null
          longest_streak: number
          total_chapters_read: number
          total_verses_read: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_read_date?: string | null
          longest_streak?: number
          total_chapters_read?: number
          total_verses_read?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_read_date?: string | null
          longest_streak?: number
          total_chapters_read?: number
          total_verses_read?: number
          updated_at?: string
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
      room_content_updates: {
        Row: {
          created_at: string
          floor_number: number
          id: string
          room_id: string
          update_description: string | null
        }
        Insert: {
          created_at?: string
          floor_number: number
          id?: string
          room_id: string
          update_description?: string | null
        }
        Update: {
          created_at?: string
          floor_number?: number
          id?: string
          room_id?: string
          update_description?: string | null
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
      sanctuary_journey_escalations: {
        Row: {
          ai_detected_reason: string | null
          assigned_to: string | null
          created_at: string | null
          escalation_type: string
          id: string
          progress_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          session_id: string | null
          status: string | null
          user_message: string | null
        }
        Insert: {
          ai_detected_reason?: string | null
          assigned_to?: string | null
          created_at?: string | null
          escalation_type: string
          id?: string
          progress_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          session_id?: string | null
          status?: string | null
          user_message?: string | null
        }
        Update: {
          ai_detected_reason?: string | null
          assigned_to?: string | null
          created_at?: string | null
          escalation_type?: string
          id?: string
          progress_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          session_id?: string | null
          status?: string | null
          user_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sanctuary_journey_escalations_progress_id_fkey"
            columns: ["progress_id"]
            isOneToOne: false
            referencedRelation: "sanctuary_journey_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctuary_journey_escalations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sanctuary_journey_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sanctuary_journey_progress: {
        Row: {
          completed_at: string | null
          current_session: number | null
          id: string
          journey_mode: string | null
          series_id: string | null
          small_group_id: string | null
          sponsor_user_id: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_session?: number | null
          id?: string
          journey_mode?: string | null
          series_id?: string | null
          small_group_id?: string | null
          sponsor_user_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_session?: number | null
          id?: string
          journey_mode?: string | null
          series_id?: string | null
          small_group_id?: string | null
          sponsor_user_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sanctuary_journey_progress_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "sanctuary_journey_series"
            referencedColumns: ["id"]
          },
        ]
      }
      sanctuary_journey_series: {
        Row: {
          church_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
          total_sessions: number | null
          updated_at: string | null
        }
        Insert: {
          church_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          total_sessions?: number | null
          updated_at?: string | null
        }
        Update: {
          church_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          total_sessions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sanctuary_journey_series_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctuary_journey_series_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      sanctuary_journey_session_completions: {
        Row: {
          ai_conversation_history: Json | null
          completed_at: string | null
          id: string
          progress_id: string | null
          reflection_response: string | null
          session_id: string | null
          time_spent_seconds: number | null
        }
        Insert: {
          ai_conversation_history?: Json | null
          completed_at?: string | null
          id?: string
          progress_id?: string | null
          reflection_response?: string | null
          session_id?: string | null
          time_spent_seconds?: number | null
        }
        Update: {
          ai_conversation_history?: Json | null
          completed_at?: string | null
          id?: string
          progress_id?: string | null
          reflection_response?: string | null
          session_id?: string | null
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sanctuary_journey_session_completions_progress_id_fkey"
            columns: ["progress_id"]
            isOneToOne: false
            referencedRelation: "sanctuary_journey_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sanctuary_journey_session_completions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sanctuary_journey_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sanctuary_journey_sessions: {
        Row: {
          checkpoint_options: Json | null
          core_truth: string
          created_at: string | null
          guided_insight: string
          id: string
          is_checkpoint: boolean | null
          phase: string
          prayer_prompt: string
          primary_scriptures: string[]
          reflection_question: string
          sanctuary_frame: string
          series_id: string | null
          session_number: number
          title: string
        }
        Insert: {
          checkpoint_options?: Json | null
          core_truth: string
          created_at?: string | null
          guided_insight: string
          id?: string
          is_checkpoint?: boolean | null
          phase: string
          prayer_prompt: string
          primary_scriptures: string[]
          reflection_question: string
          sanctuary_frame: string
          series_id?: string | null
          session_number: number
          title: string
        }
        Update: {
          checkpoint_options?: Json | null
          core_truth?: string
          created_at?: string | null
          guided_insight?: string
          id?: string
          is_checkpoint?: boolean | null
          phase?: string
          prayer_prompt?: string
          primary_scriptures?: string[]
          reflection_question?: string
          sanctuary_frame?: string
          series_id?: string | null
          session_number?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sanctuary_journey_sessions_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "sanctuary_journey_series"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_daily_verses: {
        Row: {
          id: string
          saved_at: string
          user_id: string
          verse_id: string
        }
        Insert: {
          id?: string
          saved_at?: string
          user_id: string
          verse_id: string
        }
        Update: {
          id?: string
          saved_at?: string
          user_id?: string
          verse_id?: string
        }
        Relationships: []
      }
      saved_powerpoints: {
        Row: {
          content_type: string
          created_at: string
          id: string
          sermon_id: string | null
          settings: Json | null
          slide_data: Json | null
          theme_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type?: string
          created_at?: string
          id?: string
          sermon_id?: string | null
          settings?: Json | null
          slide_data?: Json | null
          theme_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string
          created_at?: string
          id?: string
          sermon_id?: string | null
          settings?: Json | null
          slide_data?: Json | null
          theme_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_game_rsvps: {
        Row: {
          created_at: string
          id: string
          scheduled_game_id: string
          status: string
          updated_at: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          scheduled_game_id: string
          status?: string
          updated_at?: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          scheduled_game_id?: string
          status?: string
          updated_at?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_game_rsvps_scheduled_game_id_fkey"
            columns: ["scheduled_game_id"]
            isOneToOne: false
            referencedRelation: "scheduled_games"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_games: {
        Row: {
          actual_game_id: string | null
          created_at: string
          description: string | null
          game_mode: string
          game_options: Json | null
          game_type: string
          host_name: string
          host_user_id: string
          id: string
          max_players: number
          room_code: string | null
          scheduled_at: string
          status: string
          title: string | null
          verse_reference: string | null
        }
        Insert: {
          actual_game_id?: string | null
          created_at?: string
          description?: string | null
          game_mode?: string
          game_options?: Json | null
          game_type?: string
          host_name: string
          host_user_id: string
          id?: string
          max_players?: number
          room_code?: string | null
          scheduled_at: string
          status?: string
          title?: string | null
          verse_reference?: string | null
        }
        Update: {
          actual_game_id?: string | null
          created_at?: string
          description?: string | null
          game_mode?: string
          game_options?: Json | null
          game_type?: string
          host_name?: string
          host_user_id?: string
          id?: string
          max_players?: number
          room_code?: string | null
          scheduled_at?: string
          status?: string
          title?: string | null
          verse_reference?: string | null
        }
        Relationships: []
      }
      sequence_items: {
        Row: {
          book: string
          chapter: number
          commentary_depth: string | null
          commentary_mode: string | null
          commentary_voice: string | null
          created_at: string
          end_verse: number | null
          id: string
          include_jeeves_commentary: boolean | null
          item_order: number
          playback_speed: number | null
          sequence_id: string
          sequence_number: number
          start_verse: number | null
          voice: string | null
        }
        Insert: {
          book: string
          chapter: number
          commentary_depth?: string | null
          commentary_mode?: string | null
          commentary_voice?: string | null
          created_at?: string
          end_verse?: number | null
          id?: string
          include_jeeves_commentary?: boolean | null
          item_order?: number
          playback_speed?: number | null
          sequence_id: string
          sequence_number?: number
          start_verse?: number | null
          voice?: string | null
        }
        Update: {
          book?: string
          chapter?: number
          commentary_depth?: string | null
          commentary_mode?: string | null
          commentary_voice?: string | null
          created_at?: string
          end_verse?: number | null
          id?: string
          include_jeeves_commentary?: boolean | null
          item_order?: number
          playback_speed?: number | null
          sequence_id?: string
          sequence_number?: number
          start_verse?: number | null
          voice?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sequence_items_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "reading_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_amplified_studies: {
        Row: {
          action_challenge: string | null
          application_section: Json | null
          biblical_foundation: Json | null
          christ_synthesis: string | null
          church_id: string
          created_at: string
          created_by: string
          discussion_questions: string[] | null
          id: string
          key_passages: string[] | null
          opening_section: Json | null
          prayer_focus: string | null
          preacher: string | null
          sermon_date: string | null
          sermon_id: string | null
          sermon_outline: string
          sermon_title: string
          share_token: string | null
          status: string
          study_content: Json
          study_title: string
          theological_analysis: Json | null
          updated_at: string
          week_end: string | null
          week_start: string | null
        }
        Insert: {
          action_challenge?: string | null
          application_section?: Json | null
          biblical_foundation?: Json | null
          christ_synthesis?: string | null
          church_id: string
          created_at?: string
          created_by: string
          discussion_questions?: string[] | null
          id?: string
          key_passages?: string[] | null
          opening_section?: Json | null
          prayer_focus?: string | null
          preacher?: string | null
          sermon_date?: string | null
          sermon_id?: string | null
          sermon_outline: string
          sermon_title: string
          share_token?: string | null
          status?: string
          study_content?: Json
          study_title: string
          theological_analysis?: Json | null
          updated_at?: string
          week_end?: string | null
          week_start?: string | null
        }
        Update: {
          action_challenge?: string | null
          application_section?: Json | null
          biblical_foundation?: Json | null
          christ_synthesis?: string | null
          church_id?: string
          created_at?: string
          created_by?: string
          discussion_questions?: string[] | null
          id?: string
          key_passages?: string[] | null
          opening_section?: Json | null
          prayer_focus?: string | null
          preacher?: string | null
          sermon_date?: string | null
          sermon_id?: string | null
          sermon_outline?: string
          sermon_title?: string
          share_token?: string | null
          status?: string
          study_content?: Json
          study_title?: string
          theological_analysis?: Json | null
          updated_at?: string
          week_end?: string | null
          week_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sermon_amplified_studies_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermon_amplified_studies_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermon_amplified_studies_sermon_id_fkey"
            columns: ["sermon_id"]
            isOneToOne: false
            referencedRelation: "church_sermons"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_discipleship_packets: {
        Row: {
          church_id: string
          claim_ladder: Json | null
          controversy_question: string | null
          created_at: string
          created_by: string
          debate_prep: Json | null
          discussion_questions: string[] | null
          evangelism_script: string | null
          executive_summary: string | null
          house_fire_guide: Json | null
          id: string
          key_verses: string[] | null
          micro_study_plan: Json | null
          obedience_challenge: string | null
          prayer_focus: string | null
          preacher: string | null
          prophetic_map: Json | null
          sermon_amplified_study_id: string | null
          sermon_date: string | null
          sermon_title: string
          shareable_quote: string | null
          status: string
          theological_map: Json | null
          updated_at: string
        }
        Insert: {
          church_id: string
          claim_ladder?: Json | null
          controversy_question?: string | null
          created_at?: string
          created_by: string
          debate_prep?: Json | null
          discussion_questions?: string[] | null
          evangelism_script?: string | null
          executive_summary?: string | null
          house_fire_guide?: Json | null
          id?: string
          key_verses?: string[] | null
          micro_study_plan?: Json | null
          obedience_challenge?: string | null
          prayer_focus?: string | null
          preacher?: string | null
          prophetic_map?: Json | null
          sermon_amplified_study_id?: string | null
          sermon_date?: string | null
          sermon_title: string
          shareable_quote?: string | null
          status?: string
          theological_map?: Json | null
          updated_at?: string
        }
        Update: {
          church_id?: string
          claim_ladder?: Json | null
          controversy_question?: string | null
          created_at?: string
          created_by?: string
          debate_prep?: Json | null
          discussion_questions?: string[] | null
          evangelism_script?: string | null
          executive_summary?: string | null
          house_fire_guide?: Json | null
          id?: string
          key_verses?: string[] | null
          micro_study_plan?: Json | null
          obedience_challenge?: string | null
          prayer_focus?: string | null
          preacher?: string | null
          prophetic_map?: Json | null
          sermon_amplified_study_id?: string | null
          sermon_date?: string | null
          sermon_title?: string
          shareable_quote?: string | null
          status?: string
          theological_map?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_discipleship_packets_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermon_discipleship_packets_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermon_discipleship_packets_sermon_amplified_study_id_fkey"
            columns: ["sermon_amplified_study_id"]
            isOneToOne: false
            referencedRelation: "sermon_amplified_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_ideas: {
        Row: {
          analysis_result: Json | null
          context: string | null
          created_at: string
          id: string
          idea: string | null
          is_favorite: boolean | null
          jeeves_research: string | null
          key_points: string | null
          notes: string | null
          scripture: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          context?: string | null
          created_at?: string
          id?: string
          idea?: string | null
          is_favorite?: boolean | null
          jeeves_research?: string | null
          key_points?: string | null
          notes?: string | null
          scripture?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          context?: string | null
          created_at?: string
          id?: string
          idea?: string | null
          is_favorite?: boolean | null
          jeeves_research?: string | null
          key_points?: string | null
          notes?: string | null
          scripture?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sermon_micro_study_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          day_number: number
          evangelistic_question: string | null
          id: string
          one_sentence_compression: string | null
          packet_id: string
          strongest_argument: string | null
          summary_response: string | null
          user_id: string
          weakest_argument: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          day_number: number
          evangelistic_question?: string | null
          id?: string
          one_sentence_compression?: string | null
          packet_id: string
          strongest_argument?: string | null
          summary_response?: string | null
          user_id: string
          weakest_argument?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          day_number?: number
          evangelistic_question?: string | null
          id?: string
          one_sentence_compression?: string | null
          packet_id?: string
          strongest_argument?: string | null
          summary_response?: string | null
          user_id?: string
          weakest_argument?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sermon_micro_study_progress_packet_id_fkey"
            columns: ["packet_id"]
            isOneToOne: false
            referencedRelation: "sermon_discipleship_packets"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_palace_analyses: {
        Row: {
          analysis_mode: string
          analysis_result: Json | null
          created_at: string
          id: string
          packet_id: string
          selected_floor: number | null
          selected_rooms: string[] | null
          sermon_text: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_mode: string
          analysis_result?: Json | null
          created_at?: string
          id?: string
          packet_id: string
          selected_floor?: number | null
          selected_rooms?: string[] | null
          sermon_text?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_mode?: string
          analysis_result?: Json | null
          created_at?: string
          id?: string
          packet_id?: string
          selected_floor?: number | null
          selected_rooms?: string[] | null
          sermon_text?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_palace_analyses_packet_id_fkey"
            columns: ["packet_id"]
            isOneToOne: false
            referencedRelation: "sermon_discipleship_packets"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_simmer_sessions: {
        Row: {
          artifact_hashes: string[] | null
          artifacts: Json | null
          callout_quotes: string[] | null
          christ_connections: Json | null
          closing_movement: string | null
          core_claim: string | null
          created_at: string
          current_day: number
          current_lane: string | null
          day_1_completed_at: string | null
          day_2_completed_at: string | null
          day_3_completed_at: string | null
          day_4_completed_at: string | null
          day_5_completed_at: string | null
          day_6_completed_at: string | null
          emotional_arc: string | null
          final_outline: Json | null
          final_quote_list: string[] | null
          final_slide_headers: string[] | null
          gems: Json | null
          human_approved_artifacts: string[] | null
          id: string
          is_paused: boolean | null
          lane_schedule: Json | null
          locked_thesis: boolean | null
          parking_artifacts: Json | null
          pass_count: number | null
          pass_history: Json | null
          pressure_verses: string[] | null
          project_summary: string | null
          provisional_outline: Json | null
          redundant_gems: string[] | null
          rewritten_weak_connections: Json | null
          simmer_duration: string | null
          simmer_mode: string | null
          slide_headlines: string[] | null
          slide_images: Json | null
          status: string
          structure: Json | null
          target_density: string | null
          target_purpose: string | null
          target_style: string | null
          theme: string
          theme_passage: string | null
          title: string | null
          updated_at: string
          user_id: string
          validation_errors: Json | null
          visual_metaphors: string[] | null
          weak_transitions: string[] | null
          white_space_guidance: string | null
        }
        Insert: {
          artifact_hashes?: string[] | null
          artifacts?: Json | null
          callout_quotes?: string[] | null
          christ_connections?: Json | null
          closing_movement?: string | null
          core_claim?: string | null
          created_at?: string
          current_day?: number
          current_lane?: string | null
          day_1_completed_at?: string | null
          day_2_completed_at?: string | null
          day_3_completed_at?: string | null
          day_4_completed_at?: string | null
          day_5_completed_at?: string | null
          day_6_completed_at?: string | null
          emotional_arc?: string | null
          final_outline?: Json | null
          final_quote_list?: string[] | null
          final_slide_headers?: string[] | null
          gems?: Json | null
          human_approved_artifacts?: string[] | null
          id?: string
          is_paused?: boolean | null
          lane_schedule?: Json | null
          locked_thesis?: boolean | null
          parking_artifacts?: Json | null
          pass_count?: number | null
          pass_history?: Json | null
          pressure_verses?: string[] | null
          project_summary?: string | null
          provisional_outline?: Json | null
          redundant_gems?: string[] | null
          rewritten_weak_connections?: Json | null
          simmer_duration?: string | null
          simmer_mode?: string | null
          slide_headlines?: string[] | null
          slide_images?: Json | null
          status?: string
          structure?: Json | null
          target_density?: string | null
          target_purpose?: string | null
          target_style?: string | null
          theme: string
          theme_passage?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          validation_errors?: Json | null
          visual_metaphors?: string[] | null
          weak_transitions?: string[] | null
          white_space_guidance?: string | null
        }
        Update: {
          artifact_hashes?: string[] | null
          artifacts?: Json | null
          callout_quotes?: string[] | null
          christ_connections?: Json | null
          closing_movement?: string | null
          core_claim?: string | null
          created_at?: string
          current_day?: number
          current_lane?: string | null
          day_1_completed_at?: string | null
          day_2_completed_at?: string | null
          day_3_completed_at?: string | null
          day_4_completed_at?: string | null
          day_5_completed_at?: string | null
          day_6_completed_at?: string | null
          emotional_arc?: string | null
          final_outline?: Json | null
          final_quote_list?: string[] | null
          final_slide_headers?: string[] | null
          gems?: Json | null
          human_approved_artifacts?: string[] | null
          id?: string
          is_paused?: boolean | null
          lane_schedule?: Json | null
          locked_thesis?: boolean | null
          parking_artifacts?: Json | null
          pass_count?: number | null
          pass_history?: Json | null
          pressure_verses?: string[] | null
          project_summary?: string | null
          provisional_outline?: Json | null
          redundant_gems?: string[] | null
          rewritten_weak_connections?: Json | null
          simmer_duration?: string | null
          simmer_mode?: string | null
          slide_headlines?: string[] | null
          slide_images?: Json | null
          status?: string
          structure?: Json | null
          target_density?: string | null
          target_purpose?: string | null
          target_style?: string | null
          theme?: string
          theme_passage?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          validation_errors?: Json | null
          visual_metaphors?: string[] | null
          weak_transitions?: string[] | null
          white_space_guidance?: string | null
        }
        Relationships: []
      }
      sermon_starters: {
        Row: {
          created_at: string | null
          floors: Json | null
          id: string
          level: string
          quality_status: string | null
          room_refs: string[] | null
          starter_title: string
          topic_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          floors?: Json | null
          id?: string
          level: string
          quality_status?: string | null
          room_refs?: string[] | null
          starter_title: string
          topic_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          floors?: Json | null
          id?: string
          level?: string
          quality_status?: string | null
          room_refs?: string[] | null
          starter_title?: string
          topic_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sermon_starters_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "sermon_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_study_cards: {
        Row: {
          card_type: string
          created_at: string
          cross_references: string[] | null
          display_order: number
          floor_number: number | null
          id: string
          pt_rooms: string[] | null
          reflection_question: string | null
          sanctuary_connection: string | null
          sermon_point: string
          session_id: string
          timestamp_seconds: number | null
        }
        Insert: {
          card_type: string
          created_at?: string
          cross_references?: string[] | null
          display_order?: number
          floor_number?: number | null
          id?: string
          pt_rooms?: string[] | null
          reflection_question?: string | null
          sanctuary_connection?: string | null
          sermon_point: string
          session_id: string
          timestamp_seconds?: number | null
        }
        Update: {
          card_type?: string
          created_at?: string
          cross_references?: string[] | null
          display_order?: number
          floor_number?: number | null
          id?: string
          pt_rooms?: string[] | null
          reflection_question?: string | null
          sanctuary_connection?: string | null
          sermon_point?: string
          session_id?: string
          timestamp_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sermon_study_cards_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sermon_sessions"
            referencedColumns: ["id"]
          },
        ]
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
      sermon_topics: {
        Row: {
          anchor_scriptures: string[] | null
          category: string | null
          created_at: string | null
          id: string
          is_featured: boolean | null
          slug: string
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          anchor_scriptures?: string[] | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          slug: string
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          anchor_scriptures?: string[] | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          slug?: string
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sermon_writer_polish_snapshots: {
        Row: {
          ai_explanation: string | null
          applied_at: string | null
          content_after: string | null
          content_before: string
          created_at: string
          diff_summary: string | null
          id: string
          outline_after: Json | null
          outline_before: Json
          polish_mode: string
          rolled_back_at: string | null
          session_id: string
          status: string
          target_id: string | null
          target_type: string | null
          user_id: string
          validation: Json
          version_id: string | null
        }
        Insert: {
          ai_explanation?: string | null
          applied_at?: string | null
          content_after?: string | null
          content_before: string
          created_at?: string
          diff_summary?: string | null
          id?: string
          outline_after?: Json | null
          outline_before: Json
          polish_mode: string
          rolled_back_at?: string | null
          session_id: string
          status?: string
          target_id?: string | null
          target_type?: string | null
          user_id: string
          validation?: Json
          version_id?: string | null
        }
        Update: {
          ai_explanation?: string | null
          applied_at?: string | null
          content_after?: string | null
          content_before?: string
          created_at?: string
          diff_summary?: string | null
          id?: string
          outline_after?: Json | null
          outline_before?: Json
          polish_mode?: string
          rolled_back_at?: string | null
          session_id?: string
          status?: string
          target_id?: string | null
          target_type?: string | null
          user_id?: string
          validation?: Json
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sermon_writer_polish_snapshots_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sermon_writer_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermon_writer_polish_snapshots_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "sermon_writer_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_writer_sessions: {
        Row: {
          content: string | null
          created_at: string
          current_version_id: string | null
          id: string
          last_jeeves_mode: string | null
          outline_data: Json
          outline_template: string
          status: string
          theme: string
          theme_passage: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          current_version_id?: string | null
          id?: string
          last_jeeves_mode?: string | null
          outline_data?: Json
          outline_template?: string
          status?: string
          theme: string
          theme_passage?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          current_version_id?: string | null
          id?: string
          last_jeeves_mode?: string | null
          outline_data?: Json
          outline_template?: string
          status?: string
          theme?: string
          theme_passage?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_current_version"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "sermon_writer_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_writer_sparks: {
        Row: {
          claim_ladder: Json | null
          confidence: number | null
          counterpoints: Json | null
          created_at: string
          dismissed_at: string | null
          evidence: Json | null
          id: string
          inserted_at: string | null
          kind: string
          novelty_score: number | null
          outline_node_id: string | null
          pt_mapping: Json | null
          saved_at: string | null
          session_id: string
          source: string
          spark_type: string
          status: string
          summary: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          claim_ladder?: Json | null
          confidence?: number | null
          counterpoints?: Json | null
          created_at?: string
          dismissed_at?: string | null
          evidence?: Json | null
          id?: string
          inserted_at?: string | null
          kind?: string
          novelty_score?: number | null
          outline_node_id?: string | null
          pt_mapping?: Json | null
          saved_at?: string | null
          session_id: string
          source?: string
          spark_type?: string
          status?: string
          summary: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          claim_ladder?: Json | null
          confidence?: number | null
          counterpoints?: Json | null
          created_at?: string
          dismissed_at?: string | null
          evidence?: Json | null
          id?: string
          inserted_at?: string | null
          kind?: string
          novelty_score?: number | null
          outline_node_id?: string | null
          pt_mapping?: Json | null
          saved_at?: string | null
          session_id?: string
          source?: string
          spark_type?: string
          status?: string
          summary?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_writer_sparks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sermon_writer_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_writer_versions: {
        Row: {
          change_description: string | null
          change_type: string
          changed_by: string | null
          content_snapshot: string | null
          created_at: string
          id: string
          outline_snapshot: Json
          parent_version_id: string | null
          session_id: string
          sparks_snapshot: Json
          user_id: string
          version_name: string | null
          version_number: number
        }
        Insert: {
          change_description?: string | null
          change_type: string
          changed_by?: string | null
          content_snapshot?: string | null
          created_at?: string
          id?: string
          outline_snapshot: Json
          parent_version_id?: string | null
          session_id: string
          sparks_snapshot?: Json
          user_id: string
          version_name?: string | null
          version_number: number
        }
        Update: {
          change_description?: string | null
          change_type?: string
          changed_by?: string | null
          content_snapshot?: string | null
          created_at?: string
          id?: string
          outline_snapshot?: Json
          parent_version_id?: string | null
          session_id?: string
          sparks_snapshot?: Json
          user_id?: string
          version_name?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "sermon_writer_versions_parent_version_id_fkey"
            columns: ["parent_version_id"]
            isOneToOne: false
            referencedRelation: "sermon_writer_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermon_writer_versions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sermon_writer_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sermons: {
        Row: {
          bridges: Json | null
          created_at: string
          current_step: number
          full_sermon: string | null
          id: string
          movie_structure: Json | null
          polish_analysis: Json | null
          sermon_style: string
          smooth_stones: Json | null
          status: string
          theme_passage: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bridges?: Json | null
          created_at?: string
          current_step?: number
          full_sermon?: string | null
          id?: string
          movie_structure?: Json | null
          polish_analysis?: Json | null
          sermon_style: string
          smooth_stones?: Json | null
          status?: string
          theme_passage?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bridges?: Json | null
          created_at?: string
          current_step?: number
          full_sermon?: string | null
          id?: string
          movie_structure?: Json | null
          polish_analysis?: Json | null
          sermon_style?: string
          smooth_stones?: Json | null
          status?: string
          theme_passage?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_jeeves_interactions: {
        Row: {
          analysis_type: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          prompt: string
          response: string
          session_id: string
        }
        Insert: {
          analysis_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          prompt: string
          response: string
          session_id: string
        }
        Update: {
          analysis_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          prompt?: string
          response?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_jeeves_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          note_type: string | null
          related_room: string | null
          related_verse: string | null
          session_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          note_type?: string | null
          related_room?: string | null
          related_verse?: string | null
          session_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          note_type?: string | null
          related_room?: string | null
          related_verse?: string | null
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_pt_interactions: {
        Row: {
          created_at: string | null
          floor_number: number | null
          id: string
          interaction_data: Json | null
          interaction_type: string
          principle_code: string | null
          room_code: string | null
          session_id: string
        }
        Insert: {
          created_at?: string | null
          floor_number?: number | null
          id?: string
          interaction_data?: Json | null
          interaction_type: string
          principle_code?: string | null
          room_code?: string | null
          session_id: string
        }
        Update: {
          created_at?: string | null
          floor_number?: number | null
          id?: string
          interaction_data?: Json | null
          interaction_type?: string
          principle_code?: string | null
          room_code?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_pt_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_tabs: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          session_id: string
          tab_order: number | null
          tab_state: Json | null
          tab_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          session_id: string
          tab_order?: number | null
          tab_state?: Json | null
          tab_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          session_id?: string
          tab_order?: number | null
          tab_state?: Json | null
          tab_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_tabs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_verses: {
        Row: {
          accessed_at: string | null
          book: string
          chapter: number
          cross_references: string[] | null
          highlights: Json | null
          id: string
          notes: string | null
          session_id: string
          verse_end: number | null
          verse_start: number | null
        }
        Insert: {
          accessed_at?: string | null
          book: string
          chapter: number
          cross_references?: string[] | null
          highlights?: Json | null
          id?: string
          notes?: string | null
          session_id: string
          verse_end?: number | null
          verse_start?: number | null
        }
        Update: {
          accessed_at?: string | null
          book?: string
          chapter?: number
          cross_references?: string[] | null
          highlights?: Json | null
          id?: string
          notes?: string | null
          session_id?: string
          verse_end?: number | null
          verse_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_verses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      six_week_cycles: {
        Row: {
          church_id: string | null
          created_at: string
          created_by: string | null
          cycle_type: string
          description: string | null
          goal: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_template: boolean | null
          pt_rooms: string[] | null
          sanctuary_focus: string | null
          sequence_number: number | null
          theme: string | null
          title: string
          updated_at: string
          week_content: Json | null
        }
        Insert: {
          church_id?: string | null
          created_at?: string
          created_by?: string | null
          cycle_type: string
          description?: string | null
          goal?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          pt_rooms?: string[] | null
          sanctuary_focus?: string | null
          sequence_number?: number | null
          theme?: string | null
          title: string
          updated_at?: string
          week_content?: Json | null
        }
        Update: {
          church_id?: string | null
          created_at?: string
          created_by?: string | null
          cycle_type?: string
          description?: string | null
          goal?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          pt_rooms?: string[] | null
          sanctuary_focus?: string | null
          sequence_number?: number | null
          theme?: string | null
          title?: string
          updated_at?: string
          week_content?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "six_week_cycles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "six_week_cycles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      small_group_members: {
        Row: {
          group_id: string
          id: string
          is_active: boolean
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "small_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "small_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      small_group_studies: {
        Row: {
          action_challenge: string | null
          christ_synthesis: string | null
          church_id: string
          created_at: string | null
          created_by: string
          description: string | null
          discussion_questions: string[] | null
          group_id: string
          id: string
          key_passages: string[] | null
          scheduled_for: string | null
          status: string | null
          study_content: Json | null
          title: string
          updated_at: string | null
          week_number: number | null
        }
        Insert: {
          action_challenge?: string | null
          christ_synthesis?: string | null
          church_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          discussion_questions?: string[] | null
          group_id: string
          id?: string
          key_passages?: string[] | null
          scheduled_for?: string | null
          status?: string | null
          study_content?: Json | null
          title: string
          updated_at?: string | null
          week_number?: number | null
        }
        Update: {
          action_challenge?: string | null
          christ_synthesis?: string | null
          church_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          discussion_questions?: string[] | null
          group_id?: string
          id?: string
          key_passages?: string[] | null
          scheduled_for?: string | null
          status?: string | null
          study_content?: Json | null
          title?: string
          updated_at?: string | null
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "small_group_studies_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "small_group_studies_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "small_group_studies_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "small_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      small_groups: {
        Row: {
          church_id: string
          created_at: string
          current_cycle: string | null
          description: string | null
          id: string
          is_active: boolean
          is_open: boolean
          leader_id: string
          location: string | null
          max_members: number
          meeting_day: string | null
          meeting_time: string | null
          meeting_type: string
          name: string
          updated_at: string
        }
        Insert: {
          church_id: string
          created_at?: string
          current_cycle?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_open?: boolean
          leader_id: string
          location?: string | null
          max_members?: number
          meeting_day?: string | null
          meeting_time?: string | null
          meeting_type?: string
          name: string
          updated_at?: string
        }
        Update: {
          church_id?: string
          created_at?: string
          current_cycle?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_open?: boolean
          leader_id?: string
          location?: string | null
          max_members?: number
          meeting_day?: string | null
          meeting_time?: string | null
          meeting_type?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "small_groups_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "small_groups_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_devotional_recipients: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_delivery_status: string | null
          last_sms_sent_at: string | null
          name: string
          opt_out_reason: string | null
          opted_out_at: string | null
          phone_country_code: string
          phone_number: string
          plan_id: string | null
          preferred_send_hour: number
          timezone: string
          total_sms_sent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_delivery_status?: string | null
          last_sms_sent_at?: string | null
          name: string
          opt_out_reason?: string | null
          opted_out_at?: string | null
          phone_country_code?: string
          phone_number: string
          plan_id?: string | null
          preferred_send_hour?: number
          timezone?: string
          total_sms_sent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_delivery_status?: string | null
          last_sms_sent_at?: string | null
          name?: string
          opt_out_reason?: string | null
          opted_out_at?: string | null
          phone_country_code?: string
          phone_number?: string
          plan_id?: string | null
          preferred_send_hour?: number
          timezone?: string
          total_sms_sent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_devotional_recipients_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "devotional_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_notification_preferences: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean
          last_sent_at: string | null
          phone_number: string | null
          preferred_time: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_sent_at?: string | null
          phone_number?: string | null
          preferred_time?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean
          last_sent_at?: string | null
          phone_number?: string | null
          preferred_time?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sms_send_log: {
        Row: {
          created_at: string
          day_number: number | null
          delivered_at: string | null
          error_code: string | null
          error_message: string | null
          id: string
          message_body: string | null
          message_type: string
          phone_number: string
          plan_id: string | null
          price: number | null
          recipient_id: string | null
          recipient_type: string
          segments: number
          sent_at: string
          status: string | null
          twilio_sid: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          day_number?: number | null
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          message_body?: string | null
          message_type?: string
          phone_number: string
          plan_id?: string | null
          price?: number | null
          recipient_id?: string | null
          recipient_type?: string
          segments?: number
          sent_at?: string
          status?: string | null
          twilio_sid?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          day_number?: number | null
          delivered_at?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          message_body?: string | null
          message_type?: string
          phone_number?: string
          plan_id?: string | null
          price?: number | null
          recipient_id?: string | null
          recipient_type?: string
          segments?: number
          sent_at?: string
          status?: string | null
          twilio_sid?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_send_log_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "devotional_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_connections: {
        Row: {
          access_token_encrypted: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          platform: string
          platform_user_id: string | null
          platform_username: string | null
          refresh_token_encrypted: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          platform_user_id?: string | null
          platform_username?: string | null
          refresh_token_encrypted?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          platform_user_id?: string | null
          platform_username?: string | null
          refresh_token_encrypted?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      source_excerpts: {
        Row: {
          added_by: string | null
          created_at: string
          excerpt: string
          id: string
          location: string | null
          rights_checked: boolean | null
          source_id: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          excerpt: string
          id?: string
          location?: string | null
          rights_checked?: boolean | null
          source_id: string
        }
        Update: {
          added_by?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          location?: string | null
          rights_checked?: boolean | null
          source_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_excerpts_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          accessed_at: string | null
          author: string | null
          bible_translation: string | null
          created_at: string
          credibility: Database["public"]["Enums"]["credibility_tier"] | null
          id: string
          keywords: string[] | null
          library_id: string | null
          max_excerpt_chars: number | null
          publication_year: number | null
          publisher: string | null
          quote_text: string | null
          rights: Database["public"]["Enums"]["rights_flag"] | null
          scripture_ref: string | null
          scripture_text: string | null
          sop_ref: string | null
          sop_work: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          stance: Database["public"]["Enums"]["source_stance"] | null
          summary: string | null
          title: string
          updated_at: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          accessed_at?: string | null
          author?: string | null
          bible_translation?: string | null
          created_at?: string
          credibility?: Database["public"]["Enums"]["credibility_tier"] | null
          id?: string
          keywords?: string[] | null
          library_id?: string | null
          max_excerpt_chars?: number | null
          publication_year?: number | null
          publisher?: string | null
          quote_text?: string | null
          rights?: Database["public"]["Enums"]["rights_flag"] | null
          scripture_ref?: string | null
          scripture_text?: string | null
          sop_ref?: string | null
          sop_work?: string | null
          source_type: Database["public"]["Enums"]["source_type"]
          stance?: Database["public"]["Enums"]["source_stance"] | null
          summary?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          accessed_at?: string | null
          author?: string | null
          bible_translation?: string | null
          created_at?: string
          credibility?: Database["public"]["Enums"]["credibility_tier"] | null
          id?: string
          keywords?: string[] | null
          library_id?: string | null
          max_excerpt_chars?: number | null
          publication_year?: number | null
          publisher?: string | null
          quote_text?: string | null
          rights?: Database["public"]["Enums"]["rights_flag"] | null
          scripture_ref?: string | null
          scripture_text?: string | null
          sop_ref?: string | null
          sop_work?: string | null
          source_type?: Database["public"]["Enums"]["source_type"]
          stance?: Database["public"]["Enums"]["source_stance"] | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
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
      spark_claim_ladders: {
        Row: {
          claim_ladder_id: string
          created_at: string
          id: string
          relationship:
            | Database["public"]["Enums"]["spark_ladder_relationship"]
            | null
          spark_id: string
        }
        Insert: {
          claim_ladder_id: string
          created_at?: string
          id?: string
          relationship?:
            | Database["public"]["Enums"]["spark_ladder_relationship"]
            | null
          spark_id: string
        }
        Update: {
          claim_ladder_id?: string
          created_at?: string
          id?: string
          relationship?:
            | Database["public"]["Enums"]["spark_ladder_relationship"]
            | null
          spark_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spark_claim_ladders_claim_ladder_id_fkey"
            columns: ["claim_ladder_id"]
            isOneToOne: false
            referencedRelation: "claim_ladders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spark_claim_ladders_spark_id_fkey"
            columns: ["spark_id"]
            isOneToOne: false
            referencedRelation: "sparks"
            referencedColumns: ["id"]
          },
        ]
      }
      spark_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          spark_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          spark_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          spark_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spark_events_spark_id_fkey"
            columns: ["spark_id"]
            isOneToOne: false
            referencedRelation: "sparks"
            referencedColumns: ["id"]
          },
        ]
      }
      spark_preferences: {
        Row: {
          auto_open: boolean
          created_at: string
          id: string
          intensity: string
          mode: string
          only_after_save: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_open?: boolean
          created_at?: string
          id?: string
          intensity?: string
          mode?: string
          only_after_save?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_open?: boolean
          created_at?: string
          id?: string
          intensity?: string
          mode?: string
          only_after_save?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      spark_rooms: {
        Row: {
          cognitive_move: string | null
          created_at: string
          id: string
          room_code: string
          spark_id: string
          suggested_next_step: string | null
          trigger_reason: string | null
        }
        Insert: {
          cognitive_move?: string | null
          created_at?: string
          id?: string
          room_code: string
          spark_id: string
          suggested_next_step?: string | null
          trigger_reason?: string | null
        }
        Update: {
          cognitive_move?: string | null
          created_at?: string
          id?: string
          room_code?: string
          spark_id?: string
          suggested_next_step?: string | null
          trigger_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spark_rooms_spark_id_fkey"
            columns: ["spark_id"]
            isOneToOne: false
            referencedRelation: "sparks"
            referencedColumns: ["id"]
          },
        ]
      }
      spark_sources: {
        Row: {
          created_at: string
          excerpt: string | null
          id: string
          notes: string | null
          relevance: number | null
          role: Database["public"]["Enums"]["source_role"] | null
          source_id: string
          spark_id: string
        }
        Insert: {
          created_at?: string
          excerpt?: string | null
          id?: string
          notes?: string | null
          relevance?: number | null
          role?: Database["public"]["Enums"]["source_role"] | null
          source_id: string
          spark_id: string
        }
        Update: {
          created_at?: string
          excerpt?: string | null
          id?: string
          notes?: string | null
          relevance?: number | null
          role?: Database["public"]["Enums"]["source_role"] | null
          source_id?: string
          spark_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spark_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spark_sources_spark_id_fkey"
            columns: ["spark_id"]
            isOneToOne: false
            referencedRelation: "sparks"
            referencedColumns: ["id"]
          },
        ]
      }
      sparks: {
        Row: {
          anchors: Json | null
          assumptions: Json | null
          claim_text: string | null
          confidence: number | null
          confidence_lvl: Database["public"]["Enums"]["confidence_level"] | null
          confidence_notes: string | null
          content_hash: string | null
          context_id: string
          context_type: string
          counterpoints: Json | null
          created_at: string
          dismissed_at: string | null
          explore_action: Json | null
          id: string
          insight: string
          kind: Database["public"]["Enums"]["spark_kind"] | null
          lens: Database["public"]["Enums"]["interpretive_lens"] | null
          mode: Database["public"]["Enums"]["jeeves_mode"] | null
          needs: Json | null
          next_actions: Json | null
          novelty_score: number | null
          opened_at: string | null
          recognition: string
          saved_at: string | null
          session_id: string | null
          spark_type: string
          status: Database["public"]["Enums"]["spark_status"] | null
          summary: string | null
          surface: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          verification: Database["public"]["Enums"]["verification_state"] | null
        }
        Insert: {
          anchors?: Json | null
          assumptions?: Json | null
          claim_text?: string | null
          confidence?: number | null
          confidence_lvl?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          confidence_notes?: string | null
          content_hash?: string | null
          context_id: string
          context_type: string
          counterpoints?: Json | null
          created_at?: string
          dismissed_at?: string | null
          explore_action?: Json | null
          id?: string
          insight: string
          kind?: Database["public"]["Enums"]["spark_kind"] | null
          lens?: Database["public"]["Enums"]["interpretive_lens"] | null
          mode?: Database["public"]["Enums"]["jeeves_mode"] | null
          needs?: Json | null
          next_actions?: Json | null
          novelty_score?: number | null
          opened_at?: string | null
          recognition: string
          saved_at?: string | null
          session_id?: string | null
          spark_type: string
          status?: Database["public"]["Enums"]["spark_status"] | null
          summary?: string | null
          surface: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          verification?:
            | Database["public"]["Enums"]["verification_state"]
            | null
        }
        Update: {
          anchors?: Json | null
          assumptions?: Json | null
          claim_text?: string | null
          confidence?: number | null
          confidence_lvl?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          confidence_notes?: string | null
          content_hash?: string | null
          context_id?: string
          context_type?: string
          counterpoints?: Json | null
          created_at?: string
          dismissed_at?: string | null
          explore_action?: Json | null
          id?: string
          insight?: string
          kind?: Database["public"]["Enums"]["spark_kind"] | null
          lens?: Database["public"]["Enums"]["interpretive_lens"] | null
          mode?: Database["public"]["Enums"]["jeeves_mode"] | null
          needs?: Json | null
          next_actions?: Json | null
          novelty_score?: number | null
          opened_at?: string | null
          recognition?: string
          saved_at?: string | null
          session_id?: string | null
          spark_type?: string
          status?: Database["public"]["Enums"]["spark_status"] | null
          summary?: string | null
          surface?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          verification?:
            | Database["public"]["Enums"]["verification_state"]
            | null
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
      study_engagement_sessions: {
        Row: {
          church_id: string | null
          completed: boolean | null
          content_type: string | null
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          started_at: string | null
          study_id: string | null
          study_type: string | null
          user_id: string
        }
        Insert: {
          church_id?: string | null
          completed?: boolean | null
          content_type?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          study_id?: string | null
          study_type?: string | null
          user_id: string
        }
        Update: {
          church_id?: string | null
          completed?: boolean | null
          content_type?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          study_id?: string | null
          study_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_engagement_sessions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_engagement_sessions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      study_insights: {
        Row: {
          content: string
          created_at: string
          id: string
          insight_type: string | null
          participant_id: string
          room_code: string | null
          score: number
          session_id: string
          status: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          insight_type?: string | null
          participant_id: string
          room_code?: string | null
          score?: number
          session_id: string
          status?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          insight_type?: string | null
          participant_id?: string
          room_code?: string | null
          score?: number
          session_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_insights_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "study_session_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_insights_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_study_sessions"
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
      study_partnerships: {
        Row: {
          accepted_at: string | null
          bonus_xp_earned: number
          created_at: string
          ended_at: string | null
          id: string
          invitation_message: string | null
          last_both_completed_date: string | null
          longest_streak: number
          partnership_streak: number
          status: string
          total_sessions_together: number
          updated_at: string
          user1_id: string
          user2_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          bonus_xp_earned?: number
          created_at?: string
          ended_at?: string | null
          id?: string
          invitation_message?: string | null
          last_both_completed_date?: string | null
          longest_streak?: number
          partnership_streak?: number
          status?: string
          total_sessions_together?: number
          updated_at?: string
          user1_id: string
          user2_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          bonus_xp_earned?: number
          created_at?: string
          ended_at?: string | null
          id?: string
          invitation_message?: string | null
          last_both_completed_date?: string | null
          longest_streak?: number
          partnership_streak?: number
          status?: string
          total_sessions_together?: number
          updated_at?: string
          user1_id?: string
          user2_id?: string | null
        }
        Relationships: []
      }
      study_path_generation_log: {
        Row: {
          created_at: string
          error_message: string | null
          generation_date: string
          id: string
          paths_generated: number
          success: boolean
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          generation_date: string
          id?: string
          paths_generated?: number
          success?: boolean
        }
        Update: {
          created_at?: string
          error_message?: string | null
          generation_date?: string
          id?: string
          paths_generated?: number
          success?: boolean
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
      study_session_participants: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string
          insights_shared: number
          is_connected: boolean
          joined_at: string
          last_seen_at: string | null
          score: number
          session_id: string
          user_id: string
          votes_cast: number
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string
          insights_shared?: number
          is_connected?: boolean
          joined_at?: string
          last_seen_at?: string | null
          score?: number
          session_id: string
          user_id: string
          votes_cast?: number
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string
          insights_shared?: number
          is_connected?: boolean
          joined_at?: string
          last_seen_at?: string | null
          score?: number
          session_id?: string
          user_id?: string
          votes_cast?: number
        }
        Relationships: [
          {
            foreignKeyName: "study_session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          ai_summary: string | null
          ai_summary_generated_at: string | null
          created_at: string
          description: string | null
          has_jeeves_history: boolean | null
          id: string
          is_active: boolean | null
          is_public: boolean | null
          jeeves_context: Json | null
          last_auto_save_at: string | null
          last_opened_at: string | null
          saved_at: string | null
          session_state: Json | null
          share_token: string | null
          started_at: string | null
          status: string | null
          tabs_data: Json
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          total_duration_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          created_at?: string
          description?: string | null
          has_jeeves_history?: boolean | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          jeeves_context?: Json | null
          last_auto_save_at?: string | null
          last_opened_at?: string | null
          saved_at?: string | null
          session_state?: Json | null
          share_token?: string | null
          started_at?: string | null
          status?: string | null
          tabs_data?: Json
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          total_duration_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          ai_summary_generated_at?: string | null
          created_at?: string
          description?: string | null
          has_jeeves_history?: boolean | null
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          jeeves_context?: Json | null
          last_auto_save_at?: string | null
          last_opened_at?: string | null
          saved_at?: string | null
          session_state?: Json | null
          share_token?: string | null
          started_at?: string | null
          status?: string | null
          tabs_data?: Json
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          total_duration_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_analytics_snapshots: {
        Row: {
          active_patrons: number | null
          active_subscriptions: number | null
          canceled_subscriptions: number | null
          church_count: number | null
          created_at: string
          essential_count: number | null
          id: string
          lifetime_access: number | null
          mrr_cents: number | null
          pickaxe_paid: number | null
          premium_count: number | null
          snapshot_date: string
          student_count: number | null
          total_users: number | null
          trialing_subscriptions: number | null
        }
        Insert: {
          active_patrons?: number | null
          active_subscriptions?: number | null
          canceled_subscriptions?: number | null
          church_count?: number | null
          created_at?: string
          essential_count?: number | null
          id?: string
          lifetime_access?: number | null
          mrr_cents?: number | null
          pickaxe_paid?: number | null
          premium_count?: number | null
          snapshot_date: string
          student_count?: number | null
          total_users?: number | null
          trialing_subscriptions?: number | null
        }
        Update: {
          active_patrons?: number | null
          active_subscriptions?: number | null
          canceled_subscriptions?: number | null
          church_count?: number | null
          created_at?: string
          essential_count?: number | null
          id?: string
          lifetime_access?: number | null
          mrr_cents?: number | null
          pickaxe_paid?: number | null
          premium_count?: number | null
          snapshot_date?: string
          student_count?: number | null
          total_users?: number | null
          trialing_subscriptions?: number | null
        }
        Relationships: []
      }
      teachable_students: {
        Row: {
          access_expires_at: string | null
          course_name: string | null
          created_at: string
          enrollment_status: string | null
          id: string
          is_active: boolean | null
          is_master_class: boolean | null
          last_sync_at: string | null
          last_verified_at: string | null
          mrr: number | null
          teachable_email: string
          teachable_user_id: string | null
          user_id: string | null
          verified_at: string
        }
        Insert: {
          access_expires_at?: string | null
          course_name?: string | null
          created_at?: string
          enrollment_status?: string | null
          id?: string
          is_active?: boolean | null
          is_master_class?: boolean | null
          last_sync_at?: string | null
          last_verified_at?: string | null
          mrr?: number | null
          teachable_email: string
          teachable_user_id?: string | null
          user_id?: string | null
          verified_at?: string
        }
        Update: {
          access_expires_at?: string | null
          course_name?: string | null
          created_at?: string
          enrollment_status?: string | null
          id?: string
          is_active?: boolean | null
          is_master_class?: boolean | null
          last_sync_at?: string | null
          last_verified_at?: string | null
          mrr?: number | null
          teachable_email?: string
          teachable_user_id?: string | null
          user_id?: string | null
          verified_at?: string
        }
        Relationships: []
      }
      thought_analyses: {
        Row: {
          alignment_check: Json | null
          categories: Json | null
          created_at: string
          deeper_insights: Json | null
          encouragement: string | null
          followup_conversation: Json | null
          further_study: string[] | null
          growth_areas: string[] | null
          id: string
          input_text: string
          narrative_analysis: string | null
          overall_score: number | null
          palace_rooms: Json | null
          potential_misinterpretations: string[] | null
          scripture_connections: Json | null
          strengths: string[] | null
          summary: string | null
          typology_layers: Json | null
          user_id: string
        }
        Insert: {
          alignment_check?: Json | null
          categories?: Json | null
          created_at?: string
          deeper_insights?: Json | null
          encouragement?: string | null
          followup_conversation?: Json | null
          further_study?: string[] | null
          growth_areas?: string[] | null
          id?: string
          input_text: string
          narrative_analysis?: string | null
          overall_score?: number | null
          palace_rooms?: Json | null
          potential_misinterpretations?: string[] | null
          scripture_connections?: Json | null
          strengths?: string[] | null
          summary?: string | null
          typology_layers?: Json | null
          user_id: string
        }
        Update: {
          alignment_check?: Json | null
          categories?: Json | null
          created_at?: string
          deeper_insights?: Json | null
          encouragement?: string | null
          followup_conversation?: Json | null
          further_study?: string[] | null
          growth_areas?: string[] | null
          id?: string
          input_text?: string
          narrative_analysis?: string | null
          overall_score?: number | null
          palace_rooms?: Json | null
          potential_misinterpretations?: string[] | null
          scripture_connections?: Json | null
          strengths?: string[] | null
          summary?: string | null
          typology_layers?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      training_courses: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          lesson_count: number
          pdf_storage_path: string | null
          slug: string
          sort_order: number
          title: string
          updated_at: string
          voice: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          lesson_count?: number
          pdf_storage_path?: string | null
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          voice?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          lesson_count?: number
          pdf_storage_path?: string | null
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          voice?: string
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
      training_lessons: {
        Row: {
          audio_storage_path: string | null
          course_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          lesson_number: number
          status: string
          title: string
          transcript: string
          updated_at: string
        }
        Insert: {
          audio_storage_path?: string | null
          course_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          lesson_number: number
          status?: string
          title: string
          transcript?: string
          updated_at?: string
        }
        Update: {
          audio_storage_path?: string | null
          course_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          lesson_number?: number
          status?: string
          title?: string
          transcript?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "training_courses"
            referencedColumns: ["id"]
          },
        ]
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
      translation_library: {
        Row: {
          created_at: string | null
          generated_image_url: string | null
          id: string
          updated_at: string | null
          user_id: string
          user_image_description: string
          verse_reference: string
          verse_text: string
        }
        Insert: {
          created_at?: string | null
          generated_image_url?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          user_image_description: string
          verse_reference: string
          verse_text: string
        }
        Update: {
          created_at?: string | null
          generated_image_url?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          user_image_description?: string
          verse_reference?: string
          verse_text?: string
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
      uno_games: {
        Row: {
          created_at: string
          current_player_index: number
          game_mode: string
          game_state: Json
          host_id: string
          id: string
          max_players: number
          room_code: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_player_index?: number
          game_mode?: string
          game_state?: Json
          host_id: string
          id?: string
          max_players?: number
          room_code: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_player_index?: number
          game_mode?: string
          game_state?: Json
          host_id?: string
          id?: string
          max_players?: number
          room_code?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      uno_players: {
        Row: {
          display_name: string
          game_id: string
          hand: Json
          id: string
          is_host: boolean
          joined_at: string
          player_index: number
          score: number
          user_id: string
        }
        Insert: {
          display_name?: string
          game_id: string
          hand?: Json
          id?: string
          is_host?: boolean
          joined_at?: string
          player_index?: number
          score?: number
          user_id: string
        }
        Update: {
          display_name?: string
          game_id?: string
          hand?: Json
          id?: string
          is_host?: boolean
          joined_at?: string
          player_index?: number
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uno_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "uno_games"
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
      user_calendar_sync: {
        Row: {
          access_token: string | null
          calendar_id: string | null
          created_at: string | null
          id: string
          last_synced_at: string | null
          provider: string
          refresh_token: string | null
          sync_enabled: boolean | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          provider: string
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          calendar_id?: string | null
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          provider?: string
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_course_progress: {
        Row: {
          completed_at: string
          course_id: string
          created_at: string
          day_number: number
          id: string
          reflection_note: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          course_id?: string
          created_at?: string
          day_number: number
          id?: string
          reflection_note?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          course_id?: string
          created_at?: string
          day_number?: number
          id?: string
          reflection_note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_drill_completions: {
        Row: {
          completed_at: string | null
          drill_id: string
          feedback: string | null
          id: string
          response: string | null
          score: number | null
          time_seconds: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          drill_id: string
          feedback?: string | null
          id?: string
          response?: string | null
          score?: number | null
          time_seconds?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          drill_id?: string
          feedback?: string | null
          id?: string
          response?: string | null
          score?: number | null
          time_seconds?: number | null
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
      user_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          page_path: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_path?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_path?: string | null
          session_id?: string | null
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
      user_music: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          file_path: string
          file_url: string
          id: string
          is_favorite: boolean | null
          mood: string | null
          name: string
          play_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_path: string
          file_url: string
          id?: string
          is_favorite?: boolean | null
          mood?: string | null
          name: string
          play_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          file_path?: string
          file_url?: string
          id?: string
          is_favorite?: boolean | null
          mood?: string | null
          name?: string
          play_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_paths: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_month: number | null
          current_quarter: number | null
          current_year: number | null
          id: string
          is_active: boolean | null
          path_switches_used: number | null
          path_type: string
          started_at: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_month?: number | null
          current_quarter?: number | null
          current_year?: number | null
          id?: string
          is_active?: boolean | null
          path_switches_used?: number | null
          path_type: string
          started_at?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_month?: number | null
          current_quarter?: number | null
          current_year?: number | null
          id?: string
          is_active?: boolean | null
          path_switches_used?: number | null
          path_type?: string
          started_at?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_playlist_items: {
        Row: {
          audio_meta: Json | null
          audio_type: string
          audio_url: string | null
          created_at: string
          description: string | null
          id: string
          playlist_id: string | null
          position: number
          title: string
          user_id: string
        }
        Insert: {
          audio_meta?: Json | null
          audio_type?: string
          audio_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          playlist_id?: string | null
          position?: number
          title: string
          user_id: string
        }
        Update: {
          audio_meta?: Json | null
          audio_type?: string
          audio_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          playlist_id?: string | null
          position?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_playlist_items_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "user_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_playlists: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          app_font_size: string | null
          bible_font_size: string | null
          bible_translation: string | null
          has_seen_mode_selector: boolean | null
          id: string
          language: string | null
          music_volume: number | null
          nav_tab_order: string[] | null
          navigation_style: string | null
          onboarding_completed: boolean | null
          pinned_nav_tabs: string[] | null
          reading_mode: string | null
          recent_pages: Json | null
          study_buddy_theme: string | null
          suite_mode: string | null
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          app_font_size?: string | null
          bible_font_size?: string | null
          bible_translation?: string | null
          has_seen_mode_selector?: boolean | null
          id?: string
          language?: string | null
          music_volume?: number | null
          nav_tab_order?: string[] | null
          navigation_style?: string | null
          onboarding_completed?: boolean | null
          pinned_nav_tabs?: string[] | null
          reading_mode?: string | null
          recent_pages?: Json | null
          study_buddy_theme?: string | null
          suite_mode?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          app_font_size?: string | null
          bible_font_size?: string | null
          bible_translation?: string | null
          has_seen_mode_selector?: boolean | null
          id?: string
          language?: string | null
          music_volume?: number | null
          nav_tab_order?: string[] | null
          navigation_style?: string | null
          onboarding_completed?: boolean | null
          pinned_nav_tabs?: string[] | null
          reading_mode?: string | null
          recent_pages?: Json | null
          study_buddy_theme?: string | null
          suite_mode?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_process_state: {
        Row: {
          active_process: string | null
          created_at: string | null
          id: string
          last_drill_session_id: string | null
          last_location: string | null
          last_room_mastered: string | null
          last_timestamp: string | null
          notes: string | null
          process_step: number | null
          process_total_steps: number | null
          task_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_process?: string | null
          created_at?: string | null
          id?: string
          last_drill_session_id?: string | null
          last_location?: string | null
          last_room_mastered?: string | null
          last_timestamp?: string | null
          notes?: string | null
          process_step?: number | null
          process_total_steps?: number | null
          task_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_process?: string | null
          created_at?: string | null
          id?: string
          last_drill_session_id?: string | null
          last_location?: string | null
          last_room_mastered?: string | null
          last_timestamp?: string | null
          notes?: string | null
          process_step?: number | null
          process_total_steps?: number | null
          task_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_pt_preferences: {
        Row: {
          auto_suggest_cross_refs: boolean | null
          created_at: string | null
          id: string
          palace_view_enabled: boolean | null
          pt_mode: string | null
          show_insights_after_game: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_suggest_cross_refs?: boolean | null
          created_at?: string | null
          id?: string
          palace_view_enabled?: boolean | null
          pt_mode?: string | null
          show_insights_after_game?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_suggest_cross_refs?: boolean | null
          created_at?: string | null
          id?: string
          palace_view_enabled?: boolean | null
          pt_mode?: string | null
          show_insights_after_game?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_reading_presets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          items: Json
          name: string
          room_tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          items?: Json
          name: string
          room_tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          items?: Json
          name?: string
          room_tags?: string[] | null
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
      user_room_visits: {
        Row: {
          id: string
          last_visited_at: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          last_visited_at?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          last_visited_at?: string
          room_id?: string
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
          jeeves_conversation: Json | null
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
          jeeves_conversation?: Json | null
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
          jeeves_conversation?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_study_entries: {
        Row: {
          content: string
          created_at: string
          entry_type: string
          id: string
          likes_count: number
          thread_id: string
          title: string | null
          updated_at: string
          user_id: string
          verse_reference: string | null
        }
        Insert: {
          content: string
          created_at?: string
          entry_type?: string
          id?: string
          likes_count?: number
          thread_id: string
          title?: string | null
          updated_at?: string
          user_id: string
          verse_reference?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          entry_type?: string
          id?: string
          likes_count?: number
          thread_id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
          verse_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_study_entries_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "user_study_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_study_path_progress: {
        Row: {
          completed_at: string | null
          completed_cards: string[]
          created_at: string
          current_card_index: number
          id: string
          is_active: boolean
          path_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_cards?: string[]
          created_at?: string
          current_card_index?: number
          id?: string
          is_active?: boolean
          path_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_cards?: string[]
          created_at?: string
          current_card_index?: number
          id?: string
          is_active?: boolean
          path_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_study_paths: {
        Row: {
          created_at: string
          current_session_number: number
          demonstrated_level: Database["public"]["Enums"]["pt_mastery_level"]
          id: string
          integration_tasks_completed: number
          is_active: boolean
          last_recalibration_requested: string | null
          level_earned_at: string | null
          recalibration_count: number
          room_completions: Json | null
          scenario_scores: Json | null
          sessions_completed: number
          track_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_session_number?: number
          demonstrated_level?: Database["public"]["Enums"]["pt_mastery_level"]
          id?: string
          integration_tasks_completed?: number
          is_active?: boolean
          last_recalibration_requested?: string | null
          level_earned_at?: string | null
          recalibration_count?: number
          room_completions?: Json | null
          scenario_scores?: Json | null
          sessions_completed?: number
          track_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_session_number?: number
          demonstrated_level?: Database["public"]["Enums"]["pt_mastery_level"]
          id?: string
          integration_tasks_completed?: number
          is_active?: boolean
          last_recalibration_requested?: string | null
          level_earned_at?: string | null
          recalibration_count?: number
          room_completions?: Json | null
          scenario_scores?: Json | null
          sessions_completed?: number
          track_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_study_paths_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "pt_study_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_study_profiles: {
        Row: {
          available_time_minutes: number
          confidence_bible_storyline: number
          confidence_cross_referencing: number
          confidence_gospel_basics: number
          confidence_parables_symbols: number
          confidence_prophecy: number
          confidence_sanctuary_basics: number
          confidence_study_consistency: number
          created_at: string
          current_level: Database["public"]["Enums"]["pt_mastery_level"]
          id: string
          learning_preference: string
          onboarding_completed: boolean
          onboarding_skipped: boolean
          pain_points: Json | null
          primary_burdens: Database["public"]["Enums"]["pt_study_burden"][]
          updated_at: string
          user_id: string
          user_role: Database["public"]["Enums"]["pt_user_role"]
        }
        Insert: {
          available_time_minutes?: number
          confidence_bible_storyline?: number
          confidence_cross_referencing?: number
          confidence_gospel_basics?: number
          confidence_parables_symbols?: number
          confidence_prophecy?: number
          confidence_sanctuary_basics?: number
          confidence_study_consistency?: number
          created_at?: string
          current_level?: Database["public"]["Enums"]["pt_mastery_level"]
          id?: string
          learning_preference?: string
          onboarding_completed?: boolean
          onboarding_skipped?: boolean
          pain_points?: Json | null
          primary_burdens?: Database["public"]["Enums"]["pt_study_burden"][]
          updated_at?: string
          user_id: string
          user_role?: Database["public"]["Enums"]["pt_user_role"]
        }
        Update: {
          available_time_minutes?: number
          confidence_bible_storyline?: number
          confidence_cross_referencing?: number
          confidence_gospel_basics?: number
          confidence_parables_symbols?: number
          confidence_prophecy?: number
          confidence_sanctuary_basics?: number
          confidence_study_consistency?: number
          created_at?: string
          current_level?: Database["public"]["Enums"]["pt_mastery_level"]
          id?: string
          learning_preference?: string
          onboarding_completed?: boolean
          onboarding_skipped?: boolean
          pain_points?: Json | null
          primary_burdens?: Database["public"]["Enums"]["pt_study_burden"][]
          updated_at?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["pt_user_role"]
        }
        Relationships: []
      }
      user_study_threads: {
        Row: {
          created_at: string
          description: string | null
          entry_count: number
          id: string
          is_public: boolean
          title: string
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entry_count?: number
          id?: string
          is_public?: boolean
          title: string
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entry_count?: number
          id?: string
          is_public?: boolean
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          has_lifetime_access: boolean | null
          id: string
          is_recurring: boolean | null
          lifetime_access_granted_at: string | null
          payment_source: string | null
          promotional_access_expires_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_cancelled_at: string | null
          subscription_renewal_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          has_lifetime_access?: boolean | null
          id?: string
          is_recurring?: boolean | null
          lifetime_access_granted_at?: string | null
          payment_source?: string | null
          promotional_access_expires_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_cancelled_at?: string | null
          subscription_renewal_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          has_lifetime_access?: boolean | null
          id?: string
          is_recurring?: boolean | null
          lifetime_access_granted_at?: string | null
          payment_source?: string | null
          promotional_access_expires_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_cancelled_at?: string | null
          subscription_renewal_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string
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
      verse_commentary_cache: {
        Row: {
          audio_storage_path: string | null
          book: string
          chapter: number
          commentary_text: string
          created_at: string | null
          depth: string | null
          id: string
          updated_at: string | null
          verse: number
          voice_id: string | null
        }
        Insert: {
          audio_storage_path?: string | null
          book: string
          chapter: number
          commentary_text: string
          created_at?: string | null
          depth?: string | null
          id?: string
          updated_at?: string | null
          verse: number
          voice_id?: string | null
        }
        Update: {
          audio_storage_path?: string | null
          book?: string
          chapter?: number
          commentary_text?: string
          created_at?: string | null
          depth?: string | null
          id?: string
          updated_at?: string | null
          verse?: number
          voice_id?: string | null
        }
        Relationships: []
      }
      verse_highlights: {
        Row: {
          book: string
          chapter: number
          color: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          color?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          color?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      verse_notes: {
        Row: {
          book: string
          chapter: number
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      verse_palace_mappings: {
        Row: {
          book: string
          chapter: number
          created_at: string
          floor_number: number
          id: string
          imagery_note: string | null
          personal_insight: string | null
          principle_codes: string[] | null
          room_id: string
          room_tag: string
          updated_at: string
          user_id: string
          verse: number
          verse_reference: string
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          floor_number: number
          id?: string
          imagery_note?: string | null
          personal_insight?: string | null
          principle_codes?: string[] | null
          room_id: string
          room_tag: string
          updated_at?: string
          user_id: string
          verse: number
          verse_reference: string
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          floor_number?: number
          id?: string
          imagery_note?: string | null
          personal_insight?: string | null
          principle_codes?: string[] | null
          room_id?: string
          room_tag?: string
          updated_at?: string
          user_id?: string
          verse?: number
          verse_reference?: string
        }
        Relationships: []
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
      voice_chat_invites: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          invitee_id: string
          inviter_id: string
          room_id: string
          room_name: string
          status: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          invitee_id: string
          inviter_id: string
          room_id: string
          room_name: string
          status?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          room_id?: string
          room_name?: string
          status?: string
        }
        Relationships: []
      }
      war_college_manuscripts: {
        Row: {
          avatar_id: string
          created_at: string
          day_number: number
          id: string
          manuscript_data: Json
          rank: string
          updated_at: string
        }
        Insert: {
          avatar_id: string
          created_at?: string
          day_number: number
          id?: string
          manuscript_data: Json
          rank: string
          updated_at?: string
        }
        Update: {
          avatar_id?: string
          created_at?: string
          day_number?: number
          id?: string
          manuscript_data?: Json
          rank?: string
          updated_at?: string
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
      weekly_challenge_guest_contributions: {
        Row: {
          challenge_id: string | null
          contribution: string
          created_at: string
          email: string | null
          id: string
          name: string
          share_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          contribution: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          share_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          contribution?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          share_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_challenge_guest_contributions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "weekly_study_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_challenge_guest_contributions_share_id_fkey"
            columns: ["share_id"]
            isOneToOne: false
            referencedRelation: "weekly_challenge_shares"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_challenge_shares: {
        Row: {
          challenge_id: string | null
          clicks: number | null
          conversions: number | null
          created_at: string
          id: string
          share_code: string
          user_id: string
        }
        Insert: {
          challenge_id?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          id?: string
          share_code: string
          user_id: string
        }
        Update: {
          challenge_id?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          id?: string
          share_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_challenge_shares_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "weekly_study_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_study_challenges: {
        Row: {
          anchor_passage: string
          created_at: string
          difficulty: string | null
          ends_at: string | null
          id: string
          judged_at: string | null
          starts_at: string | null
          status: string | null
          theme: string | null
          title: string
          updated_at: string
          week_number: number | null
          year: number | null
        }
        Insert: {
          anchor_passage: string
          created_at?: string
          difficulty?: string | null
          ends_at?: string | null
          id?: string
          judged_at?: string | null
          starts_at?: string | null
          status?: string | null
          theme?: string | null
          title: string
          updated_at?: string
          week_number?: number | null
          year?: number | null
        }
        Update: {
          anchor_passage?: string
          created_at?: string
          difficulty?: string | null
          ends_at?: string | null
          id?: string
          judged_at?: string | null
          starts_at?: string | null
          status?: string | null
          theme?: string | null
          title?: string
          updated_at?: string
          week_number?: number | null
          year?: number | null
        }
        Relationships: []
      }
      weekly_study_submissions: {
        Row: {
          ai_feedback: string | null
          ai_score: number | null
          challenge_id: string | null
          created_at: string
          id: string
          main_insight: string
          practical_application: string | null
          principles_applied: string[] | null
          rank: number | null
          scripture_connections: string[] | null
          supporting_evidence: string | null
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          ai_feedback?: string | null
          ai_score?: number | null
          challenge_id?: string | null
          created_at?: string
          id?: string
          main_insight: string
          practical_application?: string | null
          principles_applied?: string[] | null
          rank?: number | null
          scripture_connections?: string[] | null
          supporting_evidence?: string | null
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          ai_feedback?: string | null
          ai_score?: number | null
          challenge_id?: string | null
          created_at?: string
          id?: string
          main_insight?: string
          practical_application?: string | null
          principles_applied?: string[] | null
          rank?: number | null
          scripture_connections?: string[] | null
          supporting_evidence?: string | null
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_study_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "weekly_study_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_study_winners: {
        Row: {
          badge_awarded: string | null
          challenge_id: string | null
          created_at: string
          id: string
          rank: number
          standout_insight: string | null
          submission_id: string | null
          user_id: string
          xp_awarded: number | null
        }
        Insert: {
          badge_awarded?: string | null
          challenge_id?: string | null
          created_at?: string
          id?: string
          rank: number
          standout_insight?: string | null
          submission_id?: string | null
          user_id: string
          xp_awarded?: number | null
        }
        Update: {
          badge_awarded?: string | null
          challenge_id?: string | null
          created_at?: string
          id?: string
          rank?: number
          standout_insight?: string | null
          submission_id?: string | null
          user_id?: string
          xp_awarded?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_study_winners_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "weekly_study_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_study_winners_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "weekly_study_submissions"
            referencedColumns: ["id"]
          },
        ]
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
      youth_attendance: {
        Row: {
          attendance_status: string
          created_at: string
          group_id: string
          id: string
          notes: string | null
          participation_level: string | null
          recorded_by: string | null
          session_date: string
          user_id: string
          week_number: number | null
        }
        Insert: {
          attendance_status?: string
          created_at?: string
          group_id: string
          id?: string
          notes?: string | null
          participation_level?: string | null
          recorded_by?: string | null
          session_date: string
          user_id: string
          week_number?: number | null
        }
        Update: {
          attendance_status?: string
          created_at?: string
          group_id?: string
          id?: string
          notes?: string | null
          participation_level?: string | null
          recorded_by?: string | null
          session_date?: string
          user_id?: string
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "youth_attendance_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_curriculum_weeks: {
        Row: {
          application_challenge: string | null
          core_question: string | null
          created_at: string
          discussion_prompts: string[] | null
          ew_theme: string | null
          id: string
          practice_activity: string | null
          pt_focus: string | null
          sanctuary_station: string
          scripture_references: string[]
          title: string
          truth_statement: string
          week_number: number
        }
        Insert: {
          application_challenge?: string | null
          core_question?: string | null
          created_at?: string
          discussion_prompts?: string[] | null
          ew_theme?: string | null
          id?: string
          practice_activity?: string | null
          pt_focus?: string | null
          sanctuary_station: string
          scripture_references: string[]
          title: string
          truth_statement: string
          week_number: number
        }
        Update: {
          application_challenge?: string | null
          core_question?: string | null
          created_at?: string
          discussion_prompts?: string[] | null
          ew_theme?: string | null
          id?: string
          practice_activity?: string | null
          pt_focus?: string | null
          sanctuary_station?: string
          scripture_references?: string[]
          title?: string
          truth_statement?: string
          week_number?: number
        }
        Relationships: []
      }
      youth_cycle_enrollments: {
        Row: {
          completed_at: string | null
          current_week: number | null
          cycle_id: string
          group_id: string
          id: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          current_week?: number | null
          cycle_id: string
          group_id: string
          id?: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          current_week?: number | null
          cycle_id?: string
          group_id?: string
          id?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "youth_cycle_enrollments_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "youth_study_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_cycle_enrollments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_group_messages: {
        Row: {
          content: string
          created_at: string
          flagged_reason: string | null
          group_id: string
          id: string
          is_flagged: boolean | null
          is_visible: boolean | null
          message_type: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          flagged_reason?: string | null
          group_id: string
          id?: string
          is_flagged?: boolean | null
          is_visible?: boolean | null
          message_type?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          flagged_reason?: string | null
          group_id?: string
          id?: string
          is_flagged?: boolean | null
          is_visible?: boolean | null
          message_type?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "youth_group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_group_progress: {
        Row: {
          attendance_count: number | null
          completed_at: string | null
          created_at: string
          follow_up_needed: boolean | null
          group_id: string
          id: string
          led_by: string | null
          session_date: string
          session_notes: string | null
          week_number: number
        }
        Insert: {
          attendance_count?: number | null
          completed_at?: string | null
          created_at?: string
          follow_up_needed?: boolean | null
          group_id: string
          id?: string
          led_by?: string | null
          session_date: string
          session_notes?: string | null
          week_number: number
        }
        Update: {
          attendance_count?: number | null
          completed_at?: string | null
          created_at?: string
          follow_up_needed?: boolean | null
          group_id?: string
          id?: string
          led_by?: string | null
          session_date?: string
          session_notes?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "youth_group_progress_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_groups: {
        Row: {
          age_band: string
          church_id: string
          created_at: string
          current_week: number | null
          description: string | null
          id: string
          is_online: boolean | null
          max_members: number | null
          meeting_day: string | null
          meeting_link: string | null
          meeting_location: string | null
          meeting_time: string | null
          name: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          age_band: string
          church_id: string
          created_at?: string
          current_week?: number | null
          description?: string | null
          id?: string
          is_online?: boolean | null
          max_members?: number | null
          meeting_day?: string | null
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          age_band?: string
          church_id?: string
          created_at?: string
          current_week?: number | null
          description?: string | null
          id?: string
          is_online?: boolean | null
          max_members?: number | null
          meeting_day?: string | null
          meeting_link?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "youth_groups_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_groups_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_guest_invites: {
        Row: {
          converted_to_member_at: string | null
          created_at: string
          expires_at: string | null
          group_id: string
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          invite_code: string | null
          invited_by: string
          status: string | null
        }
        Insert: {
          converted_to_member_at?: string | null
          created_at?: string
          expires_at?: string | null
          group_id: string
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          invite_code?: string | null
          invited_by: string
          status?: string | null
        }
        Update: {
          converted_to_member_at?: string | null
          created_at?: string
          expires_at?: string | null
          group_id?: string
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          invite_code?: string | null
          invited_by?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "youth_guest_invites_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_leaders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          background_check_date: string | null
          background_check_status: string | null
          church_id: string
          created_at: string
          group_id: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          role: string
          training_completed: boolean | null
          training_completed_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          background_check_date?: string | null
          background_check_status?: string | null
          church_id: string
          created_at?: string
          group_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          role?: string
          training_completed?: boolean | null
          training_completed_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          background_check_date?: string | null
          background_check_status?: string | null
          church_id?: string
          created_at?: string
          group_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          role?: string
          training_completed?: boolean | null
          training_completed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "youth_leaders_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_leaders_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_leaders_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_members: {
        Row: {
          age: number | null
          attendance_count: number | null
          group_id: string
          id: string
          is_active: boolean | null
          joined_at: string
          last_attendance: string | null
          member_pathway: string
          notes: string | null
          parent_contact_email: string | null
          parent_contact_phone: string | null
          parental_consent: boolean | null
          parental_consent_date: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          attendance_count?: number | null
          group_id: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          last_attendance?: string | null
          member_pathway?: string
          notes?: string | null
          parent_contact_email?: string | null
          parent_contact_phone?: string | null
          parental_consent?: boolean | null
          parental_consent_date?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          attendance_count?: number | null
          group_id?: string
          id?: string
          is_active?: boolean | null
          joined_at?: string
          last_attendance?: string | null
          member_pathway?: string
          notes?: string | null
          parent_contact_email?: string | null
          parent_contact_phone?: string | null
          parental_consent?: boolean | null
          parental_consent_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "youth_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_safety_logs: {
        Row: {
          action_taken: string | null
          church_id: string
          created_at: string
          description: string
          group_id: string | null
          id: string
          log_type: string
          reported_by: string
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          subject_user_id: string | null
        }
        Insert: {
          action_taken?: string | null
          church_id: string
          created_at?: string
          description: string
          group_id?: string | null
          id?: string
          log_type: string
          reported_by: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          subject_user_id?: string | null
        }
        Update: {
          action_taken?: string | null
          church_id?: string
          created_at?: string
          description?: string
          group_id?: string | null
          id?: string
          log_type?: string
          reported_by?: string
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          subject_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "youth_safety_logs_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_safety_logs_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_safety_logs_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_safety_profiles: {
        Row: {
          age_verified: boolean | null
          consent_date: string | null
          created_at: string
          date_of_birth: string | null
          id: string
          is_minor: boolean | null
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          parental_consent_given: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_verified?: boolean | null
          consent_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          is_minor?: boolean | null
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parental_consent_given?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_verified?: boolean | null
          consent_date?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          is_minor?: boolean | null
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parental_consent_given?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      youth_study_cycles: {
        Row: {
          church_id: string
          created_at: string
          created_by: string | null
          cycle_type: string
          description: string | null
          id: string
          is_active: boolean | null
          is_guest_friendly: boolean | null
          materials_link: string | null
          title: string
          week_count: number | null
        }
        Insert: {
          church_id: string
          created_at?: string
          created_by?: string | null
          cycle_type: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_guest_friendly?: boolean | null
          materials_link?: string | null
          title: string
          week_count?: number | null
        }
        Update: {
          church_id?: string
          created_at?: string
          created_by?: string | null
          cycle_type?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_guest_friendly?: boolean | null
          materials_link?: string | null
          title?: string
          week_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "youth_study_cycles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_study_cycles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      youth_transitions: {
        Row: {
          adult_cohort_id: string | null
          bridge_track_completed_at: string | null
          bridge_track_started_at: string | null
          church_id: string
          commissioned_at: string | null
          created_at: string
          from_group_id: string | null
          id: string
          leader_recommendation: string | null
          leader_recommended_by: string | null
          notes: string | null
          transition_stage: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adult_cohort_id?: string | null
          bridge_track_completed_at?: string | null
          bridge_track_started_at?: string | null
          church_id: string
          commissioned_at?: string | null
          created_at?: string
          from_group_id?: string | null
          id?: string
          leader_recommendation?: string | null
          leader_recommended_by?: string | null
          notes?: string | null
          transition_stage?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adult_cohort_id?: string | null
          bridge_track_completed_at?: string | null
          bridge_track_started_at?: string | null
          church_id?: string
          commissioned_at?: string | null
          created_at?: string
          from_group_id?: string | null
          id?: string
          leader_recommendation?: string | null
          leader_recommended_by?: string | null
          notes?: string | null
          transition_stage?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "youth_transitions_adult_cohort_id_fkey"
            columns: ["adult_cohort_id"]
            isOneToOne: false
            referencedRelation: "discipleship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_transitions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_transitions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "youth_transitions_from_group_id_fkey"
            columns: ["from_group_id"]
            isOneToOne: false
            referencedRelation: "youth_groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      churches_public_info: {
        Row: {
          branded_name: string | null
          created_at: string | null
          id: string | null
          logo_url: string | null
          max_seats: number | null
          name: string | null
          tier: Database["public"]["Enums"]["church_tier"] | null
        }
        Insert: {
          branded_name?: string | null
          created_at?: string | null
          id?: string | null
          logo_url?: string | null
          max_seats?: number | null
          name?: string | null
          tier?: Database["public"]["Enums"]["church_tier"] | null
        }
        Update: {
          branded_name?: string | null
          created_at?: string | null
          id?: string | null
          logo_url?: string | null
          max_seats?: number | null
          name?: string | null
          tier?: Database["public"]["Enums"]["church_tier"] | null
        }
        Relationships: []
      }
      profiles_public_info: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_photo_url: string | null
          created_at: string | null
          current_floor: number | null
          daily_study_streak: number | null
          display_name: string | null
          id: string | null
          interests: string[] | null
          is_profile_public: boolean | null
          level: number | null
          location: string | null
          master_title: string | null
          ministry_tags: string[] | null
          points: number | null
          social_links: Json | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          current_floor?: number | null
          daily_study_streak?: number | null
          display_name?: string | null
          id?: string | null
          interests?: string[] | null
          is_profile_public?: boolean | null
          level?: number | null
          location?: string | null
          master_title?: string | null
          ministry_tags?: string[] | null
          points?: number | null
          social_links?: Json | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          current_floor?: number | null
          daily_study_streak?: number | null
          display_name?: string | null
          id?: string | null
          interests?: string[] | null
          is_profile_public?: boolean | null
          level?: number | null
          location?: string | null
          master_title?: string | null
          ministry_tags?: string[] | null
          points?: number | null
          social_links?: Json | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
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
      award_xp: {
        Args: { p_amount: number; p_reason: string; p_user_id: string }
        Returns: undefined
      }
      can_access_youth_member: { Args: { _group_id: string }; Returns: boolean }
      check_lock_in_pass: { Args: { _token: string }; Returns: Json }
      cleanup_abandoned_signups: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      cleanup_old_typing_indicators: { Args: never; Returns: undefined }
      create_challenge_share: {
        Args: { p_challenge_id: string }
        Returns: Json
      }
      create_lock_in_pass: {
        Args: { _personal_message?: string }
        Returns: Json
      }
      decrypt_token: { Args: { encrypted_token: string }; Returns: string }
      delete_cancelled_user_data: { Args: never; Returns: undefined }
      encrypt_token: { Args: { plain_token: string }; Returns: string }
      expire_stale_trials: { Args: never; Returns: undefined }
      generate_challenge_share_code: { Args: never; Returns: string }
      generate_game_night_invite_code: { Args: never; Returns: string }
      generate_guesthouse_access_code: { Args: never; Returns: string }
      generate_profile_invite_token: { Args: never; Returns: string }
      generate_referral_code: { Args: { user_id: string }; Returns: string }
      generate_session_share_token: { Args: never; Returns: string }
      generate_student_verification_code: { Args: never; Returns: string }
      get_active_lock_in_pass: {
        Args: { _user_id_or_fingerprint?: string }
        Returns: Json
      }
      get_active_user_count: { Args: never; Returns: number }
      get_available_seats: { Args: { _church_id: string }; Returns: number }
      get_church_billing_info: {
        Args: { _church_id: string }
        Returns: {
          billing_email: string
          stripe_customer_id: string
          subscription_ends_at: string
          subscription_started_at: string
          subscription_status: string
        }[]
      }
      get_church_public_info: {
        Args: { _church_id: string }
        Returns: {
          branded_name: string
          created_at: string
          id: string
          logo_url: string
          max_seats: number
          name: string
          tier: Database["public"]["Enums"]["church_tier"]
        }[]
      }
      get_decrypted_devotional_profile: {
        Args: { _profile_id: string }
        Returns: {
          issue_description: string
          pastoral_notes: Json
        }[]
      }
      get_decrypted_gamma_key: { Args: { _user_id: string }; Returns: string }
      get_decrypted_patreon_tokens: {
        Args: { _user_id: string }
        Returns: {
          access_token: string
          refresh_token: string
          token_expires_at: string
        }[]
      }
      get_gift_by_token: {
        Args: { _token: string }
        Returns: {
          expires_at: string
          gift_token: string
          id: string
          personal_message: string
          plan_type: string
          status: string
        }[]
      }
      get_or_create_conversation: {
        Args: { other_user_id: string }
        Returns: string
      }
      get_public_profile: {
        Args: { profile_id: string }
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          display_name: string
          id: string
          username: string
        }[]
      }
      get_public_profile_info: {
        Args: { _profile_id: string }
        Returns: {
          avatar_url: string
          bio: string
          display_name: string
          id: string
          username: string
        }[]
      }
      get_safe_profile: {
        Args: { _user_id: string }
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          display_name: string
          id: string
          points: number
          subscription_tier: string
          username: string
        }[]
      }
      get_safe_public_profile: {
        Args: { _profile_id: string }
        Returns: {
          avatar_url: string
          bio: string
          current_floor: number
          display_name: string
          id: string
          master_title: string
          points: number
          username: string
        }[]
      }
      get_season_standings: {
        Args: { p_season_id: string }
        Returns: {
          banner_emoji: string
          eliminated_at: string
          elimination_week: number
          hq_points: number
          is_eliminated: boolean
          losses: number
          member_count: number
          motto: string
          squad_id: string
          squad_name: string
          total_points: number
          wins: number
        }[]
      }
      get_subscription_summary: {
        Args: { _user_id?: string }
        Returns: {
          has_access: boolean
          has_lifetime: boolean
          renewal_date: string
          status: string
          tier: string
          trial_ends_at: string
        }[]
      }
      get_user_church_ids: { Args: { _user_id: string }; Returns: string[] }
      get_youth_member_church_id: {
        Args: { _group_id: string }
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
      has_church_community_access: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      has_ministry_role: {
        Args: {
          _church_id: string
          _role: Database["public"]["Enums"]["ministry_role"]
          _user_id: string
        }
        Returns: boolean
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
      has_teachable_access: { Args: { _user_id: string }; Returns: boolean }
      increment_user_points: {
        Args: { points_to_add: number; user_id: string }
        Returns: undefined
      }
      is_admin_user: { Args: { _user_id: string }; Returns: boolean }
      is_bible_worker: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      is_certified_leader: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      is_church_admin: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      is_church_admin_direct: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      is_game_night_active: { Args: never; Returns: boolean }
      is_ministry_leader: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      is_palace_owner: { Args: { _user_id: string }; Returns: boolean }
      is_player_in_game: {
        Args: { _game_id: string; _user_id: string }
        Returns: boolean
      }
      is_room_newly_renovated: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      is_site_admin: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      is_study_owner: {
        Args: { study_id_param: string; user_id_param: string }
        Returns: boolean
      }
      is_video_admin: { Args: { _user_id: string }; Returns: boolean }
      is_youth_leader: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      is_youth_overseer: {
        Args: { _church_id: string; _user_id: string }
        Returns: boolean
      }
      mark_room_visited: {
        Args: { _room_id: string; _user_id: string }
        Returns: undefined
      }
      record_analytics_snapshot: { Args: never; Returns: undefined }
      redeem_access_code: { Args: { code_input: string }; Returns: Json }
      redeem_day_pass: {
        Args: { _recipient_id: string; _token: string }
        Returns: Json
      }
      redeem_lock_in_pass:
        | { Args: { _token: string }; Returns: Json }
        | {
            Args: {
              _guest_email?: string
              _guest_name?: string
              _token: string
            }
            Returns: Json
          }
        | {
            Args: { _token: string; _user_id_or_fingerprint: string }
            Returns: Json
          }
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
      track_share_click: { Args: { p_share_code: string }; Returns: undefined }
      update_mastery_streak: { Args: { p_user_id: string }; Returns: Json }
      use_day_pass_audio: { Args: { _token: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "video_admin" | "owner"
      church_member_role:
        | "admin"
        | "leader"
        | "member"
        | "bible_worker"
        | "guest"
      church_tier: "tier1" | "tier2" | "tier3"
      claim_ladder_status: "draft" | "saved" | "validated"
      confidence_level: "speculative" | "tentative" | "moderate" | "strong"
      credibility_tier: "A" | "B" | "C" | "D"
      interpretive_lens: "sda" | "neutral_historical" | "comparative"
      jeeves_mode: "explorer" | "auditor" | "architect"
      ministry_role:
        | "site_admin"
        | "small_group_leader"
        | "evangelism_lead"
        | "prayer_lead"
        | "sabbath_school_lead"
        | "youth_lead"
        | "personal_ministry_admin"
        | "bible_worker"
        | "announcements_lead"
        | "events_lead"
        | "community_lead"
        | "livestream_lead"
        | "discipleship_lead"
      pt_mastery_level: "beginner" | "intermediate" | "master"
      pt_pain_point_type: "diagnostic" | "symptomatic"
      pt_study_burden:
        | "prophecy"
        | "sanctuary_gospel"
        | "study_method"
        | "parables_symbols"
        | "sermon_building"
        | "apologetics"
        | "christ_centered"
        | "study_habits"
      pt_user_role:
        | "pastor"
        | "teacher"
        | "lay_member"
        | "student"
        | "new_believer"
        | "scholar"
        | "explorer"
      rights_flag: "ok_store_fulltext" | "store_excerpt_only" | "reference_only"
      source_role: "supports" | "context" | "counter" | "method"
      source_stance:
        | "supports_sda_standard"
        | "neutral"
        | "critiques_sda_standard"
        | "mixed"
      source_type:
        | "scripture"
        | "sop"
        | "historical_primary"
        | "historical_secondary"
        | "theology_reference"
        | "dictionary_encyclopedia"
        | "user_note"
        | "web_article"
        | "video_transcript"
      spark_kind:
        | "hypothesis"
        | "pattern"
        | "parallel"
        | "warning"
        | "application"
        | "question"
      spark_ladder_relationship: "originated_from" | "expanded_into"
      spark_status: "draft" | "saved" | "promoted" | "archived"
      verification_state:
        | "unverified"
        | "textually_supported"
        | "historically_supported"
        | "logic_checked"
        | "counterpoints_added"
        | "validated"
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
      app_role: ["admin", "moderator", "user", "video_admin", "owner"],
      church_member_role: [
        "admin",
        "leader",
        "member",
        "bible_worker",
        "guest",
      ],
      church_tier: ["tier1", "tier2", "tier3"],
      claim_ladder_status: ["draft", "saved", "validated"],
      confidence_level: ["speculative", "tentative", "moderate", "strong"],
      credibility_tier: ["A", "B", "C", "D"],
      interpretive_lens: ["sda", "neutral_historical", "comparative"],
      jeeves_mode: ["explorer", "auditor", "architect"],
      ministry_role: [
        "site_admin",
        "small_group_leader",
        "evangelism_lead",
        "prayer_lead",
        "sabbath_school_lead",
        "youth_lead",
        "personal_ministry_admin",
        "bible_worker",
        "announcements_lead",
        "events_lead",
        "community_lead",
        "livestream_lead",
        "discipleship_lead",
      ],
      pt_mastery_level: ["beginner", "intermediate", "master"],
      pt_pain_point_type: ["diagnostic", "symptomatic"],
      pt_study_burden: [
        "prophecy",
        "sanctuary_gospel",
        "study_method",
        "parables_symbols",
        "sermon_building",
        "apologetics",
        "christ_centered",
        "study_habits",
      ],
      pt_user_role: [
        "pastor",
        "teacher",
        "lay_member",
        "student",
        "new_believer",
        "scholar",
        "explorer",
      ],
      rights_flag: [
        "ok_store_fulltext",
        "store_excerpt_only",
        "reference_only",
      ],
      source_role: ["supports", "context", "counter", "method"],
      source_stance: [
        "supports_sda_standard",
        "neutral",
        "critiques_sda_standard",
        "mixed",
      ],
      source_type: [
        "scripture",
        "sop",
        "historical_primary",
        "historical_secondary",
        "theology_reference",
        "dictionary_encyclopedia",
        "user_note",
        "web_article",
        "video_transcript",
      ],
      spark_kind: [
        "hypothesis",
        "pattern",
        "parallel",
        "warning",
        "application",
        "question",
      ],
      spark_ladder_relationship: ["originated_from", "expanded_into"],
      spark_status: ["draft", "saved", "promoted", "archived"],
      verification_state: [
        "unverified",
        "textually_supported",
        "historically_supported",
        "logic_checked",
        "counterpoints_added",
        "validated",
      ],
    },
  },
} as const

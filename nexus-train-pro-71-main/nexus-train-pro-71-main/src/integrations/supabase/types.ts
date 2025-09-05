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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assignment_submissions: {
        Row: {
          assignment_id: string
          feedback: string | null
          file_url: string | null
          grade: number | null
          graded_by: string | null
          id: string
          student_id: string
          submitted_at: string | null
        }
        Insert: {
          assignment_id: string
          feedback?: string | null
          file_url?: string | null
          grade?: number | null
          graded_by?: string | null
          id?: string
          student_id: string
          submitted_at?: string | null
        }
        Update: {
          assignment_id?: string
          feedback?: string | null
          file_url?: string | null
          grade?: number | null
          graded_by?: string | null
          id?: string
          student_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_graded_by_fkey"
            columns: ["graded_by"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "assignment_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      assignment_templates: {
        Row: {
          created_at: string
          id: string
          instructions: string | null
          title: string
          trainer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          instructions?: string | null
          title: string
          trainer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          instructions?: string | null
          title?: string
          trainer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_templates_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      assignments: {
        Row: {
          course_id: string
          created_at: string
          created_by: string | null
          due_at: string | null
          id: string
          instructions: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by?: string | null
          due_at?: string | null
          id?: string
          instructions?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by?: string | null
          due_at?: string | null
          id?: string
          instructions?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      attendance_logs: {
        Row: {
          class_id: string
          created_at: string
          id: string
          joined_at: string | null
          left_at: string | null
          status: string
          student_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          status?: string
          student_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_logs_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      certificate_templates: {
        Row: {
          background_url: string | null
          created_at: string
          id: string
          name: string
          signature_url: string | null
        }
        Insert: {
          background_url?: string | null
          created_at?: string
          id?: string
          name: string
          signature_url?: string | null
        }
        Update: {
          background_url?: string | null
          created_at?: string
          id?: string
          name?: string
          signature_url?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          code: string
          course_id: string | null
          id: string
          issued_at: string
          pdf_url: string | null
          qr_url: string | null
          user_id: string
        }
        Insert: {
          code: string
          course_id?: string | null
          id?: string
          issued_at?: string
          pdf_url?: string | null
          qr_url?: string | null
          user_id: string
        }
        Update: {
          code?: string
          course_id?: string | null
          id?: string
          issued_at?: string
          pdf_url?: string | null
          qr_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      classes: {
        Row: {
          course_id: string
          created_at: string
          ends_at: string
          id: string
          is_cancelled: boolean
          location: string | null
          meet_link: string | null
          starts_at: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          ends_at: string
          id?: string
          is_cancelled?: boolean
          location?: string | null
          meet_link?: string | null
          starts_at: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          ends_at?: string
          id?: string
          is_cancelled?: boolean
          location?: string | null
          meet_link?: string | null
          starts_at?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          call_type: string | null
          created_at: string | null
          email: string | null
          id: string
          message: string | null
          name: string | null
          phone: string | null
          preferred_time: string | null
          requested_date: string | null
          status: string | null
          timezone: string | null
          trainer_id: string | null
          user_id: string | null
        }
        Insert: {
          call_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          preferred_time?: string | null
          requested_date?: string | null
          status?: string | null
          timezone?: string | null
          trainer_id?: string | null
          user_id?: string | null
        }
        Update: {
          call_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          preferred_time?: string | null
          requested_date?: string | null
          status?: string | null
          timezone?: string | null
          trainer_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          course_id: string
          enrolled_at: string
          id: string
          progress_percentage: number | null
          student_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          student_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      courses: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          end_at: string | null
          id: string
          price: number
          recording_url: string | null
          recurrence: string | null
          start_at: string | null
          status: string
          thumbnail_url: string | null
          title: string
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          price?: number
          recording_url?: string | null
          recurrence?: string | null
          start_at?: string | null
          status?: string
          thumbnail_url?: string | null
          title: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_at?: string | null
          id?: string
          price?: number
          recording_url?: string | null
          recurrence?: string | null
          start_at?: string | null
          status?: string
          thumbnail_url?: string | null
          title?: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_cents: number
          currency: string
          id: string
          issued_at: string
          number: string | null
          payment_id: string | null
          pdf_url: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          currency: string
          id?: string
          issued_at?: string
          number?: string | null
          payment_id?: string | null
          pdf_url?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          currency?: string
          id?: string
          issued_at?: string
          number?: string | null
          payment_id?: string | null
          pdf_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          course_id: string | null
          course_title: string | null
          created_at: string
          currency: string
          enrollment_id: string | null
          id: string
          method: string | null
          notes: string | null
          payer_email: string | null
          payer_name: string | null
          payer_phone: string | null
          plan: string | null
          provider: string | null
          provider_payment_id: string | null
          screenshot_url: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          course_id?: string | null
          course_title?: string | null
          created_at?: string
          currency?: string
          enrollment_id?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          plan?: string | null
          provider?: string | null
          provider_payment_id?: string | null
          screenshot_url?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          course_id?: string | null
          course_title?: string | null
          created_at?: string
          currency?: string
          enrollment_id?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          plan?: string | null
          provider?: string | null
          provider_payment_id?: string | null
          screenshot_url?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          must_change_password: boolean
          phone: string | null
          role: string
          student_id: string | null
          teacher_id: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          must_change_password?: boolean
          phone?: string | null
          role: string
          student_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          must_change_password?: boolean
          phone?: string | null
          role?: string
          student_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          payment_id: string
          reason: string | null
          status: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          payment_id: string
          reason?: string | null
          status?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          payment_id?: string
          reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          assignment_id: string
          attachments: string[] | null
          feedback: string | null
          grade: number | null
          graded_at: string | null
          graded_by: string | null
          id: string
          late_submission: boolean | null
          status: string | null
          student_id: string
          submission_text: string | null
          submission_url: string | null
          submitted_at: string | null
        }
        Insert: {
          assignment_id: string
          attachments?: string[] | null
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          late_submission?: boolean | null
          status?: string | null
          student_id: string
          submission_text?: string | null
          submission_url?: string | null
          submitted_at?: string | null
        }
        Update: {
          assignment_id?: string
          attachments?: string[] | null
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          late_submission?: boolean | null
          status?: string | null
          student_id?: string
          submission_text?: string | null
          submission_url?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_fk"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_student_fk"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          course_id: string
          course_price: string | null
          course_title: string | null
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          course_price?: string | null
          course_title?: string | null
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          course_price?: string | null
          course_title?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "student_performance"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      analytics_revenue: {
        Row: {
          month: string | null
          total_enrollments: number | null
          total_revenue: number | null
          verified_enrollments: number | null
        }
        Relationships: []
      }
      student_performance: {
        Row: {
          avg_grade: number | null
          certificates_earned: number | null
          classes_attended: number | null
          courses_enrolled: number | null
          courses_verified: number | null
          email: string | null
          full_name: string | null
          total_classes: number | null
          total_submissions: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assert_password_changed: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      calculate_enrollment_progress: {
        Args: { p_course_id: string; p_student_id: string }
        Returns: number
      }
      generate_certificate_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_certificate_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_admin_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          pending_payments: number
          total_courses: number
          total_payments: number
          total_revenue: number
          total_students: number
          total_trainers: number
          verified_payments: number
        }[]
      }
      get_signed_certificate_url: {
        Args: { certificate_id: string }
        Returns: string
      }
      get_trainer_stats: {
        Args: { p_trainer_id: string }
        Returns: {
          total_assignments: number
          total_classes: number
          total_courses: number
          total_students: number
        }[]
      }
      is_admin: {
        Args: { uid: string }
        Returns: boolean
      }
      issue_certificate: {
        Args: {
          p_course_code?: string
          p_course_id?: string
          p_issued_by?: string
          p_user_id: string
        }
        Returns: {
          certificate_id: string
          id: string
          issued_at: string
        }[]
      }
      verify_certificate: {
        Args: { code_input: string }
        Returns: {
          certificate_id: string
          course_id: string
          issued_at: string
          pdf_url: string
          user_id: string
        }[]
      }
      verify_certificate_by_code: {
        Args: { p_code: string }
        Returns: {
          certificate_id: string
          course_id: string
          course_title: string
          is_valid: boolean
          issued_at: string
          pdf_url: string
          student_name: string
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

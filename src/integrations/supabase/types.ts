export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content_cache: {
        Row: {
          city: string
          content: string
          created_at: string
          expires_at: string | null
          id: string
          service: string
          type: string
        }
        Insert: {
          city: string
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          service: string
          type: string
        }
        Update: {
          city?: string
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          service?: string
          type?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company_size: string | null
          created_at: string
          current_software: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          service_interest: string | null
          website: string | null
        }
        Insert: {
          company_size?: string | null
          created_at?: string
          current_software?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          service_interest?: string | null
          website?: string | null
        }
        Update: {
          company_size?: string | null
          created_at?: string
          current_software?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          service_interest?: string | null
          website?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string
          id: string
          is_popular: boolean | null
          name: string
          population: number | null
          region: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_popular?: boolean | null
          name: string
          population?: number | null
          region?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_popular?: boolean | null
          name?: string
          population?: number | null
          region?: string | null
          slug?: string
        }
        Relationships: []
      }
      niches: {
        Row: {
          created_at: string
          description: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      request_logs: {
        Row: {
          created_at: string | null
          endpoint: string
          error_code: string | null
          id: string
          response_time: number | null
          success: boolean | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          error_code?: string | null
          id?: string
          response_time?: number | null
          success?: boolean | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          error_code?: string | null
          id?: string
          response_time?: number | null
          success?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

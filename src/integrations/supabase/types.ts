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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          auto_withdraw_enabled: boolean | null
          created_at: string | null
          id: string
          min_withdraw_amount: number | null
          owner_eth_address: string
          updated_at: string | null
          withdraw_frequency_hours: number | null
        }
        Insert: {
          auto_withdraw_enabled?: boolean | null
          created_at?: string | null
          id?: string
          min_withdraw_amount?: number | null
          owner_eth_address: string
          updated_at?: string | null
          withdraw_frequency_hours?: number | null
        }
        Update: {
          auto_withdraw_enabled?: boolean | null
          created_at?: string | null
          id?: string
          min_withdraw_amount?: number | null
          owner_eth_address?: string
          updated_at?: string | null
          withdraw_frequency_hours?: number | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          project_id: string
          requests_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name?: string
          project_id: string
          requests_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          project_id?: string
          requests_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage: {
        Row: {
          api_key_id: string | null
          created_at: string
          endpoint: string
          id: string
          method: string
          project_id: string
          response_time_ms: number | null
          status_code: number | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string
          endpoint: string
          id?: string
          method: string
          project_id: string
          response_time_ms?: number | null
          status_code?: number | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string
          endpoint?: string
          id?: string
          method?: string
          project_id?: string
          response_time_ms?: number | null
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      balances: {
        Row: {
          credits: number
          gas_balance: number
          id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          credits?: number
          gas_balance?: number
          id?: string
          project_id: string
          updated_at?: string
        }
        Update: {
          credits?: number
          gas_balance?: number
          id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "balances_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      networks: {
        Row: {
          chain_id: number
          explorer_url: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          is_testnet: boolean
          name: string
          rpc_url: string
          symbol: string
        }
        Insert: {
          chain_id: number
          explorer_url?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          is_testnet?: boolean
          name: string
          rpc_url: string
          symbol: string
        }
        Update: {
          chain_id?: number
          explorer_url?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          is_testnet?: boolean
          name?: string
          rpc_url?: string
          symbol?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          plan: Database["public"]["Enums"]["project_plan"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          plan?: Database["public"]["Enums"]["project_plan"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          plan?: Database["public"]["Enums"]["project_plan"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      revenue_logs: {
        Row: {
          amount_usd: number
          created_at: string | null
          fee_amount_usd: number
          fee_percentage: number | null
          id: string
          project_id: string
          transaction_id: string | null
        }
        Insert: {
          amount_usd: number
          created_at?: string | null
          fee_amount_usd: number
          fee_percentage?: number | null
          id?: string
          project_id: string
          transaction_id?: string | null
        }
        Update: {
          amount_usd?: number
          created_at?: string | null
          fee_amount_usd?: number
          fee_percentage?: number | null
          id?: string
          project_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          confirmed_at: string | null
          created_at: string
          data: Json | null
          error_message: string | null
          from_address: string | null
          gas_price: number | null
          gas_used: number | null
          id: string
          network_id: string | null
          project_id: string
          status: Database["public"]["Enums"]["transaction_status"]
          to_address: string | null
          tx_hash: string | null
          tx_type: Database["public"]["Enums"]["transaction_type"]
          value: number | null
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          data?: Json | null
          error_message?: string | null
          from_address?: string | null
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          network_id?: string | null
          project_id: string
          status?: Database["public"]["Enums"]["transaction_status"]
          to_address?: string | null
          tx_hash?: string | null
          tx_type: Database["public"]["Enums"]["transaction_type"]
          value?: number | null
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          data?: Json | null
          error_message?: string | null
          from_address?: string | null
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          network_id?: string | null
          project_id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          to_address?: string | null
          tx_hash?: string | null
          tx_type?: Database["public"]["Enums"]["transaction_type"]
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "networks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          amount_eth: number | null
          amount_usd: number
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          eth_price_usd: number | null
          id: string
          status: string | null
          to_address: string
          tx_hash: string | null
        }
        Insert: {
          amount_eth?: number | null
          amount_usd: number
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          eth_price_usd?: number | null
          id?: string
          status?: string | null
          to_address: string
          tx_hash?: string | null
        }
        Update: {
          amount_eth?: number | null
          amount_usd?: number
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          eth_price_usd?: number | null
          id?: string
          status?: string | null
          to_address?: string
          tx_hash?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_api_key_prefix: { Args: never; Returns: string }
      get_pending_revenue: { Args: never; Returns: number }
      increment_key_requests: { Args: { key_id: string }; Returns: undefined }
    }
    Enums: {
      project_plan: "starter" | "pro" | "enterprise"
      transaction_status: "pending" | "confirmed" | "failed"
      transaction_type:
        | "transfer"
        | "swap"
        | "mint"
        | "burn"
        | "contract_call"
        | "gas_topup"
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
      project_plan: ["starter", "pro", "enterprise"],
      transaction_status: ["pending", "confirmed", "failed"],
      transaction_type: [
        "transfer",
        "swap",
        "mint",
        "burn",
        "contract_call",
        "gas_topup",
      ],
    },
  },
} as const

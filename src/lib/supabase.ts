import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      portfolios: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          description?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      holdings: {
        Row: {
          id: string
          portfolio_id: string
          symbol: string
          name: string
          shares: number
          avg_price: number
          current_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          symbol: string
          name: string
          shares: number
          avg_price: number
          current_price?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          symbol?: string
          name?: string
          shares?: number
          avg_price?: number
          current_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      cash_balances: {
        Row: {
          id: string
          portfolio_id: string
          balance: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          portfolio_id: string
          type: 'buy' | 'sell' | 'deposit' | 'withdraw'
          symbol: string | null
          name: string | null
          shares: number | null
          price: number | null
          amount: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          type: 'buy' | 'sell' | 'deposit' | 'withdraw'
          symbol?: string | null
          name?: string | null
          shares?: number | null
          price?: number | null
          amount: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          type?: 'buy' | 'sell' | 'deposit' | 'withdraw'
          symbol?: string | null
          name?: string | null
          shares?: number | null
          price?: number | null
          amount?: number
          description?: string | null
          created_at?: string
        }
      }
      watchlists: {
        Row: {
          id: string
          user_id: string
          name: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      watchlist_items: {
        Row: {
          id: string
          watchlist_id: string
          symbol: string
          name: string
          added_at: string
        }
        Insert: {
          id?: string
          watchlist_id: string
          symbol: string
          name: string
          added_at?: string
        }
        Update: {
          id?: string
          watchlist_id?: string
          symbol?: string
          name?: string
          added_at?: string
        }
      }
    }
  }
}

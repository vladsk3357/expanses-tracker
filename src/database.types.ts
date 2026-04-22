export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ReceiptStatus = "pending" | "processing" | "complete" | "failed";

export interface Database {
  public: {
    Tables: {
      receipts: {
        Row: {
          id: string;
          user_id: string;
          storage_path: string;
          status: ReceiptStatus;
          merchant: string | null;
          purchased_at: string | null;
          currency: string | null;
          total: number | null;
          raw_extraction: Json | null;
          extraction_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          storage_path: string;
          status?: ReceiptStatus;
          merchant?: string | null;
          purchased_at?: string | null;
          currency?: string | null;
          total?: number | null;
          raw_extraction?: Json | null;
          extraction_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          storage_path?: string;
          status?: ReceiptStatus;
          merchant?: string | null;
          purchased_at?: string | null;
          currency?: string | null;
          total?: number | null;
          raw_extraction?: Json | null;
          extraction_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      receipt_line_items: {
        Row: {
          id: string;
          receipt_id: string;
          label: string;
          quantity: number | null;
          unit_price: number | null;
          category: string | null;
          line_total: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          receipt_id: string;
          label: string;
          quantity?: number | null;
          unit_price?: number | null;
          category?: string | null;
          line_total?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          receipt_id?: string;
          label?: string;
          quantity?: number | null;
          unit_price?: number | null;
          category?: string | null;
          line_total?: number | null;
          created_at?: string;
        };
      };
    };
    Views: {
      receipt_category_totals: {
        Row: {
          user_id: string | null;
          category: string | null;
          total_amount: number | null;
          line_count: number | null;
        };
      };
    };
  };
}

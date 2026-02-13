
// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: string 
          nombre: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string 
          nombre: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string 
          nombre?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string
          precioDetalle: number
          imagenes: string[]
          idCategoria: string 
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion: string
          precioDetalle: number
          imagenes: string[]
          idCategoria: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string
          precioDetalle?: number
          imagenes?: string[]
          idCategoria?: string
          slug?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_idCategoria_fkey" 
            columns: ["idCategoria"]
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          }
        ]
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

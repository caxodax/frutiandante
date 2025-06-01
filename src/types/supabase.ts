// src/types/supabase.ts
// Este archivo es un placeholder. Deberías generar tus tipos de Supabase
// usando el CLI de Supabase para obtener un tipado preciso de tu base de datos.
// Comando: npx supabase gen types typescript --project-id <tu-project-id> --schema public > src/types/supabase.ts
// Reemplaza <tu-project-id> con el ID de tu proyecto de Supabase.

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
          id: string // o number si usas serial como PK
          nombre: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string // o number
          nombre: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string // o number
          nombre?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      productos: { // Ejemplo, si también gestionas productos con Supabase
        Row: {
          id: string
          nombre: string
          descripcion: string
          precioDetalle: number
          precioMayorista: number
          imagenes: string[]
          idCategoria: string // FK a categorias.id
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion: string
          precioDetalle: number
          precioMayorista: number
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
          precioMayorista?: number
          imagenes?: string[]
          idCategoria?: string
          slug?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_idCategoria_fkey" // Asegúrate que coincida con tu FK
            columns: ["idCategoria"]
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          }
        ]
      }
      // ...puedes añadir otras tablas aquí
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

// Helper para extraer tipos Row, Insert, Update de las tablas
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
// ... y así sucesivamente para otros tipos que puedas necesitar

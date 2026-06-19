export interface TraduccionItem {
  titulo?:      string
  subtitulo?:   string
  descripcion?: string
  bullets?:     string[]
  pregunta?:    string
  respuesta?:   string
  cta_texto?:   string
  trust_items?: string[]
}

export type Traducciones = {
  en?: TraduccionItem
  fr?: TraduccionItem
  [locale: string]: TraduccionItem | undefined
}

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
      funcionalidades: {
        Row: {
          id:           string
          orden:        number
          icono:        string
          titulo:       string
          descripcion:  string
          bullets:      string[]
          imagen_url:   string | null
          imagen_path:  string | null
          visible:      boolean
          traducciones: Json
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:           string
          orden?:        number
          icono?:        string
          titulo:        string
          descripcion:   string
          bullets?:      string[]
          imagen_url?:   string | null
          imagen_path?:  string | null
          visible?:      boolean
          traducciones?: Json
          created_at?:   string
          updated_at?:   string
        }
        Update: {
          orden?:        number
          icono?:        string
          titulo?:       string
          descripcion?:  string
          bullets?:      string[]
          imagen_url?:   string | null
          imagen_path?:  string | null
          visible?:      boolean
          traducciones?: Json
          updated_at?:   string
        }
        Relationships: []
      }
      beneficios: {
        Row: {
          id:           string
          orden:        number
          icono:        string
          titulo:       string
          descripcion:  string
          destacado:    boolean
          visible:      boolean
          traducciones: Json
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:           string
          orden?:        number
          icono?:        string
          titulo:        string
          descripcion:   string
          destacado?:    boolean
          visible?:      boolean
          traducciones?: Json
          created_at?:   string
          updated_at?:   string
        }
        Update: {
          orden?:        number
          icono?:        string
          titulo?:       string
          descripcion?:  string
          destacado?:    boolean
          visible?:      boolean
          traducciones?: Json
          updated_at?:   string
        }
        Relationships: []
      }
      planes_config: {
        Row: {
          id:           string
          titulo:       string
          subtitulo:    string
          descripcion:  string | null
          cta_texto:    string
          trust_items:  string[]
          traducciones: Json
          updated_at:   string
        }
        Insert: {
          id?:           string
          titulo?:       string
          subtitulo?:    string
          descripcion?:  string | null
          cta_texto?:    string
          trust_items?:  string[]
          traducciones?: Json
          updated_at?:   string
        }
        Update: {
          titulo?:       string
          subtitulo?:    string
          descripcion?:  string | null
          cta_texto?:    string
          trust_items?:  string[]
          traducciones?: Json
          updated_at?:   string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id:         string
          nombre:     string
          canal:      'whatsapp' | 'email'
          contacto:   string
          estado:     'nuevo' | 'en_contacto' | 'cerrado'
          notas:      string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?:         string
          nombre:      string
          canal:       'whatsapp' | 'email'
          contacto:    string
          estado?:     'nuevo' | 'en_contacto' | 'cerrado'
          notas?:      string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          nombre?:     string
          canal?:      'whatsapp' | 'email'
          contacto?:   string
          estado?:     'nuevo' | 'en_contacto' | 'cerrado'
          notas?:      string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      canal_tipo:  'whatsapp' | 'email'
      lead_estado: 'nuevo' | 'en_contacto' | 'cerrado'
    }
  }
}

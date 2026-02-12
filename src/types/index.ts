export interface Producto {
  id: string; // Se mantiene como string, pero en Supabase podría ser number o UUID
  nombre: string;
  descripcion: string;
  precioDetalle: number;
  precioMayorista: number;
  imagenes: string[]; // URLs
  idCategoria: string; // o number si el ID de categoría en Supabase es number
  slug: string;
  created_at?: string; // Añadido para Supabase
}

export interface Categoria {
  id?: string | number; // Hacer el ID opcional para la creación, Supabase lo genera
  nombre: string;
  slug: string;
  created_at?: string; // Añadido para Supabase
  // Puedes añadir cualquier otro campo que tengas en tu tabla de Supabase, ej:
  // cantidad_productos?: number; 
}

export interface EnlaceRedSocial {
  id: string;
  plataforma: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'YouTube' | 'TikTok';
  url: string;
  created_at?: string; // Añadido para Supabase
}

export interface ConfiguracionSitio {
  id?: string | number;
  urlLogo: string;
  nombreEmpresa: string;
  enlacesRedesSociales: EnlaceRedSocial[];
  numeroWhatsapp: string;
  // Campos para la página About
  tituloAbout?: string;
  subtituloAbout?: string;
  historiaAbout?: string;
  misionAbout?: string;
  visionAbout?: string;
  urlImagenAbout?: string;
  created_at?: string; // Añadido para Supabase
}

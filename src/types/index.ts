
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precioDetalle: number;
  imagenes: string[];
  idCategoria: string;
  slug: string;
  created_at?: string;
}

export interface Categoria {
  id?: string | number;
  nombre: string;
  slug: string;
  imagen?: string;
  created_at?: string;
}

export interface EnlaceRedSocial {
  id: string;
  plataforma: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'YouTube' | 'TikTok';
  url: string;
  created_at?: string;
}

export interface ConfiguracionSitio {
  id?: string | number;
  urlLogo: string;
  nombreEmpresa: string;
  enlacesRedesSociales: EnlaceRedSocial[];
  numeroWhatsapp: string;
  tituloAbout?: string;
  subtituloAbout?: string;
  historiaAbout?: string;
  misionAbout?: string;
  visionAbout?: string;
  urlImagenAbout?: string;
  porcentajeDescuentoSegundoPedido?: number;
  // Datos Bancarios
  banco?: string;
  tipoCuenta?: string;
  numeroCuenta?: string;
  rutCuenta?: string;
  emailCuenta?: string;
  created_at?: string;
}

export interface Pedido {
  id?: string;
  userId?: string;
  items: any[];
  total: number;
  estado: 'pendiente' | 'completado' | 'cancelado';
  created_at: string;
}

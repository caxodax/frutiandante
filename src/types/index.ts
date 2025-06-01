export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precioDetalle: number;
  precioMayorista: number;
  imagenes: string[]; // URLs
  idCategoria: string;
  slug: string; // Se mantiene 'slug' por ser un término común en desarrollo web para URLs amigables
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

export interface EnlaceRedSocial {
  id: string;
  plataforma: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'YouTube' | 'TikTok';
  url: string;
}

export interface ConfiguracionSitio {
  urlLogo: string;
  nombreEmpresa: string;
  enlacesRedesSociales: EnlaceRedSocial[];
  numeroWhatsapp: string;
}

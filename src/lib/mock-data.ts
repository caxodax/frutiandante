import type { Producto, Categoria, ConfiguracionSitio, EnlaceRedSocial } from '@/tipos';

export const categoriasSimuladas: Categoria[] = [
  { id: '1', nombre: 'Tecnología', slug: 'tecnologia' },
  { id: '2', nombre: 'Moda Urbana', slug: 'moda-urbana' },
  { id: '3', nombre: 'Hogar Inteligente', slug: 'hogar-inteligente' },
  { id: '4', nombre: 'Libros y Cultura', slug: 'libros-cultura' },
  { id: '5', nombre: 'Deportes Outdoor', slug: 'deportes-outdoor'},
];

export const productosSimulados: Producto[] = [
  {
    id: '1',
    nombre: 'Auriculares Inalámbricos ProSound X',
    descripcion: 'Sumérgete en un sonido cristalino con cancelación activa de ruido. Diseño ergonómico y hasta 30 horas de batería. Ideales para música y llamadas.',
    precioDetalle: 179.99,
    precioMayorista: 139.99,
    imagenes: ['https://placehold.co/600x600.png?text=Auriculares+ProSound+1', 'https://placehold.co/600x600.png?text=Auriculares+ProSound+2', 'https://placehold.co/600x600.png?text=Auriculares+ProSound+3'],
    idCategoria: '1',
    slug: 'auriculares-inalambricos-prosound-x',
  },
  {
    id: '2',
    nombre: 'Smartwatch Chronos V5',
    descripcion: 'Tu asistente personal en la muñeca. Monitorea tu salud, recibe notificaciones y personaliza tus esferas. Resistente al agua y compatible con iOS/Android.',
    precioDetalle: 229.00,
    precioMayorista: 189.00,
    imagenes: ['https://placehold.co/600x600.png?text=Smartwatch+Chronos+1', 'https://placehold.co/600x600.png?text=Smartwatch+Chronos+2'],
    idCategoria: '1',
    slug: 'smartwatch-chronos-v5',
  },
  {
    id: '3',
    nombre: 'Chaqueta Bomber "Urban Explorer"',
    descripcion: 'Estilo y funcionalidad se unen en esta chaqueta bomber. Tejido resistente al viento y múltiples bolsillos. Perfecta para el día a día.',
    precioDetalle: 89.99,
    precioMayorista: 69.99,
    imagenes: ['https://placehold.co/600x600.png?text=Chaqueta+Bomber+1', 'https://placehold.co/600x600.png?text=Chaqueta+Bomber+2'],
    idCategoria: '2',
    slug: 'chaqueta-bomber-urban-explorer',
  },
  {
    id: '4',
    nombre: 'Lámpara de Escritorio LED Inteligente',
    descripcion: 'Ilumina tu espacio de trabajo con estilo. Control por voz, múltiples temperaturas de color y temporizador. Diseño minimalista y moderno.',
    precioDetalle: 59.50,
    precioMayorista: 45.00,
    imagenes: ['https://placehold.co/600x600.png?text=Lampara+LED+1'],
    idCategoria: '3',
    slug: 'lampara-escritorio-led-inteligente',
  },
   {
    id: '5',
    nombre: 'Zapatillas "Street Runner Max"',
    descripcion: 'Comodidad y diseño vanguardista para tus pies. Amortiguación reactiva y materiales transpirables. Ideales para un look casual y deportivo.',
    precioDetalle: 119.90,
    precioMayorista: 89.90,
    imagenes: ['https://placehold.co/600x600.png?text=Zapatillas+Street+1', 'https://placehold.co/600x600.png?text=Zapatillas+Street+2'],
    idCategoria: '2',
    slug: 'zapatillas-street-runner-max',
  },
  {
    id: '6',
    nombre: 'Tablet Gráfica "CreatorPad 10"',
    descripcion: 'Desata tu creatividad con esta tablet gráfica profesional. Alta sensibilidad a la presión, pantalla HD y compatibilidad universal. Incluye lápiz óptico.',
    precioDetalle: 349.00,
    precioMayorista: 299.00,
    imagenes: ['https://placehold.co/600x600.png?text=Tablet+Grafica+1', 'https://placehold.co/600x600.png?text=Tablet+Grafica+2', 'https://placehold.co/600x600.png?text=Tablet+Grafica+3'],
    idCategoria: '1',
    slug: 'tablet-grafica-creatorpad-10',
  },
  {
    id: '7',
    nombre: 'Set de Altavoces Inteligentes "HomeSound Duo"',
    descripcion: 'Sonido envolvente para tu hogar. Control por voz, multi-room y conexión Bluetooth/Wi-Fi. Diseño elegante que se adapta a cualquier decoración.',
    precioDetalle: 299.00,
    precioMayorista: 249.00,
    imagenes: ['https://placehold.co/600x600.png?text=Altavoces+Duo+1', 'https://placehold.co/600x600.png?text=Altavoces+Duo+2'],
    idCategoria: '3',
    slug: 'set-altavoces-inteligentes-homesound-duo',
  },
  {
    id: '8',
    nombre: 'Mochila Antirrobo "Guardian X"',
    descripcion: 'Viaja con seguridad y estilo. Materiales resistentes a cortes, compartimentos ocultos y puerto de carga USB. Espaciosa y ergonómica.',
    precioDetalle: 75.00,
    precioMayorista: 55.00,
    imagenes: ['https://placehold.co/600x600.png?text=Mochila+Guardian+1'],
    idCategoria: '2', // Podría ser tecnología también, pero la ponemos en moda por ser un accesorio.
    slug: 'mochila-antirrobo-guardian-x',
  }
];

export const enlacesRedesSocialesSimulados: EnlaceRedSocial[] = [
  { id: '1', plataforma: 'Facebook', url: 'https://facebook.com/velozcommerce' },
  { id: '2', plataforma: 'Instagram', url: 'https://instagram.com/velozcommerce' },
  { id: '3', plataforma: 'Twitter', url: 'https://twitter.com/velozcommerce' },
  { id: '4', plataforma: 'LinkedIn', url: 'https://linkedin.com/company/velozcommerce' },
];

export const configuracionSitioSimulada: ConfiguracionSitio = {
  urlLogo: 'https://placehold.co/200x60.png?text=Veloz&font=poppins&fontColor=ffffff&bgColor=217_91_60', // Logo con colores nuevos
  nombreEmpresa: 'Veloz Commerce',
  enlacesRedesSociales: enlacesRedesSocialesSimulados,
  numeroWhatsapp: '5491123456789', // Número de ejemplo con prefijo internacional
};

// Funciones auxiliares para simular la obtención de datos
export const obtenerProductos = async (): Promise<Producto[]> => {
  await new Promise(resolve => setTimeout(resolve, 200)); 
  return productosSimulados;
};

export const obtenerProductoPorSlug = async (slug: string): Promise<Producto | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return productosSimulados.find(p => p.slug === slug);
};

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return categoriasSimuladas;
};

export const obtenerCategoriaPorSlug = async (slug: string): Promise<Categoria | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return categoriasSimuladas.find(c => c.slug === slug);
};

export const obtenerProductosPorIdCategoria = async (idCategoria: string): Promise<Producto[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return productosSimulados.filter(p => p.idCategoria === idCategoria);
}

export const obtenerConfiguracionSitio = async (): Promise<ConfiguracionSitio> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return configuracionSitioSimulada;
};

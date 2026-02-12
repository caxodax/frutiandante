import type { Producto, Categoria, ConfiguracionSitio, EnlaceRedSocial } from '@/tipos';

// Los datos de categorías simuladas ya no se usan directamente en la página de listado de categorías del admin,
// pero podrían ser útiles para otras partes del sitio o para pruebas.
export const categoriasSimuladas: Categoria[] = [
  { id: '1', nombre: 'Tecnología Avanzada', slug: 'tecnologia-avanzada' },
  { id: '2', nombre: 'Moda Urbana Premium', slug: 'moda-urbana-premium' },
  { id: '3', nombre: 'Hogar Inteligente Plus', slug: 'hogar-inteligente-plus' },
  { id: '4', nombre: 'Libros y Cultura Selecta', slug: 'libros-cultura-selecta' },
  { id: '5', nombre: 'Deportes Outdoor Extremo', slug: 'deportes-outdoor-extremo'},
];

export const productosSimulados: Producto[] = [
  {
    id: '1',
    nombre: 'Auriculares Inalámbricos ProSound X',
    descripcion: 'Sumérgete en un sonido cristalino con cancelación activa de ruido. Diseño ergonómico y hasta 30 horas de batería. Ideales para música y llamadas.',
    precioDetalle: 179990,
    precioMayorista: 139990,
    imagenes: ['https://picsum.photos/seed/1/600/600', 'https://picsum.photos/seed/11/600/600', 'https://picsum.photos/seed/111/600/600'],
    idCategoria: '1',
    slug: 'auriculares-inalambricos-prosound-x',
  },
  {
    id: '2',
    nombre: 'Smartwatch Chronos V5 Deluxe',
    descripcion: 'Tu asistente personal en la muñeca. Monitorea tu salud, recibe notificaciones y personaliza tus esferas. Resistente al agua y compatible con iOS/Android.',
    precioDetalle: 229000,
    precioMayorista: 189000,
    imagenes: ['https://picsum.photos/seed/2/600/600', 'https://picsum.photos/seed/22/600/600'],
    idCategoria: '1',
    slug: 'smartwatch-chronos-v5-deluxe',
  },
  {
    id: '3',
    nombre: 'Chaqueta Bomber "Urban Explorer Pro"',
    descripcion: 'Estilo y funcionalidad se unen en esta chaqueta bomber. Tejido resistente al viento y múltiples bolsillos. Perfecta para el día a día.',
    precioDetalle: 89990,
    precioMayorista: 69990,
    imagenes: ['https://picsum.photos/seed/3/600/600', 'https://picsum.photos/seed/33/600/600'],
    idCategoria: '2',
    slug: 'chaqueta-bomber-urban-explorer-pro',
  },
  {
    id: '4',
    nombre: 'Lámpara de Escritorio LED Inteligente "NovaLum"',
    descripcion: 'Ilumina tu espacio de trabajo con estilo. Control por voz, múltiples temperaturas de color y temporizador. Diseño minimalista y moderno.',
    precioDetalle: 59500,
    precioMayorista: 45000,
    imagenes: ['https://picsum.photos/seed/4/600/600'],
    idCategoria: '3',
    slug: 'lampara-escritorio-led-inteligente-novalum',
  },
   {
    id: '5',
    nombre: 'Zapatillas "Street Runner Max Elite"',
    descripcion: 'Comodidad y diseño vanguardista para tus pies. Amortiguación reactiva y materiales transpirables. Ideales para un look casual y deportivo.',
    precioDetalle: 119900,
    precioMayorista: 89900,
    imagenes: ['https://picsum.photos/seed/5/600/600', 'https://picsum.photos/seed/55/600/600'],
    idCategoria: '2',
    slug: 'zapatillas-street-runner-max-elite',
  },
  {
    id: '6',
    nombre: 'Tablet Gráfica "CreatorPad 10 Pro"',
    descripcion: 'Desata tu creatividad con esta tablet gráfica profesional. Alta sensibilidad a la presión, pantalla HD y compatibilidad universal. Incluye lápiz óptico.',
    precioDetalle: 349000,
    precioMayorista: 299000,
    imagenes: ['https://picsum.photos/seed/6/600/600', 'https://picsum.photos/seed/66/600/600', 'https://picsum.photos/seed/666/600/600'],
    idCategoria: '1',
    slug: 'tablet-grafica-creatorpad-10-pro',
  },
  {
    id: '7',
    nombre: 'Set de Altavoces Inteligentes "HomeSound Duo Max"',
    descripcion: 'Sonido envolvente para tu hogar. Control por voz, multi-room y conexión Bluetooth/Wi-Fi. Diseño elegante que se adapta a cualquier decoración.',
    precioDetalle: 299000,
    precioMayorista: 249000,
    imagenes: ['https://picsum.photos/seed/7/600/600', 'https://picsum.photos/seed/77/600/600'],
    idCategoria: '3',
    slug: 'set-altavoces-inteligentes-homesound-duo-max',
  },
  {
    id: '8',
    nombre: 'Mochila Antirrobo "Guardian X Secure"',
    descripcion: 'Viaja con seguridad y estilo. Materiales resistentes a cortes, compartimentos ocultos y puerto de carga USB. Espaciosa y ergonómica.',
    precioDetalle: 75000,
    precioMayorista: 55000,
    imagenes: ['https://picsum.photos/seed/8/600/600'],
    idCategoria: '2', 
    slug: 'mochila-antirrobo-guardian-x-secure',
  }
];

export const enlacesRedesSocialesSimulados: EnlaceRedSocial[] = [
  { id: '1', plataforma: 'Facebook', url: 'https://facebook.com/velozcommerce' },
  { id: '2', plataforma: 'Instagram', url: 'https://instagram.com/velozcommerce' },
  { id: '3', plataforma: 'Twitter', url: 'https://twitter.com/velozcommerce' },
  { id: '4', plataforma: 'LinkedIn', url: 'https://linkedin.com/company/velozcommerce' },
];

export const configuracionSitioSimulada: ConfiguracionSitio = {
  urlLogo: 'https://placehold.co/200x60.png?text=Veloz&font=poppins&bg=217_91_60&fc=ffffff',
  nombreEmpresa: 'Veloz Commerce',
  enlacesRedesSociales: enlacesRedesSocialesSimulados,
  numeroWhatsapp: '56912345678',
  tituloAbout: 'Innovación y Tecnología para todo Chile',
  subtituloAbout: 'Llevamos la vanguardia tecnológica directamente a tu puerta.',
  historiaAbout: 'Veloz Commerce nació con la visión de simplificar el acceso a productos tecnológicos de alta gama en Chile. Desde nuestros inicios, nos hemos enfocado en seleccionar cuidadosamente cada artículo de nuestro catálogo para asegurar que nuestros clientes reciban solo lo mejor del mercado global.',
  misionAbout: 'Proveer soluciones tecnológicas innovadoras y de alta calidad a precios competitivos, garantizando una experiencia de compra rápida, segura y confiable para todos los chilenos.',
  visionAbout: 'Convertirnos en el referente número uno de comercio electrónico en Chile, destacando por nuestra velocidad logística, atención personalizada y catálogo de vanguardia.',
  urlImagenAbout: 'https://picsum.photos/seed/about/1200/800',
};

// Funciones para obtener datos simulados (pueden coexistir con las de Supabase)
export const obtenerProductos = async (): Promise<Producto[]> => {
  // Simulación de carga de red
  await new Promise(resolve => setTimeout(resolve, 200)); 
  return productosSimulados;
};

export const obtenerProductoPorSlug = async (slug: string): Promise<Producto | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return productosSimulados.find(p => p.slug === slug);
};

// Esta función se puede mantener para mock data si es necesario en otras partes.
// La página de admin/categories ahora usa su propia función para Supabase.
export const obtenerCategorias = async (): Promise<Categoria[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return categoriasSimuladas;
};

export const obtenerCategoriaPorSlug = async (slug: string): Promise<Categoria | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // Primero intenta encontrar en las simuladas. En un futuro podría consultar Supabase aquí también.
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

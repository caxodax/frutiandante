import type { Producto, Categoria, ConfiguracionSitio, EnlaceRedSocial } from '@/tipos';

export const categoriasSimuladas: Categoria[] = [
  { id: '1', nombre: 'Frutas de Estación', slug: 'frutas-estacion' },
  { id: '2', nombre: 'Verduras Frescas', slug: 'verduras-frescas' },
  { id: '3', nombre: 'Despensa y Granos', slug: 'despensa-granos' },
  { id: '4', nombre: 'Lácteos y Huevos', slug: 'lacteos-huevos' },
  { id: '5', nombre: 'Carnes y Aves', slug: 'carnes-aves'},
];

export const productosSimulados: Producto[] = [
  {
    id: '1',
    nombre: 'Pack Manzanas Royal Gala (1kg)',
    descripcion: 'Manzanas dulces y crujientes, seleccionadas directamente de huertos locales. Ideales para colaciones y jugos naturales.',
    precioDetalle: 2490,
    precioMayorista: 1890,
    imagenes: ['https://picsum.photos/seed/apple1/600/600', 'https://picsum.photos/seed/apple2/600/600'],
    idCategoria: '1',
    slug: 'pack-manzanas-royal-gala-1kg',
  },
  {
    id: '2',
    nombre: 'Paltas Hass Premium (1kg)',
    descripcion: 'Paltas de textura cremosa y sabor intenso. En su punto justo de madurez para tus ensaladas o el desayuno perfecto.',
    precioDetalle: 5990,
    precioMayorista: 4500,
    imagenes: ['https://picsum.photos/seed/avocado1/600/600', 'https://picsum.photos/seed/avocado2/600/600'],
    idCategoria: '2',
    slug: 'paltas-hass-premium-1kg',
  },
  {
    id: '3',
    nombre: 'Arroz Grado 1 Extra Largo (1kg)',
    descripcion: 'Arroz de grano seleccionado que no se pega. El acompañamiento esencial para todas tus comidas chilenas.',
    precioDetalle: 1850,
    precioMayorista: 1450,
    imagenes: ['https://picsum.photos/seed/rice1/600/600'],
    idCategoria: '3',
    slug: 'arroz-grado-1-extra-largo-1kg',
  },
  {
    id: '4',
    nombre: 'Huevos de Gallina Feliz - 12 unidades',
    descripcion: 'Huevos frescos de campo, producidos de forma ética. Ricos en nutrientes y con el mejor sabor natural.',
    precioDetalle: 3200,
    precioMayorista: 2600,
    imagenes: ['https://picsum.photos/seed/eggs1/600/600'],
    idCategoria: '4',
    slug: 'huevos-gallina-feliz-12un',
  },
   {
    id: '5',
    nombre: 'Frutillas Frescas de San Pedro (500g)',
    descripcion: 'Frutillas grandes, rojas y jugosas. Recién cosechadas para mantener todo su aroma y dulzor.',
    precioDetalle: 3500,
    precioMayorista: 2800,
    imagenes: ['https://picsum.photos/seed/strawberry1/600/600'],
    idCategoria: '1',
    slug: 'frutillas-frescas-san-pedro-500g',
  },
  {
    id: '6',
    nombre: 'Aceite de Oliva Extra Virgen (1L)',
    descripcion: 'Aceite de oliva prensado en frío de valles centrales de Chile. Aroma frutado y acidez mínima.',
    precioDetalle: 8990,
    precioMayorista: 7200,
    imagenes: ['https://picsum.photos/seed/oliveoil1/600/600'],
    idCategoria: '3',
    slug: 'aceite-oliva-extra-virgen-1l',
  },
  {
    id: '7',
    nombre: 'Mix Ensalada Orgánica Lista (300g)',
    descripcion: 'Selección de lechugas, espinaca baby y rúcula. Lavada y lista para disfrutar. Sin pesticidas.',
    precioDetalle: 2200,
    precioMayorista: 1750,
    imagenes: ['https://picsum.photos/seed/salad1/600/600'],
    idCategoria: '2',
    slug: 'mix-ensalada-organica-lista',
  },
  {
    id: '8',
    nombre: 'Leche Entera Natural (1L)',
    descripcion: 'Leche fresca de vacas alimentadas con pasto. Sin aditivos, directo del productor a tu mesa.',
    precioDetalle: 1400,
    precioMayorista: 1100,
    imagenes: ['https://picsum.photos/seed/milk1/600/600'],
    idCategoria: '4', 
    slug: 'leche-entera-natural-1l',
  }
];

export const enlacesRedesSocialesSimulados: EnlaceRedSocial[] = [
  { id: '1', plataforma: 'Facebook', url: 'https://facebook.com/frutiandante' },
  { id: '2', plataforma: 'Instagram', url: 'https://instagram.com/frutiandante' },
];

export const configuracionSitioSimulada: ConfiguracionSitio = {
  urlLogo: '',
  nombreEmpresa: 'Frutiandante',
  enlacesRedesSociales: enlacesRedesSocialesSimulados,
  numeroWhatsapp: '56912345678',
  tituloAbout: 'Frescura que camina hacia tu hogar',
  subtituloAbout: 'Conectamos el campo chileno con tu cocina de forma directa y honesta.',
  historiaAbout: 'Frutiandante nació de la necesidad de llevar alimentos reales y frescos a las familias chilenas sin intermediarios innecesarios. Creemos que la buena alimentación debe ser accesible y transparente, por eso recorremos los mejores huertos para seleccionar personalmente cada fruta y verdura que llega a tu puerta.',
  misionAbout: 'Brindar a nuestros clientes los víveres más frescos y de mejor calidad en Chile, promoviendo el comercio justo con productores locales y facilitando una vida saludable.',
  visionAbout: 'Ser la feria online favorita de Chile, reconocida por nuestra calidad insuperable y el compromiso con la salud de nuestra comunidad.',
  urlImagenAbout: 'https://picsum.photos/seed/farm/1200/800',
};

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

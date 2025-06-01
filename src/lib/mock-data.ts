import type { Producto, Categoria, ConfiguracionSitio, EnlaceRedSocial } from '@/tipos';

export const categoriasSimuladas: Categoria[] = [
  { id: '1', nombre: 'Electrónicos', slug: 'electronicos' },
  { id: '2', nombre: 'Ropa', slug: 'ropa' },
  { id: '3', nombre: 'Artículos para el Hogar', slug: 'articulos-hogar' },
  { id: '4', nombre: 'Libros', slug: 'libros' },
];

export const productosSimulados: Producto[] = [
  {
    id: '1',
    nombre: 'Auriculares Inalámbricos Premium',
    descripcion: 'Experimenta un sonido inmersivo con estos auriculares inalámbricos premium. Cuentan con cancelación de ruido y batería de larga duración.',
    precioDetalle: 199.99,
    precioMayorista: 149.99,
    imagenes: ['https://placehold.co/600x600.png?text=Auriculares+1', 'https://placehold.co/600x600.png?text=Auriculares+2', 'https://placehold.co/600x600.png?text=Auriculares+3'],
    idCategoria: '1',
    slug: 'auriculares-inalambricos-premium',
  },
  {
    id: '2',
    nombre: 'Smartwatch Moderno',
    descripcion: 'Mantente conectado y sigue tus objetivos de fitness con este elegante smartwatch. Compatible con iOS y Android.',
    precioDetalle: 249.50,
    precioMayorista: 199.50,
    imagenes: ['https://placehold.co/600x600.png?text=Smartwatch+1', 'https://placehold.co/600x600.png?text=Smartwatch+2'],
    idCategoria: '1',
    slug: 'smartwatch-moderno',
  },
  {
    id: '3',
    nombre: 'Camiseta Clásica de Algodón',
    descripcion: 'Una camiseta cómoda y elegante hecha de 100% algodón premium. Disponible en varios colores.',
    precioDetalle: 29.99,
    precioMayorista: 19.99,
    imagenes: ['https://placehold.co/600x600.png?text=Camiseta+1', 'https://placehold.co/600x600.png?text=Camiseta+2'],
    idCategoria: '2',
    slug: 'camiseta-clasica-algodon',
  },
  {
    id: '4',
    nombre: 'Silla de Oficina Ergonómica',
    descripcion: 'Mejora tu postura y comodidad con esta silla de oficina ergonómica. Cuenta con altura ajustable y soporte lumbar.',
    precioDetalle: 399.00,
    precioMayorista: 320.00,
    imagenes: ['https://placehold.co/600x600.png?text=Silla+Oficina+1'],
    idCategoria: '3',
    slug: 'silla-oficina-ergonomica',
  },
   {
    id: '5',
    nombre: 'Jeans de Diseñador',
    descripcion: 'Jeans de diseñador elegantes y duraderos para todas las ocasiones.',
    precioDetalle: 89.99,
    precioMayorista: 65.00,
    imagenes: ['https://placehold.co/600x600.png?text=Jeans+1', 'https://placehold.co/600x600.png?text=Jeans+2'],
    idCategoria: '2',
    slug: 'jeans-de-disenador',
  },
  {
    id: '6',
    nombre: 'Laptop Avanzada',
    descripcion: 'Laptop de alto rendimiento para profesionales y creativos. Potente procesador y pantalla impresionante.',
    precioDetalle: 1299.00,
    precioMayorista: 1050.00,
    imagenes: ['https://placehold.co/600x600.png?text=Laptop+1', 'https://placehold.co/600x600.png?text=Laptop+2', 'https://placehold.co/600x600.png?text=Laptop+3'],
    idCategoria: '1',
    slug: 'laptop-avanzada',
  },
];

export const enlacesRedesSocialesSimulados: EnlaceRedSocial[] = [
  { id: '1', plataforma: 'Facebook', url: 'https://facebook.com/velozcommerce' },
  { id: '2', plataforma: 'Instagram', url: 'https://instagram.com/velozcommerce' },
  { id: '3', plataforma: 'Twitter', url: 'https://twitter.com/velozcommerce' },
];

export const configuracionSitioSimulada: ConfiguracionSitio = {
  urlLogo: 'https://placehold.co/150x50.png?text=VelozCommerce',
  nombreEmpresa: 'Veloz Commerce',
  enlacesRedesSociales: enlacesRedesSocialesSimulados,
  numeroWhatsapp: '1234567890', // Número de ejemplo, asegúrate de que sea un formato válido para wa.me
};

// Funciones auxiliares para simular la obtención de datos
export const obtenerProductos = async (): Promise<Producto[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simula retraso de red
  return productosSimulados;
};

export const obtenerProductoPorSlug = async (slug: string): Promise<Producto | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return productosSimulados.find(p => p.slug === slug);
};

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return categoriasSimuladas;
};

export const obtenerCategoriaPorSlug = async (slug: string): Promise<Categoria | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return categoriasSimuladas.find(c => c.slug === slug);
};

export const obtenerProductosPorIdCategoria = async (idCategoria: string): Promise<Producto[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return productosSimulados.filter(p => p.idCategoria === idCategoria);
}

export const obtenerConfiguracionSitio = async (): Promise<ConfiguracionSitio> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return configuracionSitioSimulada;
};

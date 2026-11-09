// Catálogo local. Se usa mientras no haya API conectada (ver services/api.js).
// "categoria" sirve para el filtro de la página de productos.
export const productos = [
  {
    id: 1,
    nombre: 'Sofoco',
    imagen: '/img/producto1.jpeg',
    alt: 'Café Sofoco - Mambrú',
    badge: 'Edición 002',
    badgeClase: 'badge-orange',
    origen: '📍 Aguadas, Caldas',
    notas: 'Notas: Amarillo, caramelo y panela.',
    detalle: 'Edición 002 • Aguadas, Caldas',
    precio: 38000,
    categoria: 'cafe',
  },
  {
    id: 2,
    nombre: 'Encuentro',
    imagen: '/img/product3.jpeg',
    alt: 'Café Encuentro - Mambrú',
    badge: 'Especial',
    badgeClase: 'badge-blue',
    origen: '📍 Jardín, Antioquia',
    notas: 'Proceso: Lavado tradicional.',
    detalle: 'Especial • Jardín, Antioquia',
    precio: 38000,
    categoria: 'cafe',
  },
  {
    id: 3,
    nombre: 'Prensa Francesa',
    imagen: '/img/prensa.jpg',
    alt: 'Prensa Francesa',
    badge: 'Accesorio',
    badgeClase: 'badge-dark',
    origen: '⚙️ 600ml / Acero y Vidrio',
    notas: 'El método ideal para resaltar el cuerpo de tu café.',
    detalle: 'Accesorio • 600ml / Acero y Vidrio',
    precio: 75000,
    categoria: 'accesorio',
  },
]

export const categorias = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'cafe', etiqueta: 'Café' },
  { id: 'accesorio', etiqueta: 'Accesorios' },
]

export const rangosPrecio = [
  { valor: '', etiqueta: 'Cualquier precio' },
  { valor: '40000', etiqueta: 'Hasta $40.000' },
  { valor: '80000', etiqueta: 'Hasta $80.000' },
]

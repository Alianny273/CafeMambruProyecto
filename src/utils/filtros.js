// categoria: 'todos' | 'cafe' | 'accesorio'   precioMax: '' (sin límite) | '40000' | ...
export function filtrarProductos(productos, { categoria = 'todos', precioMax = '' }) {
  return productos.filter((p) => {
    const okCategoria = categoria === 'todos' || p.categoria === categoria
    const okPrecio = precioMax === '' || p.precio <= Number(precioMax)
    return okCategoria && okPrecio
  })
}

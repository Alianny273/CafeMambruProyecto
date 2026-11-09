const KEY = 'mambru_carrito'

export function leerCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(guardado)) {
      // descarta datos dañados
      return guardado.filter(
        (i) => i && i.id !== undefined && Number.isFinite(i.precio) && Number.isInteger(i.cantidad) && i.cantidad > 0
      )
    }
  } catch { /* sin storage o JSON dañado */ }
  return []
}

export function guardarCarrito(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* sin storage */ }
}

// si el producto ya está, suma 1; si no, lo agrega con cantidad 1
export function agregarItem(items, producto) {
  if (items.some((i) => i.id === producto.id)) {
    return items.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i))
  }
  const { id, nombre, precio, imagen, alt, detalle } = producto
  return [...items, { id, nombre, precio, imagen, alt, detalle, cantidad: 1 }]
}

// la cantidad nunca baja de 1 (para quitar un producto está "eliminar")
export function cambiarCantidad(items, id, delta) {
  return items.map((i) => (i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i))
}

export const eliminarItem = (items, id) => items.filter((i) => i.id !== id)
export const calcularTotal = (items) => items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)
export const contarUnidades = (items) => items.reduce((suma, i) => suma + i.cantidad, 0)

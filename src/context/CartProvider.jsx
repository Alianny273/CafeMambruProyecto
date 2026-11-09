import { useState } from 'react'
import { CartContext } from './CartContext'
import {
  leerCarrito, guardarCarrito, agregarItem, cambiarCantidad as cambiar,
  eliminarItem, calcularTotal, contarUnidades,
} from '../services/carritoStore'

export default function CartProvider({ children }) {
  // se lee una vez al cargar: así el carrito sobrevive al recargar la página
  const [items, setItems] = useState(leerCarrito)

  const actualizar = (nuevos) => {
    setItems(nuevos)
    guardarCarrito(nuevos)
  }

  const value = {
    items,
    unidades: contarUnidades(items),
    total: calcularTotal(items),
    agregar: (producto) => actualizar(agregarItem(items, producto)),
    cambiarCantidad: (id, delta) => actualizar(cambiar(items, id, delta)),
    eliminar: (id) => actualizar(eliminarItem(items, id)),
    vaciar: () => actualizar([]),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

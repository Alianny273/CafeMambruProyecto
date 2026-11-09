import { createContext, useState } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  

  // Cálculo dinámico de unidades totales en el carrito
  const unidades = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

  // Función para agregar productos
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find(item => (item.id || item.id_producto) === (producto.id || producto.id_producto));
      if (existe) {
        return prev.map(item => 
          (item.id || item.id_producto) === (producto.id || producto.id_producto)
            ? { ...item, cantidad: (item.cantidad || 1) + (producto.cantidad || 1) }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: producto.cantidad || 1 }];
    });
  };

  // Función para eliminar productos
  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => (item.id || item.id_producto) !== id));
  };

  // Función para vaciar carrito
  const limpiarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CartContext.Provider value={{ carrito, unidades, agregarAlCarrito, eliminarDelCarrito, limpiarCarrito }}>
      {children}
    </CartContext.Provider>
  );
}
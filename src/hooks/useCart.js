import { useContext } from 'react';
import { CartContext } from '../context/CartContext'; 

export function useCart() {
  const context = useContext(CartContext);
  
  // Si el componente está fuera del Provider, devolvemos un objeto por defecto 
  // en lugar de null para que no rompa la desestructuración.
  if (!context) {
    console.warn("useCart está siendo usado fuera de un CartProvider");
    return { unidades: 0, carrito: [], agregarAlCarrito: () => {} };
  }

  return context;
}
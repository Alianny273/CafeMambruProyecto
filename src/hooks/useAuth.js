import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    return { 
      cliente: null, 
      cargando: false,
      favoritos: [],
      ingresar: async () => {}, 
      registrar: async () => {}, 
      salir: async () => {},
      actualizar: async () => {},
      eliminar: async () => {},
      alternarFavorito: async () => {}
    };
  }

  return context;
}
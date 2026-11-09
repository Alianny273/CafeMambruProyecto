import { useEffect, useState } from 'react'
import { getProductos } from '../services/api'

// Pide el catálogo al cargar. Devuelve { productos, cargando, error }
export function useProductos() {
  const [estado, setEstado] = useState({ productos: [], cargando: true, error: '' })

  useEffect(() => {
    let cancelado = false
    getProductos()
      .then((productos) => { if (!cancelado) setEstado({ productos, cargando: false, error: '' }) })
      .catch(() => {
        if (!cancelado) {
          setEstado({ productos: [], cargando: false, error: 'No pudimos cargar los productos. Inténtalo de nuevo en unos minutos.' })
        }
      })
    return () => { cancelado = true }
  }, [])

  return estado
}

import { useEffect, useState } from 'react'
import { leerLista, guardarLista } from '../services/cuentaApi'

// Lee una lista del cliente (direcciones, compras...). Devuelve { items, estado, guardar }
export function useListaCuenta(recurso) {
  const [items, setItems] = useState([])
  const [estado, setEstado] = useState('cargando') // cargando | ok | error

  useEffect(() => {
    let activo = true
    leerLista(recurso)
      .then((lista) => { if (activo) { setItems(lista); setEstado('ok') } })
      .catch(() => { if (activo) setEstado('error') })
    return () => { activo = false }
  }, [recurso])

  const guardar = async (nueva) => {
    await guardarLista(recurso, nueva)
    setItems(nueva)
  }

  return { items, estado, guardar }
}

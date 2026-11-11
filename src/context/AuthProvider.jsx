import { useEffect, useState, useRef } from 'react'
import Swal from 'sweetalert2'
import { AuthContext } from './AuthContext'
import {
  registrarCliente, ingresarCliente, salirCliente, restaurarSesion,
  guardarPerfil, eliminarCuenta, leerLista, guardarLista,
} from '../services/cuentaService'

export default function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null)
  const [favoritos, setFavoritos] = useState([])
  const [cargando, setCargando] = useState(true)

  // Referencia para el temporizador de inactividad (10 minutos = 600,000 ms)
  const inactivityTimer = useRef(null)

  const cerrarPorInactividad = async () => {
    await salirCliente()
    setCliente(null)
    setFavoritos([])
    Swal.fire({
      icon: 'info',
      title: 'Sesión expirada',
      text: 'Tu sesión se ha cerrado automáticamente por 10 minutos de inactividad.',
      confirmButtonColor: '#3d2613'
    })
    window.location.href = '/';
  }

  // Vigilar eventos del usuario para el cierre por inactividad
  useEffect(() => {
    if (!cliente) return

    const reiniciarTemporizador = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)

      // 10 minutos de inactividad (10 * 60 * 1000)
      inactivityTimer.current = setTimeout(() => {
        cerrarPorInactividad()
      }, 10 * 60 * 1000) 
    }

    const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    const handleUserActivity = () => reiniciarTemporizador()

    eventos.forEach(evento => window.addEventListener(evento, handleUserActivity))
    reiniciarTemporizador() // Iniciar al montar con sesión activa

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      eventos.forEach(evento => window.removeEventListener(evento, handleUserActivity))
    }
  }, [cliente])

  const abrir = async (c) => {
    // 🔑 Protegido con .catch por si el backend no tiene implementado /cliente/favoritos todavía
    const favs = c ? await leerLista('favoritos').catch(() => []) : []
    setFavoritos(favs)
    setCliente(c)
    return c
  }

  // Al cargar la página se recupera la sesión
  useEffect(() => {
    let activo = true
    restaurarSesion()
      .then(async (c) => {
        const favs = c ? await leerLista('favoritos').catch(() => []) : []
        if (!activo) return
        setFavoritos(favs)
        setCliente(c)
      })
      .catch(() => {
        if (activo) setCliente(null)
      })
      .finally(() => { if (activo) setCargando(false) })
    return () => { activo = false }
  }, [])

  const value = {
    cliente,
    cargando,
    favoritos,
    ingresar: async (datos) => abrir(await ingresarCliente(datos)),
    registrar: async (datos) => abrir(await registrarCliente(datos)),
    salir: async () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      await salirCliente()
      setCliente(null)
      setFavoritos([])
      window.location.href = '/';
    },
    actualizar: async (cambios) => setCliente(await guardarPerfil(cambios)),
    eliminar: async () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      await eliminarCuenta()
      setCliente(null)
      setFavoritos([])
      window.location.href = '/';
    },
    alternarFavorito: async (id) => {
      const antes = favoritos
      const nuevos = antes.includes(id) ? antes.filter((f) => f !== id) : [...antes, id]
      setFavoritos(nuevos)
      try { await guardarLista('favoritos', nuevos) } catch { setFavoritos(antes); throw new Error('No pudimos guardar tu favorito.') }
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
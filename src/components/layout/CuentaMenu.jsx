import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import ListaMenu from '../cuenta/ListaMenu'
import Avatar from '../cuenta/Avatar'

// Zona de cliente del encabezado: "Ingresar" si no hay sesión, o el menú de "Mi cuenta" si la hay
export default function CuentaMenu({ onNavegar }) {
  const { cliente, cargando } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)

  // se cierra al hacer clic fuera o con la tecla Escape
  useEffect(() => {
    if (!abierto) return
    const fuera = (e) => { if (caja.current && !caja.current.contains(e.target)) setAbierto(false) }
    const escape = (e) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', escape)
    }
  }, [abierto])

  if (cargando) return null

  if (!cliente) {
    return (
      <Link to="/ingresar" className="btn-cuenta btn-cuenta--texto" onClick={onNavegar}>
        Ingresar
      </Link>
    )
  }

  const cerrar = () => { setAbierto(false); onNavegar?.() }

  return (
    <div className="cuenta-menu-wrap" ref={caja}>
      <button
        type="button"
        className="btn-cuenta"
        aria-expanded={abierto}
        aria-controls="menu-cuenta"
        onClick={() => setAbierto(!abierto)}
      >
        <Avatar cliente={cliente} />
        <span className="btn-cuenta-texto">Mi cuenta</span>
      </button>

      {abierto && (
        <div id="menu-cuenta" className="cuenta-panel">
          <div className="cuenta-cabecera">
            <Avatar cliente={cliente} grande />
            <div>
              <strong>{cliente.nombre} {cliente.apellido}</strong>
              <p>{cliente.email}</p>
            </div>
          </div>
          <ListaMenu onNavegar={cerrar} />
        </div>
      )}
    </div>
  )
}

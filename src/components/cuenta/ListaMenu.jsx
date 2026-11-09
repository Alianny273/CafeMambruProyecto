import { NavLink, useNavigate } from 'react-router-dom'
import { gruposMenu } from '../../data/menuCuenta'
import { useAuth } from '../../context/useAuth'
import { useToast } from '../../context/useToast'

// Lista del menú del cliente (desplegable del encabezado y lateral de "Mi cuenta")
export default function ListaMenu({ onNavegar }) {
  const { salir } = useAuth()
  
  // 🔑 PROTECCIÓN: Si useToast devuelve null o no está disponible, creamos una función vacía para que nunca rompa la app
  const toastContext = useToast()
  const mostrarToast = toastContext?.mostrarToast || (() => {})
  
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    try {
      onNavegar?.()
      await salir() // Esto limpia la sesión y recarga a la raíz automáticamente
      mostrarToast('Sesión cerrada')
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <>
      {gruposMenu.map((grupo) => (
        <div className="menu-grupo" key={grupo.titulo}>
          <p className="menu-titulo">{grupo.titulo}</p>
          <ul>
            {grupo.items.map((item) => (
              <li key={item.texto}>
                {item.accion === 'salir' ? (
                  <button type="button" className="menu-item menu-item--salir" onClick={cerrarSesion}>
                    {item.texto}<span aria-hidden="true">›</span>
                  </button>
                ) : (
                  <NavLink to={item.to} className="menu-item" onClick={onNavegar}>
                    {item.texto}<span aria-hidden="true">›</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}
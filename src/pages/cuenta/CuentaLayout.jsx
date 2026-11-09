import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Estado from '../../components/ui/Estado'
import Avatar from '../../components/cuenta/Avatar'
import ListaMenu from '../../components/cuenta/ListaMenu'
import { useAuth } from '../../context/useAuth'

// Marco de "Mi cuenta": título con el cliente, menú lateral y la sección elegida.
// Si no hay sesión, manda a /ingresar y regresa aquí después.
export default function CuentaLayout() {
  const { cliente, cargando } = useAuth()
  const { pathname } = useLocation()

  if (cargando) return <section className="shop shop--page"><Estado>Cargando tu cuenta...</Estado></section>
  if (!cliente) return <Navigate to="/ingresar" state={{ from: pathname }} replace />

  return (
    <div className="cuenta">
      <div className="cuenta-titulo">
        <Avatar cliente={cliente} grande />
        <div>
          <h2>{cliente.nombre} {cliente.apellido}</h2>
          <p>{cliente.email}</p>
        </div>
      </div>

      <aside className="cuenta-lateral" aria-label="Menú de mi cuenta">
        <ListaMenu />
      </aside>

      <div className="cuenta-contenido">
        <Outlet />
      </div>
    </div>
  )
}
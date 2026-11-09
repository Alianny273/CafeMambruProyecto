import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import { useAuth } from '../../context/useAuth'
import { useToast } from '../../context/useToast'
import { formatoPrecio } from '../../utils/formato'

export default function ProductCard({ producto }) {
  const { agregar } = useCart()
  
  // 🔑 PROTECCIÓN: Si useToast devuelve null o no está disponible, usamos una función vacía
  const toastContext = useToast()
  const mostrarToast = toastContext?.mostrarToast || (() => {})

  const { cliente, favoritos, alternarFavorito } = useAuth()
  const navigate = useNavigate()
  const esFavorito = favoritos.includes(producto.id)

  // sin sesión, el corazón lleva a ingresar
  const alFavorito = async () => {
    if (!cliente) return navigate('/ingresar', { state: { from: '/productos' } })
    try {
      await alternarFavorito(producto.id)
      mostrarToast(esFavorito ? 'Quitado de favoritos' : `${producto.nombre} en favoritos ♥`)
    } catch (err) {
      mostrarToast(err.message)
    }
  }

  const alAgregar = () => {
    agregar(producto)
    mostrarToast(`${producto.nombre} agregado ✓`)
  }

  return (
    <article className="card">
      <div className="img-container">
        <img src={producto.imagen} alt={producto.alt} />
        <button
          type="button"
          className={`btn-favorito ${esFavorito ? 'activo' : ''}`}
          onClick={alFavorito}
          aria-pressed={esFavorito}
          aria-label={esFavorito ? `Quitar ${producto.nombre} de favoritos` : `Guardar ${producto.nombre} en favoritos`}
        >
          {esFavorito ? '♥' : '♡'}
        </button>
        {producto.badge && <span className={`badge ${producto.badgeClase}`}>{producto.badge}</span>}
      </div>
      <div className="card-info">
        <h3>{producto.nombre}</h3>
        {producto.origen && <p className="origin">{producto.origen}</p>}
        <p className="notes">{producto.notas}</p>
        <div className="card-footer">
          <span className="price">{formatoPrecio(producto.precio)}</span>
          <button type="button" className="btn-add" onClick={alAgregar} aria-label={`Agregar ${producto.nombre} al carrito`}>
            +
          </button>
        </div>
      </div>
    </article>
  )
}
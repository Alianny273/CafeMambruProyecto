import { useCart } from '../../context/useCart'
import { formatoPrecio } from '../../utils/formato'

export default function CartItem({ item }) {
  const { cambiarCantidad, eliminar } = useCart()

  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <img className="cart-item-img" src={item.imagen} alt={item.alt} />
        <div>
          <h3>{item.nombre}</h3>
          {item.detalle && <p className="cart-item-detail">{item.detalle}</p>}
          <span className="cart-item-price">{formatoPrecio(item.precio)}</span>
          {item.cantidad > 1 && (
            <span className="cart-item-subtotal"> · Subtotal {formatoPrecio(item.precio * item.cantidad)}</span>
          )}
        </div>
      </div>

      <div className="cart-item-actions">
        <div className="qty">
          <button
            type="button"
            onClick={() => cambiarCantidad(item.id, -1)}
            disabled={item.cantidad <= 1}
            aria-label={`Quitar una unidad de ${item.nombre}`}
          >
            -
          </button>
          <span aria-live="polite">{item.cantidad}</span>
          <button type="button" onClick={() => cambiarCantidad(item.id, 1)} aria-label={`Agregar una unidad de ${item.nombre}`}>
            +
          </button>
        </div>
        <button type="button" className="btn-remove" onClick={() => eliminar(item.id)}>
          Eliminar
        </button>
      </div>
    </div>
  )
}

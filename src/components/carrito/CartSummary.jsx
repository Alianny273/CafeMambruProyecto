import { Link } from 'react-router-dom'
import { formatoPrecio } from '../../utils/formato'

export default function CartSummary({ total, enviando, error, onFinalizar, onVaciar }) {
  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>Subtotal:</span>
        <span className="summary-value">{formatoPrecio(total)}</span>
      </div>
      <div className="summary-row shipping">
        <span>Envío:</span>
        <span className="summary-value">Calculado al pagar</span>
      </div>
      <div className="summary-total">
        <span>Total:</span>
        <span>{formatoPrecio(total)}</span>
      </div>

      {error && <p className="form-msg form-msg-error" role="alert">{error}</p>}

      <div className="summary-actions">
        <Link to="/productos" className="btn-secondary">Seguir comprando</Link>
        <button type="button" className="btn-primary" onClick={onFinalizar} disabled={enviando}>
          {enviando ? 'Enviando pedido...' : 'Finalizar compra'}
        </button>
      </div>

      <button type="button" className="link-vaciar" onClick={onVaciar} disabled={enviando}>
        Vaciar carrito
      </button>
    </div>
  )
}

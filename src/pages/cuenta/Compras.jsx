import { Link } from 'react-router-dom'
import Estado from '../../components/ui/Estado'
import { useListaCuenta } from '../../hooks/useListaCuenta'
import { formatoPrecio } from '../../utils/formato'

const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

export default function Compras() {
  const { items, estado } = useListaCuenta('compras')

  if (estado === 'cargando') return <Estado>Cargando tus compras...</Estado>
  if (estado === 'error') return <Estado tipo="error">No pudimos cargar tus compras. Inténtalo de nuevo en unos minutos.</Estado>

  return (
    <>
      <title>Mis compras - Mambrú</title>
      {items.length === 0 ? (
        <Estado>
          <h3>Todavía no has comprado</h3>
          <p>Cuando hagas un pedido con tu cuenta aparecerá aquí.</p>
          <Link to="/productos" className="btn-primary">Ver productos</Link>
        </Estado>
      ) : (
        <div className="lista-cuenta">
          {items.map((c) => (
            <article className="cart-item" key={c.id_pedido ?? c.fecha}>
              <div>
                <h3>Pedido #{c.id_pedido}</h3>
                <p className="cart-item-detail">{fecha(c.fecha)}</p>
                <ul className="compra-items">
                  {(c.items ?? []).map((i) => <li key={i.id}>{i.cantidad} × {i.nombre}</li>)}
                </ul>
              </div>
              <strong className="cart-item-price">{formatoPrecio(c.total)}</strong>
            </article>
          ))}
        </div>
      )}
    </>
  )
}

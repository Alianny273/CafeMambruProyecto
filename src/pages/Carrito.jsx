import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SectionHeader from '../components/ui/SectionHeader'
import Estado from '../components/ui/Estado'
import CartItem from '../components/carrito/CartItem'
import CartSummary from '../components/carrito/CartSummary'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { enviarPedido, MODO_DEMO } from '../services/api'
import { registrarCompra } from '../services/cuentaApi'

export default function Carrito() {
  const cart = useCart() || {}
  const items = Array.isArray(cart.items) ? cart.items : []
  const total = cart.total ?? 0
  const vaciar = cart.vaciar ?? (() => {})

  const { cliente } = useAuth()
  const navigate = useNavigate()
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [pedido, setPedido] = useState(null)

  const finalizar = async () => {
    if (!MODO_DEMO && !cliente) {
      alert('Inicia sesión para finalizar tu pedido')
      navigate('/ingresar', { state: { from: '/carrito' } })
      return
    }
    setEnviando(true)
    setError('')
    try {
      const respuesta = await enviarPedido({
        items: items.map((i) => ({ id_producto: i.id, cantidad: i.cantidad, precio_unitario: i.precio })),
        total,
      })
      if (cliente) {
        await registrarCompra({
          id_pedido: respuesta.id_pedido,
          total,
          items: items.map((i) => ({ id: i.id, nombre: i.nombre, cantidad: i.cantidad })),
        }).catch(() => {})
      }
      vaciar()
      setPedido(respuesta)
    } catch (err) {
      setError(err.message || 'No pudimos enviar tu pedido. Revisa tu conexión e inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <section className="shop" style={{ padding: '3rem 1rem', minHeight: '80vh' }}>
        <SectionHeader
          titulo={<>Tu <span>Carrito</span></>}
          subtitulo="Revisa tus productos seleccionados antes de finalizar el pedido."
        />

        <div className="cart-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {pedido ? (
            <Estado tipo="ok">
              <h3>¡Pedido recibido!</h3>
              <p>Tu número de pedido es <strong>#{pedido?.id_pedido}</strong>. Gracias por elegir Mambrú.</p>
              <Link to="/productos" className="btn-secondary">Seguir comprando</Link>
            </Estado>
          ) : items.length === 0 ? (
            <Estado>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega un café o una prensa desde el catálogo.</p>
              <Link to="/productos" className="btn-primary">Ver productos</Link>
            </Estado>
          ) : (
            <>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              <CartSummary total={total} enviando={enviando} error={error} onFinalizar={finalizar} onVaciar={vaciar} />
            </>
          )}
        </div>
      </section>
    </>
  )
}
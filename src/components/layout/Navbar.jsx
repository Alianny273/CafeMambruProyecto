import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import CuentaMenu from './CuentaMenu'

const enlaces = [
  { to: '/', texto: 'Inicio', end: true },
  { to: '/productos', texto: 'Productos' },
  { to: '/experiencias', texto: 'Experiencias' },
  { to: '/tecnicas', texto: 'Técnicas' },
  { to: '/conocenos', texto: 'Conócenos' },
  { to: '/contacto', texto: 'Contacto' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const { unidades } = useCart()

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={() => setAbierto(false)}>
        <img src="/img/logo.jpeg" alt="Mambrú Logo" />
        <span className="logo-text">Mambrú</span>
      </Link>

      <nav id="menu-principal" className={`nav-links ${abierto ? 'open' : ''}`} aria-label="Principal">
        {enlaces.map((e) => (
          <NavLink key={e.to} to={e.to} end={e.end} onClick={() => setAbierto(false)}>
            {e.texto}
          </NavLink>
        ))}
      </nav>

      <div className="cart">
        <CuentaMenu onNavegar={() => setAbierto(false)} />
        <Link to="/carrito" className="btn-cart" onClick={() => setAbierto(false)}>
          Carrito ({unidades})
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
          aria-controls="menu-principal"
          onClick={() => setAbierto(!abierto)}
        >
          {abierto ? '✕' : '☰'}
        </button>
      </div>
    </header>
  )
}

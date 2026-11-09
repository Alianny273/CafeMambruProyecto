import { Link } from 'react-router-dom';
import logoImg from "../../assets/logo.jpeg";
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <img src={logoImg} alt="Mambrú Logo" />
        <span className="logo-text">Mambrú</span>
      </Link>
      
      <nav className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/experiencias">Experiencias</Link>
        <Link to="/tecnicas">Técnicas</Link>
        <Link to="/conocenos">Conócenos</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>

      <div className="navbar-right">
        {/* Carrito con Emoji */}
        <Link to="/carrito" className="btn-cart-icon" title="Carrito">
          🛒 <span className="cart-count">0</span>
        </Link>

        {/* Botón único y redondeado para Iniciar Sesión */}
        <Link to="/login" className="btn-login">
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
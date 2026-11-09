import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <Link to="/productos" className="btn-primary">Ver Catálogo</Link>
      </div>
    </section>
  )
}

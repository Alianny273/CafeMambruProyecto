import { Link } from 'react-router-dom'

const ANIO = new Date().getFullYear()

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/img/logo.jpeg" alt="Mambrú" className="footer-logo" />
          <h3>Mambrú</h3>
        </div>
        <p className="slogan">Café, Memoria, Territorio, Alma.</p>
        <nav className="footer-links" aria-label="Información legal">
          <Link to="/politicas/privacidad">Política de privacidad</Link>
          <Link to="/politicas/terminos">Términos y condiciones</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>
        <p className="copyright">&copy; {ANIO} Mambrú. Creado con pasión.</p>
      </div>
    </footer>
  )
}

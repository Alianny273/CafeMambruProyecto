import { Link } from 'react-router-dom'
import StepsList from '../tecnicas/StepsList'

const pasos = [
  'Mide 2 cucharadas grandes colmadas.',
  <>Esto equivale a aprox. <strong>20 gramos</strong> de café.</>,
  'Vierte agua caliente (92°C) y disfruta.',
]

export default function RecetaPerfecta() {
  return (
    <section id="preparacion" className="prep-guide">
      <div className="guide-container">
        <div className="guide-text">
          <h2>La Receta <br /><span>Perfecta</span></h2>
          <p>Para extraer el alma de nuestro café, te recomendamos la proporción ideal. Usa una gramera para ser un verdadero barista en casa.</p>
          <StepsList pasos={pasos} />
          <div className="guide-cta">
            <Link to="/tecnicas" className="btn-receta">Ver Receta Completa ☕</Link>
          </div>
        </div>
        <div className="guide-image">
          <div className="image-wrapper">
            <img src="/img/tecnica3.jpg" alt="Guía de 20 gramos en balanza" />
            <div className="floating-badge">¡Sabor WOW!</div>
          </div>
        </div>
      </div>
    </section>
  )
}

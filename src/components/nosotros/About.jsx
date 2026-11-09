import { Link } from 'react-router-dom'

export default function About({ id, parrafoFinal, to, textoBoton, claseExtra = '' }) {
  return (
    <section id={id} className={`about-us ${claseExtra}`}>
      <div className="about-container">
        <div className="about-image">
          <div className="image-wrapper-about">
            <img src="/img/pareja.jpeg" alt="Cultivo de Café Mambrú" />
            <div className="about-badge">Nuestra Raíz</div>
          </div>
        </div>
        <div className="about-text">
          <h2>Memoria, Territorio <br />y <span>Alma</span></h2>
          <p>En Mambrú no solo tostamos granos; rescatamos la tradición de nuestras montañas. Cada taza es un viaje directo a los cafetales colombianos, cultivados con respeto por la tierra y pasión por nuestra gente.</p>
          <p>{parrafoFinal}</p>
          <Link to={to} className="btn-secondary">{textoBoton}</Link>
        </div>
      </div>
    </section>
  )
}

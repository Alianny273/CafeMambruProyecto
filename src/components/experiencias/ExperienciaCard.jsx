import { Link } from 'react-router-dom'

// Con "conAccion" muestra el botón "+" que lleva a Contacto para reservar o preguntar
export default function ExperienciaCard({ datos, conAccion = false }) {
  return (
    <article className="card">
      <div className="img-container">
        <img src={datos.imagen} alt={datos.alt} />
        <span className={`badge ${datos.badgeClase}`}>{datos.badge}</span>
      </div>
      <div className="card-info">
        <h3>{datos.titulo}</h3>
        <p className="origin">{datos.subtitulo}</p>
        <p className="notes">{datos.descripcion}</p>
        <div className="card-footer">
          <span className="price">{datos.etiqueta}</span>
          {conAccion && (
            <Link to="/contacto" className="btn-add" aria-label={`Consultar por ${datos.titulo}`}>+</Link>
          )}
        </div>
      </div>
    </article>
  )
}

import { Link, Navigate, useParams } from 'react-router-dom'
import { politicas } from '../data/politicas'
import { FECHA_POLITICAS } from '../data/negocio'

// Una sola página para las dos políticas: /politicas/privacidad y /politicas/terminos
export default function Politicas() {
  const { tema } = useParams()
  const politica = politicas[tema]
  if (!politica) return <Navigate to="/politicas/privacidad" replace />

  return (
    <>
      <title>{politica.menu} - Mambrú</title>
      <section className="shop shop--page legal">
        <nav className="filters-group legal-tabs" aria-label="Políticas">
          {Object.entries(politicas).map(([clave, p]) => (
            <Link key={clave} to={`/politicas/${clave}`} className={`chip ${clave === tema ? 'active' : ''}`} aria-current={clave === tema ? 'page' : undefined}>
              {p.menu}
            </Link>
          ))}
        </nav>

        <article className="legal-texto">
          <h1>{politica.titulo}</h1>
          <p className="legal-fecha">Actualizada el {FECHA_POLITICAS}</p>
          <p className="legal-intro">{politica.intro}</p>
          {politica.secciones.map((s) => (
            <section key={s.titulo}>
              <h2>{s.titulo}</h2>
              {s.parrafos.map((texto) => <p key={texto}>{texto}</p>)}
            </section>
          ))}
        </article>
      </section>
    </>
  )
}

import { Link } from 'react-router-dom'
import Estado from '../components/ui/Estado'

export default function NotFound() {
  return (
    <>
      <title>Página no encontrada - Mambrú</title>
      <section className="shop">
        <Estado>
          <h3>No encontramos esta página</h3>
          <p>Puede que el enlace esté roto o que la página ya no exista.</p>
          <Link to="/" className="btn-primary">Volver al inicio</Link>
        </Estado>
      </section>
    </>
  )
}

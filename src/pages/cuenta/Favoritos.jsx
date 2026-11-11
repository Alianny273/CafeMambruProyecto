import { Link } from 'react-router-dom'
import Estado from '../../components/ui/Estado'
import ProductGrid from '../../components/productos/ProductGrid'
import { useProductos } from '../../hooks/useProductos'
import { useAuth } from '../../hooks/useAuth'

export default function Favoritos() {
  const { favoritos } = useAuth()
  const { productos, cargando, error } = useProductos()
  const guardados = productos.filter((p) => favoritos.includes(p.id))

  return (
    <>
      <title>Mis favoritos - Mambrú</title>
      {!cargando && !error && guardados.length === 0 ? (
        <Estado>
          <h3>Aún no tienes favoritos</h3>
          <p>Toca el corazón de un producto para guardarlo aquí.</p>
          <Link to="/productos" className="btn-primary">Ver productos</Link>
        </Estado>
      ) : (
        <ProductGrid productos={guardados} cargando={cargando} error={error} />
      )}
    </>
  )
}

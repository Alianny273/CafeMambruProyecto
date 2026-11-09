import ProductCard from './ProductCard'
import Estado from '../ui/Estado'

// Muestra las tarjetas, o el mensaje de carga / error / sin resultados
export default function ProductGrid({ productos, cargando, error }) {
  if (cargando) return <Estado>Cargando productos...</Estado>
  if (error) return <Estado tipo="error">{error}</Estado>
  if (productos.length === 0) return <Estado>No hay productos con esos filtros. Prueba con otra categoría o precio.</Estado>

  return (
    <div className="grid-products">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  )
}

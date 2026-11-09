import { useState } from 'react'
import SectionHeader from '../components/ui/SectionHeader'
import ProductFilters from '../components/productos/ProductFilters'
import ProductGrid from '../components/productos/ProductGrid'
import { useProductos } from '../hooks/useProductos'
import { filtrarProductos } from '../utils/filtros'

export default function Productos() {
  const { productos, cargando, error } = useProductos()
  const [categoria, setCategoria] = useState('todos')
  const [precioMax, setPrecioMax] = useState('')

  const visibles = filtrarProductos(productos, { categoria, precioMax })

  return (
    <>
      <section className="shop shop--page">
        <SectionHeader titulo="Nuestra Selección" subtitulo="Cafés cultivados con el alma, listos para tu taza." />
        <ProductFilters
          categoria={categoria}
          setCategoria={setCategoria}
          precioMax={precioMax}
          setPrecioMax={setPrecioMax}
        />
        <ProductGrid productos={visibles} cargando={cargando} error={error} />
      </section>
    </>
  )
}
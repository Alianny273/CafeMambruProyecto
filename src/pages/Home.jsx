import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import Marquee from '../components/home/Marquee'
import RecetaPerfecta from '../components/home/RecetaPerfecta'
import SectionHeader from '../components/ui/SectionHeader'
import ProductGrid from '../components/productos/ProductGrid'
import ExperienciaCard from '../components/experiencias/ExperienciaCard'
import About from '../components/nosotros/About'
import { useProductos } from '../hooks/useProductos'
import { experiencias } from '../data/experiencias'

export default function Home() {
  const { productos, cargando, error } = useProductos()

  return (
    <>
      <title>Mambrú - Café, Memoria, Territorio, Alma</title>
      <Hero />
      <Marquee />

      <section id="tienda" className="shop">
        <SectionHeader titulo="Nuestra Selección" subtitulo="Cafés cultivados con el alma, listos para tu taza." />
        <ProductGrid productos={productos} cargando={cargando} error={error} />
      </section>

      <section id="servicios-preview" className="shop shop-alt">
        <SectionHeader
          titulo="Experiencias Mambrú"
          subtitulo="Un vistazo a nuestros talleres, actividades sensoriales y catas exclusivas."
        />
        <div className="grid-products">
          {experiencias.map((e) => (
            <ExperienciaCard key={e.id} datos={{ ...e, ...e.resumen }} />
          ))}
        </div>
        <div className="section-cta">
          <Link to="/experiencias" className="btn-primary">Conoce nuestras experiencias</Link>
        </div>
      </section>

      <About
        id="conocenos"
        parrafoFinal="Somos una marca joven, pero con un respeto absoluto por el café de especialidad. Sin rodeos, puro sabor."
        to="/conocenos"
        textoBoton="Prueba nuestra historia"
      />

      <RecetaPerfecta />
    </>
  )
}

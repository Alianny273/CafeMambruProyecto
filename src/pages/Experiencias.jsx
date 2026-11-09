import SectionHeader from '../components/ui/SectionHeader'
import ExperienciaCard from '../components/experiencias/ExperienciaCard'
import { experiencias } from '../data/experiencias'

export default function Experiencias() {
  return (
    <>
      <title>Experiencias - Mambrú - Café, Memoria, Territorio, Alma</title>
      <section id="experiencias" className="shop">
        <SectionHeader
          titulo="Talleres y Catas"
          subtitulo="Conecta con la cultura cafetera a través de espacios creados para ti y tu familia."
        />
        <div className="grid-products">
          {experiencias.map((e) => (
            <ExperienciaCard key={e.id} datos={e} conAccion />
          ))}
        </div>
      </section>
    </>
  )
}

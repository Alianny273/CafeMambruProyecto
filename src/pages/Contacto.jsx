import SectionHeader from '../components/ui/SectionHeader'
import ContactForm from '../components/contacto/ContactForm'

export default function Contacto() {
  return (
    <>
      <title>Contacto - Mambrú</title>
      <section className="shop contact-section">
        <SectionHeader
          titulo="Hablemos de Café"
          subtitulo="¿Tienes dudas, pedidos al por mayor o quieres parchar con nosotros? Escríbenos."
        />
        <ContactForm />
      </section>
    </>
  )
}

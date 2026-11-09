import StepsList from './StepsList'

const pasos = [
  <><strong>Calentar:</strong> Vierte agua caliente en la prensa vacía para templar el vidrio y desecha esa agua.</>,
  <><strong>Moler:</strong> Muele tus granos justo antes de usarlos para conservar aromas.</>,
  <><strong>Agregar:</strong> Coloca el café molido en el fondo de la prensa.</>,
  <><strong>Verter:</strong> Añade agua a 93°C, asegurándote de mojar todo el café por igual.</>,
  <><strong>Reposar:</strong> Remueve suavemente, pon la tapa sin bajar el émbolo y espera 4 minutos.</>,
  <><strong>Servir:</strong> Baja el émbolo lento y parejo. Sirve de inmediato para no sobreextraer.</>,
]

export default function PreparacionPrensa() {
  return (
    <section className="prep-guide prep-guide--page">
      <div className="guide-text guide-intro">
        <h2>Preparación en <br /><span>Prensa Francesa</span></h2>
        <p>Sigue estos pasos paso a paso para lograr una extracción perfecta y conservar todos los aromas de nuestro café:</p>
      </div>

      <div className="guide-container">
        <div className="guide-text">
          <StepsList pasos={pasos} />
        </div>
        <div className="guide-image guide-image--video">
          <div className="image-wrapper image-wrapper--video">
            <iframe
              className="video-frame"
              src="https://www.youtube.com/embed/_3MlAyoPga8"
              title="Cómo preparar café en prensa francesa"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}

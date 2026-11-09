const frases = [
  '☕ CAFÉ DE ESPECIALIDAD',
  '🌿 ORIGEN COLOMBIA',
  '✨ MEMORIA Y TERRITORIO',
  '🔥 TOSTIÓN FRESCA',
]

// La lista se repite dos veces: la animación recorre la mitad y vuelve a empezar sin saltos
export default function Marquee() {
  return (
    <div className="marquee-container" aria-hidden="true">
      <div className="marquee-content">
        {[...frases, ...frases].map((f, i) => (
          <span key={i}>{f}</span>
        ))}
      </div>
    </div>
  )
}

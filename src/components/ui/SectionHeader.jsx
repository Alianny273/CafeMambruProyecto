export default function SectionHeader({ titulo, subtitulo }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{titulo}</h2>
      {subtitulo && <p className="section-subtitle">{subtitulo}</p>}
    </div>
  )
}

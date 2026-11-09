// Aviso flotante ("Sofoco agregado ✓"). role="status" hace que los lectores de pantalla lo anuncien.
export default function Toast({ texto, visible }) {
  return (
    <div className={`toast ${visible ? 'visible' : ''}`} role="status" aria-live="polite">
      {texto}
    </div>
  )
}

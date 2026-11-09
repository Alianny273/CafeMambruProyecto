// Etiqueta + campo + nota + error. Sin `children` dibuja un <input>; con `children` (un <select>, por ejemplo) lo usa tal cual.
export default function Campo({ id, etiqueta, error, nota, children, ...props }) {
  const descripcion = [nota && `${id}-nota`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className="form-group">
      <label htmlFor={id}>{etiqueta}</label>
      {children ?? <input id={id} name={id} aria-invalid={!!error} aria-describedby={descripcion} {...props} />}
      {nota && <p id={`${id}-nota`} className="form-nota">{nota}</p>}
      {error && <p id={`${id}-error`} className="form-error">{error}</p>}
    </div>
  )
}

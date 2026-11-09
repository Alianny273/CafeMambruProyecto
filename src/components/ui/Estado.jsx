// Mensajes de carga, error o vacío con el mismo estilo
export default function Estado({ tipo = 'info', children }) {
  return (
    <div className={`estado estado-${tipo}`} role={tipo === 'error' ? 'alert' : undefined}>
      {children}
    </div>
  )
}

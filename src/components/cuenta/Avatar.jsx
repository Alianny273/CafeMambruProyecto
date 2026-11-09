// Círculo con la inicial del cliente
export default function Avatar({ cliente, grande = false }) {
  const inicial = (cliente?.nombre || '?').trim().charAt(0)
  return <span className={`avatar ${grande ? 'avatar--grande' : ''}`} aria-hidden="true">{inicial}</span>
}

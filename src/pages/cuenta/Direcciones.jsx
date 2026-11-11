import { useState } from 'react'
import Campo from '../../components/ui/Campo'
import Estado from '../../components/ui/Estado'
import { useListaCuenta } from '../../hooks/useListaCuenta'
import { useToast } from '../../hooks/useToast'

const VACIA = { alias: '', direccion: '', ciudad: '', indicaciones: '' }

export default function Direcciones() {
  const { items, estado, guardar } = useListaCuenta('direcciones')
  const { mostrarToast } = useToast()
  const [valores, setValores] = useState(VACIA)
  const [errores, setErrores] = useState({})

  const alCambiar = (e) => {
    setValores({ ...valores, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: undefined })
  }

  const intentar = async (accion, mensaje) => {
    try { await accion(); mostrarToast(mensaje) } catch { mostrarToast('No pudimos guardar el cambio. Inténtalo de nuevo.') }
  }

  const agregar = (e) => {
    e.preventDefault()
    const nuevos = {}
    if (!valores.direccion.trim()) nuevos.direccion = 'Escribe la dirección.'
    if (!valores.ciudad.trim()) nuevos.ciudad = 'Escribe la ciudad.'
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return
    const direccion = {
      id: Date.now(), alias: valores.alias.trim() || 'Mi dirección', direccion: valores.direccion.trim(),
      ciudad: valores.ciudad.trim(), indicaciones: valores.indicaciones.trim(),
    }
    intentar(async () => { await guardar([...items, direccion]); setValores(VACIA) }, 'Dirección guardada ✓')
  }

  if (estado === 'cargando') return <Estado>Cargando tus direcciones...</Estado>
  if (estado === 'error') return <Estado tipo="error">No pudimos cargar tus direcciones. Inténtalo de nuevo en unos minutos.</Estado>

  return (
    <>
      <title>Mis direcciones - Mambrú</title>
      {items.length === 0 ? (
        <Estado><h3>Aún no tienes direcciones</h3><p>Agrega una para que tus pedidos lleguen donde tú quieras.</p></Estado>
      ) : (
        <div className="lista-cuenta">
          {items.map((d) => (
            <article className="cart-item" key={d.id}>
              <div>
                <h3>{d.alias}</h3>
                <p>{d.direccion}, {d.ciudad}</p>
                {d.indicaciones && <p className="cart-item-detail">{d.indicaciones}</p>}
              </div>
              <button type="button" className="btn-remove" onClick={() => intentar(() => guardar(items.filter((x) => x.id !== d.id)), 'Dirección eliminada')}>
                Eliminar
              </button>
            </article>
          ))}
        </div>
      )}

      <form className="panel panel--espacio" onSubmit={agregar} noValidate>
        <h3 className="panel-titulo">Agregar una dirección</h3>
        <div className="form-grid">
          <Campo id="alias" etiqueta="Nombre (Casa, Oficina...)" value={valores.alias} onChange={alCambiar} />
          <Campo id="ciudad" etiqueta="Ciudad" value={valores.ciudad} onChange={alCambiar} error={errores.ciudad} autoComplete="address-level2" />
          <div className="span-2">
            <Campo id="direccion" etiqueta="Dirección" value={valores.direccion} onChange={alCambiar} error={errores.direccion} autoComplete="street-address" />
          </div>
          <div className="span-2">
            <Campo id="indicaciones" etiqueta="Indicaciones para el domicilio (opcional)" value={valores.indicaciones} onChange={alCambiar} />
          </div>
        </div>
        <button type="submit" className="btn-primary btn-submit perfil-guardar">Guardar dirección</button>
      </form>
    </>
  )
}

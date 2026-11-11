import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Campo from '../../components/ui/Campo'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const ANIO = new Date().getFullYear()
const ANIOS = Array.from({ length: 83 }, (_, i) => ANIO - 18 - i) // mayores de 18 años
const GENEROS = [
  ['femenino', 'Femenino'], ['masculino', 'Masculino'], ['no_binario', 'No binario'], ['no_especifica', 'Prefiero no decir'],
]

// Convierte el cliente en los valores del formulario (la fecha se separa en día, mes y año)
const aFormulario = (c) => {
  const [anio = '', mes = '', dia = ''] = (c.nacimiento || '').split('-')
  return {
    nombre: c.nombre || '', apellido: c.apellido || '', indicativo: c.indicativo || '+57', celular: c.celular || '',
    documento: c.documento || '', dia: dia && String(Number(dia)), mes: mes && String(Number(mes)), anio, genero: c.genero || '',
  }
}

function validar(v) {
  const e = {}
  if (!v.nombre.trim()) e.nombre = 'Escribe tu nombre.'
  if (!v.apellido.trim()) e.apellido = 'Escribe tu apellido.'
  if (v.celular && !/^\d+$/.test(v.celular)) e.celular = 'Usa solo números.'
  else if (v.celular && v.indicativo === '+57' && v.celular.length !== 10) e.celular = 'Un celular colombiano tiene 10 dígitos.'
  if (v.documento && !/^\d{5,12}$/.test(v.documento)) e.documento = 'Usa solo números (entre 5 y 12 dígitos).'
  const partes = [v.dia, v.mes, v.anio].filter(Boolean).length
  if (partes > 0 && partes < 3) e.nacimiento = 'Completa día, mes y año.'
  else if (partes === 3) {
    const f = new Date(Number(v.anio), Number(v.mes) - 1, Number(v.dia))
    if (f.getDate() !== Number(v.dia)) e.nacimiento = 'Esa fecha no existe.'
  }
  return e
}

export default function Perfil() {
  const { cliente, actualizar, eliminar } = useAuth()
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  const original = aFormulario(cliente)
  const [valores, setValores] = useState(original)
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const hayCambios = JSON.stringify(valores) !== JSON.stringify(original)

  const alCambiar = (e) => {
    const { name, value } = e.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: undefined, ...(['dia', 'mes', 'anio'].includes(name) && { nacimiento: undefined }) })
  }

  const alGuardar = async (e) => {
    e.preventDefault()
    const encontrados = validar(valores)
    setErrores(encontrados)
    setError('')
    if (Object.keys(encontrados).length > 0) return

    setGuardando(true)
    try {
      const nacimiento = valores.anio
        ? `${valores.anio}-${valores.mes.padStart(2, '0')}-${valores.dia.padStart(2, '0')}`
        : ''
      await actualizar({
        nombre: valores.nombre.trim(), apellido: valores.apellido.trim(), indicativo: valores.indicativo,
        celular: valores.celular, documento: valores.documento, nacimiento, genero: valores.genero,
      })
      mostrarToast('Cambios guardados ✓')
    } catch (err) {
      setError(err.message || 'No pudimos guardar tus cambios. Inténtalo de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const alEliminar = async () => {
    if (!window.confirm('¿Eliminar tu cuenta? Se borrarán tus datos, direcciones, favoritos y compras guardadas. No se puede deshacer.')) return
    try {
      await eliminar()
      navigate('/')
      mostrarToast('Tu cuenta fue eliminada')
    } catch {
      setError('No pudimos eliminar tu cuenta. Inténtalo de nuevo o escríbenos desde Contacto.')
    }
  }

  return (
    <>
      <title>Mi perfil - Mambrú</title>
      <form className="panel" onSubmit={alGuardar} noValidate>
        <div className="form-grid">
          <Campo id="nombre" etiqueta="Nombre" value={valores.nombre} onChange={alCambiar} error={errores.nombre} autoComplete="given-name" />
          <Campo id="apellido" etiqueta="Apellido" value={valores.apellido} onChange={alCambiar} error={errores.apellido} autoComplete="family-name" />

          <Campo id="email" etiqueta="Correo" value={cliente.email} disabled readOnly />
          <Campo id="celular" etiqueta="Celular" error={errores.celular}>
            <div className="campo-fila">
              <select name="indicativo" aria-label="Indicativo del país" value={valores.indicativo} onChange={alCambiar}>
                <option value="+57">+57</option>
                <option value="+1">+1</option>
                <option value="+34">+34</option>
                <option value="+52">+52</option>
                <option value="+58">+58</option>
              </select>
              <input id="celular" name="celular" inputMode="numeric" value={valores.celular} onChange={alCambiar}
                aria-invalid={!!errores.celular} aria-describedby={errores.celular ? 'celular-error' : undefined} autoComplete="tel-national" />
            </div>
          </Campo>

          <Campo
            id="documento" etiqueta="Cédula de ciudadanía" inputMode="numeric"
            value={valores.documento} onChange={alCambiar} error={errores.documento}
            disabled={!!cliente.documento}
            nota={cliente.documento ? <>Para cambiar tu cédula <Link to="/contacto">escríbenos aquí</Link>.</> : 'Opcional. Una vez guardada, solo se cambia con ayuda del equipo.'}
          />
          <Campo id="dia" etiqueta="Fecha de nacimiento" error={errores.nacimiento}>
            <div className="campo-fila">
              <select id="dia" name="dia" aria-label="Día" value={valores.dia} onChange={alCambiar}>
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
              </select>
              <select name="mes" aria-label="Mes" value={valores.mes} onChange={alCambiar}>
                <option value="">Mes</option>
                {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              <select name="anio" aria-label="Año" value={valores.anio} onChange={alCambiar}>
                <option value="">Año</option>
                {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </Campo>

          <fieldset className="radios span-2">
            <legend>Género</legend>
            {GENEROS.map(([valor, texto]) => (
              <label key={valor}>
                <input type="radio" name="genero" value={valor} checked={valores.genero === valor} onChange={alCambiar} />
                {texto}
              </label>
            ))}
          </fieldset>
        </div>

        {error && <p className="form-msg form-msg-error" role="alert">{error}</p>}

        <button type="submit" className="btn-primary btn-submit perfil-guardar" disabled={!hayCambios || guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      <p className="perfil-pie">
        Tus datos se usan como explica la <Link to="/politicas/privacidad">política de privacidad</Link>.{' '}
        <button type="button" className="btn-remove" onClick={alEliminar}>Eliminar mi cuenta</button>
      </p>
    </>
  )
}

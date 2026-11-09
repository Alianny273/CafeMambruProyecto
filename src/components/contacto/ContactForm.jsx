import { useState } from 'react'
import { Link } from 'react-router-dom'
import { enviarContacto, MODO_DEMO } from '../../services/api'

// ---------------------------------------------------------------
// Formulario de contacto.
// Al enviarlo, el front hace  POST /contacto  al backend (Spring Boot) con:
//   { nombre, email, telefono, mensaje, aceptaWhatsapp }
//   telefono = indicativo + celular, solo dígitos. Ej: "573001234567"
// El backend guarda el mensaje y envía al celular de la persona una
// confirmación por WhatsApp ("Cafe Mambrú recibió tu mensaje...").
// Ver la sección "Formulario de contacto" en el README.
// ---------------------------------------------------------------

const VACIO = { nombre: '', email: '', indicativo: '+57', celular: '', mensaje: '', aceptaWhatsapp: false }
const EMAIL = /^\S+@\S+\.\S+$/
const INDICATIVOS = ['+57', '+1', '+34', '+52', '+58', '+593', '+51', '+56', '+54']

// devuelve un objeto con un mensaje por cada campo inválido
function validar({ nombre, email, indicativo, celular, mensaje, aceptaWhatsapp }) {
  const errores = {}
  if (!nombre.trim()) errores.nombre = 'Escribe tu nombre.'

  if (!email.trim()) errores.email = 'Escribe tu correo electrónico.'
  else if (!EMAIL.test(email.trim())) errores.email = 'Escribe un correo válido, por ejemplo tu@correo.com.'

  const numero = celular.replace(/\s/g, '')
  if (!numero) errores.celular = 'Escribe tu número de WhatsApp.'
  else if (!/^\d+$/.test(numero)) errores.celular = 'Usa solo números, sin espacios ni guiones.'
  else if (indicativo === '+57' && !/^3\d{9}$/.test(numero)) errores.celular = 'Un celular colombiano tiene 10 dígitos y empieza por 3.'
  else if (numero.length < 6 || numero.length > 13) errores.celular = 'Revisa el número: parece incompleto o demasiado largo.'

  if (!mensaje.trim()) errores.mensaje = 'Cuéntanos qué necesitas.'
  if (!aceptaWhatsapp) errores.aceptaWhatsapp = 'Necesitamos tu autorización para escribirte por WhatsApp.'
  return errores
}

export default function ContactForm() {
  const [valores, setValores] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [estado, setEstado] = useState('inicial') // inicial | enviando | ok | error
  const [aviso, setAviso] = useState('')

  const alCambiar = (e) => {
    const { name, value, type, checked } = e.target
    setValores({ ...valores, [name]: type === 'checkbox' ? checked : value })
    if (errores[name]) setErrores({ ...errores, [name]: undefined })
  }

  const alEnviar = async (e) => {
    e.preventDefault()
    const encontrados = validar(valores)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEstado('enviando')
    try {
      const respuesta = await enviarContacto({
        nombre: valores.nombre.trim(),
        email: valores.email.trim(),
        telefono: (valores.indicativo + valores.celular).replace(/\D/g, ''), // "573001234567"
        mensaje: valores.mensaje.trim(),
        aceptaWhatsapp: valores.aceptaWhatsapp,
      })

      if (MODO_DEMO) {
        setAviso('Mensaje recibido. (Modo demo: la confirmación por WhatsApp solo llega cuando el backend está conectado.)')
      } else if (respuesta?.whatsappEnviado === false) {
        // el backend guardó el mensaje pero no pudo enviar el WhatsApp
        setAviso('Recibimos tu mensaje y te contactaremos pronto, pero no pudimos enviarte la confirmación por WhatsApp.')
      } else {
        setAviso('¡Listo! Recibimos tu mensaje. Te enviamos una confirmación a tu WhatsApp y pronto nos comunicaremos contigo.')
      }
      setValores(VACIO) // limpia el formulario
      setEstado('ok')
    } catch (error) {
      // el backend responde los errores como { "message": "..." } y api.js los convierte en error.message
      setAviso(error?.message || 'No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.')
      setEstado('error')
    }
  }

  const describir = (name) => (errores[name] ? `${name}-error` : undefined)
  const error = (name) => errores[name] && <p id={`${name}-error`} className="form-error">{errores[name]}</p>

  return (
    <div className="contact-card">
      <form className="contact-form" onSubmit={alEnviar} noValidate>
        <div className="form-group">
          <label htmlFor="nombre">Tu Nombre</label>
          <input id="nombre" name="nombre" type="text" placeholder="Ej. Camila Andrés" autoComplete="name"
            value={valores.nombre} onChange={alCambiar} aria-invalid={!!errores.nombre} aria-describedby={describir('nombre')} />
          {error('nombre')}
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input id="email" name="email" type="email" placeholder="tu@correo.com" autoComplete="email"
            value={valores.email} onChange={alCambiar} aria-invalid={!!errores.email} aria-describedby={describir('email')} />
          {error('email')}
        </div>

        <div className="form-group">
          <label htmlFor="celular">Celular (WhatsApp)</label>
          <div className="campo-fila">
            <select name="indicativo" aria-label="Indicativo del país" value={valores.indicativo} onChange={alCambiar}>
              {INDICATIVOS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <input id="celular" name="celular" type="tel" inputMode="numeric" placeholder="3001234567" autoComplete="tel-national"
              value={valores.celular} onChange={alCambiar} aria-invalid={!!errores.celular} aria-describedby={describir('celular')} />
          </div>
          {error('celular')}
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea id="mensaje" name="mensaje" rows={5} placeholder="Cuéntanos lo que necesites..."
            value={valores.mensaje} onChange={alCambiar} aria-invalid={!!errores.mensaje} aria-describedby={describir('mensaje')} />
          {error('mensaje')}
        </div>

        <div>
          <label className="check">
            <input type="checkbox" name="aceptaWhatsapp" checked={valores.aceptaWhatsapp} onChange={alCambiar}
              aria-invalid={!!errores.aceptaWhatsapp} aria-describedby={describir('aceptaWhatsapp')} />
            <span>
              Acepto que Café Mambrú me escriba por WhatsApp para responder mi mensaje, según la{' '}
              <Link to="/politicas/privacidad">política de privacidad</Link>.
            </span>
          </label>
          {error('aceptaWhatsapp')}
        </div>

        {estado === 'ok' && <p className="form-msg form-msg-ok" role="status">{aviso}</p>}
        {estado === 'error' && <p className="form-msg form-msg-error" role="alert">{aviso}</p>}

        <button type="submit" className="btn-primary btn-submit" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </div>
  )
}

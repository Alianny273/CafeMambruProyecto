// "Base de datos" del modo demo: todo vive en el navegador (localStorage).
// Sirve para probar la cuenta de cliente sin backend. En producción esto lo reemplaza la API.
const CLIENTES = 'mambru_clientes'
const SESION = 'mambru_sesion'
const CAMPOS_EDITABLES = ['nombre', 'apellido', 'indicativo', 'celular', 'documento', 'nacimiento', 'genero']

const leer = (clave, defecto) => {
  try { return JSON.parse(localStorage.getItem(clave)) ?? defecto } catch { return defecto }
}
const guardar = (clave, valor) => {
  try { localStorage.setItem(clave, JSON.stringify(valor)) } catch { /* sin storage */ }
}
const publico = ({ hash, sal, ...resto }) => { void hash; void sal; return resto }
const normalizar = (email) => email.trim().toLowerCase()
const aHex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('')

// La contraseña nunca se guarda tal cual: se guarda su huella (PBKDF2 + sal aleatoria)
async function hashear(password, sal) {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) throw new Error('Para crear cuentas abre el sitio desde localhost o https.')
  const enc = new TextEncoder()
  const clave = await subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(sal), iterations: 100000, hash: 'SHA-256' }, clave, 256)
  return aHex(bits)
}
const aleatorio = () => aHex(crypto.getRandomValues(new Uint8Array(16)))

const idSesion = () => leer(SESION, null)
const claveDatos = (recurso) => `mambru_${idSesion()}_${recurso}`

export async function registrar({ nombre, apellido, email, password }) {
  const clientes = leer(CLIENTES, [])
  if (clientes.some((c) => c.email === normalizar(email))) {
    throw new Error('Ya existe una cuenta con ese correo. Prueba iniciando sesión.')
  }
  const sal = aleatorio()
  const cliente = {
    id: aleatorio(), nombre: nombre.trim(), apellido: apellido.trim(), email: normalizar(email),
    indicativo: '+57', celular: '', documento: '', nacimiento: '', genero: '',
    sal, hash: await hashear(password, sal), creado: new Date().toISOString(),
  }
  guardar(CLIENTES, [...clientes, cliente])
  guardar(SESION, cliente.id)
  return publico(cliente)
}

export async function ingresar({ email, password }) {
  const cliente = leer(CLIENTES, []).find((c) => c.email === normalizar(email))
  if (!cliente || (await hashear(password, cliente.sal)) !== cliente.hash) {
    throw new Error('Correo o contraseña incorrectos.')
  }
  guardar(SESION, cliente.id)
  return publico(cliente)
}

export const cerrarSesion = () => { try { localStorage.removeItem(SESION) } catch { /* sin storage */ } }

export function sesion() {
  const cliente = leer(CLIENTES, []).find((c) => c.id === idSesion())
  return cliente ? publico(cliente) : null
}

export function actualizar(cambios) {
  const clientes = leer(CLIENTES, [])
  const actual = clientes.find((c) => c.id === idSesion())
  if (!actual) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
  const nuevo = { ...actual }
  for (const campo of CAMPOS_EDITABLES) {
    if (campo in cambios) nuevo[campo] = cambios[campo]
  }
  if (actual.documento) nuevo.documento = actual.documento // la cédula solo se cambia con ayuda del equipo
  guardar(CLIENTES, clientes.map((c) => (c.id === actual.id ? nuevo : c)))
  return publico(nuevo)
}

export function eliminar() {
  const id = idSesion()
  guardar(CLIENTES, leer(CLIENTES, []).filter((c) => c.id !== id))
  ;['direcciones', 'favoritos', 'compras'].forEach((r) => {
    try { localStorage.removeItem(claveDatos(r)) } catch { /* sin storage */ }
  })
  cerrarSesion()
}

export const lista = (recurso) => leer(claveDatos(recurso), [])
export const guardarLista = (recurso, valor) => guardar(claveDatos(recurso), valor)
export const agregarCompra = (compra) =>
  guardarLista('compras', [{ ...compra, fecha: new Date().toISOString() }, ...lista('compras')])

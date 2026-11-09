import { productos as productosLocal } from '../data/productos'

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
console.log("BASE_URL detectada:", BASE_URL);
export const MODO_DEMO = BASE_URL === ''
export const TOKEN_KEY = 'mambru_token'

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Si el cliente inició sesión, se envía su token para que el backend sepa quién es
export async function pedir(ruta, opciones = {}) {
  let token = null
  try { token = localStorage.getItem(TOKEN_KEY) } catch { /* sin storage */ }
  let res
  try {
    res = await fetch(`${BASE_URL}${ruta}`, {
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
      ...opciones,
    })
  } catch {
    // sin conexión, servidor apagado o CORS bloqueado
    throw new Error('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.')
  }
  if (!res.ok) {
    // el backend responde los errores como { "message": "..." }
    let mensaje = `Error ${res.status} en ${ruta}`
    try { mensaje = (await res.json()).message || mensaje } catch { /* sin cuerpo JSON */ }
    // token vencido o inválido: se descarta para que la app pida iniciar sesión de nuevo
    if (res.status === 401 && token) {
      try { localStorage.removeItem(TOKEN_KEY) } catch { /* sin storage */ }
    }
    throw new Error(mensaje)
  }
  return res.status === 204 ? null : res.json()
}

// La API devuelve { idProducto, nombre, descripcion, precio, stock, estado, categoria, imagen }.
// Lo visual que la base de datos no guarda (badge, origen...) sale del catálogo local según el id.
function mapearProducto(fila) {
  const id = Number(fila.idProducto ?? fila.id_producto ?? fila.id)
  const base = productosLocal.find((p) => p.id === id) ?? {
    imagen: '/img/logo.jpeg',
    alt: fila.nombre,
    badgeClase: 'badge-dark',
    categoria: 'cafe',
  }
  return {
    ...base,
    id,
    nombre: fila.nombre ?? base.nombre,
    notas: fila.descripcion ?? base.notas,
    precio: Number(fila.precio ?? base.precio),
    stock: fila.stock,
    categoria: fila.categoria || base.categoria,
    imagen: fila.imagen || base.imagen,
  }
}

// GET /productos -> catálogo
export async function getProductos() {
  if (MODO_DEMO) {
    await esperar(300)
    return productosLocal
  }
  const filas = await pedir('/api/productos')
  return filas.filter((f) => f.estado !== false).map(mapearProducto)
}

// GET /productos/:id -> un producto
export async function getProducto(id) {
  if (MODO_DEMO) {
    await esperar(200)
    const p = productosLocal.find((x) => x.id === Number(id))
    if (!p) throw new Error('Producto no encontrado')
    return p
  }
  return mapearProducto(await pedir(`/api/productos/${id}`))
}

// GET /talleres -> talleres y catas disponibles (aún sin pantalla propia: Experiencias usa contenido local)
export async function getTalleres() {
  if (MODO_DEMO) return []
  return pedir('/api/talleres')
}

// POST /pedidos (requiere sesión) -> { id_pedido }
// Solo se envía qué productos y cuántos: el precio y el total los calcula el servidor con los valores de la base de datos.
export async function enviarPedido({ items }) {
  if (MODO_DEMO) {
    await esperar(600)
    return { id_pedido: Math.floor(Math.random() * 9000) + 1000 }
  }
  const respuesta = await pedir('/api/pedidos', {
    method: 'POST',
    body: JSON.stringify({ items: items.map((i) => ({ idProducto: i.id_producto, cantidad: i.cantidad })) }),
  })
  return { id_pedido: respuesta.idPedido, total: respuesta.total }
}

// POST /contacto
//   envía:   { nombre, email, telefono: "573001234567", mensaje, aceptaWhatsapp: true }
//   espera:  201 { message, whatsappEnviado: true|false }
// El backend guarda el mensaje y le manda a "telefono" una confirmación por WhatsApp.
export async function enviarContacto(datos) {
  if (MODO_DEMO) {
    await esperar(600)
    return { message: 'Mensaje recibido', whatsappEnviado: false }
  }
  return pedir('/contacto', { method: 'POST', body: JSON.stringify(datos) })
}

import { MODO_DEMO, TOKEN_KEY, pedir } from './api'
import * as demo from './cuentaStore'

const guardarToken = (token) => {
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY) } catch { /* sin storage */ }
}
const conJson = (metodo, datos) => ({ method: metodo, body: JSON.stringify(datos) })

const aCompra = (c) => ({ id_pedido: c.idPedido, fecha: c.fecha, total: Number(c.total), estado: c.estado, items: c.items ?? [] })

export async function registrarCliente(datos) {
  if (MODO_DEMO) return demo.registrar(datos)
  const respuesta = await pedir('/api/usuarios/registro', conJson('POST', datos))
  if (respuesta.token) guardarToken(respuesta.token)
  return respuesta.cliente || respuesta;
}

export async function ingresarCliente(credenciales) {
  const respuesta = await fetch('http://localhost:8080/api/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales),
  });

  if (!respuesta.ok) {
    const errorTexto = await respuesta.text();
    throw new Error(errorTexto || 'Correo o contraseña incorrectos');
  }

  const usuario = await respuesta.json();
  
  localStorage.setItem('cliente', JSON.stringify(usuario)); 
  return usuario; 
}

export async function salirCliente() {
  if (MODO_DEMO) {
    demo.cerrarSesion();
  } else {
    localStorage.removeItem('cliente'); 
    guardarToken(null);
  }
}

export async function restaurarSesion() {
  if (MODO_DEMO) return demo.sesion()
  try {
    const usuarioGuardado = localStorage.getItem('cliente');
    if (usuarioGuardado) {
      return JSON.parse(usuarioGuardado);
    }
    return null;
  } catch {
    localStorage.removeItem('cliente');
    guardarToken(null);
    return null;
  }
}

export async function guardarPerfil(cambios) {
  return MODO_DEMO ? demo.actualizar(cambios) : pedir('/cliente', conJson('PUT', cambios))
}

export async function eliminarCuenta() {
  if (MODO_DEMO) return demo.eliminar()
  await pedir('/cliente', { method: 'DELETE' })
  localStorage.removeItem('cliente')
  guardarToken(null)
}

export async function leerLista(recurso) {
  const datos = MODO_DEMO ? demo.lista(recurso) : await pedir(`/cliente/${recurso}`)
  if (!Array.isArray(datos)) return []
  return !MODO_DEMO && recurso === 'compras' ? datos.map(aCompra) : datos
}

export async function guardarLista(recurso, valor) {
  if (MODO_DEMO) demo.guardarLista(recurso, valor)
  else await pedir(`/cliente/${recurso}`, conJson('PUT', valor))
}

export async function registrarCompra(compra) {
  if (MODO_DEMO) demo.agregarCompra(compra)
}
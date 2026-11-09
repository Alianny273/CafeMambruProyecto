// 38000 -> "$38.000"
export function formatoPrecio(valor) {
  return '$' + Number(valor).toLocaleString('es-CO')
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function obtenerProductos() {
  const response = await fetch(`${BASE_URL}/api/productos`);
  if (!response.ok) throw new Error('Error al cargar productos');
  return response.json();
}

export async function crearProducto(producto) {
  const response = await fetch(`${BASE_URL}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  if (!response.ok) throw new Error('Error al crear producto');
  return response.json();
}

export async function actualizarProducto(id, producto) {
  const response = await fetch(`${BASE_URL}/api/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
  if (!response.ok) throw new Error('Error al actualizar producto');
  return response.json();
}
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para los Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Campos del formulario de producto
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [estado, setEstado] = useState(true); // true = activo/disponible, false = inactivo

  // Cargar productos desde el backend al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  async function fetchProductos() {
    try {
      const response = await fetch('http://localhost:8080/api/productos');
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  // Abrir modal para crear
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('');
    setEstado(true);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEdit = (prod) => {
    setIsEditMode(true);
    setCurrentId(prod.idProducto);
    setNombre(prod.nombre);
    setDescripcion(prod.descripcion || '');
    setPrecio(prod.precio);
    setStock(prod.stock);
    setEstado(prod.estado);
    setIsModalOpen(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productoData = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      estado
    };

    try {
      const url = isEditMode 
        ? `http://localhost:8080/api/productos/${currentId}` 
        : 'http://localhost:8080/api/productos';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData)
      });

      if (response.ok) {
        alert(isEditMode ? '¡Producto actualizado con éxito!' : '¡Producto creado con éxito!');
        setIsModalOpen(false);
        fetchProductos();
      } else {
        alert('Error al guardar el producto.');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  // Inactivar producto (Eliminación lógica cambiando el estado a false)
  const handleInactivar = async (prod) => {
    if (!window.confirm(`¿Estás seguro de inactivar el producto "${prod.nombre}"?`)) return;

    try {
      const productoInactivo = { ...prod, estado: false };
      const response = await fetch(`http://localhost:8080/api/productos/${prod.idProducto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoInactivo)
      });

      if (response.ok) {
        alert('Producto inactivado correctamente.');
        fetchProductos();
      } else {
        alert('No se pudo inactivar el producto.');
      }
    } catch (error) {
      console.error('Error al inactivar:', error);
    }
  };

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cálculos de tarjetas de resumen
  const totalProductos = productos.length;
  const stockBajo = productos.filter(p => p.stock <= 5 && p.estado).length;
  const stockDisponible = productos.filter(p => p.stock > 5 && p.estado).length;

  return (
    <div className="w-full">
      {/* --- ENCABEZADO --- */}
      <div className="dashboard-header">
        <div className="header-title">
          <h2>Inventario</h2>
          <p>Control de stock y movimientos</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          style={{
            backgroundColor: 'var(--secondary)', color: 'white', padding: '10px 20px', 
            borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', 
            gap: '8px', cursor: 'pointer', border: 'none'
          }}
        >
          <Plus size={20} strokeWidth={2.5} /> Agregar producto
        </button>
      </div>

      {/* --- TARJETAS DE RESUMEN --- */}
      <div className="summary-grid">
        <div className="summary-card">
          <p className="title">Total productos</p>
          <p className="value dark">{totalProductos}</p>
        </div>
        <div className="summary-card">
          <p className="title">Stock bajo</p>
          <p className="value warning">{stockBajo}</p>
        </div>
        <div className="summary-card">
          <p className="title">Stock disponible</p>
          <p className="value success">{stockDisponible}</p>
        </div>
      </div>

      {/* --- BUSCADOR Y TABLA --- */}
      <div className="table-container">
        <div style={{ display: 'flex', marginBottom: '24px' }}>
          <div className="search-container" style={{ maxWidth: '400px' }}>
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Buscar en inventario..." 
              className="search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((prod) => (
              <tr key={prod.idProducto}>
                <td style={{ fontWeight: '700' }}>{prod.nombre}</td>
                <td style={{ color: 'var(--text-muted)' }}>{prod.descripcion || 'Sin descripción'}</td>
                <td>$ {prod.precio}</td>
                <td style={{ fontSize: '1.1rem', fontWeight: '800' }}>{prod.stock}</td>
                <td>
                  <span className={`badge ${prod.estado ? (prod.stock <= 5 ? 'low' : 'available') : ''}`} style={!prod.estado ? { backgroundColor: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db' } : {}}>
                    {prod.estado ? (prod.stock <= 5 ? 'Stock bajo' : 'Disponible') : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-icon" title="Editar" onClick={() => handleOpenEdit(prod)}>
                      <Edit2 size={18} strokeWidth={2.5} />
                    </button>
                    <button className="btn-icon" title="Inactivar" onClick={() => handleInactivar(prod)} style={{ color: 'inherit' }}>
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL PARA CREAR / EDITAR PRODUCTO --- */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card-bg, #fff)', padding: '2.5rem', borderRadius: '24px',
            width: '100%', maxWidth: '500px', border: '2px solid var(--text-dark)', boxShadow: '8px 8px 0px var(--primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Nombre del Producto</label>
                <input 
                  type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Descripción</label>
                <input 
                  type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Precio ($)</label>
                  <input 
                    type="number" step="0.01" required value={precio} onChange={(e) => setPrecio(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Stock</label>
                  <input 
                    type="number" required value={stock} onChange={(e) => setStock(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {isEditMode && (
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Estado</label>
                  <select 
                    value={estado} onChange={(e) => setEstado(e.target.value === 'true')}
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', background: '#fff' }}
                  >
                    <option value="true">Activo / Disponible</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              )}

              <button type="submit" style={{
                marginTop: '1rem', backgroundColor: 'var(--secondary)', color: 'white', padding: '12px',
                borderRadius: '12px', fontWeight: '700', border: '2px solid var(--text-dark)', cursor: 'pointer'
              }}>
                {isEditMode ? 'Actualizar Producto' : 'Guardar Producto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { obtenerProductos, crearProducto, actualizarProducto } from "../../../services/productoService";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  
  const formularioInicial = {
    idProducto: null,
    nombre: '',
    subtitulo: '',
    categoria: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen: '',
    estado: 1
  };
  
  const [form, setForm] = useState(formularioInicial);

  useEffect(() => {
    cargarDatos();
  }, []);

  function cargarDatos() {
    setCargando(true);
    obtenerProductos()
      .then(data => {
        // Blindaje: Nos aseguramos de que 'data' sea siempre un arreglo
        if (Array.isArray(data)) {
          setProductos(data);
        } else if (data && Array.isArray(data.resultado)) {
          setProductos(data.resultado); // Por si tu API envuelve los datos en un objeto
        } else {
          setProductos([]);
        }
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar productos:", error);
        setProductos([]);
        setCargando(false);
      });
  }

  const manejarCambioInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
  };

  const abrirModalCrear = () => {
    setForm(formularioInicial);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod) => {
    setForm({
      idProducto: prod.idProducto || prod.id_producto, // Maneja ambos nombres por si acaso
      nombre: prod.nombre || '',
      subtitulo: prod.subtitulo || '',
      categoria: prod.categoria || '',
      descripcion: prod.descripcion || '',
      precio: prod.precio || '',
      stock: prod.stock || '',
      imagen: prod.imagen || '',
      estado: prod.estado !== undefined ? prod.estado : 1
    });
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const guardarDatosProducto = async (e) => {
    e.preventDefault();
    try {
      const idAEnviar = form.idProducto || form.id_producto;
      if (modoEdicion) {
        await actualizarProducto(idAEnviar, form);
      } else {
        await crearProducto(form);
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  };

  if (cargando) {
    return <p style={{ padding: '20px', fontWeight: 'bold' }}>Cargando productos desde la base de datos de Café Mambrú...</p>;
  }

  return (
    <div className="w-full">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="header-title">
          <h2>Productos</h2>
          <p>Gestiona los productos de Mambrú para tu página web</p>
        </div>
        <button 
          onClick={abrirModalCrear}
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '2px 2px 0px #000'
          }}
        >
          + Crear Producto
        </button>
      </div>

      <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {productos
          .filter(prod => Number(prod.estado) === 1)
          .map((prod) => {
            const prodId = prod.idProducto || prod.id_producto;
            return (
              <div key={prodId} className="product-card" style={{
                background: '#fff',
                border: '2px solid #000',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '4px 4px 0px #000',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', border: '1px solid #000' }}>
                  <img 
                    src={prod.imagen || 'https://via.placeholder.com/300'} 
                    alt={prod.nombre} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {prod.categoria && (
                    <span className="badge-categoria" style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#e0dcd0',
                      border: '1px solid #000',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {prod.categoria}
                    </span>
                  )}
                </div>

                <h3 style={{ fontFamily: 'serif', fontSize: '24px', margin: '8px 0 4px 0', fontWeight: 'bold' }}>{prod.nombre}</h3>

                {prod.subtitulo && (
                  <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚙️</span> {prod.subtitulo}
                  </div>
                )}

                <p className="product-desc" style={{ fontSize: '14px', color: '#718096', marginBottom: '16px', lineHeight: '1.4' }}>
                  {prod.descripcion}
                </p>

                <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e0', marginBottom: '16px' }} />

                <div className="product-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="product-price" style={{ fontSize: '22px', fontWeight: 'bold' }}>
                    ${Number(prod.precio || 0).toLocaleString()}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => abrirModalEditar(prod)}
                      style={{
                        background: '#edf2f7',
                        border: '1px solid #000',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      Editar
                    </button>
                    <span className="badge available" style={{ background: '#e2e8f0', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}>
                      Stock: {prod.stock}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {modalAbierto && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '16px', width: '450px',
            border: '2px solid #000', boxShadow: '6px 6px 0px #000', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px' }}>{modoEdicion ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
            
            <form onSubmit={guardarDatosProducto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label>Nombre del Producto:</label>
              <input type="text" name="nombre" value={form.nombre} onChange={manejarCambioInput} required style={{ padding: '8px', border: '1px solid #000', borderRadius: '6px' }} />

              <label>Subtítulo (ej. 600ml / Acero y Vidrio):</label>
              <input type="text" name="subtitulo" value={form.subtitulo} onChange={manejarCambioInput} style={{ padding: '8px', border: '1px solid #000', borderRadius: '6px' }} />

              <label>Categoría (ej. Accesorio, Café):</label>
              <input type="text" name="categoria" value={form.categoria} onChange={manejarCambioInput} style={{ padding: '8px', border: '1px solid #000', borderRadius: '6px' }} />

              <label>URL de la Imagen:</label>
              <input type="text" name="imagen" value={form.imagen} onChange={manejarCambioInput} placeholder="https://..." style={{ padding: '8px', border: '1px solid #000', borderRadius: '6px' }} />

              <label>Descripción:</label>
              <textarea name="descripcion" value={form.descripcion} onChange={manejarCambioInput} rows="3" style={{ padding: '8px', border: '1px solid #000', borderRadius: '6px' }}></textarea>

              <label>Precio:</label>
              <input type="number" step="0.01" name="precio" value={form.precio} onChange={manejarCambioInput} required style={{ padding: '8px', border: '1px solid #000', borderRadius: '6px' }} />

              <label>Stock:</label>
              <input type="number" name="stock" value={form.stock} onChange={manejarCambioInput} required style={{ padding: '8px', border: '1px solid #000', borderRadius: '6px' }} />

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '5px' }}>
                <input type="checkbox" name="estado" checked={Number(form.estado) === 1} onChange={manejarCambioInput} />
                Producto Activo (Visible en la página web)
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ padding: '8px 16px', background: '#ccc', border: '1px solid #000', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '8px 16px', background: '#e76f51', color: 'white', border: '1px solid #000', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {modoEdicion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
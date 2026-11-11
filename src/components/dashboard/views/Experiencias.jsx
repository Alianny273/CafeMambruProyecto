import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Users, Edit2, Trash2, X } from 'lucide-react';

export default function Experiencias() {
  const [talleres, setTalleres] = useState([]);
  
  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Formulario adaptado con los nuevos campos (imagen, subtitulo, categoria)
  const [nombre, setNombre] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [cuposDisponibles, setCuposDisponibles] = useState('');
  const [imagen, setImagen] = useState('');
  const [estado, setEstado] = useState(true);

  // Pestañas (Filtramos por activos vs inactivos)
  const [filtroActivo, setFiltroActivo] = useState('Activos');
  const tabs = ['Todos', 'Activos', 'Inactivos'];

  useEffect(() => {
    fetchTalleres();
  }, []);

  const fetchTalleres = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/talleres');
      if (response.ok) {
        const data = await response.json();
        setTalleres(data);
      }
    } catch (error) {
      console.error('Error al cargar talleres:', error);
    }
  };

  const talleresFiltrados = talleres.filter(taller => {
    if (filtroActivo === 'Todos') return true;
    if (filtroActivo === 'Activos') return taller.estado === true;
    if (filtroActivo === 'Inactivos') return taller.estado === false;
    return true;
  });

  const getBadgeClass = (estado, cupos) => {
    if (!estado) return 'low'; // Inactivo = Rojo
    if (cupos === 0) return 'low'; // Sin cupos = Rojo
    if (cupos <= 3) return 'pending'; // Pocos cupos = Naranja
    return 'available'; // Verde
  };

  const getEstadoText = (estado, cupos) => {
    if (!estado) return 'Inactivo';
    if (cupos === 0) return 'Agotado';
    return 'Disponible';
  };

  // --- HANDLERS MODAL ---
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setNombre('');
    setSubtitulo('');
    setCategoria('');
    setDescripcion('');
    setPrecio('');
    setCuposDisponibles('');
    setImagen('');
    setEstado(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (taller) => {
    setIsEditMode(true);
    setCurrentId(taller.idTaller);
    setNombre(taller.nombre);
    setSubtitulo(taller.subtitulo || '');
    setCategoria(taller.categoria || '');
    setDescripcion(taller.descripcion || '');
    setPrecio(taller.precio);
    setCuposDisponibles(taller.cuposDisponibles);
    setImagen(taller.imagen || '');
    setEstado(taller.estado);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const estadoBooleano = estado === true || String(estado) === 'true';

    const tallerData = {
      nombre,
      subtitulo,
      categoria,
      descripcion,
      precio: parseFloat(precio) || 0,
      cuposDisponibles: parseInt(cuposDisponibles) || 0,
      imagen,
      estado: estadoBooleano
    };

    try {
      const url = isEditMode 
        ? `http://localhost:8080/api/talleres/${currentId}` 
        : 'http://localhost:8080/api/talleres';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tallerData)
      });

      if (res.ok) {
        alert(isEditMode ? 'Experiencia actualizada con éxito' : 'Experiencia creada con éxito');
        fetchTalleres();
        setIsModalOpen(false);
      } else {
        const errorText = await res.text();
        alert('Error del servidor: ' + errorText);
      }
    } catch (error) {
      console.error('Error de red al guardar:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  const handleInactivar = async (taller) => {
    if (!window.confirm(`¿Inactivar la experiencia "${taller.nombre}"?`)) return;

    try {
      const tallerInactivo = { ...taller, estado: false };
      const res = await fetch(`http://localhost:8080/api/talleres/${taller.idTaller}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tallerInactivo)
      });

      if (res.ok) {
        fetchTalleres();
      }
    } catch (error) {
      console.error('Error al inactivar:', error);
    }
  };

  return (
    <div className="w-full">
      {/* --- ENCABEZADO --- */}
      <div className="dashboard-header">
        <div className="header-title">
          <h2>Experiencias</h2>
          <p>Talleres, catas y recorridos programados en Mambrú</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          style={{
            backgroundColor: 'var(--secondary)', color: 'white', padding: '10px 20px', 
            borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', 
            gap: '8px', cursor: 'pointer', border: 'none'
          }}
        >
          <Plus size={20} strokeWidth={2.5} /> Crear experiencia
        </button>
      </div>

      {/* --- FILTROS INTERACTIVOS --- */}
      <div className="filter-tabs" style={{ marginBottom: '24px', display: 'inline-flex' }}>
        {tabs.map((tab, i) => (
          <button 
            key={i} 
            className={`filter-btn ${filtroActivo === tab ? 'active' : ''}`}
            onClick={() => setFiltroActivo(tab)}
            style={{
              backgroundColor: filtroActivo === tab ? 'var(--secondary)' : 'transparent',
              color: filtroActivo === tab ? 'white' : 'var(--text-muted)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- LISTA DE EXPERIENCIAS (Grid idéntico al de productos) --- */}
      <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {talleresFiltrados.length > 0 ? (
          talleresFiltrados.map((taller) => (
            <div key={taller.idTaller} className="product-card" style={{
              background: '#fff',
              border: '2px solid #000',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '4px 4px 0px #000',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              opacity: taller.estado ? 1 : 0.6
            }}>
              {/* Imagen y Badge de Categoría */}
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', border: '1px solid #000' }}>
                <img 
                  src={taller.imagen || 'https://via.placeholder.com/300'} 
                  alt={taller.nombre} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {taller.categoria && (
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
                    {taller.categoria}
                  </span>
                )}
              </div>

              {/* Título */}
              <h3 style={{ fontFamily: 'serif', fontSize: '24px', margin: '8px 0 4px 0', fontWeight: 'bold' }}>{taller.nombre}</h3>

              {/* Subtítulo */}
              {taller.subtitulo && (
                <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✨</span> {taller.subtitulo}
                </div>
              )}

              {/* Descripción */}
              <p className="product-desc" style={{ fontSize: '14px', color: '#718096', marginBottom: '16px', lineHeight: '1.4' }}>
                {taller.descripcion}
              </p>

              <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e0', marginBottom: '16px' }} />

              {/* Footer con Precio y Botón de Edición / Cupos */}
              <div className="product-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="product-price" style={{ fontSize: '22px', fontWeight: 'bold' }}>
                  ${Number(taller.precio || 0).toLocaleString()}
                </span>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    onClick={() => handleOpenEdit(taller)}
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
                  <span className={`badge ${getBadgeClass(taller.estado, taller.cuposDisponibles)}`} style={{ background: '#e2e8f0', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}>
                    Cupos: {taller.cuposDisponibles}
                  </span>
                </div>
              </div>

              {/* Botón opcional de Inactivar rápido arriba si está activo */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '4px' }}>
                {taller.estado && (
                  <button title="Inactivar" onClick={() => handleInactivar(taller)} style={{ background: '#fff', border: '1px solid #000', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={14} color="#E2725B" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            <p>No hay experiencias para la vista seleccionada.</p>
          </div>
        )}
      </div>

     {/* --- MODAL PARA CREAR / EDITAR EXPERIENCIA --- */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card-bg, #fff)', padding: '2.5rem', borderRadius: '24px',
            width: '100%', maxWidth: '500px', border: '2px solid var(--text-dark)', boxShadow: '8px 8px 0px var(--primary)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{isEditMode ? 'Editar Experiencia' : 'Nueva Experiencia'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Nombre de la Experiencia</label>
                <input 
                  type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Cata de Café" autoComplete="off"
                  style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Subtítulo (ej. Descubrimiento Sensorial)</label>
                <input 
                  type="text" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)}
                  placeholder="Ej. Descubrimiento Sensorial" autoComplete="off"
                  style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Categoría (ej. Sensorial, Especial)</label>
                <input 
                  type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ej. Sensorial, Especial" autoComplete="off"
                  style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>URL de la Imagen</label>
                <input 
                  type="text" placeholder="https://..." value={imagen} onChange={(e) => setImagen(e.target.value)}
                  autoComplete="off"
                  style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Descripción</label>
                <textarea 
                  value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="3"
                  placeholder="Escribe una breve descripción..." autoComplete="off"
                  style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Precio ($)</label>
                  <input 
                    type="number" step="0.01" required value={precio} onChange={(e) => setPrecio(e.target.value)}
                    placeholder="0.00" autoComplete="off"
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Cupos Disponibles</label>
                  <input 
                    type="number" min="0" required value={cuposDisponibles} onChange={(e) => setCuposDisponibles(e.target.value)}
                    placeholder="0" autoComplete="off"
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Estado</label>
                <select 
                  value={estado} onChange={(e) => setEstado(e.target.value === 'true')}
                  style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', background: '#fff' }}
                >
                  <option value={true}>Activo</option>
                  <option value={false}>Inactivo</option>
                </select>
              </div>

              <button type="submit" style={{
                marginTop: '1rem', backgroundColor: 'var(--secondary)', color: 'white', padding: '12px',
                borderRadius: '12px', fontWeight: '700', border: '2px solid var(--text-dark)', cursor: 'pointer'
              }}>
                {isEditMode ? 'Actualizar Experiencia' : 'Guardar Experiencia'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
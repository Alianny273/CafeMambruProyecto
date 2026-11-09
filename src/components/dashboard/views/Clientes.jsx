import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, Mail, X } from 'lucide-react';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Estados de Modales ('VIEW', 'EDIT', 'CREATE', null)
  const [modalType, setModalType] = useState(null);
  const [currentCliente, setCurrentCliente] = useState(null);

  // Formulario de Edición / Creación
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Necesario para crear
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [idRol, setIdRol] = useState('2'); // Por defecto Cliente (2)
  const [estado, setEstado] = useState(true);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  // --- HANDLERS DE MODALES ---
  const openCreateModal = () => {
    setNombre('');
    setEmail('');
    setPassword('');
    setTelefono('');
    setDireccion('');
    setTipoDocumento('C.C.');
    setNumeroDocumento('');
    setIdRol('2');
    setEstado(true);
    setModalType('CREATE');
  };

  const openViewModal = (cliente) => {
    setCurrentCliente(cliente);
    setModalType('VIEW');
  };

  const openEditModal = (cliente) => {
    setCurrentCliente(cliente);
    setNombre(cliente.nombre || '');
    setEmail(cliente.email || '');
    setTelefono(cliente.telefono || '');
    setDireccion(cliente.direccion || '');
    setTipoDocumento(cliente.tipoDocumento || '');
    setNumeroDocumento(cliente.numeroDocumento || '');
    setEstado(cliente.estado !== undefined ? cliente.estado : true);
    setModalType('EDIT');
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentCliente(null);
  };

  // --- OPERACIONES BACKEND (CREAR, EDITAR E INACTIVAR) ---
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'CREATE') {
        // Estructura que espera tu endpoint de RegistroDTO
        const nuevoUsuario = {
          nombre,
          email,
          password,
          telefono,
          direccion,
          tipoDocumento,
          numeroDocumento,
          idRol: parseInt(idRol)
        };

        const res = await fetch('http://localhost:8080/api/usuarios/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoUsuario)
        });

        if (res.ok) {
          alert('Usuario creado con éxito');
          fetchClientes();
          closeModal();
        } else {
          const errText = await res.text();
          alert('Error al crear usuario: ' + errText);
        }

      } else if (modalType === 'EDIT') {
        const clienteActualizado = {
          ...currentCliente,
          nombre,
          email,
          telefono,
          direccion,
          tipoDocumento,
          numeroDocumento,
          estado
        };

        const res = await fetch(`http://localhost:8080/api/usuarios/${currentCliente.idUsuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clienteActualizado)
        });

        if (res.ok) {
          alert('Cliente actualizado con éxito');
          fetchClientes();
          closeModal();
        } else {
          const errText = await res.text();
          alert('Error al actualizar: ' + errText);
        }
      }
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  const handleInactivar = async (cliente) => {
    if (!window.confirm(`¿Estás seguro de inactivar al usuario ${cliente.nombre}?`)) return;

    try {
      const clienteInactivo = { ...cliente, estado: false };
      const res = await fetch(`http://localhost:8080/api/usuarios/${cliente.idUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteInactivo)
      });

      if (res.ok) {
        alert('Cliente inactivado correctamente');
        fetchClientes();
      }
    } catch (error) {
      console.error('Error al inactivar:', error);
    }
  };

  // --- UTILIDADES Y FILTROS ---
  const clientesFiltrados = clientes.filter(c => 
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalClientes = clientes.length;
  const activos = clientes.filter(c => c.estado === true).length;
  const inactivos = clientes.filter(c => c.estado === false).length;

  const getBadgeClass = (estado) => {
    return estado ? 'available' : 'low';
  };

  return (
    <div className="w-full">
      {/* --- ENCABEZADO --- */}
      <div className="dashboard-header">
        <div className="header-title">
          <h2>Clientes</h2>
          <p>Gestiona los datos y estados de tus usuarios</p>
        </div>
        <button 
          onClick={openCreateModal}
          style={{
            backgroundColor: 'var(--secondary)', color: 'white', padding: '10px 20px', 
            borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', 
            gap: '8px', cursor: 'pointer', border: 'none'
          }}
        >
          <Plus size={20} strokeWidth={2.5} /> Agregar usuario
        </button>
      </div>

      {/* --- TARJETAS DE RESUMEN --- */}
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="summary-card">
          <p className="title">Total usuarios</p>
          <p className="value dark">{totalClientes}</p>
        </div>
        <div className="summary-card">
          <p className="title">Activos</p>
          <p className="value success">{activos}</p>
        </div>
        <div className="summary-card">
          <p className="title">Inactivos</p>
          <p className="value" style={{ color: '#E2725B' }}>{inactivos}</p>
        </div>
      </div>

      {/* --- BUSCADOR Y TABLA --- */}
      <div className="table-container">
        <div style={{ display: 'flex', marginBottom: '24px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-container" style={{ maxWidth: '400px' }}>
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o correo..." 
              className="search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de Clientes */}
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Cliente</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Documento</th>
              <th>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.idUsuario} style={{ opacity: cliente.estado ? 1 : 0.6 }}>
                  <td style={{ fontWeight: '800' }}>#{cliente.idUsuario}</td>
                  <td style={{ fontWeight: '800', color: 'var(--text-main)' }}>{cliente.nombre}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{cliente.email}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{cliente.telefono || 'N/A'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{cliente.tipoDocumento} {cliente.numeroDocumento}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(cliente.estado)}`}>
                      {cliente.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell" style={{ justifyContent: 'center' }}>
                      <button className="btn-icon" title="Ver perfil" onClick={() => openViewModal(cliente)} style={{ color: 'var(--text-main)' }}>
                        <Eye size={18} strokeWidth={2.5} />
                      </button>
                      <button className="btn-icon" title="Editar" onClick={() => openEditModal(cliente)}>
                        <Edit2 size={18} strokeWidth={2.5} />
                      </button>
                      {cliente.estado && (
                        <button className="btn-icon" title="Inactivar" onClick={() => handleInactivar(cliente)} style={{ color: '#E2725B' }}>
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  No se encontraron clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL GLOBAL (VER, EDITAR Y CREAR) --- */}
      {modalType && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card-bg, #fff)', padding: '2.5rem', borderRadius: '24px',
            width: '100%', maxWidth: '600px', border: '2px solid var(--text-dark)', boxShadow: '8px 8px 0px var(--primary)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                {modalType === 'VIEW' && `Perfil del Usuario #${currentCliente?.idUsuario}`}
                {modalType === 'EDIT' && `Editar Usuario #${currentCliente?.idUsuario}`}
                {modalType === 'CREATE' && 'Nuevo Usuario'}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* VISTA DE DETALLES (VER) */}
            {modalType === 'VIEW' && currentCliente && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <p><strong>Nombre Completo:</strong> {currentCliente.nombre}</p>
                  <p><strong>Correo Electrónico:</strong> {currentCliente.email}</p>
                  <p><strong>Teléfono:</strong> {currentCliente.telefono || 'No registrado'}</p>
                  <p><strong>Dirección:</strong> {currentCliente.direccion || 'No registrada'}</p>
                  <p><strong>Documento:</strong> {currentCliente.tipoDocumento} {currentCliente.numeroDocumento}</p>
                  <p><strong>Estado:</strong> <span className={`badge ${getBadgeClass(currentCliente.estado)}`}>{currentCliente.estado ? 'Activo' : 'Inactivo'}</span></p>
                </div>
              </div>
            )}

            {/* FORMULARIO DE CREAR / EDITAR */}
            {(modalType === 'EDIT' || modalType === 'CREATE') && (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Nombre Completo</label>
                  <input 
                    type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Correo Electrónico</label>
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>

                {modalType === 'CREATE' && (
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Contraseña</label>
                    <input 
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Teléfono</label>
                    <input 
                      type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                  {modalType === 'EDIT' && (
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Estado</label>
                      <select 
                        value={estado} onChange={(e) => setEstado(e.target.value === 'true')}
                        style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', background: '#fff' }}
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Dirección</label>
                  <input 
                    type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Tipo Doc.</label>
                    <input 
                      type="text" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem' }}>Número de Documento</label>
                    <input 
                      type="text" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <button type="submit" style={{
                  marginTop: '1rem', backgroundColor: 'var(--secondary)', color: 'white', padding: '12px',
                  borderRadius: '12px', fontWeight: '700', border: '2px solid var(--text-dark)', cursor: 'pointer'
                }}>
                  {modalType === 'CREATE' ? 'Registrar Usuario' : 'Guardar Cambios'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
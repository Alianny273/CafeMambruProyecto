import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, X } from 'lucide-react';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const [modalType, setModalType] = useState(null);
  const [currentCliente, setCurrentCliente] = useState(null);

  // Estados
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [idRol, setIdRol] = useState('2');
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

  const openCreateModal = () => {
    setNombre(''); setEmail(''); setPassword(''); setTelefono(''); setDireccion('');
    setTipoDocumento(''); setNumeroDocumento(''); setIdRol('2'); setEstado(true);
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
    setIdRol(cliente.rol?.idRol || cliente.idRol || '2');
    setEstado(cliente.estado !== undefined ? cliente.estado : true);
    setModalType('EDIT');
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentCliente(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'CREATE') {
        const nuevoUsuario = {
          nombre, email, password, telefono, direccion,
          tipoDocumento, numeroDocumento,
          idRol: parseInt(idRol),
          estado: 1
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
          nombre, email, telefono, direccion,
          tipoDocumento, numeroDocumento, 
          idRol: parseInt(idRol),
          estado: estado ? 1 : 0
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
      const clienteInactivo = { ...cliente, estado: 0 };
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

  const clientesFiltrados = clientes.filter(c => 
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalClientes = clientes.length;
  const activos = clientes.filter(c => c.estado === 1 || c.estado === true).length;
  const inactivos = clientes.filter(c => c.estado === 0 || c.estado === false).length;
  const getBadgeClass = (est) => (est === 1 || est === true) ? 'available' : 'low';

  return (
    <div className="w-full">
      <div className="dashboard-header">
        <div className="header-title">
          <h2>Clientes</h2>
          <p>Gestiona los datos y estados de tus usuarios</p>
        </div>
        <button 
          onClick={openCreateModal}
          style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}
        >
          <Plus size={20} strokeWidth={2.5} /> Agregar usuario
        </button>
      </div>

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

      <div className="table-container">
        <div style={{ display: 'flex', marginBottom: '24px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-container" style={{ maxWidth: '400px' }}>
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Buscar por nombre o correo..." className="search-input" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Cliente</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Documento</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.idUsuario} style={{ opacity: (cliente.estado === 1 || cliente.estado === true) ? 1 : 0.6 }}>
                  <td style={{ fontWeight: '800' }}>#{cliente.idUsuario}</td>
                  <td style={{ fontWeight: '800', color: 'var(--text-main)' }}>{cliente.nombre}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{cliente.email}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{cliente.telefono || 'N/A'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{cliente.tipoDocumento} {cliente.numeroDocumento}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${getBadgeClass(cliente.estado)}`}>
                      {(cliente.estado === 1 || cliente.estado === true) ? 'Activo' : 'Inactivo'}
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
                      {(cliente.estado === 1 || cliente.estado === true) && (
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

      {modalType && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--card-bg, #fff)', padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '600px', border: '2px solid var(--text-dark)', boxShadow: '8px 8px 0px var(--primary)', maxHeight: '90vh', overflowY: 'auto' }}>
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

            {modalType === 'VIEW' && currentCliente && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <p><strong>Nombre Completo:</strong> {currentCliente.nombre}</p>
                  <p><strong>Correo Electrónico:</strong> {currentCliente.email}</p>
                  <p><strong>Teléfono:</strong> {currentCliente.telefono || 'No registrado'}</p>
                  <p><strong>Dirección:</strong> {currentCliente.direccion || 'No registrada'}</p>
                  <p><strong>Documento:</strong> {currentCliente.tipoDocumento} {currentCliente.numeroDocumento}</p>
                  <p><strong>Estado:</strong> <span className={`badge ${getBadgeClass(currentCliente.estado)}`}>{(currentCliente.estado === 1 || currentCliente.estado === true) ? 'Activo' : 'Inactivo'}</span></p>
                </div>
              </div>
            )}

            {(modalType === 'EDIT' || modalType === 'CREATE') && (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} autoComplete="off">
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Nombre Completo *</label>
                    <input 
                      type="text" required value={nombre} onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                      placeholder="Ej. Juan Duarte" autoComplete="off"
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Correo Electrónico *</label>
                    <input 
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="juan@gmail.com" autoComplete="off"
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Tipo de Documento *</label>
                    <select 
                      required value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box', background: '#fff', fontFamily: 'inherit' }}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="CC">C.C.</option>
                      <option value="CE">C.E.</option>
                      <option value="NIT">NIT</option>
                      <option value="PAS">Pasaporte</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Número de Documento *</label>
                    <input 
                      type="text" required maxLength="15" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ej. 1020304050" autoComplete="off"
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Teléfono *</label>
                    <input 
                      type="tel" required maxLength="10" value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ej. 3001234567" autoComplete="off"
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Rol del Sistema *</label>
                    <select 
                      required value={idRol} onChange={(e) => setIdRol(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', background: '#fff', fontFamily: 'inherit' }}
                    >
                      <option value="1">Administrador</option>
                      <option value="2">Cliente</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Dirección de Residencia</label>
                    <input 
                      type="text" maxLength="150" value={direccion} onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Ej. Calle Principal 123" autoComplete="off"
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                  {modalType === 'EDIT' && (
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Estado</label>
                      <select 
                        value={estado} onChange={(e) => setEstado(e.target.value === 'true')}
                        style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', background: '#fff', fontFamily: 'inherit' }}
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                    </div>
                  )}
                </div>

                {modalType === 'CREATE' && (
                  <div style={{ padding: '0.8rem', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fcd34d', marginTop: '0.5rem' }}>
                    <label style={{ display: 'block', fontWeight: '800', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#d97706' }}>
                      Contraseña Asignada *
                    </label>
                    <input 
                      type="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" autoComplete="new-password"
                      style={{ width: '100%', padding: '10px', border: '2px solid #d97706', borderRadius: '10px', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={closeModal} style={{
                    backgroundColor: 'transparent', color: 'var(--text-dark)', padding: '12px 30px',
                    borderRadius: '50px', fontWeight: '800', border: '2px solid var(--text-dark)', cursor: 'pointer'
                  }}>
                    CANCELAR
                  </button>
                  <button type="submit" style={{
                    backgroundColor: 'var(--secondary)', color: 'white', padding: '12px 30px',
                    borderRadius: '12px', fontWeight: '800', border: '2px solid var(--text-dark)', cursor: 'pointer'
                  }}>
                    {modalType === 'CREATE' ? 'Registrar Usuario' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
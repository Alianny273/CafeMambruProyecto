import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, X, ShoppingBag, Calendar } from 'lucide-react';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]); 
  const [talleres, setTalleres] = useState([]); 
  const [busqueda, setBusqueda] = useState('');

  // Estados de Modales
  const [modalType, setModalType] = useState(null); // 'CREATE', 'EDIT', 'VIEW', null
  const [currentPedido, setCurrentPedido] = useState(null);

  // Formulario Dinámico de Pedido / Reserva
  const [selectedUserId, setSelectedUserId] = useState('');
  const [tipoItem, setTipoItem] = useState('PRODUCTO'); // 'PRODUCTO' o 'TALLER'
  const [selectedItemId, setSelectedItemId] = useState(''); // ID de producto o taller
  const [cantidad, setCantidad] = useState(1); // Cantidad (productos) o Número de personas (talleres)
  const [total, setTotal] = useState('');
  const [estado, setEstado] = useState('En preparación');
  const [fechaPedido, setFechaPedido] = useState('');

  // Cargar datos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPedidos, resUsuarios, resProductos, resTalleres] = await Promise.all([
          fetch('http://localhost:8080/api/pedidos'),
          fetch('http://localhost:8080/api/usuarios'),
          fetch('http://localhost:8080/api/productos'),
          fetch('http://localhost:8080/api/talleres')
        ]);

        if (resPedidos.ok) setPedidos(await resPedidos.json());
        if (resUsuarios.ok) setUsuarios(await resUsuarios.json());
        if (resProductos.ok) setProductos(await resProductos.json());
        if (resTalleres.ok) setTalleres(await resTalleres.json());
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/pedidos');
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/productos');
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

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

  // ----- HANDLERS PARA MODALES -----
  const openCreateModal = () => {
    setSelectedUserId('');
    setTipoItem('PRODUCTO');
    setSelectedItemId('');
    setCantidad(1);
    setTotal('');
    setEstado('En preparación');
    
    const now = new Date();
    setFechaPedido(now.toISOString().split('T')[0]);
    
    setModalType('CREATE');
  };

  const openEditModal = (ped) => {
    setCurrentPedido(ped);
    setTotal(ped.total);
    setEstado(ped.estado);
    setFechaPedido(ped.fechaPedido ? ped.fechaPedido.split('T')[0] : '');

    // Detectar si el pedido contiene un producto o un taller
    if (ped.detallePedidoProductos && ped.detallePedidoProductos.length > 0) {
      setTipoItem('PRODUCTO');
      const detalle = ped.detallePedidoProductos[0];
      setSelectedItemId(detalle.producto?.idProducto || '');
      setCantidad(detalle.cantidad || 1);
    } else if (ped.detallePedidoTalleres && ped.detallePedidoTalleres.length > 0) {
      setTipoItem('TALLER');
      const detalle = ped.detallePedidoTalleres[0];
      setSelectedItemId(detalle.taller?.idTaller || '');
      setCantidad(detalle.cantidadPersonas || 1);
    } else {
      setTipoItem('PRODUCTO');
      setSelectedItemId('');
      setCantidad(1);
    }

    setModalType('EDIT');
  };

  const openViewModal = (ped) => {
    setCurrentPedido(ped);
    setModalType('VIEW');
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentPedido(null);
  };

  // ----- CALCULADORA AUTOMÁTICA DE TOTAL -----
  useEffect(() => {
    if ((modalType === 'CREATE' || modalType === 'EDIT') && selectedItemId) {
      let precioUnitario = 0;
      if (tipoItem === 'PRODUCTO') {
        const producto = productos.find(p => p.idProducto === parseInt(selectedItemId));
        if (producto) precioUnitario = parseFloat(producto.precio) || 0;
      } else {
        const taller = talleres.find(t => t.idTaller === parseInt(selectedItemId));
        if (taller) precioUnitario = parseFloat(taller.precio) || 0;
      }
      const cantidadReal = parseInt(cantidad) || 0;
      setTotal((precioUnitario * cantidadReal).toFixed(2));
    }
  }, [selectedItemId, cantidad, tipoItem, productos, talleres, modalType]);

  // ----- OPERACIONES BACKEND -----
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'CREATE') {
        if (!selectedUserId) return alert('Selecciona un cliente válido');
        if (!selectedItemId) return alert('Selecciona un producto o taller');

        let itemSeleccionado = null;
        let endpointDetalle = 'http://localhost:8080/api/pedidos';
        let cuerpoDetalle = {};

        if (tipoItem === 'PRODUCTO') {
          itemSeleccionado = productos.find(p => p.idProducto === parseInt(selectedItemId));
          cuerpoDetalle = {
            idUsuario: parseInt(selectedUserId),
            total: parseFloat(total),
            estado: estado,
            fechaPedido: `${fechaPedido}T00:00:00`,
            detalles: [
              {
                idProducto: parseInt(selectedItemId),
                cantidad: parseInt(cantidad),
                precioUnitario: parseFloat(itemSeleccionado.precio)
              }
            ]
          };
        } else {
          itemSeleccionado = talleres.find(t => t.idTaller === parseInt(selectedItemId));
          cuerpoDetalle = {
            idUsuario: parseInt(selectedUserId),
            total: parseFloat(total),
            estado: estado,
            fechaPedido: `${fechaPedido}T00:00:00`,
            detallesTalleres: [
              {
                idTaller: parseInt(selectedItemId),
                cantidadPersonas: parseInt(cantidad),
                precioUnitario: parseFloat(itemSeleccionado.precio)
              }
            ]
          };
        }

        const res = await fetch(endpointDetalle, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cuerpoDetalle)
        });

        if (res.ok) {
          alert('Registro creado con éxito');
          fetchPedidos();
          closeModal();
        } else {
          alert('Error al registrar el pedido o reserva');
        }
      } else if (modalType === 'EDIT') {
        const pedidoActualizado = {
          ...currentPedido,
          total: parseFloat(total),
          estado
        };

        const res = await fetch(`http://localhost:8080/api/pedidos/${currentPedido.idPedido}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pedidoActualizado)
        });

        if (res.ok) {
          alert('Registro actualizado con éxito');
          fetchPedidos();
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleEliminarLogico = async (ped) => {
    if (!window.confirm(`¿Estás seguro de cancelar el registro #${ped.idPedido}?`)) return;

    try {
      const pedidoCancelado = { ...ped, estado: 'Cancelado' };
      const res = await fetch(`http://localhost:8080/api/pedidos/${ped.idPedido}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoCancelado)
      });

      if (res.ok) {
        alert('Registro cancelado correctamente');
        fetchPedidos();
      }
    } catch (error) {
      console.error('Error al cancelar:', error);
    }
  };

  // ----- UTILIDADES -----
  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'pending';
      case 'En preparación': return 'prep';
      case 'Enviado': return 'shipped';
      case 'Entregado': 
      case 'Activo': return 'available';
      case 'Cancelado': 
      case 'Inactivo': return 'low';
      default: return '';
    }
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Sin fecha';
    const date = new Date(fechaStr);
    return date.toLocaleDateString('es-CO');
  };

  // Filtros y Contadores
  const pedidosFiltrados = pedidos.filter(p => 
    p.usuario?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.idPedido?.toString().includes(busqueda)
  );

  const totalPedidos = pedidos.length;
  const enPreparacion = pedidos.filter(p => p.estado === 'En preparación').length;
  const enviados = pedidos.filter(p => p.estado === 'Enviado').length;
  const entregados = pedidos.filter(p => p.estado === 'Entregado').length;

  return (
    <div className="w-full">
      <div className="dashboard-header">
        <div className="header-title">
          <h2>Gestión de Pedidos y Talleres</h2>
          <p>Administra ventas de tienda y reservas de experiencias</p>
        </div>
        <button 
          onClick={openCreateModal}
          style={{
            backgroundColor: 'var(--secondary)', color: 'white', padding: '10px 20px', 
            borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', 
            gap: '8px', cursor: 'pointer', border: 'none'
          }}
        >
          <Plus size={20} strokeWidth={2.5} /> Nuevo registro
        </button>
      </div>

      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="summary-card">
          <p className="title">Total registros</p>
          <p className="value dark">{totalPedidos}</p>
        </div>
        <div className="summary-card">
          <p className="title">En preparación</p>
          <p className="value" style={{ color: 'var(--primary)' }}>{enPreparacion}</p>
        </div>
        <div className="summary-card">
          <p className="title">Enviados</p>
          <p className="value" style={{ color: '#1DA9D2' }}>{enviados}</p>
        </div>
        <div className="summary-card">
          <p className="title">Entregados</p>
          <p className="value success">{entregados}</p>
        </div>
      </div>

      <div className="table-container">
        <div style={{ display: 'flex', marginBottom: '24px' }}>
          <div className="search-container" style={{ maxWidth: '400px' }}>
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por ID o cliente..." 
              className="search-input"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((ped) => {
              const esTaller = ped.detallePedidoTalleres && ped.detallePedidoTalleres.length > 0;
              return (
                <tr key={ped.idPedido}>
                  <td style={{ fontWeight: '800' }}>#{ped.idPedido.toString().padStart(6, '0')}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{ped.usuario?.nombre || 'Cliente sin asignar'}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '700', color: esTaller ? 'var(--secondary)' : 'var(--primary)' }}>
                      {esTaller ? <Calendar size={14}/> : <ShoppingBag size={14}/>}
                      {esTaller ? 'Taller / Reserva' : 'Producto Tienda'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatearFecha(ped.fechaPedido)}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(ped.estado)}`}>
                      {ped.estado}
                    </span>
                  </td>
                  <td style={{ fontSize: '1.1rem', fontWeight: '800' }}>$ {ped.total}</td>
                  <td>
                    <div className="actions-cell" style={{ justifyContent: 'center' }}>
                      <button className="btn-icon" title="Ver detalle" onClick={() => openViewModal(ped)} style={{ color: 'var(--text-main)' }}>
                        <Eye size={18} strokeWidth={2.5} />
                      </button>
                      <button className="btn-icon" title="Editar" onClick={() => openEditModal(ped)}>
                        <Edit2 size={18} strokeWidth={2.5} />
                      </button>
                      <button className="btn-icon" title="Cancelar" onClick={() => handleEliminarLogico(ped)} style={{ color: 'inherit' }} onMouseOver={(e) => e.currentTarget.style.color = '#E2725B'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalType && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'var(--card-bg, #fff)', padding: '2.5rem', borderRadius: '24px',
            width: '100%', maxWidth: '650px', border: '2px solid var(--text-dark)', boxShadow: '8px 8px 0px var(--primary)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                {modalType === 'CREATE' && 'Nuevo Registro (Pedido o Taller)'}
                {modalType === 'EDIT' && `Editar Registro #${currentPedido?.idPedido}`}
                {modalType === 'VIEW' && `Detalles del Registro #${currentPedido?.idPedido}`}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* VISTA DE DETALLES */}
            {modalType === 'VIEW' && currentPedido && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ marginBottom: '0.5rem', fontWeight: '800', color: 'var(--primary)' }}>Información del Cliente</h4>
                  <p><strong>Nombre:</strong> {currentPedido.usuario?.nombre || 'N/A'}</p>
                  <p><strong>Teléfono:</strong> {currentPedido.usuario?.telefono || 'N/A'}</p>
                  <p><strong>Dirección:</strong> {currentPedido.usuario?.direccion || 'N/A'}</p>
                </div>
                
                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ marginBottom: '0.5rem', fontWeight: '800', color: 'var(--secondary)' }}>Datos Generales</h4>
                  <p><strong>Fecha:</strong> {new Date(currentPedido.fechaPedido).toLocaleString('es-CO')}</p>
                  <p><strong>Estado:</strong> <span className={`badge ${getBadgeClass(currentPedido.estado)}`}>{currentPedido.estado}</span></p>
                  <p style={{ marginTop: '0.5rem' }}><strong>Total:</strong> <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>$ {currentPedido.total}</span></p>
                  
                  <h5 style={{ marginTop: '1rem', marginBottom: '0.5rem', fontWeight: '700' }}>Ítems Incluidos:</h5>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {currentPedido.detallePedidoProductos && currentPedido.detallePedidoProductos.length > 0 && 
                      currentPedido.detallePedidoProductos.map((det, idx) => (
                        <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                          🛍️ <strong>[Producto] {det.producto?.nombre}</strong><br/>
                          Cantidad: {det.cantidad} | Subtotal: ${(det.precioUnitario * det.cantidad).toFixed(2)}
                        </li>
                      ))
                    }
                    {currentPedido.detallePedidoTalleres && currentPedido.detallePedidoTalleres.length > 0 && 
                      currentPedido.detallePedidoTalleres.map((det, idx) => (
                        <li key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                          📅 <strong>[Taller] {det.taller?.nombre}</strong><br/>
                          Asistentes (Personas): {det.cantidadPersonas} | Subtotal: ${(det.precioUnitario * det.cantidadPersonas).toFixed(2)}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            )}

            {/* FORMULARIO CREAR / EDITAR */}
            {(modalType === 'CREATE' || modalType === 'EDIT') && (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                {modalType === 'CREATE' && (
                  <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                    <h4 style={{ marginBottom: '1rem', fontWeight: '700' }}>1. Cliente</h4>
                    <select 
                      required 
                      value={selectedUserId} 
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', background: '#fff' }}
                    >
                      <option value="" disabled>-- Elige un cliente --</option>
                      {usuarios.map(u => (
                        <option key={u.idUsuario} value={u.idUsuario}>{u.nombre} - {u.numeroDocumento}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '1rem', fontWeight: '700' }}>2. Selección de Ítem</h4>
                  
                  {modalType === 'CREATE' && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', cursor: 'pointer' }}>
                        <input type="radio" name="tipoItem" value="PRODUCTO" checked={tipoItem === 'PRODUCTO'} onChange={() => { setTipoItem('PRODUCTO'); setSelectedItemId(''); }} />
                        Producto de Tienda
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700', cursor: 'pointer' }}>
                        <input type="radio" name="tipoItem" value="TALLER" checked={tipoItem === 'TALLER'} onChange={() => { setTipoItem('TALLER'); setSelectedItemId(''); }} />
                        Taller / Experiencia
                      </label>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        {tipoItem === 'PRODUCTO' ? 'Producto' : 'Taller'}
                      </label>
                      <select 
                        required 
                        value={selectedItemId} 
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', background: '#fff' }}
                      >
                        <option value="" disabled>-- Seleccionar --</option>
                        {tipoItem === 'PRODUCTO' ? (
                          productos.map(p => (
                            <option key={p.idProducto} value={p.idProducto}>{p.nombre} (${p.precio})</option>
                          ))
                        ) : (
                          talleres.map(t => (
                            <option key={t.idTaller} value={t.idTaller}>{t.nombre} (${t.precio})</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        {tipoItem === 'PRODUCTO' ? 'Cantidad' : 'Nro. Personas'}
                      </label>
                      <input 
                        type="number" min="1" required value={cantidad} onChange={(e) => setCantidad(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {modalType === 'CREATE' && (
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Fecha</label>
                      <input 
                        type="date" required value={fechaPedido} onChange={(e) => setFechaPedido(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Total Calculado ($)</label>
                    <input 
                      type="number" step="0.01" required value={total} readOnly
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box', backgroundColor: '#e5e7eb' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Estado</label>
                    <select 
                      value={estado} onChange={(e) => setEstado(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', background: '#fff' }}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En preparación">En preparación</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                <button type="submit" style={{
                  marginTop: '0.5rem', backgroundColor: 'var(--secondary)', color: 'white', padding: '12px',
                  borderRadius: '12px', fontWeight: '700', border: '2px solid var(--text-dark)', cursor: 'pointer'
                }}>
                  {modalType === 'CREATE' ? 'Registrar Pedido / Reserva' : 'Guardar Cambios'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
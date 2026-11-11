import React, { useState, useEffect } from 'react';
import { Settings, Sun, Moon, Bell, ChevronDown, User, Edit2, Mail, Phone, FileText, Calendar, MapPin, ShieldCheck, Coffee, Plus, X, Users, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8080/api/usuarios';
const ADMIN_ID = 4;

export default function Configuracion() {
  const [admins, setAdmins] = useState([]);
  const [loggedAdmin, setLoggedAdmin] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [modalType, setModalType] = useState(null);

  // Estados del formulario idénticos a la BD
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [idRol, setIdRol] = useState('1'); 
  const [estado, setEstado] = useState(true); 

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const getUserId = (u) => u?.id_usuario || u?.idUsuario || u?.id;
  const getRolId = (u) => u?.rol?.id_rol || u?.rol?.idRol || u?.id_rol || u?.idRol || u?.rolId;
  const getDocType = (u) => u?.tipo_documento || u?.tipoDocumento || 'Sin definir';
  const getDocNum = (u) => u?.numero_documento || u?.numeroDocumento || 'No registrado';
  
  const getFecha = (u) => {
    const f = u?.fecha_nacimiento || u?.fechaNacimiento;
    return f ? f.split('T')[0] : 'No registrada';
  };

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        const adminList = data.filter(u => {
          const rol = Number(getRolId(u));
          const est = Number(u.estado);
          const esAdminPorCorreo = u.email === 'admin@mambru.com' || u.email === 'juan@gmail.com';
          return (rol === 1 || esAdminPorCorreo) && est === 1;
        });

        setAdmins(adminList);
        const currentUser = adminList.find(u => Number(getUserId(u)) === ADMIN_ID) || adminList[0] || null;
        setLoggedAdmin(currentUser);
      }
    } catch (error) {
      console.error("Error de red:", error);
      Swal.fire('Error', 'No hay conexión con el servidor (localhost:8080).', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    cargarDatos();
  }, []);

  const openCreateModal = () => {
    setNombre(''); setEmail(''); setPassword(''); setTelefono('');
    setDireccion(''); setTipoDocumento(''); setNumeroDocumento(''); setFechaNacimiento('');
    setIdRol('1'); setEstado(true);
    setSelectedAdminId(null);
    setModalType('CREATE');
  };

  const openEditModal = (adminData) => {
    if (!adminData) return;
    setNombre(adminData.nombre || '');
    setEmail(adminData.email || '');
    setPassword(''); 
    setTelefono(adminData.telefono || '');
    setDireccion(adminData.direccion || '');
    setTipoDocumento(getDocType(adminData) !== 'Sin definir' ? getDocType(adminData) : ''); 
    setNumeroDocumento(getDocNum(adminData) !== 'No registrado' ? getDocNum(adminData) : ''); 
    setFechaNacimiento(getFecha(adminData) !== 'No registrada' ? getFecha(adminData) : '');
    setIdRol(getRolId(adminData) || '1');
    setEstado(Number(adminData.estado) === 1 || adminData.estado === true);
    setSelectedAdminId(getUserId(adminData));
    setModalType('EDIT');
  };

  const closeModal = () => setModalType(null);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'CREATE') {
        const nuevoAdmin = {
          nombre, email, password, telefono, direccion,
          tipoDocumento, numeroDocumento, 
          fechaNacimiento: fechaNacimiento ? `${fechaNacimiento}T00:00:00` : null,
          idRol: parseInt(idRol), estado: estado ? 1 : 0
        };
        
        const res = await fetch(`${API_URL}/registro`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(nuevoAdmin) 
        });

        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Creado', text: 'Administrador registrado con éxito.', confirmButtonColor: '#2C5545', customClass: { popup: 'rounded-[20px]' } });
          closeModal();
          cargarDatos(); 
        } else {
          const errorMsg = await res.text();
          throw new Error(errorMsg || 'Error en el registro');
        }

      } else if (modalType === 'EDIT') {
        const adminActualizado = {
          nombre, email, telefono, direccion,
          tipoDocumento, numeroDocumento, 
          fechaNacimiento: fechaNacimiento ? (fechaNacimiento.includes('T') ? fechaNacimiento : `${fechaNacimiento}T00:00:00`) : null,
          idRol: parseInt(idRol), 
          estado: estado ? 1 : 0
        };
        
        if (password.trim() !== '') adminActualizado.password = password;

        const res = await fetch(`${API_URL}/${selectedAdminId}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(adminActualizado) 
        });

        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Perfil modificado con éxito.', confirmButtonColor: '#2C5545', customClass: { popup: 'rounded-[20px]' } });
          closeModal();
          cargarDatos(); 
        } else {
          const errorMsg = await res.text();
          throw new Error(errorMsg || 'Error al actualizar');
        }
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo procesar la solicitud.', 'error');
    }
  };

  const handleInactivar = async (admin) => {
    if (!window.confirm(`¿Estás seguro de inactivar al administrador ${admin.nombre}?`)) return;

    try {
      const adminInactivo = { ...admin, estado: 0 }; 
      const res = await fetch(`${API_URL}/${getUserId(admin)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminInactivo)
      });

      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Inactivado', text: 'Administrador retirado correctamente.', confirmButtonColor: '#2C5545', customClass: { popup: 'rounded-[20px]' } });
        cargarDatos();
      } else {
        throw new Error('No se pudo procesar la solicitud en el servidor');
      }
    } catch (error) {
      console.error('Error al inactivar:', error);
      Swal.fire('Error', 'No se pudo inactivar al administrador.', 'error');
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8">
      <div className="dashboard-header mb-8">
        <div className="header-title">
          <h2>Configuración</h2>
          <p>Administra perfiles, seguridad y accesos del sistema</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <button 
            onClick={openCreateModal}
            style={{
              backgroundColor: 'var(--secondary)', color: 'white', padding: '10px 20px', 
              borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', 
              gap: '8px', cursor: 'pointer', border: 'none'
            }}
          >
            <Plus size={20} strokeWidth={2.5} /> Nuevo Admin
          </button>

          <div className="filter-tabs">
            <button onClick={() => setIsDarkMode(false)} className={`filter-btn ${!isDarkMode ? 'active' : ''} !p-2 flex items-center justify-center`}>
              <Sun size={18} />
            </button>
            <button onClick={() => setIsDarkMode(true)} className={`filter-btn ${isDarkMode ? 'active' : ''} !p-2 flex items-center justify-center`}>
              <Moon size={18} />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--secondary)] border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            
            <div className="card !p-0 overflow-hidden lg:col-span-2">
              <div className="relative bg-[var(--secondary)] h-36 md:h-44 w-full shrink-0">
                <div className="absolute top-6 left-6 md:top-8 md:left-8 text-white/90 text-[10px] font-bold tracking-[0.25em] uppercase">Café · Chocolate · Experiencias</div>
                <svg className="absolute -bottom-1 w-full h-12 md:h-16 fill-white" preserveAspectRatio="none" viewBox="0 0 1440 60">
                  <path d="M0,30 C400,70 1000,-10 1440,30 L1440,60 L0,60 Z"></path>
                </svg>
              </div>

              <div className="px-6 md:px-8 pb-6 relative z-10 flex flex-col sm:flex-row justify-between sm:items-end gap-5 -mt-12 md:-mt-16">
                <div className="flex items-end gap-5 md:gap-6">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white border-[5px] md:border-[6px] border-white flex items-center justify-center text-[var(--secondary)] shadow-sm">
                      <User size={40} className="md:w-12 md:h-12" strokeWidth={1.5} />
                    </div>
                    <div className="absolute bottom-0 right-0 md:bottom-1 md:right-1 w-7 h-7 md:w-8 md:h-8 bg-[var(--accent)] rounded-full border-[2px] md:border-[3px] border-white flex items-center justify-center text-white shadow-sm">
                      <Coffee size={12} className="md:w-3.5 md:h-3.5" />
                    </div>
                  </div>
                  <div className="pb-1.5 md:pb-2">
                    <h2 className="card-title text-xl md:text-3xl mb-0.5 md:mb-1">{loggedAdmin?.nombre || 'Administrador'}</h2>
                    <p className="text-[var(--primary)] text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase">Mi Perfil</p>
                  </div>
                </div>
                
                <div className="pb-1.5 mt-2 sm:mt-0">
                  <button 
                    onClick={() => openEditModal(loggedAdmin)} 
                    style={{
                      backgroundColor: 'transparent', color: 'var(--text-dark)', 
                      padding: '8px 16px', borderRadius: '50px', fontWeight: '800', 
                      border: '2px solid var(--text-dark)', cursor: 'pointer', 
                      display: 'flex', alignItems: 'center', gap: '6px', 
                      textTransform: 'uppercase', fontSize: '0.75rem', 
                      boxShadow: '4px 4px 0px var(--secondary)', transition: 'all 0.2s ease', 
                      letterSpacing: '0.5px', marginRight: '1.5rem'
                    }}
                  >
                    <Edit2 size={14} strokeWidth={2.5} /> Editar perfil
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8 pt-0 md:pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--border-light)] border border-[var(--border-light)] rounded-[var(--radius-card)] overflow-hidden">
                  
                  <div className="flex gap-4 items-center p-4 md:p-5 bg-[#FAFAF8]">
                    <div className="btn-add-circle !bg-white !text-[var(--primary)] !cursor-default !border-[var(--border-light)] shrink-0">
                      <Mail size={16} className="md:w-4 md:h-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="form-label !mb-0.5 !text-[9px] md:!text-[10px] uppercase tracking-wider">Correo electrónico</p>
                      <p className="font-bold text-xs md:text-sm text-[var(--text-main)] truncate">{loggedAdmin?.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center p-4 md:p-5 bg-[#FAFAF8]">
                    <div className="btn-add-circle !bg-white !text-[var(--secondary)] !cursor-default !border-[var(--border-light)] shrink-0">
                      <Phone size={16} className="md:w-4 md:h-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="form-label !mb-0.5 !text-[9px] md:!text-[10px] uppercase tracking-wider">Teléfono</p>
                      <p className="font-bold text-xs md:text-sm text-[var(--text-main)] truncate">{loggedAdmin?.telefono || 'No registrado'}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center p-4 md:p-5 bg-[#FAFAF8]">
                    <div className="btn-add-circle !bg-white !text-[var(--accent)] !cursor-default !border-[var(--border-light)] shrink-0">
                      <FileText size={16} className="md:w-4 md:h-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="form-label !mb-0.5 !text-[9px] md:!text-[10px] uppercase tracking-wider">Documento ({getDocType(loggedAdmin)})</p>
                      <p className="font-bold text-xs md:text-sm text-[var(--text-main)] truncate">{getDocNum(loggedAdmin)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center p-4 md:p-5 bg-[#FAFAF8]">
                    <div className="btn-add-circle !bg-white !text-[var(--secondary)] !cursor-default !border-[var(--border-light)] shrink-0">
                      <Calendar size={16} className="md:w-4 md:h-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="form-label !mb-0.5 !text-[9px] md:!text-[10px] uppercase tracking-wider">Nacimiento</p>
                      <p className="font-bold text-xs md:text-sm text-[var(--text-main)] truncate">
                        {getFecha(loggedAdmin)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center p-4 md:p-5 bg-[#FAFAF8] md:col-span-2">
                    <div className="btn-add-circle !bg-white !text-[var(--primary)] !cursor-default !border-[var(--border-light)] shrink-0">
                      <MapPin size={16} className="md:w-4 md:h-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="form-label !mb-0.5 !text-[9px] md:!text-[10px] uppercase tracking-wider">Dirección de residencia</p>
                      <p className="font-bold text-xs md:text-sm text-[var(--text-main)] truncate">{loggedAdmin?.direccion || 'No registrada'}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:gap-8 h-full">
              
              <div className="card h-full justify-center" style={{ padding: '24px' }}>
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <ShieldCheck size={24} color="var(--secondary)" strokeWidth={2.5} />
                  <div>
                    <h3 className="card-title" style={{ marginBottom: '2px', fontSize: '1.15rem' }}>Estado de cuenta</h3>
                    <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', fontWeight: '600' }}>Información de acceso</p>
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-[var(--border-light)]">
                    <span className="form-label !mb-0 !text-[12px] md:!text-[13px]">Estado</span>
                    <span className="badge available">Activo</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-[var(--border-light)]">
                    <span className="form-label !mb-0 !text-[12px] md:!text-[13px]">Rol del sistema</span>
                    <strong className="text-xs md:text-sm font-bold text-[var(--text-main)]">Administrador</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="form-label !mb-0 !text-[12px] md:!text-[13px]">Total Admins</span>
                    <strong className="text-xs md:text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                      <Users size={14} color="var(--primary)" /> {admins.length} Usuarios
                    </strong>
                  </div>
                </div>
              </div>

              <div className="card h-full justify-center" style={{ padding: '24px' }}>
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <Settings size={24} color="var(--primary)" strokeWidth={2.5} />
                  <div>
                    <h3 className="card-title" style={{ marginBottom: '2px', fontSize: '1.15rem' }}>Preferencias</h3>
                    <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', fontWeight: '600' }}>Ajustes visuales</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Moon size={18} color="var(--text-muted)" />
                      <div>
                        <p className="font-bold text-xs md:text-sm text-[var(--text-main)]">Tema visual</p>
                        <p className="text-[10px] md:text-[11px] text-[var(--text-muted)] font-semibold mt-0.5">{isDarkMode ? 'Oscuro activado' : 'Claro activado'}</p>
                      </div>
                    </div>
                    <div onClick={toggleDarkMode} className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${isDarkMode ? 'bg-[var(--secondary)]' : 'bg-[#EAE0D5]'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${isDarkMode ? 'left-[20px]' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="card !p-0 overflow-hidden w-full dashboard-section-gap" style={{ marginTop: '40px' }}>
            <div className="p-6 border-b border-[var(--border-light)] flex justify-between items-center bg-[#FAFAF8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[var(--border-light)] flex items-center justify-center text-[var(--secondary)] shadow-sm">
                  <Users size={18} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="card-title text-lg">Administradores del Sistema</h3>
                  <p className="text-[10px] md:text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">Gestión de accesos y roles</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-white text-[10px] md:text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-light)]">
                    <th className="px-6 py-4 font-bold">Usuario</th>
                    <th className="px-6 py-4 font-bold">Contacto</th>
                    <th className="px-6 py-4 font-bold">Documento</th>
                    <th className="px-6 py-4 font-bold text-center">Estado</th>
                    <th className="px-6 py-4 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-light)]">
                  {admins.map(admin => {
                    const currentId = getUserId(admin);
                    return (
                      <tr key={currentId} className="hover:bg-[#FAFAF8] transition-colors bg-white">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#EAE0D5]/30 text-[var(--secondary)] flex items-center justify-center font-bold text-xs uppercase border border-[var(--border-light)] shrink-0">
                              {admin.nombre ? admin.nombre.charAt(0) : '-'}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[var(--text-main)] truncate">{admin.nombre}</p>
                              <p className="text-xs text-[var(--text-muted)]">{currentId === ADMIN_ID ? '(Tú)' : 'Administrador'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-[var(--text-main)] truncate">{admin.email}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{admin.telefono || 'Sin teléfono'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-[var(--text-main)] truncate">{getDocNum(admin)}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{getDocType(admin)}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="badge available">Activo</span>
                        </td>
                        <td className="px-6 py-4">
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                            <button onClick={() => openEditModal(admin)} className="btn-icon" title="Editar usuario">
                              <Edit2 size={18} strokeWidth={2.5} />
                            </button>
                            {currentId !== ADMIN_ID && (
                              <button onClick={() => handleInactivar(admin)} className="btn-icon" title="Inactivar usuario" style={{ color: '#E2725B' }}>
                                <Trash2 size={18} strokeWidth={2.5} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-[var(--text-muted)] font-medium">
                        No hay administradores registrados en el sistema.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

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
                {modalType === 'CREATE' ? 'Registrar Administrador' : 'Editar Administrador'}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} autoComplete="off">
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Nombre Completo *</label>
                  <input 
                    type="text" required maxLength="100" value={nombre} onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                    placeholder="Ej. Estefany Prieto" autoComplete="off"
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Correo Electrónico *</label>
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mambru.com" autoComplete="off"
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
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Teléfono / Celular *</label>
                  <input 
                    type="tel" required maxLength="10" value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 3001234567" autoComplete="off"
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Fecha de Nacimiento</label>
                  <input 
                    type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)}
                    autoComplete="off"
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Dirección de Residencia</label>
                  <input 
                    type="text" maxLength="150" value={direccion} onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ej. Calle 123 #45-67" autoComplete="off"
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Rol del Sistema *</label>
                  <select 
                    required value={idRol} onChange={(e) => setIdRol(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '10px', boxSizing: 'border-box', background: '#fff', fontFamily: 'inherit' }}
                  >
                    <option value="1">Administrador</option>
                    <option value="2">Cliente</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '0.8rem', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fcd34d' }}>
                  <label style={{ display: 'block', fontWeight: '800', marginBottom: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase', color: '#d97706' }}>
                    {modalType === 'CREATE' ? 'Contraseña Asignada *' : 'Nueva Contraseña (Opcional)'}
                  </label>
                  <input
                    type="password" required={modalType === 'CREATE'} minLength="6" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" autoComplete="new-password"
                    style={{ width: '100%', padding: '10px', border: '2px solid #d97706', borderRadius: '10px', boxSizing: 'border-box' }}
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
                  {modalType === 'CREATE' ? 'Registrar Admin' : 'Guardar Cambios'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
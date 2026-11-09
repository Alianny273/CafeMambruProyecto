import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Box, 
  Coffee, 
  ClipboardList, 
  Star, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from "../../../context/useAuth"; 

export default function Sidebar() {
  const navigate = useNavigate();
  const { salir } = useAuth(); // 👈 2. Extraemos la función salir oficial del contexto

  const handleLogout = async () => {
    try {
      // 3. Ejecutamos la función salir del contexto. 
      // Esto limpia el storage, fija el cliente en null y redirige limpiamente al home.
      await salir(); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Función simplificada: react-router-dom inyecta "isActive" automáticamente.
  const navLinkClasses = ({ isActive }) =>
    isActive ? 'sidebar-link active' : 'sidebar-link';

  return (
    <aside className="sidebar">
      
      {/* --- Logo y Encabezado --- */}
      <div className="sidebar-logo">
        <div 
          style={{ 
            width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#EAE0D5', 
            border: '2px solid var(--secondary)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '2rem', transition: 'transform 0.4s var(--spring)',
            overflow: 'hidden' // 👈 Asegura que la imagen respete el círculo
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(-10deg) scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
        >
          <img 
            src="/img/logo.jpeg" // 👈 Corrección: en Vite las rutas de public van directo sin la palabra "/public"
            alt="Café Mambrú" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
        <h1>Café Mambrú</h1>
        <p style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.2em', fontWeight: 'bold', textTransform: 'uppercase' }}>
          Modulo Administrador
        </p>
      </div>

      {/* --- Menú de Navegación --- */}
      <nav className="sidebar-menu" style={{ flex: 1 }}>
        <NavLink to="/dashboard" end className={navLinkClasses}>
          <Home size={20} strokeWidth={2.5} /> Panel Reportes
        </NavLink>
        <NavLink to="/dashboard/inventario" className={navLinkClasses}>
          <Box size={20} strokeWidth={2.5} /> Inventario
        </NavLink>
        <NavLink to="/dashboard/productos" className={navLinkClasses}>
          <Coffee size={20} strokeWidth={2.5} /> Productos
        </NavLink>
        <NavLink to="/dashboard/pedidos" className={navLinkClasses}>
          <ClipboardList size={20} strokeWidth={2.5} /> Pedidos
        </NavLink>
        <NavLink to="/dashboard/experiencias" className={navLinkClasses}>
          <Star size={20} strokeWidth={2.5} /> Experiencias
        </NavLink>
        <NavLink to="/dashboard/clientes" className={navLinkClasses}>
          <Users size={20} strokeWidth={2.5} /> Clientes
        </NavLink>
        <NavLink to="/dashboard/configuracion" className={navLinkClasses}>
          <Settings size={20} strokeWidth={2.5} /> Configuración
        </NavLink>
      </nav>

      {/* --- Botón de Cerrar Sesión --- */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
        <button 
          onClick={handleLogout}
          className="sidebar-link" 
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={20} strokeWidth={2.5} /> Cerrar sesión
        </button>
      </div>
      
    </aside>
  );
}
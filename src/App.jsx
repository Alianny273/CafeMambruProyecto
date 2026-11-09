import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';

// 1. Layout y Páginas Públicas de la Tienda (Cliente Final)
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Experiencias from './pages/Experiencias';
import Tecnicas from './pages/Tecnicas';
import Conocenos from './pages/Conocenos';
import Contacto from './pages/Contacto';
import Carrito from './pages/Carrito';
import Ingresar from './pages/Ingresar';
import Politicas from './pages/Politicas';
import NotFound from './pages/NotFound';

// 2. Vistas de Cuenta de Usuario (Cliente Logueado)
import CuentaLayout from './pages/cuenta/CuentaLayout';
import Perfil from './pages/cuenta/Perfil';
import Direcciones from './pages/cuenta/Direcciones';
import Compras from './pages/cuenta/Compras';
import Favoritos from './pages/cuenta/Favoritos';

// 3. Layout y Vistas del Dashboard (Panel de Administración)
import DashboardLayout from './components/dashboard/layout/DashboardLayout';
import PanelPrincipal from './components/dashboard/views/PanelPrincipal';
import Inventario from './components/dashboard/views/Inventario';
import AdminProductos from './components/dashboard/views/Productos';
import Pedidos from './components/dashboard/views/Pedidos';
import ExperienciasAdmin from './components/dashboard/views/Experiencias';
import Clientes from './components/dashboard/views/Clientes';
import Configuracion from './components/dashboard/views/Configuracion';

// 4. Panel de Usuarios (Rol 2 - Pendiente de crear tu vista, puedes poner un componente básico o temporal)
import PanelUsuarios from './pages/PanelUsuarios'; 

// Componente de Ruta Protegida por Rol de Administrador (Rol 1)
function ProtectedAdminRoute({ children }) {
  const { cliente, cargando } = useAuth();
  
  if (cargando) return <div>Cargando...</div>;
  
  // Imprime esto en la consola F12 para verificar qué lee la ruta protegida
  console.log("Cliente en ProtectedAdminRoute:", cliente);

  const rolId = cliente?.rol?.idRol ?? cliente?.rol?.id ?? cliente?.idRol ?? cliente?.rol;
  const esAdmin = cliente && (rolId == 1 || rolId === "1");

  return esAdmin ? children : <Navigate to="/ingresar" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* =========================================================
            RUTAS PÚBLICAS DE LA TIENDA
           ========================================================= */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/experiencias" element={<Experiencias />} />
          <Route path="/tecnicas" element={<Tecnicas />} />
          <Route path="/conocenos" element={<Conocenos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/ingresar" element={<Ingresar />} />
          <Route path="/login" element={<Navigate to="/ingresar" replace />} />
          <Route path="/register" element={<Ingresar />} />
          <Route path="/politicas/:tema" element={<Politicas />} />

          {/* Rutas de la cuenta del cliente */}
          <Route path="/cuenta" element={<CuentaLayout />}>
            <Route index element={<Navigate to="perfil" replace />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="direcciones" element={<Direcciones />} />
            <Route path="compras" element={<Compras />} />
            <Route path="favoritos" element={<Favoritos />} />
          </Route>
        </Route>

        {/* =========================================================
            PANEL DE USUARIOS (Rol 2)
           ========================================================= */}
        <Route path="/panel-usuarios" element={<PanelUsuarios />} />

        {/* =========================================================
            RUTAS PRIVADAS DEL PANEL DE ADMINISTRACIÓN (Rol 1)
           ========================================================= */}
           <Route path="/dashboard" element={<ProtectedAdminRoute><DashboardLayout />
           </ProtectedAdminRoute>}
        
        >
          <Route index element={<PanelPrincipal />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="experiencias" element={<ExperienciasAdmin />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
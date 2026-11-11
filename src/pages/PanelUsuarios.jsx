import { useAuth } from '../hooks/useAuth';

export default function PanelUsuarios() {
  const { cliente, salir } = useAuth();

  return (
    <div style={{ padding: '3rem 1rem', textAlign: 'center', fontFamily: 'inherit' }}>
      <h1>Panel de Usuarios (Rol 2)</h1>
      <p>Bienvenido, {cliente?.nombre || 'Usuario'} 👋</p>
      <p>Este es tu panel personalizado. Aquí podrás ver tus próximas funciones muy pronto.</p>
      
      <button 
        onClick={salir} 
        style={{ 
          marginTop: '1.5rem', 
          padding: '10px 20px', 
          backgroundColor: 'var(--secondary)', 
          color: '#fff', 
          border: '2px solid var(--text-dark)', 
          borderRadius: '12px', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { Package, ShoppingBag, Calendar as CalendarIcon, TrendingUp, Users, Award, DollarSign } from 'lucide-react';

export default function PanelPrincipal() {
  const [dashboardData, setDashboardData] = useState({
    kpis: { productos: 0, clientes: 0, pedidos: 0, totalFacturado: 0, clienteEstrella: 'Cargando...' },
    topProductos: [],
    topTalleres: [],
    inventario: []
  });

  const [loading, setLoading] = useState(true);
  
  // Estado para controlar qué pestaña está activa ('General', 'Clientes', 'Productos')
  const [vistaActiva, setVistaActiva] = useState('General');

  useEffect(() => {
    fetch('http://localhost:8080/api/dashboard')
      .then(response => response.json())
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar los datos del dashboard:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontWeight: 'bold' }}>Cargando datos de Café Mambrú...</div>;
  }

  return (
    <div className="w-full">

      {/* --- ENCABEZADO Y PESTAÑAS DINÁMICAS --- */}
      <div className="dashboard-header">
        <div className="header-title">
          <h2>Reportes de Mambrú</h2>
          <p>Analiza el rendimiento de la tienda según la categoría seleccionada</p>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-btn ${vistaActiva === 'General' ? 'active' : ''}`}
            onClick={() => setVistaActiva('General')}
          >
            General
          </button>
          <button 
            className={`filter-btn ${vistaActiva === 'Clientes' ? 'active' : ''}`}
            onClick={() => setVistaActiva('Clientes')}
          >
            Clientes
          </button>
          <button 
            className={`filter-btn ${vistaActiva === 'Productos' ? 'active' : ''}`}
            onClick={() => setVistaActiva('Productos')}
          >
            Productos
          </button>
        </div>
      </div>

      {/* --- KPIS SUPERIORES (Se mantienen visibles para dar contexto) --- */}
      <div className="kpi-grid">
        <div className="card">
          <div className="kpi-header">
            <DollarSign size={20} color="var(--primary)" strokeWidth={2.5} />
            <span>Total Facturado</span>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.5rem' }}>$ {dashboardData.kpis.totalFacturado?.toLocaleString()}</div>
          <div className="kpi-badge">
            <TrendingUp size={14} strokeWidth={3} /> General
          </div>
        </div>

        <div className="card">
          <div className="kpi-header">
            <Award size={20} color="var(--secondary)" strokeWidth={2.5} />
            <span>Cliente con más pedidos</span>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.2rem', marginTop: '5px' }}>{dashboardData.kpis.clienteEstrella}</div>
          <div className="kpi-badge">
            <Users size={14} strokeWidth={3} /> VIP
          </div>
        </div>

        <div className="card">
          <div className="kpi-header">
            <ShoppingBag size={20} color="var(--accent)" strokeWidth={2.5} />
            <span>Total Pedidos</span>
          </div>
          <div className="kpi-value">{dashboardData.kpis.pedidos}</div>
          <div className="kpi-badge">
            <TrendingUp size={14} strokeWidth={3} /> Registrados
          </div>
        </div>

        <div className="card">
          <div className="kpi-header">
            <Package size={20} color="var(--primary)" strokeWidth={2.5} />
            <span>Stock en Inventario</span>
          </div>
          <div className="kpi-value">{dashboardData.kpis.productos}</div>
          <div className="kpi-badge">
            <TrendingUp size={14} strokeWidth={3} /> Unidades
          </div>
        </div>
      </div>

      {/* --- CONTENIDO CONDICIONAL SEGÚN LA PESTAÑA SELECCIONADA --- */}

      {/* VISTA 1: GENERAL (Muestra las 2 gráficas principales de productos y talleres) */}
      {vistaActiva === 'General' && (
        <div className="charts-grid">
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '4px' }}>Productos Más Vendidos</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '24px' }}>Unidades vendidas por producto</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.topProductos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE0D5" />
                <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontSize: 12, fontWeight: 600 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#78716C', fontSize: 13, fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #EAE0D5', fontWeight: 'bold' }} />
                <Bar dataKey="unidadesVendidas" name="Unidades Vendidas" fill="#2C5545" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '4px' }}>Talleres y Experiencias Populares</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '24px' }}>Total de personas asistentes por taller</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.topTalleres} layout="vertical" margin={{ top: 0, right: 30, left: 35, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#EAE0D5" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716C', fontWeight: 600 }} width={110} />
                  <Tooltip cursor={{fill: '#FDFBF7'}} contentStyle={{ borderRadius: '12px', border: '1px solid #EAE0D5', fontWeight: 'bold' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px', fontWeight: '600' }} />
                  <Bar dataKey="totalPersonas" name="Personas Asistentes" fill="#E2725B" barSize={16} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: CLIENTES (Gráfica exclusiva o resumen enfocada en clientes) */}
      {vistaActiva === 'Clientes' && (
        <div className="charts-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <Users size={48} color="var(--secondary)" style={{ marginBottom: '16px' }} />
            <h3 className="card-title" style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Módulo de Análisis de Clientes</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 20px auto' }}>
              El cliente más activo hasta el momento es <strong style={{ color: 'var(--text-main)' }}>{dashboardData.kpis.clienteEstrella}</strong>, 
              liderando las compras y reservas en Café Mambrú con un total de {dashboardData.kpis.clientes} clientes registrados en la plataforma.
            </p>
            <div style={{ display: 'inline-block', background: '#FDFBF7', padding: '15px 30px', borderRadius: '12px', border: '1px solid #EAE0D5', fontWeight: 'bold' }}>
              👥 Total de Clientes Registrados: {dashboardData.kpis.clientes}
            </div>
          </div>
        </div>
      )}

      {/* VISTA 3: PRODUCTOS */}
      {vistaActiva === 'Productos' && (
        <div className="charts-grid">
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '4px' }}>Estado del Inventario</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '24px' }}>Cantidad de stock disponible por producto</p>
            <div className="chart-wrapper" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.inventario} layout="vertical" margin={{ top: 0, right: 30, left: 35, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#EAE0D5" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716C', fontWeight: 600 }} width={110} reversed={true} />
                  <Tooltip cursor={{fill: '#FDFBF7'}} contentStyle={{ borderRadius: '12px', border: '1px solid #EAE0D5', fontWeight: 'bold' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px', fontWeight: '600' }} />
                  <Bar dataKey="stockDisponibles" name="Stock en Bodega" fill="#F4A261" barSize={16} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '30px' }}>
            <Package size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
            <h3 className="card-title" style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Control de Productos</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '400px', marginBottom: '20px' }}>
              Actualmente tienes un total de <strong style={{ color: 'var(--text-main)' }}>{dashboardData.kpis.productos} unidades</strong> en stock distribuidas entre los diferentes cafés y accesorios de la tienda.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
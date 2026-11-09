import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      
      {/* El Sidebar ya tiene posición 'fixed' y 260px de ancho en el CSS */}
      <Sidebar />
      
      {/* main-content tiene el calc(100% - 260px) y los paddings perfectos */}
      <div className="main-content">
        <Header />
        
        {/* Aquí renderizan las vistas (Productos, Inventario, etc.) */}
        <main>
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}
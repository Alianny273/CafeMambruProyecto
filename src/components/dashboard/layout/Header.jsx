import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

export default function Header() {
  const savedUser = JSON.parse(localStorage.getItem('mambru_user')) || { nombre: 'Administrador' };

  return (
    <header className="flex justify-between items-center pb-6 mb-8 border-b border-[#EAE0D5]">
      {/* Título de bienvenida dinámico */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2C221E] tracking-tight">
          Panel de control
        </h2>
        <p className="text-sm text-[#78716C] font-medium mt-0.5">
          Bienvenido de nuevo, <span className="text-[#2C221E] font-bold">{savedUser.nombre}</span>
        </p>
      </div>
      
      {/* Zona derecha: Notificaciones y Perfil */}
      <div className="flex items-center gap-4">
        
        {/* Botón de notificaciones con efecto sutil */}
        <button className="header-icon-btn relative">
          <Bell size={18} className="text-[#78716C]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#E2725B] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Píldora de perfil de usuario */}
        <div className="header-profile-pill">
          <div className="w-8 h-8 rounded-full bg-[#2C5545] flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {savedUser.nombre.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-[#2C221E] pr-1">
            {savedUser.nombre}
          </span>
          <ChevronDown size={14} className="text-[#78716C]" />
        </div>

      </div>
    </header>
  );
}
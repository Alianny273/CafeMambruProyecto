// Menú del cliente. Lo usan el desplegable del encabezado y el lateral de "Mi cuenta".
// Un elemento con `accion: 'salir'` cierra la sesión en vez de navegar.
export const gruposMenu = [
  {
    titulo: 'Tu cuenta',
    items: [
      { to: '/cuenta/perfil', texto: 'Mi perfil' },
      { to: '/cuenta/direcciones', texto: 'Mis direcciones' },
      { to: '/cuenta/compras', texto: 'Mis compras' },
      { to: '/cuenta/favoritos', texto: 'Mis favoritos' },
    ],
  },
  {
    titulo: 'Ajustes y ayuda',
    items: [
      { to: '/politicas/privacidad', texto: 'Políticas de privacidad' },
      { to: '/politicas/terminos', texto: 'Términos y condiciones' },
      { to: '/contacto', texto: 'Soporte y contacto' },
      { accion: 'salir', texto: 'Cerrar sesión' },
    ],
  },
]

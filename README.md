# ☕ Café Mambrú — Proyecto Integrador Full-Stack

Aplicación web desarrollada como proyecto integrador ("proyecto integrador"), estructurada con una arquitectura moderna de **Full-Stack** que conecta un frontend dinámico en **React** con un backend robusto en **Java Spring Boot**. La plataforma simula un sistema de e-commerce y gestión administrativa para una tienda de café especial.

---

## 🚀 Tecnologías Utilizadas

### Frontend

- **React** (con JSX y Hooks personalizados)
- **React Router DOM** para navegación y rutas protegidas (`ProtectedAdminRoute`)
- **Tailwind CSS** y CSS modular (variables globales para modo oscuro)
- **SweetAlert2** para alertas y notificaciones interactivas de sesión
- **Lucide React** para iconografía moderna en el panel de administración

### Backend

- **Java Spring Boot** (API REST)
- **Spring Security / JWT** (Autenticación y manejo de sesiones)
- Base de datos relacional con entidades `MUsuarios` y `MRoles` (relación ManyToOne)

---

## 🛠️ Características Principales

1. **Autenticación y Roles**:
   - Inicio de sesión diferenciado entre roles (Administrador vs. Usuario).
   - Protección de rutas privadas y panel de control administrativo.
2. **Gestión de Sesión e Inactividad**:
   - Temporizador de inactividad de 10 minutos implementado con `useRef` y eventos del navegador para auto-cierre de sesión por seguridad.
   - Persistencia de sesión mediante almacenamiento local (`localStorage`) y sincronización reactiva en el menú de usuario (`CuentaMenu`).
3. **Catálogo y Carrito de Compras**:
   - Filtros de productos, favoritos sincronizados y gestión de compras.
4. **Módulo Administrativo (Dashboard)**:
   - Panel de reportes, control de inventario, gestión de productos, pedidos y clientes.

---

## 📂 Estructura del Proyecto (Frontend)

```text
src/
├── components/     # Componentes reutilizables (carrito, cuenta, home, productos, ui)
├── context/        # Proveedores de contexto globales (Auth, Cart, Toast)
├── data/           # Datos locales y catálogos estáticos de respaldo
├── hooks/          # Hooks personalizados de consumo de API y lógica
├── pages/          # Vistas principales de la tienda y panel de administración
├── services/       # Conexiones HTTP centralizadas (fetch hacia la API de Spring Boot)
└── utils/          # Utilidades de formato de precios y filtros
```

import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import Campo from '../components/ui/Campo';
import { useAuth } from '../context/useAuth';

const EMAIL = /^\S+@\S+\.\S+$/;

const VACIO = { 
  nombre: '', 
  apellido: '', 
  email: '', 
  password: '', 
  telefono: '', 
  direccion: '', 
  tipoDocumento: 'CC', 
  numeroDocumento: '', 
  fechaNacimiento: '', 
  acepta: false 
};

function validar(v, registro) {
  const e = {};
  if (registro) {
    if (!v.nombre.trim()) e.nombre = 'Escribe tu nombre.';
    if (!v.apellido.trim()) e.apellido = 'Escribe tu apellido.';
    if (!v.telefono.trim()) e.telefono = 'Escribe tu teléfono.';
    if (!v.direccion.trim()) e.direccion = 'Escribe tu dirección.';
    if (!v.numeroDocumento.trim()) e.numeroDocumento = 'Escribe tu número de documento.';
    if (!v.fechaNacimiento) e.fechaNacimiento = 'Selecciona tu fecha de nacimiento.';
    if (!v.acepta) e.acepta = 'Debes aceptar la política de privacidad.';
  }
  if (!v.email.trim()) e.email = 'Escribe tu correo electrónico.';
  else if (!EMAIL.test(v.email.trim())) e.email = 'Escribe un correo válido.';
  
  if (!v.password) e.password = 'Escribe tu contraseña.';
  else if (registro && v.password.length < 6) e.password = 'Usa al menos 6 caracteres.';
  
  return e;
}

export default function Ingresar() {
  const { cliente, cargando, ingresar, registrar } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const destinoPrevio = location.state?.from;

  const [registro, setRegistro] = useState(false);
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Redirección si ya está autenticado previamente
  if (!cargando && cliente) {
    const rolId = cliente.rol?.idRol ?? cliente.rol?.id ?? cliente.idRol ?? cliente.rol;
    const rutaDefecto = (rolId == 1) ? '/dashboard' : '/panel-usuarios';
    return <Navigate to={destinoPrevio || rutaDefecto} replace />;
  }

  const cambiarModo = (modoRegistro) => {
    setRegistro(modoRegistro);
    setErrores({});
    setError('');
  };

  const alCambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setValores({ ...valores, [name]: type === 'checkbox' ? checked : value });
    if (errores[name]) setErrores({ ...errores, [name]: undefined });
  };

  const alEnviar = async (e) => {
    e.preventDefault();
    const encontrados = validar(valores, registro);
    setErrores(encontrados);
    setError('');
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      if (registro) {
        const datosRegistro = {
          nombre: `${valores.nombre} ${valores.apellido}`,
          email: valores.email.trim(),
          password: valores.password,
          telefono: valores.telefono,
          direccion: valores.direccion,
          tipoDocumento: valores.tipoDocumento,
          numeroDocumento: valores.numeroDocumento,
          fechaNacimiento: valores.fechaNacimiento,
          rol: { idRol: 2 }
        };
        
        if (registrar) {
          await registrar(datosRegistro);
        } else {
          const res = await fetch('http://localhost:8080/api/usuarios/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosRegistro)
          });
          if (!res.ok) throw new Error(await res.text() || 'Error al registrarse');
        }
        alert('¡Cuenta creada con éxito!');
        navigate('/cuenta/perfil', { replace: true });
      } else {
        // Recibimos el objeto usuario directamente del backend
        const usuarioLogueado = await ingresar({ 
          email: valores.email.trim(), 
          password: valores.password 
        });
        
        alert('¡Bienvenido de vuelta!');

        // Captura robusta del rol sin importar si viene como idRol, id o directo
        const rolId = usuarioLogueado?.rol?.idRol ?? usuarioLogueado?.rol?.id ?? usuarioLogueado?.idRol ?? usuarioLogueado?.rol;
        
        console.log("Usuario logueado exitosamente:", usuarioLogueado);
        console.log("ID de Rol detectado:", rolId);

        let rutaDestino = '/panel-usuarios'; 
        if (rolId == 1) {
          rutaDestino = '/dashboard'; // Administrador directo al dashboard
        }

        navigate(destinoPrevio || rutaDestino, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'No pudimos completar la solicitud. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="shop shop--page" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 1rem' }}>
      <SectionHeader
        titulo={registro ? 'Crea tu cuenta' : 'Ingresa a tu cuenta'}
        subtitulo="Guarda tus direcciones, revisa tus compras y marca tus cafés favoritos."
      />

      <div className="panel panel--auth" style={{ maxWidth: registro ? '650px' : '450px', margin: '0 auto', width: '100%', background: 'var(--card-bg)', border: '2px solid var(--text-dark)', borderRadius: '24px', padding: '2.5rem', boxShadow: '8px 8px 0px var(--secondary)' }}>
        <div className="filters-group auth-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button type="button" className={`chip ${!registro ? 'active' : ''}`} onClick={() => cambiarModo(false)} style={{ flex: 1, padding: '10px', fontWeight: 'bold', cursor: 'pointer', border: '2px solid var(--text-dark)', borderRadius: '12px', background: !registro ? 'var(--secondary)' : '#fff', color: !registro ? '#fff' : 'inherit' }}>
            Ingresar
          </button>
          <button type="button" className={`chip ${registro ? 'active' : ''}`} onClick={() => cambiarModo(true)} style={{ flex: 1, padding: '10px', fontWeight: 'bold', cursor: 'pointer', border: '2px solid var(--text-dark)', borderRadius: '12px', background: registro ? 'var(--secondary)' : '#fff', color: registro ? '#fff' : 'inherit' }}>
            Crear cuenta
          </button>
        </div>

        <form onSubmit={alEnviar} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {registro && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Campo id="nombre" etiqueta="Nombre" error={errores.nombre} value={valores.nombre} onChange={alCambiar} autoComplete="given-name" />
              <Campo id="apellido" etiqueta="Apellido" error={errores.apellido} value={valores.apellido} onChange={alCambiar} autoComplete="family-name" />
            </div>
          )}

          <Campo id="email" etiqueta="Correo electrónico" type="email" placeholder="tu@correo.com" error={errores.email} value={valores.email} onChange={alCambiar} autoComplete="email" />
          
          <Campo id="password" etiqueta="Contraseña" type="password" error={errores.password} nota={registro ? 'Mínimo 6 caracteres.' : undefined} value={valores.password} onChange={alCambiar} autoComplete={registro ? 'new-password' : 'current-password'} />

          {registro && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Tipo de Documento</label>
                  <select name="tipoDocumento" value={valores.tipoDocumento} onChange={alCambiar} style={{ width: '100%', padding: '10px', border: '2px solid var(--text-dark)', borderRadius: '12px', fontFamily: 'inherit', background: '#fff' }}>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="NIT">NIT</option>
                  </select>
                </div>
                <Campo id="numeroDocumento" etiqueta="Nº de Documento" error={errores.numeroDocumento} value={valores.numeroDocumento} onChange={alCambiar} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Campo id="telefono" etiqueta="Teléfono" type="tel" error={errores.telefono} value={valores.telefono} onChange={alCambiar} />
                <Campo id="fechaNacimiento" etiqueta="Fecha de Nacimiento" type="date" error={errores.fechaNacimiento} value={valores.fechaNacimiento} onChange={alCambiar} />
              </div>

              <Campo id="direccion" etiqueta="Dirección" error={errores.direccion} value={valores.direccion} onChange={alCambiar} placeholder="Calle 123 # 45-67" />

              <div>
                <label className="check" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" name="acepta" checked={valores.acepta} onChange={alCambiar} aria-invalid={!!errores.acepta} />
                  <span>
                    Acepto la <Link to="/politicas/privacidad" target="_blank" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>política de privacidad</Link>.
                  </span>
                </label>
                {errores.acepta && <p className="form-error" style={{ color: '#d9534f', fontSize: '0.8rem', marginTop: '0.3rem' }}>{errores.acepta}</p>}
              </div>
            </>
          )}

          {error && <p className="form-msg form-msg-error" role="alert" style={{ color: '#d9534f', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn-primary btn-submit" disabled={enviando} style={{ width: '100%', padding: '12px', textAlign: 'center', border: '2px solid var(--text-dark)', cursor: 'pointer', backgroundColor: 'var(--secondary)', color: '#fff', fontWeight: 'bold', borderRadius: '12px', marginTop: '0.5rem' }}>
            {enviando ? 'Un momento...' : registro ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>
      </div>
    </section>
  );
}
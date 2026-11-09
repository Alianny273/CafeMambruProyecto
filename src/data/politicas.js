import { negocio as n } from './negocio'

// Cada política es: título + secciones (cada una con párrafos). Se muestran en pages/Politicas.jsx
export const politicas = {
  privacidad: {
    menu: 'Política de privacidad',
    titulo: 'Política de privacidad y tratamiento de datos personales',
    intro: 'Cuidamos tus datos como cuidamos el café: con respeto por quien los entrega. Aquí te contamos qué guardamos, para qué y cómo puedes controlarlo, según la Ley 1581 de 2012 de Colombia.',
    secciones: [
      { titulo: 'Quién es el responsable', parrafos: [
        `${n.razonSocial} (${n.nombre}), NIT ${n.nit}, con domicilio en ${n.domicilio}, es la responsable del tratamiento de tus datos personales.`,
        `Para cualquier solicitud sobre tus datos escríbenos a ${n.correo} o llámanos al ${n.telefono}.`,
      ] },
      { titulo: 'Qué datos recogemos', parrafos: [
        'Al crear tu cuenta: nombre, apellido, correo electrónico y contraseña. En "Mi perfil" puedes agregar, si quieres, celular, cédula, fecha de nacimiento y género.',
        'Al comprar: direcciones de entrega, productos pedidos y valor de cada pedido. En tu cuenta también guardamos los productos que marcas como favoritos.',
        'Tu contraseña se guarda cifrada. Nadie del equipo puede leerla.',
      ] },
      { titulo: 'Para qué usamos tus datos', parrafos: [
        'Para crear y mantener tu cuenta, procesar y entregar tus pedidos, responder tus mensajes y cumplir obligaciones legales y contables.',
        'Si en algún momento te enviamos novedades o promociones, será solo con tu autorización y podrás retirarla cuando quieras.',
        'No vendemos tus datos.',
      ] },
      { titulo: 'Tus derechos', parrafos: [
        'Como titular de los datos puedes conocer, actualizar y rectificar tu información; pedir prueba de la autorización que nos diste; saber cómo usamos tus datos; acceder a ellos de forma gratuita; revocar tu autorización o pedir que los eliminemos; y presentar quejas ante la Superintendencia de Industria y Comercio.',
        'Puedes editar tus datos en "Mi perfil" y eliminar tu cuenta desde la misma página, cuando quieras.',
      ] },
      { titulo: 'Cómo ejercer tus derechos', parrafos: [
        `Envía tu consulta o reclamo a ${n.correo}, indicando tu nombre completo, el correo de tu cuenta y qué necesitas.`,
        'Respondemos las consultas en máximo 10 días hábiles; si necesitamos más tiempo te avisamos y la respuesta llegará en máximo 5 días hábiles adicionales. Los reclamos se atienden en máximo 15 días hábiles, prorrogables hasta por 8 días hábiles más con aviso previo.',
      ] },
      { titulo: 'Conservación y seguridad', parrafos: [
        'Guardamos tus datos mientras tengas cuenta y durante el tiempo que la ley nos exija conservar información de ventas. Aplicamos medidas técnicas y administrativas razonables para protegerlos.',
      ] },
      { titulo: 'Menores de edad', parrafos: [
        'Nuestra tienda está dirigida a personas mayores de 18 años. No recogemos datos de menores de forma intencional.',
      ] },
      { titulo: 'Cambios a esta política', parrafos: [
        'Si cambiamos esta política publicaremos la nueva versión en esta página, con su fecha de actualización.',
      ] },
    ],
  },
  terminos: {
    menu: 'Términos y condiciones',
    titulo: 'Términos y condiciones de uso',
    intro: 'Estas reglas son simples: úsanos con honestidad y nosotros te respondemos con lo mismo. Al crear una cuenta o hacer un pedido aceptas lo que sigue.',
    secciones: [
      { titulo: 'Tu cuenta', parrafos: [
        'Debes ser mayor de 18 años y dar datos verdaderos. Eres responsable de cuidar tu contraseña y de lo que se haga con tu cuenta.',
        'Podemos suspender cuentas usadas para fraude o abuso.',
      ] },
      { titulo: 'Productos y precios', parrafos: [
        'Los precios están en pesos colombianos (COP). Pueden cambiar sin previo aviso, pero el precio de un pedido ya confirmado no cambia. Los productos están sujetos a disponibilidad.',
        'Las fotos y descripciones son una guía: el café es un producto de origen y sus notas pueden variar entre cosechas.',
      ] },
      { titulo: 'Pedidos y envíos', parrafos: [
        'Al finalizar la compra nos envías tu pedido. Lo confirmamos y te informamos el costo y el tiempo de envío antes de despacharlo.',
      ] },
      { titulo: 'Cambios, garantía y retracto', parrafos: [
        'Si tu pedido llega con algún problema, escríbenos desde "Soporte y contacto" y lo resolvemos. Además de lo que aquí decimos, te protegen los derechos del Estatuto del Consumidor (Ley 1480 de 2011), incluidos la garantía y el retracto en ventas a distancia cuando aplique.',
      ] },
      { titulo: 'Propiedad intelectual', parrafos: [
        `El nombre, el logo, las fotos y los textos de ${n.nombre} son nuestros o de sus autores. No los uses sin permiso.`,
      ] },
      { titulo: 'Datos personales', parrafos: [
        'El tratamiento de tus datos se rige por nuestra Política de privacidad.',
      ] },
      { titulo: 'Ley aplicable', parrafos: [
        'Estos términos se rigen por las leyes de Colombia.',
      ] },
    ],
  },
}

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = `"Diplomado CESMECA-UNICACH" <${process.env.SMTP_USER}>`
const BASE_URL = process.env.NEXTAUTH_URL

function escapeHtml(texto: string): string {
  if (!texto) return ""
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

const emailLayout = (titulo: string, contenido: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #6B1F2A; padding: 20px; text-align: center; color: #fff;">
    <h1 style="margin: 0; font-size: 20px;">CESMECA-UNICACH</h1>
  </div>
  <div style="padding: 30px;">
    <h2 style="color: #6B1F2A;">${titulo}</h2>
    ${contenido}
  </div>
  <div style="background-color: #f9f9f9; padding: 15px; text-align: center; color: #999; font-size: 12px;">
    CESMECA - UNICACH - San Cristóbal de Las Casas, Chiapas
  </div>
</div>`

const boton = (texto: string, url: string) => `
<a href="${url}" style="background:#6B1F2A; color:#fff; padding:12px 25px; border-radius:5px; text-decoration:none; display:inline-block; font-weight:bold; margin-top:20px;">
  ${texto}
</a>`

export async function enviarEmailRecepcion(correo: string, nombre: string, folio: string) {
  const nombreSeguro = escapeHtml(nombre)
  const contenido = `<p>Hola <strong>${nombreSeguro}</strong>,</p>
  <p>Gracias por registrarte en el diplomado. Hemos recibido tu solicitud correctamente. Tu folio es: <strong>${folio}</strong>.</p>
  <p>Por favor, mantente atento a tu estatus en nuestra plataforma:</p>
  ${boton("Consultar mi solicitud", `${BASE_URL}/mi-solicitud?folio=${folio}`)}`
  await transporter.sendMail({ from: FROM, to: correo, subject: `Solicitud recibida - Folio ${folio}`, html: emailLayout("Solicitud Recibida", contenido) })
}

export async function enviarEmailAceptado(correo: string, nombre: string, folio: string) {
  const nombreSeguro = escapeHtml(nombre)
  const contenido = `<p>Hola <strong>${nombreSeguro}</strong>,</p>
  <p>Tu solicitud ha sido <strong>aceptada</strong>. Para concluir tu proceso de inscripción, realiza tu pago correspondiente a la cuenta indicada:</p>
  <div style="background:#f4f4f4; padding:15px; border-radius:5px; margin: 20px 0;">
    <p style="margin:5px 0"><strong>Banco:</strong> HSBC</p>
    <p style="margin:5px 0"><strong>Cuenta:</strong> 4069114171</p>
    <p style="margin:5px 0"><strong>Nombre:</strong> UNICACH INGRESOS PROPIOS</p>
    <p style="margin:5px 0"><strong>CLABE:</strong> 021100040691141712</p>
  </div>
  <p>Una vez realizado, <strong>no es necesario enviar comprobantes por correo</strong>. Ingresa con tu correo y folio al sistema para cargarlo directamente:</p>
  ${boton("Cargar comprobante de pago", `${BASE_URL}/mi-solicitud?folio=${folio}`)}
  <p style="margin-top:20px; font-size: 0.9em; color: #555;">Nuestro equipo validará tu información y te notificaremos por este mismo medio en cuanto tu estatus cambie.</p>`

  await transporter.sendMail({ from: FROM, to: correo, subject: `Solicitud aceptada - Folio ${folio}`, html: emailLayout("¡Tu solicitud fue aceptada!", contenido) })
}

export async function enviarEmailRechazado(correo: string, nombre: string, folio: string, motivo?: string) {
  const nombreSeguro = escapeHtml(nombre)
  const motivoSeguro = motivo ? escapeHtml(motivo) : ""
  const contenido = `<p>Estimado/a <strong>${nombreSeguro}</strong>,</p><p>Lamentamos informarte que tu solicitud no ha podido ser aceptada.</p>${motivoSeguro ? `<p style="background:#fff3f3; padding:10px; border-left:4px solid #d9534f;"><strong>Motivo:</strong> ${motivoSeguro}</p>` : ""}`
  await transporter.sendMail({ from: FROM, to: correo, subject: `Resultado de tu solicitud - Folio ${folio}`, html: emailLayout("Resultado de Solicitud", contenido) })
}

export async function enviarEmailPagoRecibido(correo: string, nombre: string, folio: string) {
  const nombreSeguro = escapeHtml(nombre)
  const contenido = `<p>Estimado/a <strong>${nombreSeguro}</strong>,</p><p>Hemos recibido tu comprobante de pago. El comité lo verificará en breve.</p>${boton("Ver mi solicitud", `${BASE_URL}/mi-solicitud?folio=${folio}`)}`
  await transporter.sendMail({ from: FROM, to: correo, subject: `Comprobante de pago recibido - Folio ${folio}`, html: emailLayout("Pago en verificación", contenido) })
}

export async function enviarEmailInscrito(correo: string, nombre: string, folio: string) {
  const nombreSeguro = escapeHtml(nombre)
  const contenido = `<p>¡Bienvenido/a al Diplomado, <strong>${nombreSeguro}</strong>!</p><p>Tu pago ha sido validado satisfactoriamente. Estás oficialmente inscrito/a.</p>`
  await transporter.sendMail({ from: FROM, to: correo, subject: `¡Estás inscrito! - Folio ${folio}`, html: emailLayout("¡Inscripción Exitosa!", contenido) })
}

export async function enviarEmailNota(correo: string, nombre: string, folio: string, nota: string) {
  const nombreSeguro = escapeHtml(nombre)
  const notaSegura = escapeHtml(nota)
  const contenido = `<p>Estimado/a <strong>${nombreSeguro}</strong>,</p>
  <p>El comité del Diplomado te ha enviado el siguiente mensaje respecto a tu solicitud (Folio: <strong>${folio}</strong>):</p>
  <div style="background:#f4f4f4; padding:15px; border-radius:5px; margin: 20px 0; white-space: pre-line;">${notaSegura}</div>
  ${boton("Ver mi solicitud", `${BASE_URL}/mi-solicitud?folio=${folio}`)}`
  await transporter.sendMail({ from: FROM, to: correo, subject: `Mensaje del comité - Folio ${folio}`, html: emailLayout("Mensaje del Comité", contenido) })
}

export async function enviarEmailAprobado(correo: string, nombre: string, urlConstancia: string) {
  const nombreSeguro = escapeHtml(nombre)
  const contenido = `<p>¡Muchas felicidades, <strong>${nombreSeguro}</strong>!</p><p>Has completado satisfactoriamente el Diplomado.</p>${boton("Obtener mi constancia", urlConstancia)}`
  await transporter.sendMail({ from: FROM, to: correo, subject: `Diplomado completado con éxito!`, html: emailLayout("Diplomado Finalizado", contenido) })
}

export async function enviarEmailNoAprobado(correo: string, nombre: string) {
  const nombreSeguro = escapeHtml(nombre)
  const contenido = `<p>Estimado/a <strong>${nombreSeguro}</strong>, lamentamos informarte que no has aprobado el diplomado.</p>`
  await transporter.sendMail({ from: FROM, to: correo, subject: `Resultado final del Diplomado`, html: emailLayout("Resultado Final", contenido) })
}

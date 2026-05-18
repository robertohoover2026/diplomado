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

export async function enviarEmailRecepcion(correo: string, nombre: string, folio: string) {
  await transporter.sendMail({
    from: FROM, to: correo,
    subject: `Solicitud recibida - Folio ${folio}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#6B1F2A">Diplomado en Estudio y Formacion Politica</h2>
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Hemos recibido tu solicitud. Tu folio es: <strong style="color:#6B1F2A">${folio}</strong></p>
      <p>El comite revisara tu expediente en un plazo maximo de <strong>5 dias habiles</strong>.</p>
      <p><a href="${BASE_URL}/mi-solicitud?folio=${folio}">Ver estado de mi solicitud</a></p>
      <hr><p style="color:#999;font-size:0.85rem">CESMECA - UNICACH - San Cristobal de Las Casas, Chiapas</p>
    </div>`
  })
}

export async function enviarEmailAceptado(correo: string, nombre: string, folio: string) {
  await transporter.sendMail({
    from: FROM, to: correo,
    subject: `Solicitud aceptada - Folio ${folio}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#6B1F2A">Felicidades ${nombre}!</h2>
      <p>Tu solicitud ha sido <strong>aceptada</strong>. Para completar tu inscripcion realiza el pago de <strong>$3,300 MXN</strong>:</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px;background:#f5f5f5"><strong>Banco</strong></td><td style="padding:8px">HSBC</td></tr>
        <tr><td style="padding:8px;background:#f5f5f5"><strong>Cuenta</strong></td><td style="padding:8px">4069114171</td></tr>
        <tr><td style="padding:8px;background:#f5f5f5"><strong>Nombre</strong></td><td style="padding:8px">UNICACH INGRESOS PROPIOS</td></tr>
        <tr><td style="padding:8px;background:#f5f5f5"><strong>CLABE</strong></td><td style="padding:8px">021100040691141712</td></tr>
      </table>
      <p>Sube tu voucher en: <a href="${BASE_URL}/mi-solicitud?folio=${folio}">Ver mi solicitud</a></p>
      <hr><p style="color:#999;font-size:0.85rem">CESMECA - UNICACH</p>
    </div>`
  })
}

export async function enviarEmailRechazado(correo: string, nombre: string, folio: string, motivo?: string) {
  await transporter.sendMail({
    from: FROM, to: correo,
    subject: `Resultado de tu solicitud - Folio ${folio}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#6B1F2A">Diplomado en Estudio y Formacion Politica</h2>
      <p>Estimado/a <strong>${nombre}</strong>, lamentamos informarte que tu solicitud no fue aceptada.</p>
      ${motivo ? `<p><strong>Motivo:</strong> ${motivo}</p>` : ""}
      <hr><p style="color:#999;font-size:0.85rem">CESMECA - UNICACH</p>
    </div>`
  })
}

export async function enviarEmailPagoRecibido(correo: string, nombre: string, folio: string) {
  await transporter.sendMail({
    from: FROM, to: correo,
    subject: `Comprobante de pago recibido - Folio ${folio}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#6B1F2A">Pago en verificacion</h2>
      <p>Estimado/a <strong>${nombre}</strong>, hemos recibido tu comprobante de pago. Lo verificaremos en breve.</p>
      <p><a href="${BASE_URL}/mi-solicitud?folio=${folio}">Ver mi solicitud</a></p>
      <hr><p style="color:#999;font-size:0.85rem">CESMECA - UNICACH</p>
    </div>`
  })
}

export async function enviarEmailInscrito(correo: string, nombre: string, folio: string) {
  await transporter.sendMail({
    from: FROM, to: correo,
    subject: `Estas inscrito al diplomado! - Folio ${folio}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#6B1F2A">Bienvenido/a al Diplomado!</h2>
      <p>Estimado/a <strong>${nombre}</strong>, tu pago fue verificado. Estas oficialmente inscrito/a.</p>
      <p><strong>Inicio:</strong> Septiembre 2026 | <strong>Sesiones:</strong> Viernes 16:00-19:00 hrs | <strong>Modalidad:</strong> Mixta</p>
      <hr><p style="color:#999;font-size:0.85rem">CESMECA - UNICACH</p>
    </div>`
  })
}

export async function enviarEmailAprobado(correo: string, nombre: string, urlConstancia: string) {
  await transporter.sendMail({
    from: FROM, to: correo,
    subject: `Diplomado completado con exito!`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#6B1F2A">Felicidades ${nombre}!</h2>
      <p>Has completado satisfactoriamente el Diplomado en Estudio y Formacion Politica.</p>
      <p><a href="${urlConstancia}" style="background:#6B1F2A;color:#fff;padding:0.8rem 1.5rem;border-radius:4px;text-decoration:none;display:inline-block">Obtener mi constancia</a></p>
      <hr><p style="color:#999;font-size:0.85rem">CESMECA - UNICACH</p>
    </div>`
  })
}

export async function enviarEmailNoAprobado(correo: string, nombre: string) {
  await transporter.sendMail({
    from: FROM, to: correo,
    subject: `Resultado final del Diplomado`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#6B1F2A">Diplomado en Estudio y Formacion Politica</h2>
      <p>Estimado/a <strong>${nombre}</strong>, lamentamos informarte que no has aprobado el diplomado.</p>
      <p>Agradecemos tu participacion y dedicacion durante el proceso.</p>
      <hr><p style="color:#999;font-size:0.85rem">CESMECA - UNICACH</p>
    </div>`
  })
}

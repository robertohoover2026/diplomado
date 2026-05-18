import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { enviarEmailAceptado, enviarEmailRechazado, enviarEmailInscrito, enviarEmailPagoRecibido } from "@/lib/email"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const estatus = searchParams.get("estatus")
  const page = Number(searchParams.get("page") || 1)
  const limit = 20

  const where = estatus ? { estatus } : {}

  const [solicitudes, total] = await Promise.all([
    prisma.solicitud.findMany({
      where,
      orderBy: { creadoEn: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { kardex: true }
    }),
    prisma.solicitud.count({ where })
  ])

  return NextResponse.json({ ok: true, solicitudes, total, pages: Math.ceil(total / limit) })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get("id"))

  const solicitud = await prisma.solicitud.findUnique({ where: { id } })
  if (!solicitud) return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 })

  // Borrar archivos del servidor
  const { unlink } = await import("fs/promises")
  const archivos = [solicitud.urlCV, solicitud.urlIdentificacion, solicitud.urlCartaMotivos, solicitud.urlVoucher]
  for (const url of archivos) {
    if (url) {
      try {
        const filename = url.split("/").pop()
        await unlink(`/app/public/uploads/${filename}`)
      } catch {}
    }
  }

  // Borrar kardex y solicitud
  await prisma.kardex.deleteMany({ where: { solicitudId: id } })
  await prisma.solicitud.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, accion, notasComite } = body

  const solicitud = await prisma.solicitud.findUnique({ where: { id } })
  if (!solicitud) return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 })

  let nuevoEstatus = solicitud.estatus

  if (accion === "ACEPTAR") {
    nuevoEstatus = "ACEPTADO"
    await enviarEmailAceptado(solicitud.correo, solicitud.nombre, solicitud.folio)
  } else if (accion === "RECHAZAR") {
    nuevoEstatus = "RECHAZADO"
    await enviarEmailRechazado(solicitud.correo, solicitud.nombre, solicitud.folio, notasComite)
  } else if (accion === "CONFIRMAR_PAGO") {
    nuevoEstatus = "INSCRITO"
    await enviarEmailInscrito(solicitud.correo, solicitud.nombre, solicitud.folio)
    await prisma.kardex.create({ data: { solicitudId: solicitud.id } })
  } else if (accion === "RECHAZAR_PAGO") {
    nuevoEstatus = "ACEPTADO"
  }

  const actualizada = await prisma.solicitud.update({
    where: { id },
    data: { estatus: nuevoEstatus, notasComite }
  })

  return NextResponse.json({ ok: true, solicitud: actualizada })
}

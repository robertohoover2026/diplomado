import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { enviarEmailAprobado, enviarEmailNoAprobado } from "@/lib/email"

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { solicitudId, accion } = body
  const asistenciaM1 = body.asistenciaM1 !== "" ? Number(body.asistenciaM1) : null
  const asistenciaM2 = body.asistenciaM2 !== "" ? Number(body.asistenciaM2) : null
  const asistenciaM3 = body.asistenciaM3 !== "" ? Number(body.asistenciaM3) : null
  const asistenciaM4 = body.asistenciaM4 !== "" ? Number(body.asistenciaM4) : null
  const ensayoM1 = body.ensayoM1 !== "" ? Number(body.ensayoM1) : null
  const ensayoM2 = body.ensayoM2 !== "" ? Number(body.ensayoM2) : null
  const ensayoM3 = body.ensayoM3 !== "" ? Number(body.ensayoM3) : null
  const ensayoM4 = body.ensayoM4 !== "" ? Number(body.ensayoM4) : null
  const ensayoFinal = body.ensayoFinal !== "" ? Number(body.ensayoFinal) : null

  const solicitud = await prisma.solicitud.findUnique({
    where: { id: solicitudId },
    include: { kardex: true }
  })
  if (!solicitud) return NextResponse.json({ ok: false, error: "No encontrada" }, { status: 404 })

  // Calcular puntaje asistencia (20%)
  const asistencias = [asistenciaM1, asistenciaM2, asistenciaM3, asistenciaM4].filter((v): v is number => v !== null)
  const promedioAsistencia = asistencias.length > 0 ? asistencias.reduce((a: number, b: number) => a + b, 0) / asistencias.length : 0
  const puntajeAsistencia = promedioAsistencia >= 80 ? 20 : (promedioAsistencia / 80) * 20

  // Calcular ensayos parciales (30%)
  const ensayos = [ensayoM1, ensayoM2, ensayoM3, ensayoM4].filter((v): v is number => v !== null)
  const promedioEnsayos = ensayos.length > 0 ? ensayos.reduce((a: number, b: number) => a + b, 0) / ensayos.length : 0
  const puntajeEnsayosParciales = (promedioEnsayos / 10) * 30

  // Ensayo final (50%)
  const puntajeEnsayoFinal = ensayoFinal ? (ensayoFinal / 10) * 50 : 0

  // Calificacion final
  const calificacionFinal = puntajeAsistencia + puntajeEnsayosParciales + puntajeEnsayoFinal
  const aprobado = calificacionFinal >= 8

  const kardex = await prisma.kardex.upsert({
    where: { solicitudId },
    create: {
      solicitudId,
      asistenciaM1, asistenciaM2, asistenciaM3, asistenciaM4,
      puntajeAsistencia,
      ensayoM1, ensayoM2, ensayoM3, ensayoM4,
      puntajeEnsayosParciales,
      ensayoFinal, puntajeEnsayoFinal,
      calificacionFinal,
      aprobado
    },
    update: {
      asistenciaM1, asistenciaM2, asistenciaM3, asistenciaM4,
      puntajeAsistencia,
      ensayoM1, ensayoM2, ensayoM3, ensayoM4,
      puntajeEnsayosParciales,
      ensayoFinal,
      calificacionFinal,
      aprobado
    }
  })

  if (accion === "APROBAR") {
    const urlConstancia = process.env.URL_CONSTANCIA || ""
    await enviarEmailAprobado(solicitud.correo, solicitud.nombre, urlConstancia)
    await prisma.kardex.update({
      where: { solicitudId },
      data: { estatusGeneral: "APROBADO" }
    })
  } else if (accion === "NO_APROBAR") {
    await enviarEmailNoAprobado(solicitud.correo, solicitud.nombre)
    await prisma.kardex.update({
      where: { solicitudId },
      data: { estatusGeneral: "NO_APROBADO" }
    })
  }

  return NextResponse.json({ ok: true, kardex, calificacionFinal, aprobado })
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generarFolio } from "@/lib/folio"
import { enviarEmailRecepcion } from "@/lib/email"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const nombre = formData.get("nombre") as string
    const apellidos = formData.get("apellidos") as string
    const curp = formData.get("curp") as string
    const correo = formData.get("correo") as string
    const telefono = formData.get("telefono") as string
    const perfil = formData.get("perfil") as string
    const institucion = formData.get("institucion") as string
    const nivelAcademico = formData.get("nivelAcademico") as string
    const pais = formData.get("pais") as string
    const nacionalidad = formData.get("nacionalidad") as string

    const uploadDir = path.join(process.cwd(), "public/uploads")
    await mkdir(uploadDir, { recursive: true })

    async function guardarArchivo(file: File, prefix: string): Promise<string> {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext = file.name.split(".").pop()
      const filename = `${prefix}_${Date.now()}.${ext}`
      await writeFile(path.join(uploadDir, filename), buffer)
      return `/uploads/${filename}`
    }

    const cv = formData.get("cv") as File
    const identificacion = formData.get("identificacion") as File
    const cartaMotivos = formData.get("cartaMotivos") as File

    const urlCV = cv ? await guardarArchivo(cv, "cv") : null
    const urlIdentificacion = identificacion ? await guardarArchivo(identificacion, "id") : null
    const urlCartaMotivos = cartaMotivos ? await guardarArchivo(cartaMotivos, "carta") : null

    // Verificar duplicados por CURP o correo
    const duplicado = await prisma.solicitud.findFirst({
      where: {
        OR: [
          { curp: curp },
          { correo: correo }
        ]
      }
    })

    if (duplicado) {
      return NextResponse.json({ 
        ok: false, 
        error: `Ya existe una solicitud registrada con ${duplicado.correo === correo ? "este correo electrónico" : "esta CURP"}. Tu folio es: ${duplicado.folio}` 
      }, { status: 400 })
    }

    let folio = generarFolio()
    let existe = await prisma.solicitud.findUnique({ where: { folio } })
    while (existe) {
      folio = generarFolio()
      existe = await prisma.solicitud.findUnique({ where: { folio } })
    }

    const solicitud = await prisma.solicitud.create({
      data: {
        folio, nombre, apellidos, curp, correo, telefono,
        perfil, institucion, nivelAcademico, pais, nacionalidad,
        costo: 3300,
        urlCV, urlIdentificacion, urlCartaMotivos,
        estatus: "PENDIENTE"
      }
    })

    await enviarEmailRecepcion(correo, nombre, folio)

    return NextResponse.json({ ok: true, folio: solicitud.folio })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: "Error al procesar solicitud" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const folio = searchParams.get("folio")
  const correo = searchParams.get("correo")

  if (!folio || !correo) {
    return NextResponse.json({ ok: false, error: "Folio y correo requeridos" }, { status: 400 })
  }

  const solicitud = await prisma.solicitud.findFirst({
    where: { folio, correo },
    include: { kardex: true }
  })

  if (!solicitud) {
    return NextResponse.json({ ok: false, error: "Solicitud no encontrada" }, { status: 404 })
  }

  return NextResponse.json({ ok: true, solicitud })
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { enviarEmailPagoRecibido } from "@/lib/email"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const folio = formData.get("folio") as string
    const correo = formData.get("correo") as string
    const voucher = formData.get("voucher") as File

    const solicitud = await prisma.solicitud.findFirst({
      where: { folio, correo }
    })

    if (!solicitud) {
      return NextResponse.json({ ok: false, error: "Solicitud no encontrada" }, { status: 404 })
    }

    const uploadDir = path.join(process.cwd(), "public/uploads")
    await mkdir(uploadDir, { recursive: true })
    const ext = voucher.name.split(".").pop()
    const filename = `voucher_${folio}_${Date.now()}.${ext}`
    const bytes = await voucher.arrayBuffer()
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

    await prisma.solicitud.update({
      where: { id: solicitud.id },
      data: {
        urlVoucher: `/uploads/${filename}`,
        estatus: "PAGO_ENVIADO"
      }
    })

    await enviarEmailPagoRecibido(correo, solicitud.nombre, folio)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: "Error al procesar" }, { status: 500 })
  }
}

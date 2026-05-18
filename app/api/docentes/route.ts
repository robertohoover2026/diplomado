import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const docentes = await prisma.$queryRaw`SELECT * FROM docentes WHERE activo = true ORDER BY orden ASC`
  return NextResponse.json({ ok: true, docentes })
}

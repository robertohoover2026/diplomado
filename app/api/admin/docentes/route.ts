import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const docentes = await prisma.$queryRaw`SELECT * FROM docentes ORDER BY orden ASC, id ASC`
  return NextResponse.json({ ok: true, docentes })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre, institucion, cargo, url, esCoordinador, orden } = body
  const docente = await prisma.$executeRaw`
    INSERT INTO docentes (nombre, institucion, cargo, url, es_coordinador, orden)
    VALUES (${nombre}, ${institucion}, ${cargo || null}, ${url || null}, ${esCoordinador || false}, ${orden || 0})
  `
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, nombre, institucion, cargo, url, esCoordinador, orden, activo } = body
  await prisma.$executeRaw`
    UPDATE docentes SET 
      nombre=${nombre}, institucion=${institucion}, cargo=${cargo || null},
      url=${url || null}, es_coordinador=${esCoordinador || false},
      orden=${orden || 0}, activo=${activo !== false},
      actualizado_en=NOW()
    WHERE id=${id}
  `
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get("id"))
  await prisma.$executeRaw`DELETE FROM docentes WHERE id=${id}`
  return NextResponse.json({ ok: true })
}

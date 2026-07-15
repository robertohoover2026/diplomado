import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const SECRET = process.env.NEXTAUTH_SECRET!

export async function POST(req: Request) {
  const { user, pwd } = await req.json()

  const validUser = process.env.ADMIN_USER
  const validHash = process.env.ADMIN_PASSWORD_HASH

  if (!validUser || !validHash) {
    return NextResponse.json({ ok: false, error: "Servidor mal configurado" }, { status: 500 })
  }

  if (user !== validUser) {
    return NextResponse.json({ ok: false, error: "Credenciales invalidas" }, { status: 401 })
  }

  const passwordMatches = await bcrypt.compare(pwd, validHash)

  if (!passwordMatches) {
    return NextResponse.json({ ok: false, error: "Credenciales invalidas" }, { status: 401 })
  }

  const token = jwt.sign(
    { user, role: "admin" },
    SECRET,
    { expiresIn: "24h" }
  )

  ;(await cookies()).set("admin_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/"
  })

  return NextResponse.json({ ok: true })
}

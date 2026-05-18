import { NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import path from "path"

export async function GET(req: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params
    const filepath = path.join(process.cwd(), "public/uploads", filename)
    if (!existsSync(filepath)) {
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 })
    }
    const file = readFileSync(filepath)
    const ext = filename.split(".").pop()?.toLowerCase()
    const contentType = ext === "pdf" ? "application/pdf" : 
                       ext === "png" ? "image/png" :
                       ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "application/octet-stream"
    return new NextResponse(file, {
      headers: { "Content-Type": contentType }
    })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

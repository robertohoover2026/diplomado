import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Diplomado en Estudio y Formacion Politica - CESMECA UNICACH",
  description: "Sistema de registro para el Diplomado en Estudio y Formacion Politica",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

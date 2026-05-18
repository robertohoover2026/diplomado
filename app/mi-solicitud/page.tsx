import { Suspense } from "react"
import MiSolicitudClient from "./client"

export default function MiSolicitudPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>}>
      <MiSolicitudClient />
    </Suspense>
  )
}

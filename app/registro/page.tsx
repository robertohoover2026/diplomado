"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegistroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (data.ok) {
        router.push(`/mi-solicitud?folio=${data.folio}&nuevo=true`)
      } else {
        setError(data.error || "Error al enviar solicitud")
      }
    } catch {
      setError("Error de conexion. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#C8973A] text-sm font-medium tracking-widest uppercase mb-2">CESMECA · UNICACH · 2026</p>
          <h1 className="text-4xl font-bold text-[#6B1F2A] mb-3">Solicitud de Inscripcion</h1>
          <p className="text-gray-500">Diplomado en Estudio y Formacion Politica</p>
          <div className="mt-4 bg-[#6B1F2A] text-white rounded-lg p-4 text-sm">
            <p>Costo de inscripcion: <strong>$3,300 MXN</strong></p>
            <p className="text-gray-300 text-xs mt-1">Los datos bancarios se enviaran una vez aceptada tu solicitud</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Nombre(s) *</label>
              <input name="nombre" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="Tu nombre"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Apellidos *</label>
              <input name="apellidos" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="Apellido paterno y materno"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">CURP *</label>
              <input name="curp" required maxLength={18} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm uppercase text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="XXXX000000XXXXXXXX00"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Telefono *</label>
              <input name="telefono" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="967 000 0000"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Correo electronico *</label>
              <input name="correo" type="email" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="tu@correo.com"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Pais de residencia *</label>
              <input name="pais" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="Mexico"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Nacionalidad *</label>
              <input name="nacionalidad" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="Mexicana"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Nivel academico *</label>
              <select name="nivelAcademico" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]">
                <option value="">Selecciona</option>
                <option>Licenciatura</option>
                <option>Especialidad</option>
                <option>Maestria</option>
                <option>Doctorado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Perfil / Ocupacion *</label>
              <select name="perfil" required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]">
                <option value="">Selecciona</option>
                <option>Academico / Investigador</option>
                <option>Estudiante de posgrado</option>
                <option>Estudiante de licenciatura</option>
                <option>Servidor publico</option>
                <option>Profesionista independiente</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Institucion / Organizacion</label>
              <input name="institucion" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="Nombre de tu institucion"/>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm font-medium text-[#6B1F2A] mb-4">Documentos requeridos</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Curriculum Vitae (PDF) *</label>
                <input name="cv" type="file" accept=".pdf" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#6B1F2A] file:text-white file:text-sm cursor-pointer"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Identificacion oficial (PDF o imagen) *</label>
                <input name="identificacion" type="file" accept=".pdf,.jpg,.jpeg,.png" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#6B1F2A] file:text-white file:text-sm cursor-pointer"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Carta de exposicion de motivos - 1 cuartilla (PDF) *</label>
                <input name="cartaMotivos" type="file" accept=".pdf" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#6B1F2A] file:text-white file:text-sm cursor-pointer"/>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-[#6B1F2A] text-white py-4 rounded-lg font-medium text-sm hover:bg-[#3D2B1F] transition-colors disabled:opacity-50">
            {loading ? "Enviando solicitud..." : "Enviar solicitud de pre-registro"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Al enviar tu solicitud recibiras un folio de seguimiento en tu correo electronico.
            El comite respondera en un plazo maximo de 5 dias habiles.
          </p>
        </form>
      </div>
    </div>
  )
}

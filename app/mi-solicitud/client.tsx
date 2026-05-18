"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

const PASOS = [
  { key: "PENDIENTE", label: "Solicitud recibida", desc: "Tu solicitud fue recibida correctamente" },
  { key: "EN_REVISION", label: "En revision", desc: "El comite esta revisando tu expediente" },
  { key: "ACEPTADO", label: "Aceptado", desc: "Tu solicitud fue aceptada. Realiza tu pago" },
  { key: "PAGO_ENVIADO", label: "Pago enviado", desc: "Tu comprobante de pago fue recibido" },
  { key: "PAGO_REVISION", label: "Verificando pago", desc: "El comite esta verificando tu pago" },
  { key: "INSCRITO", label: "Inscrito", desc: "Eres participante oficial del diplomado" },
]

export default function MiSolicitudClient() {
  const params = useSearchParams()
  const folioParam = params.get("folio") || ""
  const esNuevo = params.get("nuevo") === "true"
  const [folio, setFolio] = useState(folioParam)
  const [correo, setCorreo] = useState("")
  const [solicitud, setSolicitud] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [buscado, setBuscado] = useState(false)

  async function buscarSolicitud() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/solicitudes?folio=${folio}&correo=${correo}`)
      const data = await res.json()
      if (data.ok) { setSolicitud(data.solicitud); setBuscado(true) }
      else setError("No encontramos tu solicitud. Verifica tu folio y correo.")
    } catch { setError("Error de conexion.") }
    finally { setLoading(false) }
  }

  const pasoActual = solicitud?.estatus === "INSCRITO" ? PASOS.length : PASOS.findIndex(p => p.key === solicitud?.estatus)

  return (
    <div className="min-h-screen bg-[#FAF6EF] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#C8973A] text-sm font-medium tracking-widest uppercase mb-2">CESMECA - UNICACH</p>
          <h1 className="text-3xl font-bold text-[#6B1F2A] mb-2">Mi Solicitud</h1>
          <p className="text-gray-500 text-sm">Consulta el estado de tu inscripcion</p>
        </div>

        {esNuevo && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
            <p className="text-2xl mb-2">✅</p>
            <h2 className="font-bold text-green-800 mb-1">Solicitud enviada correctamente</h2>
            <p className="text-green-700 text-sm">Tu folio es: <strong className="text-lg">{folioParam}</strong></p>
            <p className="text-green-600 text-xs mt-2">Guarda este folio. Lo necesitaras para consultar tu estatus.</p>
          </div>
        )}

        {!buscado && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-medium text-gray-700 mb-6">Ingresa tus datos para consultar</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Numero de folio</label>
                <input value={folio} onChange={e => setFolio(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="DIPLO-2026-0000"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Correo electronico</label>
                <input value={correo} onChange={e => setCorreo(e.target.value)} type="email" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="tu@correo.com"/>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button onClick={buscarSolicitud} disabled={loading || !folio || !correo} className="w-full bg-[#6B1F2A] text-white py-3 rounded-lg font-medium text-sm hover:bg-[#3D2B1F] transition-colors disabled:opacity-50">
                {loading ? "Buscando..." : "Consultar mi solicitud"}
              </button>
            </div>
          </div>
        )}

        {solicitud && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-bold text-[#6B1F2A] text-lg">{solicitud.nombre} {solicitud.apellidos}</h2>
                  <p className="text-gray-500 text-sm">Folio: <strong>{solicitud.folio}</strong></p>
                </div>
                <span className="bg-[#6B1F2A] text-white text-xs px-3 py-1 rounded-full">{solicitud.estatus}</span>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-600 mb-4">Estado de tu solicitud</h3>
                <div className="space-y-3">
                  {PASOS.map((paso, i) => (
                    <div key={paso.key} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${i < pasoActual ? "bg-green-500 text-white" : i === pasoActual ? "bg-[#6B1F2A] text-white" : "bg-gray-100 text-gray-400"}`}>
                        {i < pasoActual ? "✓" : i + 1}
                      </div>
                      <div className="flex-1 pb-3 border-b border-gray-50">
                        <p className={`text-sm font-medium ${i <= pasoActual ? "text-gray-800" : "text-gray-400"}`}>{paso.label}</p>
                        <p className={`text-xs mt-0.5 ${i <= pasoActual ? "text-gray-500" : "text-gray-300"}`}>{paso.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {solicitud.notasComite && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-amber-800 mb-1">Mensaje del comite:</p>
                  <p className="text-sm text-amber-700">{solicitud.notasComite}</p>
                </div>
              )}
            </div>

            {solicitud.estatus === "ACEPTADO" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-medium text-[#6B1F2A] mb-4">Datos bancarios para pago</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600 font-medium">Banco</span><strong className="text-gray-900">HSBC</strong></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600 font-medium">Cuenta</span><strong className="text-gray-900">4069114171</strong></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600 font-medium">Nombre</span><strong className="text-gray-900">UNICACH INGRESOS PROPIOS</strong></div>
                  <div className="flex justify-between py-2 border-b"><span className="text-gray-600 font-medium">CLABE</span><strong className="text-gray-900">021100040691141712</strong></div>
                  <div className="flex justify-between py-2"><span className="text-gray-600 font-medium">Monto</span><strong className="text-[#6B1F2A] text-lg">$3,300 MXN</strong></div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs font-medium text-gray-600 mb-3">Sube tu comprobante de pago:</p>
                  <UploadVoucher folio={solicitud.folio} correo={solicitud.correo}/>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function UploadVoucher({ folio, correo }: { folio: string, correo: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function subir() {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append("folio", folio)
    formData.append("correo", correo)
    formData.append("voucher", file)
    const res = await fetch("/api/solicitudes/voucher", { method: "POST", body: formData })
    const data = await res.json()
    if (data.ok) setDone(true)
    setLoading(false)
  }

  if (done) return <p className="text-green-600 text-sm">Comprobante enviado. Te notificaremos cuando sea verificado.</p>

  return (
    <div className="space-y-3">
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#6B1F2A] file:text-white cursor-pointer"/>
      <button onClick={subir} disabled={!file || loading} className="w-full bg-[#C8973A] text-white py-3 rounded-lg font-medium text-sm hover:opacity-90 transition disabled:opacity-50">
        {loading ? "Subiendo..." : "Enviar comprobante de pago"}
      </button>
    </div>
  )
}

"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function KardexPage() {
  const router = useRouter()
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [seleccionada, setSeleccionada] = useState<any>(null)
  const [kardex, setKardex] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [guardado, setGuardado] = useState("")

  useEffect(() => { cargar() }, [])

  async function cargar() {
    const res = await fetch("/api/admin?estatus=INSCRITO")
    const data = await res.json()
    if (data.ok) setSolicitudes(data.solicitudes)
  }

  function seleccionar(s: any) {
    setSeleccionada(s)
    setGuardado("")
    const k = s.kardex || {}
    setKardex({
      asistenciaM1: k.asistenciaM1 || "",
      asistenciaM2: k.asistenciaM2 || "",
      asistenciaM3: k.asistenciaM3 || "",
      asistenciaM4: k.asistenciaM4 || "",
      ensayoM1: k.ensayoM1 || "",
      ensayoM2: k.ensayoM2 || "",
      ensayoM3: k.ensayoM3 || "",
      ensayoM4: k.ensayoM4 || "",
      ensayoFinal: k.ensayoFinal || "",
    })
  }

  function validar(campo: string, valor: string, max: number) {
    const num = Number(valor)
    if (valor !== "" && (num < 0 || num > max)) return `Valor debe ser entre 0 y ${max}`
    return null
  }

  function calcular() {
    // Asistencia (20%) - promedio de 4 modulos / 100 * 20
    const asistencias = [kardex.asistenciaM1, kardex.asistenciaM2, kardex.asistenciaM3, kardex.asistenciaM4].filter(v => v !== "").map(Number)
    const promedioAsistencia = asistencias.length > 0 ? asistencias.reduce((a, b) => a + b, 0) / asistencias.length : 0
    const puntajeAsistencia = (promedioAsistencia / 10) * 20

    // Ensayos parciales (30%) - suma de 4 modulos / 4 = promedio / 10 * 30
    const ensayos = [kardex.ensayoM1, kardex.ensayoM2, kardex.ensayoM3, kardex.ensayoM4].filter(v => v !== "").map(Number)
    const promedioEnsayos = ensayos.length > 0 ? ensayos.reduce((a, b) => a + b, 0) / ensayos.length : 0
    const puntajeEnsayos = (promedioEnsayos / 10) * 30

    // Ensayo final (50%) - calificacion / 10 * 50
    const puntajeFinal = kardex.ensayoFinal ? (Number(kardex.ensayoFinal) / 10) * 50 : 0

    const total = puntajeAsistencia + puntajeEnsayos + puntajeFinal
    return { puntajeAsistencia, puntajeEnsayos, puntajeFinal, total, aprobado: total >= 60 }
  }

  async function guardar(accion?: string) {
    setLoading(true)
    const calc = calcular()
    const body = {
      solicitudId: seleccionada.id,
      ...kardex,
      accion: accion || null
    }
    const res = await fetch("/api/admin/kardex", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (data.ok) {
      if (accion === "APROBAR") {
        setGuardado("✅ Aprobado correctamente. Email con constancia enviado al participante.")
      } else if (accion === "NO_APROBAR") {
        setGuardado("❌ Marcado como no aprobado. Email de notificación enviado al participante.")
      } else {
        setGuardado("✅ Calificaciones guardadas correctamente.")
      }
      await cargar()
    }
    setLoading(false)
  }

  const calc = seleccionada ? calcular() : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#6B1F2A] text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">Kardex Académico</h1>
          <p className="text-xs text-red-200">Diplomado CESMECA-UNICACH</p>
        </div>
        <button onClick={() => router.push("/admin")} className="text-sm px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white/10">
          Volver al admin
        </button>
      </div>

      <div className="p-6 grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-sm font-medium text-gray-600 mb-3 uppercase tracking-wider">Participantes inscritos</h2>
          <div className="space-y-2">
            {solicitudes.length === 0 && <p className="text-gray-400 text-sm">No hay participantes inscritos aún</p>}
            {solicitudes.map((s: any) => (
              <div key={s.id} onClick={() => seleccionar(s)}
                className={`bg-white rounded-xl p-4 cursor-pointer border transition-all ${seleccionada?.id === s.id ? "border-[#6B1F2A] shadow-md" : "border-gray-100 hover:border-gray-300"}`}>
                <p className="font-semibold text-gray-900 text-sm">{s.nombre} {s.apellidos}</p>
                <p className="text-xs text-gray-500">{s.folio}</p>
                {s.kardex && (
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.kardex.estatusGeneral === "APROBADO" ? "bg-green-100 text-green-700" : s.kardex.estatusGeneral === "NO_APROBADO" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {s.kardex.estatusGeneral || "EN_CURSO"}
                    </span>
                    {s.kardex.calificacionFinal && <span className="text-xs text-gray-500 ml-2">Cal: {Number(s.kardex.calificacionFinal).toFixed(1)}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          {!seleccionada && (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <p className="text-gray-400">Selecciona un participante para ver su kardex</p>
            </div>
          )}

          {seleccionada && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="font-bold text-[#6B1F2A] text-lg mb-1">{seleccionada.nombre} {seleccionada.apellidos}</h2>
                <p className="text-gray-500 text-sm">{seleccionada.folio} · {seleccionada.institucion}</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Asistencia por módulo (calificación 0-10)</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[1,2,3,4].map(n => (
                    <div key={n}>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Módulo {n}</label>
                      <input type="number" min="0" max="10" step="0.1"
                        value={kardex[`asistenciaM${n}`]}
                        onChange={e => {
                          const v = e.target.value
                          if (v === "" || (Number(v) >= 0 && Number(v) <= 10)) setKardex({...kardex, [`asistenciaM${n}`]: v})
                        }}
                        className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none ${kardex[`asistenciaM${n}`] !== "" && Number(kardex[`asistenciaM${n}`]) > 10 ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#6B1F2A]"}`}
                        placeholder="0-10"/>
                    </div>
                  ))}
                </div>
                {calc && <p className="text-xs text-gray-500 mt-2">Puntaje asistencia: <strong>{calc.puntajeAsistencia.toFixed(1)}/20</strong> {calc.puntajeAsistencia >= 20 ? "✅" : calc.puntajeAsistencia > 0 ? "⚠️" : ""} · Promedio: {((calc.puntajeAsistencia / 20) * 10).toFixed(1)}/10</p>}
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Ensayos parciales (calificación 0-10)</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[1,2,3,4].map(n => (
                    <div key={n}>
                      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Módulo {n}</label>
                      <input type="number" min="0" max="10" step="0.1"
                        value={kardex[`ensayoM${n}`]}
                        onChange={e => {
                          const v = e.target.value
                          if (v === "" || (Number(v) >= 0 && Number(v) <= 10)) setKardex({...kardex, [`ensayoM${n}`]: v})
                        }}
                        className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none ${kardex[`ensayoM${n}`] !== "" && Number(kardex[`ensayoM${n}`]) > 10 ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#6B1F2A]"}`}
                        placeholder="0-10"/>
                    </div>
                  ))}
                </div>
                {calc && <p className="text-xs text-gray-500 mt-2">Puntaje ensayos: <strong>{calc.puntajeEnsayos.toFixed(1)}/30</strong> · Promedio: {((calc.puntajeEnsayos / 30) * 10).toFixed(1)}/10</p>}
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Ensayo final (calificación 0-10)</h3>
                <div className="max-w-xs">
                  <input type="number" min="0" max="10" step="0.1"
                    value={kardex.ensayoFinal}
                    onChange={e => {
                      const v = e.target.value
                      if (v === "" || (Number(v) >= 0 && Number(v) <= 10)) setKardex({...kardex, ensayoFinal: v})
                    }}
                    className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none ${kardex.ensayoFinal !== "" && Number(kardex.ensayoFinal) > 10 ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#6B1F2A]"}`}
                    placeholder="0-10"/>
                </div>
                {calc && <p className="text-xs text-gray-500 mt-2">Puntaje ensayo final: <strong>{calc.puntajeFinal.toFixed(1)}/50</strong></p>}
              </div>

              {calc && (
                <div className={`rounded-xl p-6 border-2 ${calc.aprobado ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Calificación final</p>
                      <p className={`text-4xl font-bold ${calc.aprobado ? "text-green-700" : "text-red-700"}`}>{calc.total.toFixed(1)}<span className="text-lg font-normal text-gray-500">/100</span></p>
                      <p className="text-sm text-gray-500 mt-1">
                        Asistencia: {calc.puntajeAsistencia.toFixed(1)} + Ensayos: {calc.puntajeEnsayos.toFixed(1)} + Final: {calc.puntajeFinal.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${calc.aprobado ? "text-green-700" : "text-red-700"}`}>
                        {calc.aprobado ? "✅ APROBADO" : "❌ NO APROBADO"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Mínimo aprobatorio: 60/100</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => guardar()} disabled={loading} className="flex-1 bg-[#6B1F2A] text-white py-3 rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-50">
                  {loading ? "Guardando..." : "Guardar calificaciones"}
                </button>
                {calc && calc.aprobado && seleccionada.kardex?.estatusGeneral !== "APROBADO" && (
                  <button onClick={() => guardar("APROBAR")} disabled={loading} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-50">
                    Aprobar y enviar constancia
                  </button>
                )}
                {calc && calc.aprobado && seleccionada.kardex?.estatusGeneral === "APROBADO" && (
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="bg-green-100 text-green-700 py-3 rounded-xl text-sm font-medium text-center">✅ Constancia enviada</div>
                    <button onClick={() => guardar("APROBAR")} disabled={loading} className="text-xs text-green-600 hover:underline text-center">Reenviar constancia</button>
                  </div>
                )}
                {calc && !calc.aprobado && calc.total > 0 && seleccionada.kardex?.estatusGeneral !== "NO_APROBADO" && (
                  <button onClick={() => guardar("NO_APROBAR")} disabled={loading} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-50">
                    Marcar como no aprobado
                  </button>
                )}
                {calc && !calc.aprobado && seleccionada.kardex?.estatusGeneral === "NO_APROBADO" && (
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="bg-red-100 text-red-700 py-3 rounded-xl text-sm font-medium text-center">❌ Notificación enviada</div>
                    <button onClick={() => guardar("NO_APROBAR")} disabled={loading} className="text-xs text-red-600 hover:underline text-center">Reenviar notificación</button>
                  </div>
                )}
              </div>
              {guardado && <p className={`text-sm text-center font-medium ${guardado.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>{guardado}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

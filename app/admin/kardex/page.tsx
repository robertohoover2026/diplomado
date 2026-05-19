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

  // Se añade un parámetro opcional para forzar la actualización del participante seleccionado
  async function cargar(idSeleccionadoAActualizar?: string) {
    const res = await fetch("/api/admin?estatus=INSCRITO")
    const data = await res.json()
    if (data.ok) {
      setSolicitudes(data.solicitudes)
      
      // Sincronización: Si acabamos de guardar, actualizamos también los datos de la tarjeta seleccionada
      if (idSeleccionadoAActualizar) {
        const solicitudActualizada = data.solicitudes.find((s: any) => s.id === idSeleccionadoAActualizar)
        if (solicitudActualizada) {
          setSeleccionada(solicitudActualizada)
        }
      }
    }
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
        setGuardado("✅ Aprobado correctamente. Email con constancia enviado.")
      } else if (accion === "NO_APROBAR") {
        setGuardado("❌ Marcado como no aprobado. Email enviado.")
      } else {
        setGuardado("✅ Calificaciones guardadas correctamente.")
      }
      
      // Sincronización: pasamos el ID para que la lista y el panel derecho se sincronicen
      await cargar(seleccionada.id) 
    }
    setLoading(false)
  }

  const calc = seleccionada ? calcular() : null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="bg-[#6B1F2A] text-white px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div>
          <h1 className="font-bold text-lg">Kardex Académico</h1>
          <p className="text-xs text-red-200">Diplomado CESMECA-UNICACH</p>
        </div>
        <button onClick={() => router.push("/admin")} className="text-sm px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white/10 transition-colors">
          Volver al admin
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 h-[calc(100vh-76px)]">
        
        {/* PANEL IZQUIERDO: LISTA (Mejorado UX/UI) */}
        <div className="col-span-1 flex flex-col bg-gray-50 h-full border-r border-gray-200 pr-4">
          <h2 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest shrink-0">Participantes inscritos</h2>
          
          <div className="space-y-4 overflow-y-auto pr-2 pb-6 custom-scrollbar h-full">
            {solicitudes.length === 0 && <p className="text-gray-400 text-sm italic">No hay participantes inscritos aún</p>}
            
            {solicitudes.map((s: any) => (
              <div 
                key={s.id} 
                onClick={() => seleccionar(s)}
                className={`bg-white rounded-xl p-5 cursor-pointer border shadow-sm transition-all duration-200 hover:-translate-y-1 ${
                  seleccionada?.id === s.id 
                    ? "border-[#6B1F2A] ring-1 ring-[#6B1F2A] shadow-md" 
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col gap-1.5">
                  <p className="font-bold text-gray-900 text-[15px] leading-tight">{s.nombre} {s.apellidos}</p>
                  <p className="text-xs text-gray-500 font-mono bg-gray-100 self-start px-2 py-0.5 rounded">{s.folio}</p>
                  
                  {s.kardex && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className={`text-[11px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide ${
                        s.kardex.estatusGeneral === "APROBADO" ? "bg-green-100 text-green-800" : 
                        s.kardex.estatusGeneral === "NO_APROBADO" ? "bg-red-100 text-red-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {s.kardex.estatusGeneral || "EN CURSO"}
                      </span>
                      {s.kardex.calificacionFinal && (
                        <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          Cal: {Number(s.kardex.calificacionFinal).toFixed(1)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO: DETALLE Y FORMULARIO */}
        <div className="col-span-1 md:col-span-2 overflow-y-auto h-full pb-10 pl-2 custom-scrollbar">
          {!seleccionada && (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm flex flex-col items-center justify-center h-[50vh]">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-500 font-medium">Selecciona un participante de la lista para gestionar su kardex</p>
            </div>
          )}

          {seleccionada && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Cabecera del participante */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#6B1F2A] text-xl mb-1">{seleccionada.nombre} {seleccionada.apellidos}</h2>
                  <p className="text-gray-500 text-sm font-medium">{seleccionada.folio} · {seleccionada.institucion}</p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <p>{seleccionada.email}</p>
                </div>
              </div>

              {/* Bloque: Asistencia */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-5 border-b pb-2">Asistencia por módulo <span className="font-normal text-gray-400 text-sm ml-2">(Calificación 0-10)</span></h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1,2,3,4].map(n => (
                    <div key={n} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Módulo {n}</label>
                      <input type="number" min="0" max="10" step="0.1"
                        value={kardex[`asistenciaM${n}`]}
                        onChange={e => {
                          const v = e.target.value
                          if (v === "" || (Number(v) >= 0 && Number(v) <= 10)) setKardex({...kardex, [`asistenciaM${n}`]: v})
                        }}
                        className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 ${kardex[`asistenciaM${n}`] !== "" && Number(kardex[`asistenciaM${n}`]) > 10 ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-[#6B1F2A] focus:ring-[#6B1F2A]/20"}`}
                        placeholder="0.0"/>
                    </div>
                  ))}
                </div>
                {calc && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm border border-gray-100">
                    <span className="text-gray-600">Promedio general: <strong className="text-gray-900">{((calc.puntajeAsistencia / 20) * 10).toFixed(1)}</strong>/10</span>
                    <span className="text-gray-600">Puntaje ponderado: <strong className="text-gray-900">{calc.puntajeAsistencia.toFixed(1)}</strong>/20 {calc.puntajeAsistencia >= 20 ? "✅" : ""}</span>
                  </div>
                )}
              </div>

              {/* Bloque: Ensayos Parciales */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-5 border-b pb-2">Ensayos parciales <span className="font-normal text-gray-400 text-sm ml-2">(Calificación 0-10)</span></h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1,2,3,4].map(n => (
                    <div key={n} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Módulo {n}</label>
                      <input type="number" min="0" max="10" step="0.1"
                        value={kardex[`ensayoM${n}`]}
                        onChange={e => {
                          const v = e.target.value
                          if (v === "" || (Number(v) >= 0 && Number(v) <= 10)) setKardex({...kardex, [`ensayoM${n}`]: v})
                        }}
                        className={`w-full border rounded-md px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 ${kardex[`ensayoM${n}`] !== "" && Number(kardex[`ensayoM${n}`]) > 10 ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-[#6B1F2A] focus:ring-[#6B1F2A]/20"}`}
                        placeholder="0.0"/>
                    </div>
                  ))}
                </div>
                {calc && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm border border-gray-100">
                    <span className="text-gray-600">Promedio general: <strong className="text-gray-900">{((calc.puntajeEnsayos / 30) * 10).toFixed(1)}</strong>/10</span>
                    <span className="text-gray-600">Puntaje ponderado: <strong className="text-gray-900">{calc.puntajeEnsayos.toFixed(1)}</strong>/30</span>
                  </div>
                )}
              </div>

              {/* Bloque: Ensayo Final */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-5 border-b pb-2">Ensayo final <span className="font-normal text-gray-400 text-sm ml-2">(Calificación 0-10)</span></h3>
                <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="w-1/3">
                    <input type="number" min="0" max="10" step="0.1"
                      value={kardex.ensayoFinal}
                      onChange={e => {
                        const v = e.target.value
                        if (v === "" || (Number(v) >= 0 && Number(v) <= 10)) setKardex({...kardex, ensayoFinal: v})
                      }}
                      className={`w-full border rounded-md px-4 py-3 text-lg font-bold text-gray-900 text-center focus:outline-none focus:ring-2 ${kardex.ensayoFinal !== "" && Number(kardex.ensayoFinal) > 10 ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:border-[#6B1F2A] focus:ring-[#6B1F2A]/20"}`}
                      placeholder="0.0"/>
                  </div>
                  {calc && (
                    <div className="w-2/3">
                      <p className="text-sm text-gray-600">Puntaje ponderado: <strong className="text-xl text-gray-900">{calc.puntajeFinal.toFixed(1)}</strong><span className="text-gray-500">/50</span></p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resultado Final */}
              {calc && (
                <div className={`rounded-xl p-8 border-2 shadow-sm ${calc.aprobado ? "bg-green-50 border-green-300" : "bg-red-50 border-red-200"}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Calificación final</p>
                      <p className={`text-5xl font-black ${calc.aprobado ? "text-green-800" : "text-red-800"}`}>{calc.total.toFixed(1)}<span className="text-2xl font-medium text-opacity-50">/100</span></p>
                      <p className="text-sm text-gray-600 mt-2 font-medium">
                        Asistencia: {calc.puntajeAsistencia.toFixed(1)} + Ensayos: {calc.puntajeEnsayos.toFixed(1)} + Final: {calc.puntajeFinal.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-black tracking-tight ${calc.aprobado ? "text-green-700" : "text-red-700"}`}>
                        {calc.aprobado ? "✅ APROBADO" : "❌ NO APROBADO"}
                      </p>
                      <p className="text-sm font-medium text-gray-500 mt-2">Mínimo aprobatorio: 60/100</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-4 pt-2">
                <button onClick={() => guardar()} disabled={loading} className="flex-1 bg-[#6B1F2A] text-white py-4 rounded-xl font-bold text-[15px] shadow-sm hover:bg-[#521620] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Guardando..." : "Guardar calificaciones"}
                </button>
                
                {calc && calc.aprobado && seleccionada.kardex?.estatusGeneral !== "APROBADO" && (
                  <button onClick={() => guardar("APROBAR")} disabled={loading} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-[15px] shadow-sm hover:bg-green-700 hover:shadow-md transition-all disabled:opacity-50">
                    Aprobar y enviar constancia
                  </button>
                )}
                
                {calc && calc.aprobado && seleccionada.kardex?.estatusGeneral === "APROBADO" && (
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="bg-green-100 border border-green-200 text-green-800 py-3 rounded-xl text-[15px] font-bold text-center shadow-sm">✅ Constancia oficial enviada</div>
                    <button onClick={() => guardar("APROBAR")} disabled={loading} className="text-xs font-medium text-green-700 hover:text-green-900 mt-2 text-center underline decoration-green-300">Reenviar constancia</button>
                  </div>
                )}
                
                {calc && !calc.aprobado && calc.total > 0 && seleccionada.kardex?.estatusGeneral !== "NO_APROBADO" && (
                  <button onClick={() => guardar("NO_APROBAR")} disabled={loading} className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold text-[15px] shadow-sm hover:bg-red-700 hover:shadow-md transition-all disabled:opacity-50">
                    Marcar como no aprobado
                  </button>
                )}
                
                {calc && !calc.aprobado && seleccionada.kardex?.estatusGeneral === "NO_APROBADO" && (
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="bg-red-100 border border-red-200 text-red-800 py-3 rounded-xl text-[15px] font-bold text-center shadow-sm">❌ Notificación de no aprobación enviada</div>
                    <button onClick={() => guardar("NO_APROBAR")} disabled={loading} className="text-xs font-medium text-red-700 hover:text-red-900 mt-2 text-center underline decoration-red-300">Reenviar notificación</button>
                  </div>
                )}
              </div>
              
              {guardado && (
                <div className={`p-4 rounded-lg text-center font-bold text-[15px] ${guardado.startsWith("❌") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                  {guardado}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Estilos para ocultar la barra de scroll y que se vea más limpio */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.3); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); }
      `}} />
    </div>
  )
}

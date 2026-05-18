"use client"
import { useState, useEffect } from "react"

const ESTADOS = ["TODOS","PENDIENTE","EN_REVISION","ACEPTADO","RECHAZADO","PAGO_ENVIADO","PAGO_REVISION","INSCRITO"]

const colorEstatus: Record<string, string> = {
  INSCRITO: "bg-green-100 text-green-700",
  RECHAZADO: "bg-red-100 text-red-700",
  ACEPTADO: "bg-blue-100 text-blue-700",
  PAGO_ENVIADO: "bg-purple-100 text-purple-700",
  PAGO_REVISION: "bg-orange-100 text-orange-700",
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  EN_REVISION: "bg-gray-100 text-gray-700",
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState("")
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [filtro, setFiltro] = useState("TODOS")
  const [seleccionada, setSeleccionada] = useState<any>(null)
  const [notas, setNotas] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmacion, setConfirmacion] = useState<{mensaje: string, onAceptar: () => void} | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("admin_auth")
    const timestamp = localStorage.getItem("admin_auth_time")
    if (saved === "true" && timestamp) {
      const elapsed = Date.now() - Number(timestamp)
      if (elapsed < 30 * 60 * 1000) setAuth(true)
      else { localStorage.removeItem("admin_auth"); localStorage.removeItem("admin_auth_time") }
    }
  }, [])

  useEffect(() => { if (auth) cargar() }, [filtro, auth])

  async function cargar() {
    const estatus = filtro === "TODOS" ? "" : filtro
    const res = await fetch(`/api/admin?estatus=${estatus}`)
    const data = await res.json()
    if (data.ok) setSolicitudes(data.solicitudes)
  }

  function login() {
    if (password === "admin2026") {
      setAuth(true)
      localStorage.setItem("admin_auth", "true")
      localStorage.setItem("admin_auth_time", String(Date.now()))
    } else {
      setConfirmacion({ mensaje: "Contraseña incorrecta.", onAceptar: () => setConfirmacion(null) })
    }
  }

  async function accion(id: number, accionStr: string) {
    setLoading(true)
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, accion: accionStr, notasComite: notas })
    })
    setSeleccionada(null)
    setNotas("")
    await cargar()
    setLoading(false)
  }

  function confirmarEliminar(id: number) {
    setConfirmacion({
      mensaje: "¿Estás seguro de eliminar este registro? Se borrarán todos sus archivos.",
      onAceptar: async () => {
        setConfirmacion(null)
        setLoading(true)
        await fetch(`/api/admin?id=${id}`, { method: "DELETE" })
        setSeleccionada(null)
        await cargar()
        setLoading(false)
      }
    })
  }

  if (!auth) return (
    <div className="min-h-screen bg-[#6B1F2A] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#6B1F2A] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#6B1F2A]">Panel Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Diplomado CESMECA · UNICACH</p>
        </div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 mb-4 focus:outline-none focus:border-[#6B1F2A]"
          placeholder="Contraseña"/>
        <button onClick={login} className="w-full bg-[#6B1F2A] text-white py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
          Ingresar
        </button>
      </div>
      {confirmacion && <Modal confirmacion={confirmacion} />}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#6B1F2A] text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-bold text-lg leading-tight">Panel de Administración</h1>
            <p className="text-red-200 text-xs mt-0.5">Diplomado en Estudio y Formación Política · CESMECA-UNICACH</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href="/admin" className="text-sm px-4 py-2 rounded-lg bg-white text-[#6B1F2A] font-medium">Solicitudes</a>
            <a href="/admin/kardex" className="text-sm px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white/10">Kardex</a>
            <a href="/admin/docentes" className="text-sm px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white/10">Docentes</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Filtros */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {ESTADOS.map(e => (
            <button key={e} onClick={() => setFiltro(e)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filtro === e ? "bg-[#6B1F2A] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[#6B1F2A]"}`}>
              {e.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Contador */}
        <p className="text-xs text-gray-500 mb-3">{solicitudes.length} registro{solicitudes.length !== 1 ? "s" : ""}</p>

        {/* Tabla desktop */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Folio</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Correo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">País</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estatus</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {solicitudes.map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#6B1F2A] font-semibold">{s.folio}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.nombre} {s.apellidos}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.correo}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.pais}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorEstatus[s.estatus] || "bg-gray-100 text-gray-700"}`}>
                      {s.estatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.creadoEn).toLocaleDateString("es-MX")}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setSeleccionada(s); setNotas(s.notasComite || "") }}
                      className="text-xs bg-[#6B1F2A] text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                      Ver expediente
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {solicitudes.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">No hay solicitudes con este filtro</div>
          )}
        </div>

        {/* Cards móvil */}
        <div className="md:hidden space-y-3">
          {solicitudes.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm bg-white rounded-xl">No hay solicitudes con este filtro</div>
          )}
          {solicitudes.map((s: any) => (
            <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{s.nombre} {s.apellidos}</p>
                  <p className="font-mono text-xs text-[#6B1F2A] mt-0.5">{s.folio}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorEstatus[s.estatus] || "bg-gray-100 text-gray-700"}`}>
                  {s.estatus.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{s.correo}</p>
              <p className="text-xs text-gray-400 mb-3">{s.pais} · {new Date(s.creadoEn).toLocaleDateString("es-MX")}</p>
              <button onClick={() => { setSeleccionada(s); setNotas(s.notasComite || "") }}
                className="w-full text-xs bg-[#6B1F2A] text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium">
                Ver expediente
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal expediente */}
      {seleccionada && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="bg-[#6B1F2A] text-white p-5 rounded-t-2xl sm:rounded-t-xl flex justify-between items-start sticky top-0">
              <div>
                <h2 className="font-bold text-base leading-tight">{seleccionada.nombre} {seleccionada.apellidos}</h2>
                <p className="text-red-200 text-xs mt-0.5">{seleccionada.folio}</p>
              </div>
              <button onClick={() => setSeleccionada(null)} className="text-white/70 hover:text-white text-2xl leading-none ml-4">×</button>
            </div>

            <div className="p-5 space-y-5">
              {/* Estatus badge */}
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${colorEstatus[seleccionada.estatus] || "bg-gray-100 text-gray-700"}`}>
                  {seleccionada.estatus.replace("_", " ")}
                </span>
                <span className="text-xs text-gray-400">{new Date(seleccionada.creadoEn).toLocaleDateString("es-MX", {day:"2-digit",month:"long",year:"numeric"})}</span>
              </div>

              {/* Datos personales */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Datos personales</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    ["CURP", seleccionada.curp],
                    ["Correo", seleccionada.correo],
                    ["Teléfono", seleccionada.telefono],
                    ["País", seleccionada.pais],
                    ["Nivel académico", seleccionada.nivelAcademico],
                    ["Perfil / Ocupación", seleccionada.perfil],
                    ["Institución", seleccionada.institucion],
                    ["Nacionalidad", seleccionada.nacionalidad],
                  ].map(([label, val]) => val ? (
                    <div key={label} className="bg-gray-50 rounded-lg px-3 py-2.5">
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-gray-900 break-all">{val}</p>
                    </div>
                  ) : null)}
                </div>
              </div>

              {/* Documentos */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Documentos</p>
                <div className="space-y-2">
                  {seleccionada.urlCV && (
                    <a href={`/api/uploads/${seleccionada.urlCV?.split("/").pop()}`} target="_blank"
                      className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
                      <span className="text-2xl">📄</span>
                      <div><p className="text-sm font-medium text-[#6B1F2A]">Currículum Vitae</p><p className="text-xs text-gray-400">Abrir PDF</p></div>
                    </a>
                  )}
                  {seleccionada.urlIdentificacion && (
                    <a href={`/api/uploads/${seleccionada.urlIdentificacion?.split("/").pop()}`} target="_blank"
                      className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
                      <span className="text-2xl">🪪</span>
                      <div><p className="text-sm font-medium text-[#6B1F2A]">Identificación oficial</p><p className="text-xs text-gray-400">Abrir archivo</p></div>
                    </a>
                  )}
                  {seleccionada.urlCartaMotivos && (
                    <a href={`/api/uploads/${seleccionada.urlCartaMotivos?.split("/").pop()}`} target="_blank"
                      className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors">
                      <span className="text-2xl">✉️</span>
                      <div><p className="text-sm font-medium text-[#6B1F2A]">Carta de motivos</p><p className="text-xs text-gray-400">Abrir PDF</p></div>
                    </a>
                  )}
                  {seleccionada.urlVoucher && (
                    <a href={`/api/uploads/${seleccionada.urlVoucher?.split("/").pop()}`} target="_blank"
                      className="flex items-center gap-3 bg-amber-50 hover:bg-amber-100 rounded-lg px-4 py-3 transition-colors">
                      <span className="text-2xl">💳</span>
                      <div><p className="text-sm font-medium text-[#C8973A]">Comprobante de pago</p><p className="text-xs text-gray-400">Abrir archivo</p></div>
                    </a>
                  )}
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notas del comité</label>
                <textarea value={notas} onChange={e => setNotas(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A] h-24 resize-none"
                  placeholder="Agregar comentarios internos..."/>
              </div>

              {/* Acciones */}
              <div className="border-t pt-4 space-y-2">
                {seleccionada.estatus === "PENDIENTE" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => accion(seleccionada.id, "ACEPTAR")} disabled={loading}
                      className="bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                      ✓ Aceptar solicitud
                    </button>
                    <button onClick={() => accion(seleccionada.id, "RECHAZAR")} disabled={loading}
                      className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                      ✗ Rechazar solicitud
                    </button>
                  </div>
                )}
                {seleccionada.estatus === "PAGO_ENVIADO" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => accion(seleccionada.id, "CONFIRMAR_PAGO")} disabled={loading}
                      className="bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                      ✓ Confirmar e inscribir
                    </button>
                    <button onClick={() => accion(seleccionada.id, "RECHAZAR_PAGO")} disabled={loading}
                      className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                      ✗ Rechazar comprobante
                    </button>
                  </div>
                )}
                <button onClick={() => confirmarEliminar(seleccionada.id)} disabled={loading}
                  className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                  Eliminar registro permanentemente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmacion && <Modal confirmacion={confirmacion} />}
    </div>
  )
}

function Modal({ confirmacion }: { confirmacion: { mensaje: string; onAceptar: () => void } }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <p className="text-gray-800 text-sm mb-6 text-center">{confirmacion.mensaje}</p>
        <div className="flex gap-3">
          <button onClick={() => confirmacion.onAceptar()} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={confirmacion.onAceptar} className="flex-1 bg-[#6B1F2A] text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90">Aceptar</button>
        </div>
      </div>
    </div>
  )
}

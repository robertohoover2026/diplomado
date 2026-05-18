"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DocentesPage() {
  const router = useRouter()
  const [docentes, setDocentes] = useState<any[]>([])
  const [editando, setEditando] = useState<any>(null)
  const [nuevo, setNuevo] = useState(false)
  const [form, setForm] = useState({ nombre: "", institucion: "", cargo: "", url: "", esCoordinador: false, orden: 0, activo: true })
  const [loading, setLoading] = useState(false)
  const [confirmacion, setConfirmacion] = useState<{mensaje: string, onAceptar: () => void} | null>(null)

  useEffect(() => { cargar() }, [])

  async function cargar() {
    const res = await fetch("/api/admin/docentes")
    const data = await res.json()
    if (data.ok) setDocentes(data.docentes)
  }

  function abrirEditar(d: any) {
    setEditando(d)
    setForm({ nombre: d.nombre, institucion: d.institucion, cargo: d.cargo || "", url: d.url || "", esCoordinador: d.es_coordinador, orden: d.orden, activo: d.activo })
    setNuevo(false)
  }

  function abrirNuevo() {
    setEditando(null)
    setForm({ nombre: "", institucion: "", cargo: "", url: "", esCoordinador: false, orden: docentes.length + 1, activo: true })
    setNuevo(true)
  }

  async function guardar() {
    setLoading(true)
    if (nuevo) {
      await fetch("/api/admin/docentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
    } else {
      await fetch("/api/admin/docentes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, id: editando.id })
      })
    }
    setEditando(null)
    setNuevo(false)
    await cargar()
    setLoading(false)
  }

  function confirmarEliminar(id: number) {
    setConfirmacion({
      mensaje: "Estas seguro de eliminar este docente?",
      onAceptar: async () => {
        setConfirmacion(null)
        await fetch(`/api/admin/docentes?id=${id}`, { method: "DELETE" })
        await cargar()
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#6B1F2A] text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">Gestion de Docentes</h1>
          <p className="text-xs text-red-200">Diplomado CESMECA-UNICACH</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push("/admin")} className="text-sm px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white/10">Volver al admin</button>
          <button onClick={abrirNuevo} className="text-sm px-4 py-2 rounded-lg bg-white text-[#6B1F2A] font-medium">+ Agregar docente</button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Orden</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Institución</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Cargo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {docentes.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{d.orden}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {d.es_coordinador && <span className="text-xs bg-[#C8973A] text-white px-2 py-0.5 rounded-full mr-2">Coord.</span>}
                    {d.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{d.institucion}</td>
                  <td className="px-4 py-3 text-gray-600">{d.cargo}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {d.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => abrirEditar(d)} className="text-xs bg-[#6B1F2A] text-white px-3 py-1.5 rounded-lg hover:opacity-90">Editar</button>
                    <button onClick={() => confirmarEliminar(d.id)} className="text-xs bg-gray-700 text-white px-3 py-1.5 rounded-lg hover:opacity-90">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editando || nuevo) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="font-bold text-[#6B1F2A] text-lg">{nuevo ? "Agregar docente" : "Editar docente"}</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase mb-1">Nombre completo *</label>
              <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase mb-1">Institución *</label>
              <input value={form.institucion} onChange={e => setForm({...form, institucion: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase mb-1">Cargo</label>
              <input value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase mb-1">URL perfil académico</label>
              <input value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]" placeholder="https://..."/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase mb-1">Orden</label>
                <input type="number" value={form.orden} onChange={e => setForm({...form, orden: Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#6B1F2A]"/>
              </div>
              <div className="flex flex-col gap-2 pt-5">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.esCoordinador} onChange={e => setForm({...form, esCoordinador: e.target.checked})} className="w-4 h-4 accent-[#6B1F2A]"/>
                  Es coordinador
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.activo} onChange={e => setForm({...form, activo: e.target.checked})} className="w-4 h-4 accent-[#6B1F2A]"/>
                  Activo en página
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setEditando(null); setNuevo(false) }} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium">Cancelar</button>
              <button onClick={guardar} disabled={loading || !form.nombre || !form.institucion} className="flex-1 bg-[#6B1F2A] text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50">
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmacion && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <p className="text-gray-800 text-sm mb-6 text-center">{confirmacion.mensaje}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmacion(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium">Cancelar</button>
              <button onClick={confirmacion.onAceptar} className="flex-1 bg-[#6B1F2A] text-white py-2.5 rounded-lg text-sm font-medium">Aceptar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

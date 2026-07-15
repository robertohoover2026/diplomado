"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [user, setUser] = useState("")
  const [pwd, setPwd] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pwd })
    })

    if (res.ok) {
      router.push("/admin")
      router.refresh()
    } else {
      setError("Usuario o contraseña incorrectos")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#6B1F2A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl">🔒</div>
          <h1 className="text-2xl font-bold text-[#6B1F2A]">Acceso Seguro</h1>
          <p className="text-sm text-gray-500 mt-1">Panel de Administración CESMECA</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-5 text-center font-bold border border-red-200">
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Usuario</label>
            <input type="text" required value={user} onChange={e=>setUser(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#6B1F2A] focus:ring-1 focus:ring-[#6B1F2A] transition-all"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Contraseña</label>
            <input type="password" required value={pwd} onChange={e=>setPwd(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#6B1F2A] focus:ring-1 focus:ring-[#6B1F2A] transition-all"/>
          </div>
          <button type="submit" disabled={loading} 
            className="w-full bg-[#6B1F2A] text-white py-3.5 rounded-lg text-[15px] font-bold hover:bg-[#521620] transition-colors mt-2 shadow-sm disabled:opacity-70">
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </div>
      </form>
    </div>
  )
}

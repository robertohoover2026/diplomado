"use client"
import { useState, useEffect } from "react"

export default function DocentesSection() {
  const [docentes, setDocentes] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/docentes")
      .then(r => r.json())
      .then(d => { if (d.ok) setDocentes(d.docentes) })
  }, [])

  return (
    // Se elimina el estilo en línea conflictivo y se confía en las clases del layout global
    <div className="w-full">
      
      {/* CUADRÍCULA RESPONSIVA DE TAILWIND */}
      {/* Móvil: 1 columna | Tablet: 2 columnas | PC: 4 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {docentes.map((d: any) => (
          <div key={d.id} style={{
            border: d.es_coordinador ? "2px solid #C8973A" : "1px solid rgba(107,31,42,0.15)",
            borderRadius: "8px", padding: "1.8rem 1.5rem",
            background: d.es_coordinador ? "#fff" : "#FAF6EF",
            transition: "transform .2s, box-shadow .2s"
          }} className="hover:-translate-y-1 hover:shadow-lg">
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: d.es_coordinador ? "#C8973A" : "#6B1F2A",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Playfair Display, serif", fontSize: "1.2rem", fontWeight: 700,
              marginBottom: "1rem"
            }}>
              {d.nombre.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
            </div>
            {d.es_coordinador && (
              <span style={{fontSize: "0.7rem", background: "#C8973A", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "20px", display: "inline-block", marginBottom: "0.6rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase"}}>
                Coordinador académico
              </span>
            )}
            <div style={{fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: 700, color: "#6B1F2A", marginBottom: "0.3rem", lineHeight: 1.3}}>{d.nombre}</div>
            <div style={{fontSize: "0.75rem", color: "#C8973A", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.8rem"}}>{d.institucion}</div>
            {d.url && (
              <a href={d.url} target="_blank" rel="noopener noreferrer" style={{fontSize: "0.8rem", color: "#7A6558", textDecoration: "none"}} className="hover:text-[#C8973A] transition-colors">
                ↗ Ver perfil académico
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

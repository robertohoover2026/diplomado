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
    <section className="docentes" id="docentes" style={{background: "#fff", padding: "7rem 8vw"}}>
      <div className="reveal">
        <div className="section-label" style={{fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C8973A", fontWeight: 500, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.6rem"}}>
          <span style={{display: "block", width: "24px", height: "1px", background: "#C8973A"}}></span>
          Quiénes enseñan
        </div>
        <h2 style={{fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, color: "#6B1F2A", lineHeight: 1.15, marginBottom: "1.5rem"}}>Equipo docente</h2>
        <p style={{fontSize: "1rem", color: "#7A6558", maxWidth: "680px", lineHeight: 1.8, marginBottom: "3rem"}}>Investigadores y académicos de instituciones nacionales de alto nivel, especializados en ciencia política, derecho, sociología y administración pública.</p>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem"}}>
        {docentes.map((d: any) => (
          <div key={d.id} style={{
            border: d.es_coordinador ? "2px solid #C8973A" : "1px solid rgba(107,31,42,0.15)",
            borderRadius: "8px", padding: "1.8rem 1.5rem",
            background: d.es_coordinador ? "#fff" : "#FAF6EF",
            transition: "transform .2s, box-shadow .2s"
          }}>
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
            <div style={{fontFamily: "Playfair Display, serif", fontSize: "1rem", fontWeight: 700, color: "#6B1F2A", marginBottom: "0.3rem", lineHeight: 1.3}}>{d.nombre}</div>
            <div style={{fontSize: "0.75rem", color: "#C8973A", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.8rem"}}>{d.institucion}</div>
            {d.url && <a href={d.url} target="_blank" style={{fontSize: "0.8rem", color: "#7A6558", textDecoration: "none"}}>↗ Ver perfil académico</a>}
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) {
          #docentes > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

"use client"
import { useState } from "react"
import Link from "next/link"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  // Función para cerrar el menú al hacer clic en un enlace (muy útil en móviles)
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="nav-container">
      <div className="nav-logo">CESMECA · UNICACH</div>
      
      {/* Botón de Hamburguesa (Solo visible en móviles) */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Alternar menú"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Enlaces de Navegación */}
      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li><a href="#sobre" onClick={closeMenu}>Sobre el diplomado</a></li>
        <li><a href="#modulos" onClick={closeMenu}>Módulos</a></li>
        <li><a href="#calendario" onClick={closeMenu}>Calendario</a></li>
        <li><a href="#docentes" onClick={closeMenu}>Docentes</a></li>
        <li><a href="#proceso" onClick={closeMenu}>Proceso</a></li>
        <li><Link href="/mi-solicitud" onClick={closeMenu}>Mi solicitud</Link></li>
        <li><Link href="/registro" className="nav-cta" onClick={closeMenu}>Pre-registro</Link></li>
      </ul>
    </nav>
  )
}

import DocentesSection from "../components/DocentesSection"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; background: #FAF6EF; }

        .landing-body { font-family: "DM Sans", sans-serif; color: #1A1210; padding-top: 64px; }

        nav.nav-container {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5vw; width: 100%; position: fixed; top: 0; left: 0; right: 0;
          height: 64px; z-index: 1000; background: rgba(250,246,239,0.97);
          backdrop-filter: blur(12px); border-bottom: 1px solid rgba(107,31,42,0.15);
          box-sizing: border-box;
        }
        .nav-logo { font-family: "Playfair Display", serif; color: #6B1F2A; font-weight: 700; font-size: 1rem; text-decoration: none; }
        .nav-links { display: flex; align-items: center; list-style: none; gap: 2rem; }
        .nav-links a { text-decoration: none; color: #3D2B1F; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; transition: color .2s; }
        .nav-links a:hover { color: #6B1F2A; }
        .nav-cta { background: #6B1F2A !important; color: #fff !important; padding: 0.45rem 1.2rem; border-radius: 4px; }
        .nav-cta:hover { background: #3D2B1F !important; }

        .hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
        .hero-left { display: flex; flex-direction: column; justify-content: center; padding: 8vw 5vw 8vw 8vw; background: #FAF6EF; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #C8973A; margin-bottom: 1.5rem; }
        .hero-eyebrow::before { content: ""; display: block; width: 32px; height: 1px; background: #C8973A; }
        .hero h1 { font-family: "Playfair Display", serif; font-size: clamp(2.8rem, 5vw, 4.2rem); font-weight: 900; line-height: 1.08; color: #6B1F2A; margin-bottom: 1.5rem; }
        .hero h1 em { font-style: italic; color: #C8973A; }
        .hero-sub { font-size: 1.05rem; color: #7A6558; max-width: 480px; margin-bottom: 2.5rem; line-height: 1.75; }
        .hero-meta { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2.5rem; }
        .meta-pill { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 500; color: #3D2B1F; }
        .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary { display: inline-block; background: #6B1F2A; color: #fff; padding: 1rem 2rem; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: background .2s; }
        .btn-primary:hover { background: #3D2B1F; }
        .btn-ghost { display: inline-block; border: 1.5px solid #6B1F2A; color: #6B1F2A; padding: 0.95rem 1.8rem; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: all .2s; }
        .btn-ghost:hover { background: #6B1F2A; color: #fff; }

        .hero-right { background: #6B1F2A; background-image: repeating-linear-gradient(45deg, rgba(200,151,58,0.08) 0, rgba(200,151,58,0.08) 1px, transparent 0, transparent 50%); background-size: 24px 24px; display: flex; align-items: center; justify-content: center; }
        .hero-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(200,151,58,0.3); border-radius: 8px; padding: 3rem 2.5rem; width: min(380px, 85%); backdrop-filter: blur(4px); }
        .hero-card-title { font-family: "Playfair Display", serif; font-size: 1.1rem; color: #C8973A; margin-bottom: 1.5rem; font-weight: 700; }
        .stat-row { display: flex; flex-direction: column; gap: 1.2rem; }
        .stat-item { border-bottom: 1px solid rgba(200,151,58,0.2); padding-bottom: 1.2rem; }
        .stat-item:last-child { border-bottom: none; padding-bottom: 0; }
        .stat-num { font-family: "Playfair Display", serif; font-size: 2.2rem; font-weight: 900; color: #fff; line-height: 1; }
        .stat-label { font-size: 0.82rem; color: rgba(255,255,255,0.55); margin-top: 0.2rem; letter-spacing: 0.06em; text-transform: uppercase; }
        .stat-sub { font-size: 0.88rem; color: rgba(255,255,255,0.75); margin-top: 0.4rem; }

        section { padding: 7rem 8vw; }
        .section-label { font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase; color: #C8973A; font-weight: 500; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.6rem; }
        .section-label::before { content: ""; display: block; width: 24px; height: 1px; background: #C8973A; }
        .section-title { font-family: "Playfair Display", serif; font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 900; color: #6B1F2A; line-height: 1.15; margin-bottom: 1.5rem; }
        .section-body { font-size: 1rem; color: #7A6558; max-width: 680px; line-height: 1.8; }

        .about { background: #fff; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
        .about-list { margin-top: 2rem; list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .about-list li { display: flex; gap: 1rem; align-items: flex-start; font-size: 0.95rem; color: #3D2B1F; }
        .about-list li::before { content: ""; flex-shrink: 0; width: 6px; height: 6px; border-radius: 50%; background: #C8973A; margin-top: 0.6rem; }
        .about-right { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .about-block { background: #FAF6EF; border: 1px solid rgba(107,31,42,0.15); border-radius: 6px; padding: 1.8rem 1.5rem; }
        .about-block-icon { font-size: 1.5rem; margin-bottom: 0.8rem; }
        .about-block h4 { font-family: "Playfair Display", serif; font-size: 1rem; color: #6B1F2A; margin-bottom: 0.5rem; }
        .about-block p { font-size: 0.85rem; color: #7A6558; line-height: 1.6; }

        .modules { background: #FAF6EF; }
        .modules-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-top: 3rem; }
        .module-card { border: 1px solid rgba(107,31,42,0.15); border-radius: 8px; overflow: hidden; background: #fff; }
        .module-header { background: #6B1F2A; padding: 1.8rem 2rem; display: flex; justify-content: space-between; align-items: flex-start; }
        .module-num { font-family: "Playfair Display", serif; font-size: 3rem; font-weight: 900; color: rgba(255,255,255,0.15); line-height: 1; }
        .module-hrs { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: #C8973A; font-weight: 500; background: rgba(200,151,58,0.15); border: 1px solid rgba(200,151,58,0.35); padding: 0.3rem 0.8rem; border-radius: 20px; }
        .module-title { font-family: "Playfair Display", serif; font-size: 1.4rem; font-weight: 700; color: #fff; margin-top: 0.5rem; line-height: 1.3; }
        .module-body { padding: 1.8rem 2rem; }
        .module-desc { font-size: 0.88rem; color: #7A6558; margin-bottom: 1.2rem; line-height: 1.65; }
        .module-units { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
        .module-units li { display: flex; align-items: flex-start; gap: 0.7rem; font-size: 0.85rem; color: #3D2B1F; }
        .unit-dot { flex-shrink: 0; width: 5px; height: 5px; border-radius: 50%; background: #C8973A; margin-top: 0.6rem; }

        .calendar-sec { background: #6B1F2A; }
        .calendar-sec .section-title { color: #fff; }
        .calendar-sec .section-label { color: #C8973A; }
        .calendar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 3rem; background: rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; }
        .cal-cell { background: rgba(255,255,255,0.04); padding: 2rem 1.5rem; }
        .cal-period { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: #C8973A; font-weight: 500; margin-bottom: 0.6rem; }
        .cal-date { font-family: "Playfair Display", serif; font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
        .cal-desc { font-size: 0.82rem; color: rgba(255,255,255,0.55); line-height: 1.5; }

        .eval { background: #fff; }
        .eval-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 5rem; align-items: start; margin-top: 3rem; }
        .eval-bars { display: flex; flex-direction: column; gap: 1.8rem; }
        .eval-bar-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.6rem; }
        .eval-bar-label { font-size: 0.9rem; font-weight: 500; color: #3D2B1F; }
        .eval-bar-pct { font-family: "Playfair Display", serif; font-size: 1.3rem; font-weight: 900; color: #6B1F2A; }
        .eval-bar-track { height: 6px; background: rgba(107,31,42,0.15); border-radius: 3px; overflow: hidden; }
        .eval-bar-fill { height: 100%; background: linear-gradient(90deg, #6B1F2A, #C8973A); border-radius: 3px; }
        .eval-right h3 { font-family: "Playfair Display", serif; font-size: 1.5rem; color: #6B1F2A; margin-bottom: 1rem; }
        .eval-right p { font-size: 0.95rem; color: #7A6558; line-height: 1.8; margin-bottom: 1rem; }
        .perfil-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
        .perfil-tag { background: #FAF6EF; border: 1px solid rgba(107,31,42,0.15); border-radius: 5px; padding: 1rem 1.2rem; font-size: 0.85rem; color: #7A6558; }
        .perfil-tag strong { display: block; color: #6B1F2A; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.3rem; }

        .proceso { background: #FAF6EF; }
        .proceso-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
        .paso { background: #fff; border: 1px solid rgba(107,31,42,0.15); border-radius: 8px; padding: 2rem 1.5rem; }
        .paso-num { font-family: "Playfair Display", serif; font-size: 3rem; font-weight: 900; color: rgba(107,31,42,0.08); line-height: 1; margin-bottom: 0.5rem; }
        .paso-title { font-family: "Playfair Display", serif; font-size: 1.1rem; font-weight: 700; color: #6B1F2A; margin-bottom: 0.8rem; }
        .paso-desc { font-size: 0.88rem; color: #7A6558; line-height: 1.7; }
        .paso-fecha { font-size: 0.8rem; font-weight: 500; color: #C8973A; margin-top: 0.8rem; }
        .banco-box { background: #6B1F2A; border-radius: 8px; padding: 2.5rem; margin-top: 3rem; color: #fff; }
        .banco-box h3 { font-family: "Playfair Display", serif; font-size: 1.3rem; color: #C8973A; margin-bottom: 1.5rem; }
        .banco-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .banco-item label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); display: block; margin-bottom: 0.3rem; }
        .banco-item span { font-size: 1rem; color: #fff; font-weight: 500; }
        .banco-note { font-size: 0.82rem; color: rgba(255,255,255,0.6); margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; }

        .inscripcion { background: #FAF6EF; text-align: center; }
        .insc-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem; }

        .contacto { background: #1A1210; }
        .contacto .section-title { color: #fff; }
        .contacto .section-label { color: #C8973A; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; margin-top: 3rem; }
        .contact-block h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #C8973A; margin-bottom: 0.8rem; }
        .contact-block p, .contact-block a { font-size: 0.9rem; color: rgba(255,255,255,0.65); line-height: 1.8; text-decoration: none; display: block; }
        .contact-block a:hover { color: #C8973A; }

        footer { background: #1A1210; border-top: 1px solid rgba(255,255,255,0.07); padding: 2rem 8vw; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: rgba(255,255,255,0.35); }
        footer a { color: #C8973A; text-decoration: none; }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; }
          .hero-right { min-height: 300px; }
          .about-grid, .eval-grid, .modules-grid, .calendar-grid, .contact-grid { grid-template-columns: 1fr; }
          .about-right { grid-template-columns: 1fr 1fr; }
          .proceso-steps, .banco-grid { grid-template-columns: 1fr; }
          .nav-links { display: none; }
        }
      `}} />

      <div className="landing-body">
        <nav className="nav-container">
          <div className="nav-logo">CESMECA · UNICACH</div>
          <ul className="nav-links">
            <li><a href="#sobre">Sobre el diplomado</a></li>
            <li><a href="#modulos">Módulos</a></li>
            <li><a href="#calendario">Calendario</a></li>
            <li><a href="#docentes">Docentes</a></li>
            <li><a href="#proceso">Proceso</a></li>
            <li><Link href="/mi-solicitud">Mi solicitud</Link></li>
            <li><Link href="/registro" className="nav-cta">Inscribirse</Link></li>
          </ul>
        </nav>

        <section className="hero">
          <div className="hero-left">
            <span className="hero-eyebrow">CESMECA · UNICACH · 2026</span>
            <h1>Diplomado en<br/>Estudio y<br/><em>Formación Política</em></h1>
            <p className="hero-sub">Herramientas analíticas y conceptuales para comprender los fenómenos políticos y participar de manera informada y responsable en la vida pública.</p>
            <div className="hero-meta">
              <div className="meta-pill">📅 Septiembre 2026 – Junio 2027</div>
              <div className="meta-pill">🕐 Viernes 16:00 – 19:00 hrs</div>
              <div className="meta-pill">📍 Presencial · San Cristóbal de Las Casas, Chiapas</div>
            </div>
            <div className="hero-btns">
              <Link href="/registro" className="btn-primary">Solicitar inscripción</Link>
              <a href="#modulos" className="btn-ghost">Ver plan académico</a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-card">
              <div className="hero-card-title">Plan académico</div>
              <div className="stat-row">
                <div className="stat-item">
                  <div className="stat-num">120</div>
                  <div className="stat-label">Horas totales</div>
                  <div className="stat-sub">4 módulos · 30 hrs cada uno</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">2</div>
                  <div className="stat-label">Semestres académicos</div>
                  <div className="stat-sub">Semestre I: Sep 2026 – Ene 2027</div>
                </div>
                <div className="stat-item">
                  <div className="stat-num">Coord.</div>
                  <div className="stat-label">Dr. Jesús Solís Cruz</div>
                  <div className="stat-sub">Investigador TC · Observatorio de las Democracias</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about" id="sobre">
          <div className="about-grid">
            <div>
              <div className="section-label">Presentación</div>
              <h2 className="section-title">¿Por qué este diplomado?</h2>
              <p className="section-body">En un contexto de impredecibilidad política global, los marcos institucionales democráticos se han desdibujado. La falta de formación política deriva en apatía ciudadana, polarización social y deslegitimación institucional.</p>
              <ul className="about-list">
                <li>Promover la investigación sobre bases teóricas sólidas</li>
                <li>Actualizar la práctica profesional en el servicio público</li>
                <li>Generar análisis pertinentes en materia política</li>
                <li>Contribuir a la transformación social e institucional</li>
              </ul>
            </div>
            <div className="about-right">
              <div className="about-block"><div className="about-block-icon">🎓</div><h4>Académicos</h4><p>Investigadores y docentes interesados en actualizar sus habilidades de análisis político.</p></div>
              <div className="about-block"><div className="about-block-icon">📚</div><h4>Estudiantes</h4><p>Posgrado y licenciatura desarrollando investigaciones en estudios políticos.</p></div>
              <div className="about-block"><div className="about-block-icon">🏛️</div><h4>Servidores públicos</h4><p>Ciudadanos con funciones en el ámbito público o responsabilidades profesionales.</p></div>
              <div className="about-block"><div className="about-block-icon">🌎</div><h4>Disciplinas</h4><p>Ciencia política, administración pública, derecho, filosofía, antropología y sociología.</p></div>
            </div>
          </div>
        </section>

        <section className="modules" id="modulos">
          <div className="section-label">Plan académico</div>
          <h2 className="section-title">Cuatro módulos, 120 horas</h2>
          <p className="section-body">Cada módulo está estructurado en tres unidades de 10 horas, con temario y bibliografía especializada.</p>
          <div className="modules-grid">
            <div className="module-card">
              <div className="module-header"><div><div className="module-num">01</div><div className="module-title">Teoría Política</div></div><span className="module-hrs">30 hrs · Sem. I</span></div>
              <div className="module-body"><p className="module-desc">Conceptos fundamentales y principales corrientes del pensamiento político, desde sus orígenes hasta los debates contemporáneos.</p><ul className="module-units"><li><span className="unit-dot"></span>Fundamentos del Pensamiento Político</li><li><span className="unit-dot"></span>Corrientes Políticas Modernas</li><li><span className="unit-dot"></span>Debates Contemporáneos</li></ul></div>
            </div>
            <div className="module-card">
              <div className="module-header"><div><div className="module-num">02</div><div className="module-title">Sistemas de Gobierno</div></div><span className="module-hrs">30 hrs · Sem. I</span></div>
              <div className="module-body"><p className="module-desc">Estructuras institucionales y dinámicas de poder en diferentes sistemas políticos. La distinción entre forma estatal y el gobierno como ejercicio de poder.</p><ul className="module-units"><li><span className="unit-dot"></span>El Estado y sus elementos</li><li><span className="unit-dot"></span>Formas de Gobierno</li><li><span className="unit-dot"></span>Instituciones y Actores</li></ul></div>
            </div>
            <div className="module-card">
              <div className="module-header"><div><div className="module-num">03</div><div className="module-title">Política Aplicada</div></div><span className="module-hrs">30 hrs · Sem. II</span></div>
              <div className="module-body"><p className="module-desc">La política desde una perspectiva práctica: cómo se formulan, implementan y evalúan las decisiones gubernamentales.</p><ul className="module-units"><li><span className="unit-dot"></span>El ciclo de las políticas públicas</li><li><span className="unit-dot"></span>Estrategias de Gestión Pública</li><li><span className="unit-dot"></span>Ámbitos de la Política Aplicada</li></ul></div>
            </div>
            <div className="module-card">
              <div className="module-header"><div><div className="module-num">04</div><div className="module-title">Estudios Político-Electorales</div></div><span className="module-hrs">30 hrs · Sem. II</span></div>
              <div className="module-body"><p className="module-desc">Procesos electorales, comportamientos de los actores y comunicación política en el contexto mexicano.</p><ul className="module-units"><li><span className="unit-dot"></span>Sistemas Electorales y Partidos</li><li><span className="unit-dot"></span>Comportamiento Electoral y Opinión Pública</li><li><span className="unit-dot"></span>Comunicación Política y Estrategia</li></ul></div>
            </div>
          </div>
        </section>

        <section className="calendar-sec" id="calendario">
          <div className="section-label">Fechas importantes</div>
          <h2 className="section-title">Calendario académico</h2>
          <div className="calendar-grid">
            <div className="cal-cell"><div className="cal-period">Convocatoria</div><div className="cal-date">Ago – Sep 2026</div><div className="cal-desc">Registro y proceso de selección de participantes.</div></div>
            <div className="cal-cell"><div className="cal-period">Semestre I</div><div className="cal-date">Sep 2026 – Ene 2027</div><div className="cal-desc">Módulos 1 y 2 · Viernes 16–19 hrs</div></div>
            <div className="cal-cell"><div className="cal-period">Semestre II</div><div className="cal-date">Feb – Jun 2027</div><div className="cal-desc">Módulos 3 y 4 · Viernes 16–19 hrs</div></div>
            <div className="cal-cell"><div className="cal-period">Clausura</div><div className="cal-date">Junio 2027</div><div className="cal-desc">Entrega de ensayo final y acto de graduación.</div></div>
          </div>
        </section>

        <section className="eval" id="evaluacion">
          <div className="section-label">Criterios de evaluación</div>
          <h2 className="section-title">¿Cómo se evalúa?</h2>
          <div className="eval-grid">
            <div className="eval-bars">
              <div><div className="eval-bar-head"><span className="eval-bar-label">Ensayo final</span><span className="eval-bar-pct">50%</span></div><div className="eval-bar-track"><div className="eval-bar-fill" style={{width:"50%"}}></div></div></div>
              <div><div className="eval-bar-head"><span className="eval-bar-label">Ensayos parciales (modulares)</span><span className="eval-bar-pct">30%</span></div><div className="eval-bar-track"><div className="eval-bar-fill" style={{width:"30%"}}></div></div></div>
              <div><div className="eval-bar-head"><span className="eval-bar-label">Asistencia (mín. 80%)</span><span className="eval-bar-pct">20%</span></div><div className="eval-bar-track"><div className="eval-bar-fill" style={{width:"20%"}}></div></div></div>
            </div>
            <div className="eval-right">
              <h3>Perfil del egresado</h3>
              <p>Al concluir, los participantes tendrán conocimientos, habilidades y competencias para comprender críticamente los sistemas políticos, las instituciones y los procesos comiciales.</p>
              <div className="perfil-grid">
                <div className="perfil-tag"><strong>Análisis político</strong>Marcos teóricos para fenómenos contemporáneos</div>
                <div className="perfil-tag"><strong>Políticas públicas</strong>Diseño, implementación y evaluación</div>
                <div className="perfil-tag"><strong>Metodología</strong>Herramientas para proyectos e iniciativas</div>
                <div className="perfil-tag"><strong>Asesoría</strong>Asesores informados en asuntos de gobierno</div>
              </div>
            </div>
          </div>
        </section>

        <section id="docentes" style={{padding:"7rem 8vw", backgroundColor:"#fff"}}>
          <div className="section-label">Quiénes enseñan</div>
          <h2 className="section-title">Equipo docente</h2>
          <p className="section-body">Investigadores y académicos de instituciones nacionales de alto nivel, especializados en ciencia política, derecho, sociología y administración pública.</p>
          <DocentesSection />
        </section>

        <section className="proceso" id="proceso">
          <div className="section-label">Cómo inscribirse</div>
          <h2 className="section-title">Proceso de registro y matriculación</h2>
          <p className="section-body">El proceso consta de tres etapas. Lee con atención antes de enviar tu solicitud.</p>
          <div className="proceso-steps">
            <div className="paso"><div className="paso-num">01</div><div className="paso-title">Pre-registro en línea</div><div className="paso-desc">Envía tu Currículum Vitae, copia de identificación oficial y carta de exposición de motivos.</div><div className="paso-fecha">📅 20 de mayo al 10 de julio de 2026</div></div>
            <div className="paso"><div className="paso-num">02</div><div className="paso-title">Inscripción y pago</div><div className="paso-desc">Una vez aceptado, realiza el pago de inscripción y envía tu comprobante.</div><div className="paso-fecha">📅 4 al 14 de agosto de 2026</div></div>
            <div className="paso"><div className="paso-num">03</div><div className="paso-title">Registro universitario</div><div className="paso-desc">Confirmado tu pago, recibirás por correo el enlace para completar tu registro oficial en UNICACH.</div><div className="paso-fecha">📅 Agosto 2026</div></div>
          </div>
          <div className="banco-box">
            <h3>💳 Datos bancarios para pago</h3>
            <div style={{background:"rgba(200,151,58,0.15)",border:"1px solid rgba(200,151,58,0.3)",borderRadius:"6px",padding:"1rem 1.5rem",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"1rem"}}>
              <span style={{fontFamily:"Playfair Display,serif",fontSize:"2rem",fontWeight:900,color:"#C8973A"}}>$3,300</span>
              <span style={{color:"rgba(255,255,255,0.75)",fontSize:"0.9rem"}}>MXN · Costo de inscripción al diplomado</span>
            </div>
            <div className="banco-grid">
              <div className="banco-item"><label>Número de cuenta</label><span>4069114171</span></div>
              <div className="banco-item"><label>Nombre de la cuenta</label><span>UNICACH INGRESOS PROPIOS</span></div>
              <div className="banco-item"><label>Sucursal</label><span>366 Urbana Boulevard · HSBC Chiapas</span></div>
              <div className="banco-item"><label>CLABE interbancaria</label><span>021100040691141712</span></div>
            </div>
            <p className="banco-note">⚠️ Una vez realizado el pago, envía tu comprobante con nombre completo al correo: <strong>diplomadoformacionpolitica@unicach.mx</strong></p>
          </div>
        </section>

        <section className="inscripcion" id="inscripcion">
          <div className="section-label" style={{justifyContent:"center"}}>Registro</div>
          <h2 className="section-title" style={{textAlign:"center"}}>Solicitar inscripción</h2>
          <p className="section-body" style={{margin:"0 auto 2rem"}}>Completa el formulario de pre-registro y el comité revisará tu solicitud en un plazo máximo de 5 días hábiles.</p>
          <div className="insc-btns">
            <Link href="/registro" className="btn-primary" style={{fontSize:"1rem",padding:"1.1rem 2.5rem"}}>Solicitar inscripción</Link>
            <Link href="/mi-solicitud" style={{display:"inline-block",border:"1.5px solid #6B1F2A",color:"#6B1F2A",padding:"1.05rem 2rem",borderRadius:"4px",textDecoration:"none",fontWeight:500,fontSize:"1rem"}}>Consultar mi solicitud</Link>
          </div>
        </section>

        <section className="contacto" id="contacto">
          <div className="section-label">Información de contacto</div>
          <h2 className="section-title">¿Tienes dudas?</h2>
          <div className="contact-grid">
            <div className="contact-block"><h4>Coordinador</h4><p>Dr. Jesús Solís Cruz<br/>Investigador de Tiempo Completo<br/>Observatorio de las Democracias:<br/>Sur de México y Centroamérica</p></div>
            <div className="contact-block"><h4>Institución</h4><p>Centro de Estudios Superiores<br/>de México y Centroamérica<br/>CESMECA · UNICACH<br/><br/>Calle Bugambilia No. 30<br/>Fracc. La Buena Esperanza<br/>C.P. 29243, San Cristóbal de Las Casas, Chiapas</p></div>
            <div className="contact-block"><h4>Correo</h4><a href="mailto:diplomadoformacionpolitica@unicach.mx">diplomadoformacionpolitica@unicach.mx</a><a href="mailto:jesus.solis@unicach.mx">jesus.solis@unicach.mx</a><h4 style={{marginTop:"1rem"}}>Teléfonos</h4><a href="tel:9676786921">967 67 8 69 21</a><a href="tel:9671120483">967 112 04 83</a></div>
          </div>
        </section>

        <footer>
          <span>© 2026 CESMECA · Universidad Autónoma de Ciencias y Artes de Chiapas. <em>2026, Año de Margarita Maza · Año de Jaime Sabines</em></span>
          <Link href="/registro" style={{color:"#C8973A",textDecoration:"none"}}>Inscribirse →</Link>
        </footer>
      </div>
    </>
  )
}

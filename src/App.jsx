import { useState, useEffect, useRef } from "react";

// ——— Numero: senza spazi per link tel/WhatsApp ———
const PHONE = "3342281990";
const PHONE_DISPLAY = "334 228 1990";
const EMAIL = "DA INSERIRE";
const WHATSAPP = "3342281990";

const whatsappUrl = `https://wa.me/39${PHONE}?text=${encodeURIComponent("Buongiorno, vorrei un preventivo")}`;
const telUrl = `tel:+39${PHONE}`;
const MAPS_ADDRESS = "Via degli Spreti 101, Ravenna";
const MAPS_EMBED_URL = "https://www.google.com/maps?q=Via+degli+Spreti+101,+Ravenna,+Italy&output=embed";
const MAPS_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_ADDRESS)}`;

const faqData = [
  { q: "In che zona lavorate?", a: "Ravenna e tutta la provincia. Per lavori particolari ci spostiamo anche in Romagna." },
  { q: "Il sopralluogo è gratuito?", a: "Sì. Veniamo a vedere il lavoro, misuriamo e facciamo il preventivo senza nessun costo." },
  { q: "Che materiali usate?", a: "Lavoriamo rame, alluminio, zinco titanio, lamiera preverniciata e acciaio inox. Scegliamo il materiale più adatto al lavoro e al budget." },
  { q: "Fate anche rimozione amianto?", a: "Sì. Siamo abilitati alla rimozione e allo smaltimento di coperture in amianto/eternit, con certificazione completa." },
  { q: "Quanto tempo ci vuole per un preventivo?", a: "Facciamo il sopralluogo entro 48 ore dalla chiamata. Il preventivo arriva in 2-3 giorni lavorativi." },
];

const serviziLattoneria = [
  { nome: "Grondaie e Pluviali", desc: "Fornitura e posa in opera grondaie e pluviali in rame, alluminio, zinco titanio, acciaio inox e lamiera preverniciata. Forme e misure su richiesta.", tag: "principale" },
  { nome: "Scossaline e Bandinelle", desc: "Realizzazione e installazione scossaline, bandinelle e raccordi in lamiera. Protezione completa dei giunti murari.", tag: "" },
  { nome: "Raccordi Camini e Canne Fumarie", desc: "Lattoneria di raccordo per camini, canne fumarie, converse e lucernari. Sagomatura su misura.", tag: "" },
  { nome: "Pulizia e Manutenzione Grondaie", desc: "Pulizia annuale, riparazione e sostituzione grondaie danneggiate. Preveniamo infiltrazioni e danni.", tag: "popular" },
  { nome: "Comignoli e Esalatori", desc: "Realizzazione e installazione comignoli, esalatori e cappelli di protezione in lamiera su misura.", tag: "" },
];

const serviziCoperture = [
  { nome: "Rifacimento Tetti", desc: "Ristrutturazione completa coperture civili e industriali. Rimozione vecchia copertura e posa nuova.", tag: "principale" },
  { nome: "Coperture in Lamiera", desc: "Coperture in lamiera grecata, ondulata, aggraffata. Per civile e industriale.", tag: "" },
  { nome: "Coperture in Rame", desc: "Coperture pregiate in rame per edifici storici e di pregio. Lavorazione artigianale.", tag: "premium" },
  { nome: "Impermeabilizzazioni", desc: "Trattamenti impermeabilizzanti per tetti piani, terrazze e coperture. Materiali di ultima generazione.", tag: "" },
  { nome: "Bonifica Amianto", desc: "Rimozione e smaltimento coperture in eternit/amianto nel rispetto delle normative vigenti. Certificazione completa.", tag: "importante" },
];

const recensioni = [
  { testo: "Hanno rifatto completamente le grondaie di casa. Lavoro preciso, pulito, e prezzi onesti. Sono venuti a fare il sopralluogo il giorno dopo la chiamata. Consigliati.", nome: "Roberto M.", piattaforma: "Google", stelle: "5" },
  { testo: "Avevo infiltrazioni dal tetto da mesi. Sono intervenuti in tempi rapidi, hanno trovato il problema e risolto tutto. Finalmente un artigiano serio e puntuale.", nome: "Antonella G.", piattaforma: "Google", stelle: "5" },
  { testo: "Rimozione amianto e rifacimento tetto completo. Lavoro grosso fatto con professionalità. Cantiere sempre in ordine e tempi rispettati. Ottimo rapporto qualità/prezzo.", nome: "Marco L.", piattaforma: "Google", stelle: "5" },
];

const tagColor = (tag) => {
  if (tag === "principale" || tag === "popular") return "#EA580C";
  if (tag === "premium") return "#C8A97E";
  if (tag === "importante") return "#DC2626";
  return "transparent";
};

// Easing ease-out per counter: accelera all'inizio, rallenta alla fine
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function App() {
  const [faqOpen, setFaqOpen] = useState(null);
  const [serviziTab, setServiziTab] = useState("lattoneria");
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroStat100, setHeroStat100] = useState(0);
  const [counterDone, setCounterDone] = useState(false);
  const [waVisible, setWaVisible] = useState(false);
  const mainRef = useRef(null);
  const heroStatsRef = useRef(null);

  // Smooth scroll con offset 80px e aggiornamento hash
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setMenuOpen(false);
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
  };

  // Intersection Observer: scroll reveal (una sola volta)
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const sections = el.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("reveal-visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Counter Hero stats (100%): parte quando la sezione hero stats è visibile, una sola volta
  useEffect(() => {
    const el = heroStatsRef.current;
    if (!el || counterDone) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setCounterDone(true);
        const duration = 2000;
        const start = performance.now();
        const run = (now) => {
          const elapsed = now - start;
          const t = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(t);
          setHeroStat100(Math.round(100 * eased));
          if (t < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [counterDone]);

  // WhatsApp button visibile dopo 3 secondi
  useEffect(() => {
    const t = setTimeout(() => setWaVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255,255,255,0.6);
          background: #111111;
        }
        [data-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          will-change: transform, opacity;
        }
        [data-reveal].reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal].reveal-visible [data-reveal-item] {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal-item] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          will-change: transform, opacity;
        }
        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        @media (hover: hover) {
          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.35);
            border-color: rgba(234,88,12,0.25) !important;
          }
        }
        .btn-interact {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        @media (hover: hover) {
          .btn-interact:hover { transform: scale(1.02); box-shadow: 0 6px 20px rgba(234,88,12,0.4); }
          .btn-interact.btn-primary:hover { background: #f97316; box-shadow: 0 6px 24px rgba(234,88,12,0.5); }
          .btn-interact.btn-outline:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.35); }
        }
        .btn-interact:active { transform: scale(0.98); }
        .hero-word { opacity: 0; transform: translateY(12px); animation: heroReveal 0.6s ease-out forwards; }
        @keyframes heroReveal {
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-sub-cta { opacity: 0; transform: translateY(12px); animation: heroReveal 0.5s ease-out 1.1s forwards; }
        .wa-float {
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .wa-float.wa-visible { opacity: 1; }
        .wa-float { animation: waPulse 5s ease-in-out infinite; }
        @keyframes waPulse {
          0%, 90%, 100% { transform: scale(1); }
          92% { transform: scale(1.08); }
          96% { transform: scale(1); }
        }
        @media (max-width: 768px) {
          .wa-float { bottom: 20px !important; right: 16px !important; }
        }
        section { scroll-margin-top: 80px; }
        .nav-blur { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .nav-desktop { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; }
        .nav-mobile-btn { display: none; background: none; border: none; color: #fff; padding: 8px; cursor: pointer; min-height: 48px; min-width: 48px; align-items: center; justify-content: center; }
        .nav-dropdown { display: none; background: #1A1A1A; border-bottom: 2px solid rgba(234,88,12,0.3); padding: 16px 20px; flex-direction: column; gap: 8px; }
        .nav-dropdown.open { display: flex; }
        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .nav-mobile-btn { display: flex; }
        }
        @media (min-width: 769px) {
          .nav-dropdown { display: none !important; }
        }
        .map-wrap { border-radius: 8px; overflow: hidden; border: 1px solid rgba(234,88,12,0.1); aspect-ratio: 16/9; }
        @media (max-width: 768px) { .map-wrap { aspect-ratio: 4/3; } }
      `}</style>

      {/* Navbar sticky con blur */}
      <header style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <nav
          className="nav-blur"
          style={{
            background: "rgba(17,17,17,0.85)",
            borderBottom: "2px solid rgba(234,88,12,0.3)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 700, textTransform: "uppercase", color: "#FFFFFF", fontSize: "1.1rem" }}>
            Lattoneria Ravennate
          </div>
          <div className="nav-desktop">
            <button type="button" onClick={() => scrollTo("chi-siamo")} className="btn-interact" style={navLink}>Chi siamo</button>
            <button type="button" onClick={() => scrollTo("servizi")} className="btn-interact" style={navLink}>Servizi</button>
            <button type="button" onClick={() => scrollTo("recensioni")} className="btn-interact" style={navLink}>Recensioni</button>
            <button type="button" onClick={() => scrollTo("faq")} className="btn-interact" style={navLink}>FAQ</button>
            <button type="button" onClick={() => scrollTo("contatti")} className="btn-interact" style={navLink}>Contatti</button>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-interact btn-primary" style={{ ...navCta, display: "inline-flex", alignItems: "center" }}>Richiedi Preventivo</a>
          </div>
          <button
            type="button"
            className="nav-mobile-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </nav>
        {/* Menu a tendina mobile */}
        <div className={`nav-dropdown ${menuOpen ? "open" : ""}`}>
          <button type="button" onClick={() => scrollTo("chi-siamo")} className="btn-interact" style={{ ...navLink, textAlign: "left", padding: "12px 0", minHeight: 48 }}>Chi siamo</button>
          <button type="button" onClick={() => scrollTo("servizi")} className="btn-interact" style={{ ...navLink, textAlign: "left", padding: "12px 0", minHeight: 48 }}>Servizi</button>
          <button type="button" onClick={() => scrollTo("recensioni")} className="btn-interact" style={{ ...navLink, textAlign: "left", padding: "12px 0", minHeight: 48 }}>Recensioni</button>
          <button type="button" onClick={() => scrollTo("faq")} className="btn-interact" style={{ ...navLink, textAlign: "left", padding: "12px 0", minHeight: 48 }}>FAQ</button>
          <button type="button" onClick={() => scrollTo("contatti")} className="btn-interact" style={{ ...navLink, textAlign: "left", padding: "12px 0", minHeight: 48 }}>Contatti</button>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-interact btn-primary" style={{ ...navCta, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 8 }} onClick={() => setMenuOpen(false)}>Richiedi Preventivo</a>
          <a href={telUrl} style={{ color: "#EA580C", fontWeight: 700, fontSize: "1.1rem", padding: "12px 0", textDecoration: "none" }} onClick={() => setMenuOpen(false)}>📞 {PHONE_DISPLAY}</a>
        </div>
      </header>

      <main ref={mainRef}>
      {/* Hero */}
      <section
        id="hero"
        data-reveal
        style={{
          background: "#111111",
          padding: "48px 20px 64px",
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          className="hero-word"
          style={{
            fontSize: "0.85rem",
            color: "#EA580C",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 16,
            animationDelay: "0.3s",
          }}
        >
          🔧 LATTONERIA EDILE · RAVENNA E PROVINCIA
        </div>
        <h1
          style={{
            fontFamily: "Inter",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#FFFFFF",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            margin: "0 0 8px",
            lineHeight: 1.15,
          }}
        >
          <span className="hero-word" style={{ display: "inline-block", animationDelay: "0.3s" }}>Il</span>{" "}
          <span className="hero-word" style={{ display: "inline-block", animationDelay: "0.38s" }}>Tuo</span>{" "}
          <span className="hero-word" style={{ display: "inline-block", animationDelay: "0.46s" }}>Tetto.</span>
        </h1>
        <h1
          style={{
            fontFamily: "Inter",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#EA580C",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            margin: "0 0 20px",
            lineHeight: 1.15,
          }}
        >
          <span className="hero-word" style={{ display: "inline-block", animationDelay: "0.54s" }}>In</span>{" "}
          <span className="hero-word" style={{ display: "inline-block", animationDelay: "0.62s" }}>Mani</span>{" "}
          <span className="hero-word" style={{ display: "inline-block", animationDelay: "0.7s" }}>Sicure.</span>
        </h1>
        <div className="hero-sub-cta">
          <p style={{ maxWidth: 560, margin: "0 auto 28px", fontSize: "1rem", color: "rgba(255,255,255,0.6)" }}>
            Coperture, grondaie, pluviali e lattoneria edile su misura. Lavoriamo rame, alluminio, acciaio inox e lamiera zincata. Sopralluogo e preventivo gratuito.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 24 }}>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-interact btn-primary" style={btnPrimary}>Richiedi Preventivo</a>
            <a href={telUrl} className="btn-interact btn-outline" style={btnSecondary}>Chiama Ora</a>
          </div>
          <a href={telUrl} style={{ fontSize: "28px", fontWeight: 700, color: "#EA580C", textDecoration: "none", marginBottom: 40 }}>
            📞 +39 {PHONE_DISPLAY}
          </a>
        </div>
        <div ref={heroStatsRef} style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center" }}>
          <div data-reveal-item style={{ transitionDelay: "0ms" }}><strong style={{ color: "#FFFFFF", display: "block", fontSize: "1.25rem" }}>Ravenna</strong><span style={{ color: "rgba(255,255,255,0.3)" }}>e Provincia</span></div>
          <div data-reveal-item style={{ transitionDelay: "100ms" }}><strong style={{ color: "#FFFFFF", display: "block", fontSize: "1.25rem" }}>{heroStat100}%</strong><span style={{ color: "rgba(255,255,255,0.3)" }}>Su Misura</span></div>
          <div data-reveal-item style={{ transitionDelay: "200ms" }}><strong style={{ color: "#FFFFFF", display: "block", fontSize: "1.25rem" }}>Gratis</strong><span style={{ color: "rgba(255,255,255,0.3)" }}>Sopralluogo</span></div>
        </div>
        <div style={{ ...placeholderImg("#1A1A1A", "280px", "160px"), transitionDelay: "300ms" }} data-reveal-item>
          [Foto tetto con grondaie nuove in rame, vista dall&apos;alto]
        </div>
      </section>

      {/* Chi siamo */}
      <section
        id="chi-siamo"
        data-reveal
        style={{ background: "#1A1A1A", padding: "64px 20px", borderTop: "1px solid rgba(234,88,12,0.1)" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="responsive-stack">
          <div>
            <div data-reveal-item style={{ transitionDelay: "0ms", fontSize: "0.75rem", color: "#EA580C", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>CHI SIAMO</div>
            <h2 data-reveal-item style={{ transitionDelay: "100ms", color: "#FFFFFF", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(1.5rem, 3vw, 2rem)", margin: "0 0 16px" }}>
              Artigiani del Tetto.
            </h2>
            <h2 data-reveal-item style={{ transitionDelay: "200ms", color: "#EA580C", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(1.5rem, 3vw, 2rem)", margin: "0 0 20px" }}>
              Non Improvvisatori.
            </h2>
            <p data-reveal-item style={{ transitionDelay: "300ms", margin: 0, fontSize: 16 }}>
              Lavoriamo nel settore della lattoneria edile a Ravenna e provincia. Ogni lavoro che facciamo è su misura: dalla progettazione alla piegatura della lamiera, dalla sagomatura alla posa in opera. Utilizziamo materiali di prima qualità e tecniche consolidate. Non subappaltiamo, non improvvisiamo. Il nostro team segue ogni cantiere dall&apos;inizio alla fine, garantendo qualità e puntualità. Il tetto è la protezione della tua casa. Noi lo trattiamo come merita.
            </p>
          </div>
          <div data-reveal-item style={{ transitionDelay: "400ms", ...placeholderImg("#111111", "100%", "280px") }}>
            [Foto operaio su tetto che installa grondaia in rame]
          </div>
        </div>
      </section>

      {/* Servizi con tab */}
      <section id="servizi" data-reveal style={{ background: "#111111", padding: "64px 20px" }}>
        <h2 data-reveal-item style={{ transitionDelay: "0ms", color: "#FFFFFF", fontWeight: 700, textTransform: "uppercase", textAlign: "center", margin: "0 0 32px", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
          I Nostri Servizi
        </h2>
        <div data-reveal-item style={{ transitionDelay: "100ms", display: "flex", justifyContent: "center", gap: 0, marginBottom: 32 }}>
          <button
            type="button"
            className="btn-interact"
            onClick={() => setServiziTab("lattoneria")}
            style={{
              padding: "14px 28px",
              minHeight: 48,
              fontWeight: 700,
              border: "1px solid rgba(234,88,12,0.3)",
              background: serviziTab === "lattoneria" ? "#EA580C" : "transparent",
              color: "#FFFFFF",
              cursor: "pointer",
              borderRadius: "6px 0 0 6px",
              fontFamily: "Inter",
            }}
          >
            Lattoneria
          </button>
          <button
            type="button"
            className="btn-interact"
            onClick={() => setServiziTab("coperture")}
            style={{
              padding: "14px 28px",
              minHeight: 48,
              fontWeight: 700,
              border: "1px solid rgba(234,88,12,0.3)",
              background: serviziTab === "coperture" ? "#EA580C" : "transparent",
              color: "#FFFFFF",
              cursor: "pointer",
              borderRadius: "0 6px 6px 0",
              fontFamily: "Inter",
            }}
          >
            Coperture
          </button>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {(serviziTab === "lattoneria" ? serviziLattoneria : serviziCoperture).map((s, i) => (
            <div
              key={i}
              className="card-hover"
              data-reveal-item
              style={{
                transitionDelay: `${200 + i * 100}ms`,
                background: "#1A1A1A",
                border: "1px solid rgba(234,88,12,0.1)",
                borderRadius: 8,
                borderTop: "3px solid #EA580C",
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: "#FFFFFF", fontSize: "1.05rem" }}>{s.nome}</span>
                {s.tag && (
                  <span style={{ background: tagColor(s.tag), color: "#111", fontSize: "0.7rem", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                    {s.tag}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,0.6)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <p data-reveal-item style={{ transitionDelay: "800ms", textAlign: "center", marginTop: 28, color: "rgba(255,255,255,0.5)", fontSize: 16 }}>
          Ogni lavoro è diverso. Contattaci per un sopralluogo gratuito e un preventivo su misura.
        </p>
      </section>

      {/* Perché noi */}
      <section id="perche-noi" data-reveal style={{ background: "#1A1A1A", padding: "64px 20px" }}>
        <h2 data-reveal-item style={{ transitionDelay: "0ms", color: "#FFFFFF", fontWeight: 700, textTransform: "uppercase", textAlign: "center", margin: "0 0 40px", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
          Perché Scegliere Lattoneria Ravennate
        </h2>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="responsive-grid-4">
          {[
            { emoji: "🔧", titolo: "Lavoro Su Misura", desc: "Ogni pezzo è sagomato e piegato su misura per il tuo edificio. Niente soluzioni standard." },
            { emoji: "🏗️", titolo: "Tutto il Cantiere Interno", desc: "Non subappaltiamo. Il nostro team segue ogni fase, dalla progettazione alla posa in opera." },
            { emoji: "📋", titolo: "Sopralluogo Gratuito", desc: "Veniamo a vedere il lavoro, misuriamo, e ti facciamo un preventivo dettagliato. Senza impegno." },
            { emoji: "🛡️", titolo: "Materiali di Qualità", desc: "Lavoriamo rame, alluminio, zinco titanio, acciaio inox. Solo materiali certificati e duraturi." },
          ].map((item, i) => (
            <div
              key={i}
              className="card-hover"
              data-reveal-item
              style={{
                transitionDelay: `${100 + i * 100}ms`,
                background: "#111111",
                border: "1px solid rgba(234,88,12,0.1)",
                borderRadius: 8,
                padding: 24,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>{item.emoji}</div>
              <h3 style={{ color: "#FFFFFF", fontWeight: 700, textTransform: "uppercase", margin: "0 0 8px", fontSize: "1rem" }}>{item.titolo}</h3>
              <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,0.6)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recensioni */}
      <section id="recensioni" data-reveal style={{ background: "#111111", padding: "64px 20px" }}>
        <h2 data-reveal-item style={{ transitionDelay: "0ms", color: "#FFFFFF", fontWeight: 700, textTransform: "uppercase", textAlign: "center", margin: "0 0 40px", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
          Cosa Dicono di Noi
        </h2>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="responsive-grid-3">
          {recensioni.map((r, i) => (
            <div
              key={i}
              className="card-hover"
              data-reveal-item
              style={{
                transitionDelay: `${100 + i * 100}ms`,
                background: "#1A1A1A",
                border: "1px solid rgba(234,88,12,0.1)",
                borderRadius: 8,
                padding: 24,
              }}
            >
              <div style={{ color: "#EA580C", marginBottom: 8 }}>{"★".repeat(parseInt(r.stelle, 10))}</div>
              <p style={{ margin: "0 0 16px", fontSize: 16, color: "rgba(255,255,255,0.6)" }}>&ldquo;{r.testo}&rdquo;</p>
              <div style={{ color: "#FFFFFF", fontWeight: 700 }}>{r.nome}</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)" }}>{r.piattaforma}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" data-reveal style={{ background: "#1A1A1A", padding: "64px 20px", borderTop: "1px solid rgba(234,88,12,0.1)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div data-reveal-item style={{ transitionDelay: "0ms", fontSize: "0.85rem", color: "#EA580C", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 12 }}>📋 PREVENTIVO GRATUITO</div>
          <h2 data-reveal-item style={{ transitionDelay: "100ms", color: "#FFFFFF", fontWeight: 700, textTransform: "uppercase", margin: "0 0 16px", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
            Richiedi un Sopralluogo Gratuito
          </h2>
          <p data-reveal-item style={{ transitionDelay: "200ms", margin: "0 0 24px", fontSize: 16, color: "rgba(255,255,255,0.6)" }}>
            Veniamo noi a vedere il lavoro. Misuriamo, valutiamo, e ti facciamo un preventivo dettagliato. Zero costi, zero impegno.
          </p>
          <ul data-reveal-item style={{ transitionDelay: "300ms", listStyle: "none", padding: 0, margin: "0 0 28px", textAlign: "left", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
            {["Sopralluogo gratuito in 48 ore", "Preventivo dettagliato e trasparente", "Nessun costo fino all'accettazione", "Lavoriamo su tutta Ravenna e provincia"].map((f, i) => (
              <li key={i} style={{ marginBottom: 8, paddingLeft: 24, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#EA580C" }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
          <a href={telUrl} data-reveal-item style={{ transitionDelay: "400ms", display: "block", fontSize: "32px", fontWeight: 700, color: "#EA580C", textDecoration: "none", marginBottom: 24 }}>
            📞 +39 {PHONE_DISPLAY}
          </a>
          <div data-reveal-item style={{ transitionDelay: "500ms", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-interact btn-primary" style={btnPrimary}>Richiedi Preventivo →</a>
            <a href={telUrl} className="btn-interact btn-outline" style={{ ...btnSecondary, borderColor: "#EA580C", color: "#EA580C" }}>Chiama {PHONE_DISPLAY}</a>
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section id="faq" data-reveal style={{ background: "#111111", padding: "64px 20px" }}>
        <h2 data-reveal-item style={{ transitionDelay: "0ms", color: "#FFFFFF", fontWeight: 700, textTransform: "uppercase", textAlign: "center", margin: "0 0 32px", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
          Domande Frequenti
        </h2>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {faqData.map((item, i) => (
            <div
              key={i}
              className="card-hover"
              data-reveal-item
              style={{
                transitionDelay: `${100 + i * 100}ms`,
                background: "#1A1A1A",
                border: "1px solid rgba(234,88,12,0.1)",
                borderRadius: 8,
                marginBottom: 12,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                className="btn-interact"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "18px 20px",
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "Inter",
                }}
              >
                {item.q}
                <span style={{ color: "#EA580C", fontSize: "1.2rem" }}>{faqOpen === i ? "−" : "+"}</span>
              </button>
              {faqOpen === i && (
                <div style={{ padding: "0 20px 18px", color: "rgba(255,255,255,0.6)", fontSize: 16, borderTop: "1px solid rgba(234,88,12,0.1)" }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contatti con mappa */}
      <section id="contatti" data-reveal style={{ background: "#1A1A1A", padding: "64px 20px", borderTop: "1px solid rgba(234,88,12,0.1)" }}>
        <h2 data-reveal-item style={{ transitionDelay: "0ms", color: "#FFFFFF", fontWeight: 700, textTransform: "uppercase", textAlign: "center", margin: "0 0 24px", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
          Contatti
        </h2>
        <p data-reveal-item style={{ transitionDelay: "100ms", textAlign: "center", margin: "0 0 24px", color: "rgba(255,255,255,0.6)", fontSize: 16 }}>
          Venite a trovarci in sede o contattateci per un sopralluogo gratuito.
        </p>
        <div data-reveal-item style={{ transitionDelay: "200ms", maxWidth: 900, margin: "0 auto 20px" }} className="map-wrap">
          <iframe
            src={MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0, display: "block", minHeight: 280 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mappa sede Lattoneria Ravennate"
          />
        </div>
        <p data-reveal-item style={{ transitionDelay: "300ms", textAlign: "center", margin: 0 }}>
          <a href={MAPS_LINK_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#EA580C", fontWeight: 600, textDecoration: "none" }}>
            📍 {MAPS_ADDRESS}
          </a>
        </p>
        <p data-reveal-item style={{ transitionDelay: "400ms", textAlign: "center", marginTop: 12, color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
          <a href={telUrl} style={{ color: "#EA580C", textDecoration: "none" }}>📞 +39 {PHONE_DISPLAY}</a>
          {EMAIL !== "DA INSERIRE" && <> · <a href={`mailto:${EMAIL}`} style={{ color: "rgba(255,255,255,0.7)" }}>{EMAIL}</a></>}
        </p>
      </section>

      {/* Footer */}
      <footer data-reveal style={{ background: "#1A1A1A", padding: "48px 20px 24px", borderTop: "2px solid rgba(234,88,12,0.3)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", marginBottom: 8 }}>Lattoneria Ravennate</div>
          <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.6)", fontSize: 16 }}>
            Coperture, Grondaie e Lattoneria Edile. Ravenna e Provincia.
          </p>
          <p style={{ margin: "0 0 8px", fontSize: 16 }}>
            <a href={telUrl} style={{ color: "#EA580C", fontWeight: 700, textDecoration: "none" }}>📞 +39 {PHONE_DISPLAY}</a>
            {EMAIL !== "DA INSERIRE" && <span style={{ color: "rgba(255,255,255,0.5)" }}> · </span>}
            {EMAIL !== "DA INSERIRE" && <a href={`mailto:${EMAIL}`} style={{ color: "rgba(255,255,255,0.7)" }}>{EMAIL}</a>}
          </p>
          <p style={{ margin: "0 0 24px", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>
            Via degli Spreti 101, Ravenna · Lun-Ven 7:30-17:30 · Sabato su appuntamento
          </p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)", margin: 0 }}>
            Sito realizzato da ECF Media
          </p>
        </div>
      </footer>

      </main>

      {/* WhatsApp fisso: appare dopo 3s, pulse ogni 5s, z-index 900 */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className={`wa-float ${waVisible ? "wa-visible" : ""}`}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 900,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "28px",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-stack { grid-template-columns: 1fr !important; }
          .responsive-grid-4 { grid-template-columns: 1fr !important; }
          .responsive-grid-3 { grid-template-columns: 1fr !important; }
          nav > div:last-child { justify-content: center; }
          nav button { min-height: 48px; }
        }
      `}</style>
    </>
  );
}

const navLink = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.8)",
  cursor: "pointer",
  fontFamily: "Inter",
  fontSize: 16,
  padding: "8px 0",
};
const navCta = {
  background: "#EA580C",
  color: "#FFFFFF",
  fontWeight: 700,
  border: "none",
  padding: "12px 20px",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "Inter",
  fontSize: 16,
  minHeight: 48,
  textDecoration: "none",
};
const btnPrimary = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 28px",
  minHeight: 48,
  background: "#EA580C",
  color: "#FFFFFF",
  fontWeight: 700,
  borderRadius: 6,
  textDecoration: "none",
  fontFamily: "Inter",
  fontSize: 16,
};
const btnSecondary = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 28px",
  minHeight: 48,
  background: "transparent",
  color: "#FFFFFF",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 6,
  textDecoration: "none",
  fontFamily: "Inter",
  fontSize: 16,
  fontWeight: 700,
};
const placeholderImg = (bg, w, h) => ({
  background: bg,
  border: "1px solid rgba(234,88,12,0.1)",
  borderRadius: 8,
  width: w,
  height: h,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255,255,255,0.3)",
  fontSize: "0.9rem",
  textAlign: "center",
  padding: 12,
});

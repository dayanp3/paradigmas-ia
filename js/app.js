/* =========================================================
   app.js — Estado, navegación y renderizado de vistas
   ========================================================= */

/* ---------- Iconos ---------- */
const I = {
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  grid:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  star:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>`,
};

/* ---------- Estado y persistencia ---------- */
const STORE_KEY = "paradigmas-ia:v1";

const State = {
  visited: {},   // { topicId: true }
  answers: {},   // { "topicId:i": true|false }
  points: 0,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d && typeof d === "object") {
      State.visited = d.visited || {};
      State.answers = d.answers || {};
      State.points = Number(d.points) || 0;
    }
  } catch (e) { /* almacenamiento no disponible: se sigue sin persistir */ }
}
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(State)); }
  catch (e) { /* sin persistencia, la sesión sigue funcionando */ }
}

/* ---------- Cálculo de progreso ---------- */
/* Un tema avanza 40% por leerlo y 60% por acertar sus ejercicios. */
function topicProgress(t) {
  const read = State.visited[t.id] ? 0.4 : 0;
  const total = t.quiz.length;
  let ok = 0;
  for (let i = 0; i < total; i++) if (State.answers[`${t.id}:${i}`] === true) ok++;
  return read + (total ? 0.6 * (ok / total) : 0.6);
}
function topicDone(t) { return topicProgress(t) >= 0.999; }
function overallProgress() {
  const sum = TOPICS.reduce((a, t) => a + topicProgress(t), 0);
  return sum / TOPICS.length;
}
function answeredCount() { return Object.keys(State.answers).length; }
function correctCount() { return Object.values(State.answers).filter(Boolean).length; }
function totalQuestions() { return TOPICS.reduce((a, t) => a + t.quiz.length, 0); }

/* ---------- Utilidades de vista ---------- */
const NIVEL_CLASS = { "Básico": "chip-basico", "Intermedio": "chip-intermedio", "Avanzado": "chip-avanzado" };
const nivelClass = n => NIVEL_CLASS[n] || "chip-time";
const byId = id => TOPICS.find(t => t.id === id);

function chipNivel(t) { return `<span class="chip ${nivelClass(t.nivel)}">${t.nivel}</span>`; }
function chipTiempo(t) { return `<span class="chip chip-time">${I.clock} ${t.minutos} min</span>`; }

function topicCard(t) {
  const p = topicProgress(t);
  const done = topicDone(t);
  return `
  <button class="topic-card ${done ? "done" : ""}" data-topic="${t.id}">
    <div class="tc-top">
      <span class="tc-num">${done ? I.check : t.num}</span>
      <span class="tc-title">${t.title}</span>
    </div>
    <p class="tc-desc">${t.tag}</p>
    <div class="tc-meta">
      ${chipNivel(t)}${chipTiempo(t)}
      ${t.destacado ? `<span class="chip chip-featured">${I.star} Tema de exposición</span>` : ""}
      ${done ? `<span class="chip chip-done">${I.check} Completado</span>` : ""}
    </div>
    <div class="tc-bar"><i style="width:${Math.round(p * 100)}%"></i></div>
  </button>`;
}

/* ---------- Vista: Inicio ---------- */
function viewInicio() {
  const pct = Math.round(overallProgress() * 100);
  const empezado = pct > 0;
  return `
  <section class="view" id="v-inicio">
    <div class="hero">
      <span class="hero-badge"><span class="dot"></span> 9 paradigmas · ejercicios interactivos</span>
      <h1>Comprende cómo <span class="grad">aprenden las máquinas</span></h1>
      <p class="lead">Una guía interactiva por las nueve formas en que un sistema de inteligencia artificial puede aprender: desde el aprendizaje supervisado clásico hasta los modelos del mundo. Con explicaciones claras, diagramas del mecanismo real y ejercicios para comprobar que lo entendiste.</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-go="${empezado ? "continuar" : "tema:supervisado"}">
          ${empezado ? "Continuar aprendizaje" : "Comenzar aprendizaje"} ${I.arrow}
        </button>
        <button class="btn btn-secondary" data-go="temas">${I.grid} Explorar temas</button>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><b>9</b><span>paradigmas</span></div>
        <div class="hero-stat"><b>${totalQuestions()}</b><span>ejercicios</span></div>
        <div class="hero-stat"><b>${TOPICS.reduce((a,t)=>a+t.minutos,0)}</b><span>minutos de contenido</span></div>
        <div class="hero-stat"><b>${pct}%</b><span>tu avance</span></div>
      </div>
    </div>

    <div class="section-title">
      <h2>Los nueve paradigmas</h2>
      <span>Elige cualquiera: no hay un orden obligatorio</span>
    </div>
    <div class="topic-grid">${TOPICS.map(topicCard).join("")}</div>
  </section>`;
}

/* ---------- Vista: Temas ---------- */
function viewTemas() {
  return `
  <section class="view" id="v-temas">
    <div class="view-head">
      <div class="eyebrow">Catálogo</div>
      <h1>Temas</h1>
      <p>Los nueve paradigmas de aprendizaje. Cada tema incluye definición, explicación, diagrama del mecanismo, ejemplos y ejercicios.</p>
    </div>
    <div class="topic-grid">${TOPICS.map(topicCard).join("")}</div>
  </section>`;
}

/* ---------- Vista: Ruta ---------- */
function viewRuta() {
  const bloques = RUTA.map((b, i) => {
    const temas = b.temas.map(byId).filter(Boolean);
    const hechos = temas.filter(topicDone).length;
    const cls = hechos === temas.length ? "done" : (hechos > 0 ? "partial" : "");
    return `
    <div class="ruta-bloque ${cls}">
      <div class="ruta-dot">${hechos === temas.length ? I.check : i + 1}</div>
      <h3>${b.bloque}</h3>
      <p class="rb-desc">${b.desc}</p>
      <div class="ruta-temas">
        ${temas.map(t => `
          <div class="ruta-tema ${topicDone(t) ? "done" : ""}" data-topic="${t.id}">
            <span class="rt-n">${topicDone(t) ? I.check : t.num}</span>
            <span class="rt-t">${t.title}</span>
          </div>`).join("")}
      </div>
    </div>`;
  }).join("");

  return `
  <section class="view" id="v-ruta">
    <div class="view-head">
      <div class="eyebrow">Guía sugerida</div>
      <h1>Ruta de aprendizaje</h1>
      <p>Un orden que va de lo fundamental a lo emergente. Es una guía, no una barrera: puedes saltarte bloques o entrar por donde quieras.</p>
    </div>
    <div class="ruta">${bloques}</div>
  </section>`;
}

/* ---------- Vista: Ejercicios ---------- */
function viewEjercicios() {
  const filas = TOPICS.map(t => {
    const total = t.quiz.length;
    let ok = 0;
    for (let i = 0; i < total; i++) if (State.answers[`${t.id}:${i}`] === true) ok++;
    const done = ok === total;
    return `
    <div class="check-row ${done ? "done" : ""}" data-topic="${t.id}">
      <span class="check-box">${I.check}</span>
      <span class="cr-t">${t.num}. ${t.title}</span>
      <span class="chip ${done ? "chip-done" : "chip-time"}">${ok} / ${total}</span>
    </div>`;
  }).join("");

  return `
  <section class="view" id="v-ejercicios">
    <div class="view-head">
      <div class="eyebrow">Práctica</div>
      <h1>Ejercicios</h1>
      <p>Cada tema cierra con preguntas que explican por qué la respuesta es correcta. Responder bien suma a tu progreso.</p>
    </div>
    <div class="stat-row">
      <div class="stat"><div class="s-lbl">Respondidas</div><div class="s-val">${answeredCount()}</div><div class="s-sub">de ${totalQuestions()} preguntas</div></div>
      <div class="stat"><div class="s-lbl">Correctas</div><div class="s-val">${correctCount()}</div><div class="s-sub">${answeredCount() ? Math.round(correctCount() / answeredCount() * 100) : 0}% de acierto</div></div>
      <div class="stat"><div class="s-lbl">Puntos</div><div class="s-val">${State.points}</div><div class="s-sub">10 por acierto nuevo</div></div>
    </div>
    <div class="section-title"><h2>Por tema</h2><span>Toca uno para practicar</span></div>
    <div class="checklist">${filas}</div>
  </section>`;
}

/* ---------- Vista: Progreso ---------- */
function viewProgreso() {
  const pct = Math.round(overallProgress() * 100);
  const completos = TOPICS.filter(topicDone).length;
  const leidos = TOPICS.filter(t => State.visited[t.id]).length;

  const filas = TOPICS.map(t => {
    const p = Math.round(topicProgress(t) * 100);
    return `
    <div class="check-row ${topicDone(t) ? "done" : ""}" data-topic="${t.id}">
      <span class="check-box">${I.check}</span>
      <span class="cr-t">${t.num}. ${t.title}</span>
      <span class="chip ${topicDone(t) ? "chip-done" : "chip-time"}">${p}%</span>
    </div>`;
  }).join("");

  const vacio = pct === 0 ? `
    <div class="empty">
      <h3>Todavía no has empezado</h3>
      <p>Abre cualquier tema y responde sus ejercicios: tu avance aparecerá aquí.</p>
      <button class="btn btn-primary btn-sm" data-go="tema:supervisado">Empezar por el primero ${I.arrow}</button>
    </div>` : "";

  return `
  <section class="view" id="v-progreso">
    <div class="view-head">
      <div class="eyebrow">Tu avance</div>
      <h1>Progreso</h1>
      <p>Se guarda en este navegador y en este dispositivo. Si abres el sitio en otro equipo, el avance empieza de cero.</p>
    </div>

    <div class="stat-row">
      <div class="stat">
        <div class="s-lbl">Avance general</div>
        <div class="s-val">${pct}%</div>
        <div class="bigbar"><i style="width:${pct}%"></i></div>
      </div>
      <div class="stat"><div class="s-lbl">Temas completados</div><div class="s-val">${completos} <span style="font-size:16px;color:var(--text-3)">/ 9</span></div><div class="s-sub">leídos y con ejercicios resueltos</div></div>
      <div class="stat"><div class="s-lbl">Temas leídos</div><div class="s-val">${leidos} <span style="font-size:16px;color:var(--text-3)">/ 9</span></div><div class="s-sub">al menos una visita</div></div>
      <div class="stat"><div class="s-lbl">Puntos</div><div class="s-val">${State.points}</div><div class="s-sub">${correctCount()} respuestas correctas</div></div>
    </div>

    ${vacio}
    <div class="section-title"><h2>Detalle por tema</h2><span>Toca uno para continuar</span></div>
    <div class="checklist">${filas}</div>
  </section>`;
}

/* ---------- Vista: detalle de un tema ---------- */
function railHtml(activeId) {
  return `
  <aside class="rail">
    <div class="rail-title">Los 9 paradigmas</div>
    <ul class="rail-list">
      ${TOPICS.map(t => `
        <li class="rail-item ${t.id === activeId ? "active" : ""} ${topicDone(t) ? "done" : ""}" data-topic="${t.id}">
          <span class="rail-n">${t.num}</span>
          <span>${t.title}</span>
          ${topicDone(t) ? `<span class="rail-check">${I.check}</span>` : ""}
        </li>`).join("")}
    </ul>
  </aside>`;
}

function quizHtml(t) {
  return t.quiz.map((item, qi) => {
    const prev = State.answers[`${t.id}:${qi}`];
    const answered = prev !== undefined;
    const opts = item.options.map((op, oi) => {
      let cls = "", mark = String.fromCharCode(65 + oi);
      if (answered) {
        if (oi === item.correct) { cls = "correct"; mark = "✓"; }
      }
      return `<button class="quiz-opt ${cls}" data-oi="${oi}" ${answered ? "disabled" : ""}>
        <span class="mark">${mark}</span><span>${op}</span></button>`;
    }).join("");
    const fb = answered
      ? `<div class="quiz-fb show ${prev ? "ok" : "no"}"><b>${prev ? "Correcto" : "No exactamente"}</b>${item.exp}</div>`
      : `<div class="quiz-fb"></div>`;
    return `
    <div class="quiz" data-topic="${t.id}" data-qi="${qi}" ${answered ? 'data-answered="1"' : ""}>
      <p class="quiz-q"><span class="qn">${qi + 1}</span><span>${item.q}</span></p>
      <div class="quiz-opts">${opts}</div>
      ${fb}
    </div>`;
  }).join("");
}

function viewTema(t) {
  const i = TOPICS.indexOf(t);
  const prev = i > 0 ? TOPICS[i - 1] : null;
  const next = i < TOPICS.length - 1 ? TOPICS[i + 1] : null;

  return `
  <section class="view" id="v-tema">
    <div class="topic-layout">
      ${railHtml(t.id)}
      <div class="topic-main">
        <div class="topic-head">
          <div class="crumbs"><a data-go="temas">Temas</a> › <span>Tema ${t.num}</span></div>
          <h1>${t.title}</h1>
          <p class="sub">${t.tag}</p>
          <div class="metas">
            ${chipNivel(t)}${chipTiempo(t)}
            ${t.destacado ? `<span class="chip chip-featured">${I.star} Tema de exposición</span>` : ""}
            ${topicDone(t) ? `<span class="chip chip-done">${I.check} Completado</span>` : ""}
          </div>
        </div>

        ${t.intro ? `<div class="block"><div class="card card-intro"><p>${t.intro}</p></div></div>` : ""}

        <div class="block">
          <div class="block-label">Definición</div>
          <div class="card card-def">${t.definicion}</div>
        </div>

        <div class="block">
          <div class="block-label">Explicación</div>
          <div class="prose">${t.explicacion.map(p => `<p>${p}</p>`).join("")}</div>
        </div>

        <div class="block">
          <div class="block-label">Cómo funciona</div>
          <div class="diagram-frame">${t.diagram}</div>
          <p class="diagram-caption">${t.diagramCaption}</p>
        </div>

        ${t.diagram2 ? `<div class="block">
          <div class="diagram-frame">${t.diagram2}</div>
          <p class="diagram-caption">${t.diagram2Caption}</p>
        </div>` : ""}

        <div class="block">
          <div class="block-label">Ejemplos</div>
          <div class="grid-2">
            ${t.examples.map(e => `<div class="example-card"><span class="ex-tag">${e.tag}</span><p>${e.text}</p></div>`).join("")}
          </div>
        </div>

        ${t.extra || ""}

        <div class="block">
          <div class="block-label">Pon a prueba lo aprendido</div>
          ${quizHtml(t)}
        </div>

        <div class="prevnext">
          ${prev ? `<div class="pn" data-topic="${prev.id}"><span class="dir">← Anterior</span><span class="lbl">${prev.title}</span></div>` : `<div class="pn" data-go="temas"><span class="dir">← Volver</span><span class="lbl">Todos los temas</span></div>`}
          ${next ? `<div class="pn next" data-topic="${next.id}"><span class="dir">Siguiente →</span><span class="lbl">${next.title}</span></div>` : `<div class="pn next" data-go="progreso"><span class="dir">Terminaste →</span><span class="lbl">Ver tu progreso</span></div>`}
        </div>
      </div>
    </div>
  </section>`;
}

/* ---------- Router ---------- */
let currentRoute = "inicio";

function render(route) {
  const app = document.getElementById("app");
  let html = "";

  if (route.startsWith("tema:")) {
    const t = byId(route.slice(5));
    if (!t) return go("temas");
    html = viewTema(t);
    if (!State.visited[t.id]) { State.visited[t.id] = true; saveState(); }
  } else {
    switch (route) {
      case "temas":      html = viewTemas(); break;
      case "ruta":       html = viewRuta(); break;
      case "ejercicios": html = viewEjercicios(); break;
      case "progreso":   html = viewProgreso(); break;
      default:           html = viewInicio(); route = "inicio";
    }
  }

  app.innerHTML = html + footHtml();
  app.querySelector(".view").classList.add("active");
  currentRoute = route;
  syncNav(route);
  updateRing();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function footHtml() {
  return `<footer class="foot">
    <span>Paradigmas de Aprendizaje en IA · Institución Universitaria del Putumayo</span>
    <span>Tu progreso se guarda en este navegador</span>
  </footer>`;
}

function syncNav(route) {
  const base = route.startsWith("tema:") ? "temas" : route;
  document.querySelectorAll("#nav a").forEach(a => {
    a.classList.toggle("active", a.dataset.go === base);
  });
}

function updateRing() {
  const pct = Math.round(overallProgress() * 100);
  const fg = document.getElementById("ringFg");
  if (fg) fg.setAttribute("stroke-dasharray", `${(pct * 97.4) / 100} 100`);
  const txt = document.getElementById("navPct");
  if (txt) txt.textContent = pct + "%";
}

function go(route) {
  if (route === "continuar") {
    const pend = TOPICS.find(t => !topicDone(t)) || TOPICS[0];
    route = "tema:" + pend.id;
  }
  const hash = route.startsWith("tema:") ? "#tema/" + route.slice(5) : "#" + route;
  if (location.hash !== hash) { location.hash = hash; }
  else { render(route); }
  closeMenu();
}

function routeFromHash() {
  const h = location.hash.replace(/^#/, "");
  if (!h) return "inicio";
  if (h.startsWith("tema/")) return "tema:" + h.slice(5);
  return h;
}

/* ---------- Menú móvil ---------- */
function closeMenu() {
  const nav = document.getElementById("nav");
  const b = document.getElementById("burger");
  if (nav) nav.classList.remove("open");
  if (b) b.setAttribute("aria-expanded", "false");
}

/* ---------- Ejercicios ---------- */
function handleQuizClick(btn) {
  const card = btn.closest(".quiz");
  if (!card || card.dataset.answered === "1") return;
  card.dataset.answered = "1";

  const t = byId(card.dataset.topic);
  const qi = Number(card.dataset.qi);
  const item = t.quiz[qi];
  const chosen = Number(btn.dataset.oi);
  const ok = chosen === item.correct;

  card.querySelectorAll(".quiz-opt").forEach((b, i) => {
    b.disabled = true;
    const mark = b.querySelector(".mark");
    if (i === item.correct) { b.classList.add("correct"); mark.textContent = "✓"; }
    else if (i === chosen) { b.classList.add("wrong"); mark.textContent = "✕"; }
  });

  const fb = card.querySelector(".quiz-fb");
  fb.className = "quiz-fb show " + (ok ? "ok" : "no");
  fb.innerHTML = `<b>${ok ? "Correcto" : "No exactamente"}</b>${item.exp}`;

  const key = `${t.id}:${qi}`;
  if (State.answers[key] === undefined) {
    State.answers[key] = ok;
    if (ok) State.points += 10;
    saveState();
    updateRing();
  }
}

/* ---------- Arranque ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadState();

  document.body.addEventListener("click", (e) => {
    const opt = e.target.closest(".quiz-opt");
    if (opt) { handleQuizClick(opt); return; }

    const topicEl = e.target.closest("[data-topic]");
    if (topicEl && !e.target.closest(".quiz")) { go("tema:" + topicEl.dataset.topic); return; }

    const goEl = e.target.closest("[data-go]");
    if (goEl) { go(goEl.dataset.go); return; }
  });

  document.getElementById("burger").addEventListener("click", () => {
    const nav = document.getElementById("nav");
    const open = nav.classList.toggle("open");
    document.getElementById("burger").setAttribute("aria-expanded", String(open));
  });

  document.querySelector(".brand").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go("inicio"); }
  });

  window.addEventListener("hashchange", () => render(routeFromHash()));
  render(routeFromHash());
});

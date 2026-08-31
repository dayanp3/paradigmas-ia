/* =========================================================
   progress.js — Niveles, insignias y racha

   Regla de diseño: nada se premia por hacer clic. Cada punto
   y cada insignia corresponde a una acción de aprendizaje
   verificable (leer un tema completo, acertar un ejercicio,
   terminar un bloque de la ruta).
   ========================================================= */

/* ---------- Puntos ---------- */
const PTS_ACIERTO = 10;   // responder bien un ejercicio, la primera vez
const PTS_TEMA    = 25;   // completar un tema entero (leído + ejercicios resueltos)

/* ---------- Niveles ---------- */
const NIVELES = [
  { min: 0,   n: 1, t: "Explorador",   d: "Estás empezando a recorrer los paradigmas." },
  { min: 80,  n: 2, t: "Aprendiz",     d: "Ya manejas los fundamentos del aprendizaje automático." },
  { min: 200, n: 3, t: "Practicante",  d: "Distingues los paradigmas y sus mecanismos." },
  { min: 350, n: 4, t: "Analista",     d: "Comprendes las diferencias finas entre técnicas." },
  { min: 500, n: 5, t: "Especialista", d: "Dominas el mapa completo del aprendizaje en IA." },
];

function nivelActual(puntos) {
  let cur = NIVELES[0];
  for (const n of NIVELES) if (puntos >= n.min) cur = n;
  return cur;
}
function nivelSiguiente(puntos) {
  return NIVELES.find(n => n.min > puntos) || null;
}

/* ---------- Insignias ---------- */
/* Cada una exige aprendizaje comprobado, no actividad. */
const BADGES = [
  {
    id: "primer-paso", t: "Primer paso", icon: "🚩",
    d: "Completa tu primer tema: leerlo y resolver bien sus ejercicios.",
    check: () => TOPICS.filter(topicDone).length >= 1,
  },
  {
    id: "fundamentos", t: "Fundamentos", icon: "📐",
    d: "Domina el aprendizaje supervisado y el no supervisado.",
    check: () => ["supervisado", "no-supervisado"].every(id => topicDone(byId(id))),
  },
  {
    id: "sin-etiquetas", t: "Sin etiquetas", icon: "🔍",
    d: "Completa semisupervisado y autosupervisado.",
    check: () => ["semisupervisado", "autosupervisado"].every(id => topicDone(byId(id))),
  },
  {
    id: "especializador", t: "Especializador", icon: "🎯",
    d: "Completa Transfer Learning y Fine-tuning.",
    check: () => topicDone(byId("transfer-learning")),
  },
  {
    id: "experiencia", t: "De la experiencia", icon: "🔄",
    d: "Completa aprendizaje por refuerzo y alineación (RLHF / RLAIF).",
    check: () => ["refuerzo", "rlhf-rlaif"].every(id => topicDone(byId(id))),
  },
  {
    id: "frontera", t: "En la frontera", icon: "🌐",
    d: "Completa aprendizaje en contexto y modelos del mundo.",
    check: () => ["in-context", "world-models"].every(id => topicDone(byId(id))),
  },
  {
    id: "impecable", t: "Impecable", icon: "✨",
    d: "Termina un tema entero sin una sola respuesta incorrecta.",
    check: () => TOPICS.some(t =>
      t.quiz.length > 0 &&
      t.quiz.every((_, i) => State.answers[`${t.id}:${i}`] === true)
    ),
  },
  {
    id: "recorrido", t: "Recorrido completo", icon: "🏅",
    d: "Completa los nueve paradigmas.",
    check: () => TOPICS.every(topicDone),
  },
];

function badgesGanadas() { return BADGES.filter(b => b.check()); }

/* ---------- Racha de días ---------- */
function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function diasEntre(a, b) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}
/* Se llama solo cuando hay actividad real de aprendizaje. */
function registrarActividad() {
  const hoy = hoyISO();
  if (!State.ultimoDia) { State.racha = 1; }
  else {
    const dif = diasEntre(State.ultimoDia, hoy);
    if (dif === 0) { /* mismo día: la racha no cambia */ }
    else if (dif === 1) { State.racha = (State.racha || 0) + 1; }
    else { State.racha = 1; }
  }
  State.ultimoDia = hoy;
}

/* ---------- Aviso flotante ---------- */
function toast(titulo, texto, icono) {
  let cont = document.getElementById("toasts");
  if (!cont) {
    cont = document.createElement("div");
    cont.id = "toasts";
    cont.className = "toasts";
    document.body.appendChild(cont);
  }
  // Nunca más de 3 avisos a la vez: apilados tapan el contenido
  while (cont.children.length >= 3) cont.firstElementChild.remove();

  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span class="t-icon">${icono}</span>
    <span class="t-body"><b>${titulo}</b><span>${texto}</span></span>`;
  cont.appendChild(el);
  requestAnimationFrame(() => el.classList.add("in"));
  setTimeout(() => {
    el.classList.remove("in");
    setTimeout(() => el.remove(), 350);
  }, 4200);
}

/* Compara el estado antes/después de una acción y avisa de lo ganado. */
function revisarLogros(antes) {
  const nuevoNivel = nivelActual(State.points);
  if (nuevoNivel.n > antes.nivel) {
    toast(`Nivel ${nuevoNivel.n}: ${nuevoNivel.t}`, nuevoNivel.d, "⬆️");
  }
  const ganadas = badgesGanadas().map(b => b.id);
  ganadas.filter(id => !antes.badges.includes(id)).forEach(id => {
    const b = BADGES.find(x => x.id === id);
    toast("Insignia desbloqueada", b.t, b.icon);
  });
}
function snapshotLogros() {
  return { nivel: nivelActual(State.points).n, badges: badgesGanadas().map(b => b.id) };
}

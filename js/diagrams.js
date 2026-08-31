/* =========================================================
   diagrams.js — Diagramas SVG explicativos
   Paleta clara. Cada diagrama muestra el mecanismo real
   del paradigma, no decoración.
   ========================================================= */

const DC = {
  card:    "#ffffff",
  soft:    "#f6f7fc",
  border:  "#d9dded",
  text:    "#1a1d2e",
  muted:   "#6b7186",
  primary: "#4f46e5",
  primarySoft: "#eef2ff",
  success: "#059669",
  successSoft: "#ecfdf5",
  warn:    "#d97706",
  warnSoft:"#fffbeb",
};

function svgOpen(id, w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" xmlns="http://www.w3.org/2000/svg" role="img" font-family="Inter, ui-sans-serif, system-ui, sans-serif">
  <defs>
    <marker id="ar-${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${DC.primary}"/>
    </marker>
    <marker id="as-${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${DC.success}"/>
    </marker>
  </defs>`;
}
const svgClose = `</svg>`;

/* Caja con texto multilínea */
function nbox(x, y, w, h, lines, opts = {}) {
  const {
    fill = DC.card, stroke = DC.border, tc = DC.text,
    fs = 12.5, fw = 600, rx = 10, sw = 1.4
  } = opts;
  lines = Array.isArray(lines) ? lines : [lines];
  const startDy = -((lines.length - 1) * 15) / 2;
  const tspans = lines
    .map((l, i) => `<tspan x="${x + w / 2}" dy="${i === 0 ? startDy : 15}">${l}</tspan>`)
    .join("");
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
  <text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" fill="${tc}" font-size="${fs}" font-weight="${fw}">${tspans}</text>`;
}

function tag(x, y, text, color = DC.muted, anchor = "middle", fs = 10.5) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="${fs}">${text}</text>`;
}

/* Flecha principal */
function arrow(id, d, opts = {}) {
  const { dash = "", w = 1.7 } = opts;
  return `<path d="${d}" fill="none" stroke="${DC.primary}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} marker-end="url(#ar-${id})"/>`;
}
/* Flecha de retorno / ciclo */
function arrowBack(id, d, opts = {}) {
  const { dash = "4,3", w = 1.6 } = opts;
  return `<path d="${d}" fill="none" stroke="${DC.success}" stroke-width="${w}" stroke-dasharray="${dash}" marker-end="url(#as-${id})"/>`;
}

function dots(cx, cy, color, n, r = 3.4) {
  const pts = [[0,0],[10,4],[-8,7],[4,-9],[-11,-3],[9,10],[-4,11],[13,-6]];
  let out = "";
  for (let i = 0; i < n; i++) {
    const [dx, dy] = pts[i % pts.length];
    out += `<circle cx="${cx + dx * 1.6}" cy="${cy + dy * 1.6}" r="${r}" fill="${color}"/>`;
  }
  return out;
}

/* ---------- 1. Supervisado ---------- */
const SVG_SUPERVISADO = svgOpen("d1", 640, 230) + `
  ${nbox(16, 68, 152, 62, ["Datos etiquetados", "(entrada x, salida y)"], { fs: 11.5 })}
  ${arrow("d1", "M168,99 L228,99")}
  ${nbox(228, 68, 110, 62, ["Modelo"], { fill: DC.primarySoft, stroke: DC.primary })}
  ${arrow("d1", "M338,99 L398,99")}
  ${nbox(398, 68, 150, 62, ["Predicción", "ŷ"], { fs: 12 })}
  ${arrow("d1", "M473,130 L473,158")}
  ${nbox(330, 158, 216, 40, ["Comparar ŷ con y real → error"], { fs: 11, fill: DC.soft })}
  ${arrowBack("d1", "M330,178 L200,178 L200,130")}
  ${tag(258, 216, "ajustar parámetros del modelo", DC.success, "start", 10.5)}
` + svgClose;

/* ---------- 2. No supervisado ---------- */
const SVG_NO_SUPERVISADO = svgOpen("d2", 640, 215) + `
  ${nbox(16, 70, 150, 60, ["Datos sin", "etiquetar"], { fs: 12 })}
  ${dots(60, 158, "#b9bfd4", 8)}
  ${arrow("d2", "M172,100 L232,100")}
  ${nbox(232, 70, 170, 60, ["Algoritmo agrupa", "por similitud"], { fs: 12, fill: DC.primarySoft, stroke: DC.primary })}
  ${arrow("d2", "M406,100 L466,100")}
  <circle cx="532" cy="58" r="34" fill="none" stroke="${DC.primary}" stroke-width="1.3" stroke-dasharray="4,3"/>
  ${dots(532, 58, DC.primary, 6)}
  <circle cx="472" cy="140" r="30" fill="none" stroke="${DC.success}" stroke-width="1.3" stroke-dasharray="4,3"/>
  ${dots(472, 140, DC.success, 5)}
  <circle cx="583" cy="148" r="28" fill="none" stroke="${DC.warn}" stroke-width="1.3" stroke-dasharray="4,3"/>
  ${dots(583, 148, DC.warn, 5)}
  ${tag(320, 200, "el modelo descubre los grupos por sí solo — nadie se los indicó", DC.muted)}
` + svgClose;

/* ---------- 3. Semisupervisado ---------- */
const SVG_SEMISUPERVISADO = svgOpen("d3", 640, 222) + `
  ${nbox(16, 26, 190, 50, ["Pocos datos etiquetados"], { fs: 11.5, fill: DC.primarySoft, stroke: DC.primary })}
  ${nbox(16, 100, 190, 50, ["Muchos datos sin etiquetar"], { fs: 11.5 })}
  ${arrow("d3", "M206,51 L266,88")}
  ${arrow("d3", "M206,125 L266,102")}
  ${nbox(266, 66, 120, 60, ["Modelo"], { fill: DC.primarySoft, stroke: DC.primary })}
  ${arrow("d3", "M386,96 L446,96")}
  ${nbox(446, 66, 178, 60, ["Genera pseudo-etiquetas", "para el resto"], { fs: 11 })}
  ${arrowBack("d3", "M535,126 L535,174 L326,174 L326,126")}
  ${tag(430, 192, "reentrena con datos reales + pseudo-etiquetados", DC.success)}
` + svgClose;

/* ---------- 4. Autosupervisado ---------- */
const SVG_AUTOSUPERVISADO = svgOpen("d4", 640, 212) + `
  ${nbox(16, 70, 194, 60, ['"El cielo está muy ___"', "(se oculta una parte)"], { fs: 11.5 })}
  ${arrow("d4", "M210,100 L268,100")}
  ${nbox(268, 70, 140, 60, ["Modelo predice", "la parte oculta"], { fs: 11.5, fill: DC.primarySoft, stroke: DC.primary })}
  ${arrow("d4", "M408,100 L466,100")}
  ${nbox(466, 70, 158, 60, ['Predicción: "soleado"'], { fs: 11.5 })}
  ${arrowBack("d4", "M545,130 L545,158 L113,158 L113,130")}
  ${tag(329, 178, "se compara con la palabra real oculta: el propio dato es la etiqueta", DC.success)}
` + svgClose;

/* ---------- 5a. Transfer learning: pipeline ---------- */
const SVG_TRANSFER_PIPELINE = svgOpen("d5a", 640, 190) + `
  ${nbox(10, 65, 150, 60, ["Preentrenamiento", "(datos masivos)"], { fs: 11.5 })}
  ${arrow("d5a", "M160,95 L212,95")}
  ${nbox(212, 65, 152, 60, ["Modelo base", "(conocimiento general)"], { fs: 11, fill: DC.primarySoft, stroke: DC.primary })}
  ${arrow("d5a", "M364,95 L416,95")}
  ${nbox(416, 65, 124, 60, ["Fine-tuning", "(datos específicos)"], { fs: 11 })}
  ${arrow("d5a", "M540,95 L576,95")}
  ${nbox(576, 45, 58, 100, ["Modelo", "especia-", "lizado"], { fs: 10, fill: DC.successSoft, stroke: DC.success, fw: 700 })}
` + svgClose;

/* ---------- 5b. LoRA ---------- */
const SVG_LORA = svgOpen("d5b", 640, 222) + `
  ${nbox(20, 40, 232, 130, ["Pesos preentrenados W", "congelados", "(no se modifican)"], { fs: 12, fill: DC.soft, stroke: DC.border, tc: DC.muted })}
  ${tag(20, 190, "modelo original — miles de millones de parámetros", DC.muted, "start", 10)}
  ${nbox(300, 80, 132, 50, ["Matrices LoRA", "A · B (entrenables)"], { fs: 10.5, fill: DC.successSoft, stroke: DC.success, tc: DC.success })}
  ${tag(366, 146, "0,1 – 1 % de los parámetros", DC.success, "middle", 10)}
  <text x="274" y="112" text-anchor="middle" fill="${DC.muted}" font-size="19">+</text>
  ${arrow("d5b", "M432,105 L490,105")}
  ${nbox(490, 75, 132, 60, ["Salida adaptada", "a la nueva tarea"], { fs: 11 })}
` + svgClose;

/* ---------- 6. Refuerzo ---------- */
const SVG_REFUERZO = svgOpen("d6", 640, 222) + `
  ${tag(320, 20, "el agente ajusta su política para maximizar la recompensa acumulada", DC.muted)}
  ${nbox(60, 82, 172, 62, ["Agente"], { fs: 13.5, fill: DC.primarySoft, stroke: DC.primary })}
  ${nbox(420, 82, 172, 62, ["Entorno"], { fs: 13.5 })}
  ${arrow("d6", "M232,97 C 302,62 382,62 416,97")}
  ${tag(324, 58, "acción", DC.text, "middle", 11.5)}
  ${arrowBack("d6", "M418,137 C 350,177 302,177 234,137", { dash: "" })}
  ${tag(324, 198, "nuevo estado + recompensa", DC.success, "middle", 11.5)}
` + svgClose;

/* ---------- 7. RLHF / RLAIF ---------- */
const SVG_ALINEACION = svgOpen("d7", 640, 232) + `
  ${nbox(8, 80, 132, 60, ["Modelo genera", "varias respuestas"], { fs: 10.5 })}
  ${arrow("d7", "M140,110 L186,110")}
  ${nbox(186, 62, 152, 96, ["Evaluador compara", "y prefiere una", "humano = RLHF", "IA + constitución = RLAIF"], { fs: 9.6, fill: DC.primarySoft, stroke: DC.primary })}
  ${arrow("d7", "M338,110 L384,110")}
  ${nbox(384, 80, 122, 60, ["Modelo de", "recompensa"], { fs: 10.5 })}
  ${arrow("d7", "M506,110 L552,110")}
  ${nbox(552, 62, 80, 96, ["RL", "(PPO)", "ajusta el", "modelo"], { fs: 9.6, fill: DC.successSoft, stroke: DC.success, tc: DC.success })}
  ${arrowBack("d7", "M592,158 L592,196 L74,196 L74,140")}
  ${tag(330, 214, "el resultado es un modelo alineado con las preferencias definidas", DC.success)}
` + svgClose;

/* ---------- 8. Aprendizaje en contexto ---------- */
const SVG_EN_CONTEXTO = svgOpen("d8", 640, 212) + `
  ${nbox(16, 52, 250, 102, ["Prompt:", "instrucción + ejemplos", "+ consulta nueva"], { fs: 11.5 })}
  ${arrow("d8", "M266,103 L324,103")}
  ${nbox(324, 63, 142, 80, ["Modelo", "pesos congelados"], { fs: 11, fill: DC.primarySoft, stroke: DC.primary })}
  ${arrow("d8", "M466,103 L524,103")}
  ${nbox(524, 63, 102, 80, ["Respuesta", "sigue el patrón"], { fs: 10.5 })}
  ${tag(324, 180, "no se actualiza ni un solo peso: el aprendizaje dura solo esa conversación", DC.muted)}
` + svgClose;

/* ---------- 9. World models ---------- */
const SVG_WORLD_MODELS = svgOpen("d9", 640, 222) + `
  ${nbox(14, 75, 172, 70, ["Estado actual", "+ acción propuesta"], { fs: 11 })}
  ${arrow("d9", "M186,110 L238,110")}
  ${nbox(238, 60, 162, 100, ["World model", "(simulador aprendido", "del entorno)"], { fs: 10.8, fill: DC.primarySoft, stroke: DC.primary })}
  ${arrow("d9", "M400,110 L452,110")}
  ${nbox(452, 75, 172, 70, ["Predicción del", "siguiente estado", "(imaginado)"], { fs: 11 })}
  ${arrowBack("d9", "M538,145 L538,178 L100,178 L100,145")}
  ${tag(320, 198, "el agente elige la mejor acción sin ejecutarla en el mundo real", DC.success)}
` + svgClose;

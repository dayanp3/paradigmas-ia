/* =========================================================
   Paradigmas de Aprendizaje en IA — contenido + interacción
   Sitio estático, sin dependencias externas de JS.
   ========================================================= */

/* ---------- Diagramas SVG (uno por tema, dibujados a mano) ---------- */
/* Paleta usada dentro de los SVG */
const C = {
  bg: "#171c29", bg2: "#131722", border: "#2a3040",
  text: "#e9ebf3", dim: "#a7adc2", faint: "#6b7288",
  accent: "#7c9eff", accent2: "#63e6c8", accent3: "#f5a97f",
};

function svgOpen(id, w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" xmlns="http://www.w3.org/2000/svg" font-family="Inter, ui-sans-serif, sans-serif">
  <defs>
    <marker id="arr-${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${C.accent}"/>
    </marker>
    <marker id="arr2-${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${C.accent2}"/>
    </marker>
  </defs>`;
}
const svgClose = `</svg>`;

function nbox(x, y, w, h, lines, opts = {}) {
  const { fill = C.bg, stroke = C.border, tc = C.text, fs = 12.5, fw = 600, rx = 10, dash = "" } = opts;
  lines = Array.isArray(lines) ? lines : [lines];
  const startDy = -((lines.length - 1) * 15) / 2;
  const tspans = lines.map((l, i) => `<tspan x="${x + w / 2}" dy="${i === 0 ? startDy : 15}">${l}</tspan>`).join("");
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.3" ${dash ? `stroke-dasharray="${dash}"` : ""}/>
  <text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" fill="${tc}" font-size="${fs}" font-weight="${fw}">${tspans}</text>`;
}
function tag(x, y, text, color = C.faint, anchor = "middle", fs = 10) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="${fs}" letter-spacing=".02em">${text}</text>`;
}
function seg(id, d, opts = {}) {
  const { color = C.accent, dash = "", marker = true, w = 1.6 } = opts;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ""} ${marker ? `marker-end="url(#arr-${id})"` : ""}/>`;
}
function seg2(id, d, opts = {}) {
  return seg(id, d, { color: C.accent2, marker: "arr2", ...opts, });
}
function segAcc2(id, d, opts = {}) {
  const { dash = "", w = 1.6 } = opts;
  return `<path d="${d}" fill="none" stroke="${C.accent2}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ""} marker-end="url(#arr2-${id})"/>`;
}

/* 1. Supervisado */
const svg1 = svgOpen("t1", 640, 226) + `
  ${nbox(16, 68, 152, 62, ["Datos etiquetados", "(entrada x, salida y)"], { fs: 11.5 })}
  ${seg("t1", "M168,99 L228,99")}
  ${nbox(228, 68, 110, 62, ["Modelo"], { fill: C.bg2, stroke: C.accent })}
  ${seg("t1", "M338,99 L398,99")}
  ${nbox(398, 68, 150, 62, ["Predicción", "ŷ"], { fs: 12 })}
  ${seg("t1", "M473,130 L473,160")}
  ${nbox(330, 160, 216, 40, ["Comparar ŷ con y real → error"], { fs: 11, fill: C.bg2 })}
  ${segAcc2("t1", "M330,180 L200,180 L200,130", { dash: "3,3" })}
  ${tag(255, 216, "ajustar parámetros del modelo", C.accent2, "start", 10.5)}
  ${svgClose}`;

/* 2. No supervisado */
function dots(cx, cy, color, seedN, r = 3.2) {
  let out = "";
  const pts = [[0,0],[10,4],[-8,7],[4,-9],[-11,-3],[9,10],[-4,11],[13,-6]];
  for (let i = 0; i < seedN; i++) {
    const [dx, dy] = pts[i % pts.length];
    out += `<circle cx="${cx + dx * 1.6}" cy="${cy + dy * 1.6}" r="${r}" fill="${color}" opacity=".9"/>`;
  }
  return out;
}
const svg2 = svgOpen("t2", 640, 210) + `
  ${nbox(16, 70, 150, 60, ["Datos sin", "etiquetar"], { fs: 12 })}
  ${dots(50, 150, C.faint, 8)}${dots(90, 165, C.faint, 6)}${dots(60, 180, C.faint, 5)}
  ${seg("t2", "M172,100 L232,100")}
  ${nbox(232, 70, 170, 60, ["Algoritmo agrupa", "por similitud"], { fs: 12 })}
  ${seg("t2", "M406,100 L466,100")}
  <circle cx="530" cy="60" r="34" fill="none" stroke="${C.accent}" stroke-width="1.3" stroke-dasharray="3,3"/>
  ${dots(530, 60, C.accent, 6)}
  <circle cx="470" cy="140" r="30" fill="none" stroke="${C.accent2}" stroke-width="1.3" stroke-dasharray="3,3"/>
  ${dots(470, 140, C.accent2, 5)}
  <circle cx="580" cy="150" r="28" fill="none" stroke="${C.accent3}" stroke-width="1.3" stroke-dasharray="3,3"/>
  ${dots(580, 150, C.accent3, 5)}
  ${tag(530, 190, "grupos (clusters) descubiertos por el modelo", C.faint, "middle", 10.5)}
  ${svgClose}`;

/* 3. Semisupervisado */
const svg3 = svgOpen("t3", 640, 220) + `
  ${nbox(16, 26, 190, 50, ["Pocos datos etiquetados"], { fs: 11.5, stroke: C.accent })}
  ${nbox(16, 100, 190, 50, ["Muchos datos sin etiquetar"], { fs: 11.5 })}
  ${seg("t3", "M206,51 L266,90")}
  ${seg("t3", "M206,125 L266,100")}
  ${nbox(266, 66, 120, 60, ["Modelo"], { fill: C.bg2, stroke: C.accent })}
  ${seg("t3", "M386,96 L446,96")}
  ${nbox(446, 66, 178, 60, ["Genera pseudo-etiquetas", "para el resto de datos"], { fs: 11 })}
  ${segAcc2("t3", "M535,126 L535,175 L326,175 L326,126", { dash: "3,3" })}
  ${tag(430, 190, "reentrena con datos reales + pseudo-etiquetados", C.accent2, "middle", 10.5)}
  ${svgClose}`;

/* 4. Autosupervisado */
const svg4 = svgOpen("t4", 640, 210) + `
  ${nbox(16, 70, 190, 60, ['"El cielo está muy ___"', "(se oculta una parte)"], { fs: 11.5 })}
  ${seg("t4", "M206,100 L266,100")}
  ${nbox(266, 70, 140, 60, ["Modelo predice", "la parte oculta"], { fs: 11.5, stroke: C.accent })}
  ${seg("t4", "M406,100 L466,100")}
  ${nbox(466, 70, 158, 60, ['Predicción: "soleado"'], { fs: 11.5 })}
  ${segAcc2("t4", "M545,130 L545,160 L110,160 L110,130", { dash: "3,3" })}
  ${tag(330, 176, "se compara con la palabra real oculta → el propio dato es la etiqueta", C.accent2, "middle", 10.5)}
  ${svgClose}`;

/* 5a. Transfer learning / fine-tuning — pipeline */
const svg5a = svgOpen("t5a", 640, 190) + `
  ${nbox(10, 65, 150, 60, ["Preentrenamiento", "(datos masivos)"], { fs: 11.5 })}
  ${seg("t5a", "M160,95 L214,95")}
  ${nbox(214, 65, 150, 60, ["Modelo base", "(conocimiento general)"], { fs: 11, stroke: C.accent })}
  ${seg("t5a", "M364,95 L418,95")}
  ${nbox(418, 65, 122, 60, ["Fine-tuning", "(datos específicos)"], { fs: 11 })}
  ${seg("t5a", "M540,95 L578,95")}
  ${nbox(578, 45, 56, 100, ["Modelo", "especia-", "lizado"], { fs: 10, stroke: C.accent2, fw: 700 })}
  ${svgClose}`;

/* 5b. LoRA — pesos congelados vs. matrices entrenables */
const svg5b = svgOpen("t5b", 640, 220) + `
  ${nbox(20, 40, 230, 130, ["Pesos preentrenados W", "❄ congelados", "(no se modifican)"], { fs: 12, stroke: C.faint, tc: C.dim })}
  ${tag(20, 190, "modelo original — miles de millones de parámetros", C.faint, "start", 10)}
  ${nbox(300, 80, 130, 50, ["Matrices LoRA", "A · B (entrenables)"], { fs: 10.5, stroke: C.accent2, tc: C.accent2 })}
  ${tag(365, 145, "≈ 0.1–1% de los parámetros", C.accent2, "middle", 10)}
  ${seg("t5b", "M250,105 L296,105", { color: C.faint, marker: false })}
  <text x="273" y="100" text-anchor="middle" fill="${C.faint}" font-size="16">+</text>
  ${seg("t5b", "M430,105 L490,105")}
  ${nbox(490, 75, 130, 60, ["Salida adaptada", "a la nueva tarea"], { fs: 11 })}
  ${svgClose}`;

/* 6. Aprendizaje por refuerzo */
const svg6 = svgOpen("t6", 640, 220) + `
  ${nbox(60, 80, 170, 62, ["Agente"], { fs: 13, stroke: C.accent })}
  ${nbox(420, 80, 170, 62, ["Entorno"], { fs: 13 })}
  ${seg("t6", "M230,95 C 300,60 380,60 418,95", { })}
  ${tag(324, 55, "acción", C.text, "middle", 11)}
  ${segAcc2("t6", "M418,135 C 350,175 300,175 232,135", { })}
  ${tag(324, 195, "nuevo estado + recompensa", C.accent2, "middle", 11)}
  ${tag(324, 15, "el agente ajusta su política para maximizar la recompensa acumulada", C.faint, "middle", 10.5)}
  ${svgClose}`;

/* 7. RLHF / RLAIF */
const svg7 = svgOpen("t7", 640, 230) + `
  ${nbox(10, 80, 130, 60, ["Modelo genera", "varias respuestas"], { fs: 10.5 })}
  ${seg("t7", "M140,110 L188,110")}
  ${nbox(188, 65, 150, 90, ["Evaluador compara", "y prefiere una", "(humano = RLHF", "IA + constitución = RLAIF)"], { fs: 9.6, stroke: C.accent })}
  ${seg("t7", "M338,110 L386,110")}
  ${nbox(386, 80, 120, 60, ["Modelo de", "recompensa"], { fs: 10.5 })}
  ${seg("t7", "M506,110 L554,110")}
  ${nbox(554, 65, 76, 90, ["RL", "(PPO)", "ajusta el", "modelo"], { fs: 9.6, stroke: C.accent2, tc: C.accent2 })}
  ${segAcc2("t7", "M592,155 L592,195 L75,195 L75,140", { dash: "3,3" })}
  ${tag(330, 210, "modelo alineado con las preferencias/principios definidos", C.accent2, "middle", 10.5)}
  ${svgClose}`;

/* 8. In-context learning */
const svg8 = svgOpen("t8", 640, 210) + `
  ${nbox(16, 55, 250, 100, ["Prompt:", "instrucción + ejemplos", "+ consulta nueva"], { fs: 11.5 })}
  ${seg("t8", "M266,105 L326,105")}
  ${nbox(326, 65, 140, 80, ["Modelo", "❄ pesos congelados"], { fs: 11, stroke: C.accent })}
  ${seg("t8", "M466,105 L526,105")}
  ${nbox(526, 65, 100, 80, ["Respuesta", "sigue el patrón"], { fs: 10.5 })}
  ${tag(330, 175, "no se actualiza ni un solo peso — el “aprendizaje” dura solo esa conversación", C.faint, "middle", 10.5)}
  ${svgClose}`;

/* 9. World models */
const svg9 = svgOpen("t9", 640, 220) + `
  ${nbox(14, 75, 170, 70, ["Estado actual", "+ acción propuesta"], { fs: 11 })}
  ${seg("t9", "M184,110 L240,110")}
  ${nbox(240, 60, 160, 100, ["World model", "(simulador", "aprendido del entorno)"], { fs: 10.8, stroke: C.accent })}
  ${seg("t9", "M400,110 L456,110")}
  ${nbox(456, 75, 170, 70, ["Predicción del", "siguiente estado", "(imaginado)"], { fs: 11 })}
  ${segAcc2("t9", "M541,145 L541,180 L99,180 L99,145", { dash: "3,3" })}
  ${tag(320, 197, "el agente elige la mejor acción sin haberla ejecutado en el mundo real", C.accent2, "middle", 10.5)}
  ${svgClose}`;

/* ---------- Contenido de los 9 temas ---------- */
const TOPICS = [
  {
    id: "supervisado", num: 1, title: "Aprendizaje supervisado", tag: "Aprende de ejemplos con respuesta correcta",
    definicion: `El modelo aprende una función que relaciona <b>entradas</b> con <b>salidas</b> a partir de datos <b>etiquetados</b>: cada ejemplo de entrenamiento ya trae la respuesta correcta.`,
    explicacion: [
      `Durante el entrenamiento se le muestran al modelo pares <code>(entrada, salida)</code>. El modelo hace una predicción, se compara contra la etiqueta real usando una <strong>función de pérdida</strong>, y sus parámetros se ajustan (normalmente con descenso de gradiente) para reducir ese error.`,
      `Este ciclo se repite miles o millones de veces hasta que el modelo generaliza: puede predecir correctamente sobre ejemplos nuevos que nunca vio, no solo memorizar los de entrenamiento.`,
    ],
    diagram: svg1, diagramCaption: "Ciclo de entrenamiento supervisado: predicción → comparación con la etiqueta real → ajuste de parámetros.",
    examples: [
      { tag: "Clasificación", text: `Un filtro de <b>spam</b>: se entrena con miles de correos ya marcados como "spam" o "no spam", y aprende a clasificar correos nuevos.` },
      { tag: "Regresión", text: `Predecir el <b>precio de una vivienda</b> a partir de metros cuadrados y ubicación, usando precios reales de ventas pasadas como etiqueta.` },
    ],
    quiz: [
      { q: "¿Qué necesita obligatoriamente el aprendizaje supervisado para entrenar?", options: ["Solo datos, sin ninguna estructura", "Datos etiquetados (entrada y salida conocida)", "Un entorno con recompensas", "Una gran cantidad de texto sin procesar"], correct: 1, exp: "El supervisado requiere pares entrada-salida ya conocidos: es lo que lo distingue del no supervisado." },
      { q: "¿Para qué sirve la función de pérdida?", options: ["Para generar datos nuevos", "Para medir qué tan lejos está la predicción de la etiqueta real", "Para agrupar datos similares", "Para decidir cuántas capas tiene el modelo"], correct: 1, exp: "La pérdida cuantifica el error; el entrenamiento ajusta los parámetros para minimizarla." },
      { q: "Un modelo que predice el precio de una casa está resolviendo un problema de…", options: ["Clasificación", "Regresión", "Clustering", "Aprendizaje por refuerzo"], correct: 1, exp: "Predecir un valor numérico continuo (precio) es un problema de regresión, un caso particular de aprendizaje supervisado." },
    ],
  },
  {
    id: "no-supervisado", num: 2, title: "Aprendizaje no supervisado", tag: "Encuentra estructura sin etiquetas",
    definicion: `El modelo busca <b>patrones o estructuras</b> ocultas en los datos <b>sin usar etiquetas</b>: nadie le dice cuál es la respuesta correcta.`,
    explicacion: [
      `Como no hay una "respuesta correcta" que aprender, el algoritmo se basa en la <strong>similitud o distancia</strong> entre los datos para organizarlos: agrupa los que se parecen (<code>clustering</code>) o reduce su dimensionalidad para encontrar la estructura esencial detrás de muchas variables.`,
      `El resultado no es una predicción exacta, sino una nueva forma de ver los datos: grupos, jerarquías o representaciones más simples que un humano puede interpretar después.`,
    ],
    diagram: svg2, diagramCaption: "El algoritmo agrupa datos sin etiquetar según su similitud, descubriendo estructura por sí solo.",
    examples: [
      { tag: "Clustering", text: `<b>Segmentar clientes</b> de una tienda según su comportamiento de compra (K-means), sin saber de antemano qué grupos existen.` },
      { tag: "Reducción de dimensionalidad", text: `Usar <b>PCA o autoencoders</b> para comprimir imágenes de alta resolución en pocas variables y visualizarlas o comprimirlas.` },
    ],
    quiz: [
      { q: "¿Qué NO tiene el aprendizaje no supervisado que sí tiene el supervisado?", options: ["Datos", "Un algoritmo", "Etiquetas (respuestas conocidas)", "Parámetros"], correct: 2, exp: "La ausencia de etiquetas es justamente lo que define a este paradigma." },
      { q: "Agrupar clientes similares sin saber de antemano los grupos es un ejemplo de…", options: ["Clasificación", "Clustering", "Fine-tuning", "Aprendizaje por refuerzo"], correct: 1, exp: "El clustering agrupa datos por similitud sin etiquetas previas — es la técnica no supervisada más común." },
      { q: "¿En qué se basa principalmente un algoritmo no supervisado para organizar los datos?", options: ["En instrucciones escritas por un humano", "En la similitud o distancia entre los datos", "En una recompensa numérica", "En una etiqueta correcta"], correct: 1, exp: "Sin etiquetas, la única señal disponible es qué tan parecidos o distintos son los datos entre sí." },
    ],
  },
  {
    id: "semisupervisado", num: 3, title: "Aprendizaje semisupervisado", tag: "Pocas etiquetas + muchos datos sin etiquetar",
    definicion: `Combina una <b>pequeña cantidad de datos etiquetados</b> con una <b>gran cantidad de datos sin etiquetar</b> para entrenar el modelo.`,
    explicacion: [
      `El modelo aprende primero con los pocos datos etiquetados disponibles. Con ese conocimiento inicial, genera <strong>pseudo-etiquetas</strong> para los datos sin etiquetar (predice cuál sería su etiqueta) y las usa para seguir entrenando, refinando el modelo de forma iterativa.`,
      `Es útil cuando etiquetar es caro o lento (requiere un experto), pero conseguir datos sin etiquetar es fácil y barato.`,
    ],
    diagram: svg3, diagramCaption: "Un modelo inicial entrenado con pocas etiquetas genera pseudo-etiquetas para el resto de los datos.",
    examples: [
      { tag: "Medicina", text: `Diagnóstico por <b>imágenes médicas</b>: solo unas pocas radiografías tienen diagnóstico confirmado por un especialista, pero hay miles sin etiquetar.` },
      { tag: "Audio", text: `<b>Transcripción de voz</b>: solo una fracción de las horas de audio grabado fue transcrita manualmente; el resto se aprovecha sin etiquetar.` },
    ],
    quiz: [
      { q: "¿Qué combina el aprendizaje semisupervisado?", options: ["Solo datos etiquetados", "Solo datos sin etiquetar", "Pocos datos etiquetados + muchos sin etiquetar", "Recompensas y castigos"], correct: 2, exp: "Es exactamente su definición: una mezcla de ambos tipos de datos, aprovechando lo poco etiquetado disponible." },
      { q: "¿Qué es una \"pseudo-etiqueta\"?", options: ["Una etiqueta puesta por un humano experto", "Una etiqueta que el propio modelo genera para datos sin etiquetar", "Un error del modelo", "Una recompensa en RL"], correct: 1, exp: "El modelo usa lo que ya aprendió para \"adivinar\" etiquetas de los datos restantes y seguir entrenando con ellas." },
      { q: "¿Cuándo conviene más este enfoque?", options: ["Cuando etiquetar es barato y rápido", "Cuando etiquetar es caro o requiere expertos, pero hay muchos datos sin etiquetar", "Cuando no hay ningún dato etiquetado", "Cuando el problema es un juego con recompensas"], correct: 1, exp: "Su valor está en aprovechar datos sin etiquetar cuando conseguir etiquetas es costoso." },
    ],
  },
  {
    id: "autosupervisado", num: 4, title: "Aprendizaje autosupervisado", tag: "El propio dato genera su etiqueta",
    definicion: `El modelo genera <b>sus propias etiquetas</b> a partir de la estructura interna de los datos, sin que ningún humano etiquete nada.`,
    explicacion: [
      `Se diseña una <strong>tarea pretexto</strong>: se oculta una parte del dato y se le pide al modelo que la prediga usando el resto. Como el dato original ya contiene la "respuesta correcta" (la parte que se ocultó), no hace falta intervención humana para crear las etiquetas.`,
      `Este mecanismo es la base del preentrenamiento de los grandes modelos de lenguaje actuales: predicen palabras ocultas o siguientes en textos masivos, aprendiendo representaciones muy ricas antes de resolver cualquier tarea específica.`,
    ],
    diagram: svg4, diagramCaption: "Se oculta una parte del dato y el modelo la predice; el propio dato original sirve como etiqueta.",
    examples: [
      { tag: "Texto", text: `<b>BERT y GPT</b> se preentrenan prediciendo palabras enmascaradas o la palabra siguiente en enormes cantidades de texto sin etiquetar por humanos.` },
      { tag: "Visión", text: `Modelos como <b>MAE o SimCLR</b> ocultan parches de una imagen y aprenden a reconstruirlos o a reconocer que dos recortes vienen de la misma imagen.` },
    ],
    quiz: [
      { q: "¿De dónde salen las etiquetas en el aprendizaje autosupervisado?", options: ["Las pone un anotador humano", "Las genera el propio dato al ocultar una parte de sí mismo", "Vienen de una recompensa del entorno", "No existen etiquetas de ningún tipo"], correct: 1, exp: "La \"etiqueta\" es la parte oculta del dato original: no requiere anotación humana." },
      { q: "¿Qué es una \"tarea pretexto\"?", options: ["La tarea final que le interesa al usuario", "Una tarea auxiliar diseñada para que el modelo aprenda representaciones útiles a partir de los propios datos", "Un tipo de recompensa", "Un conjunto de datos etiquetado por expertos"], correct: 1, exp: "Predecir la parte oculta de un dato no es el objetivo final, pero fuerza al modelo a aprender patrones útiles." },
      { q: "¿Con qué paradigma se preentrenan hoy la mayoría de los grandes modelos de lenguaje?", options: ["Aprendizaje por refuerzo puro", "Aprendizaje supervisado con miles de humanos etiquetando cada palabra", "Aprendizaje autosupervisado sobre texto masivo", "Aprendizaje semisupervisado"], correct: 2, exp: "Predecir la siguiente palabra sobre grandes corpus de texto es autosupervisado: el propio texto provee la señal de entrenamiento." },
    ],
  },
  {
    id: "transfer-learning", num: 5, title: "Transfer Learning y Fine-tuning", tag: "Reutilizar y especializar conocimiento ya aprendido", expo: true,
    definicion: `<b>Transfer learning</b> es reutilizar el conocimiento de un modelo ya entrenado en una tarea para acelerar o mejorar el aprendizaje en una tarea distinta pero relacionada. El <b>fine-tuning</b> es la técnica más común para lograrlo: continuar entrenando ese modelo con datos de la nueva tarea.`,
    explicacion: [
      `El proceso típico tiene dos etapas. Primero, un <strong>preentrenamiento</strong> sobre datos masivos y generales (casi siempre de forma autosupervisada) produce un <strong>modelo base</strong> con representaciones amplias del dominio (lenguaje, imágenes, etc.). Después, el <strong>fine-tuning</strong> continúa el entrenamiento de ese modelo con un conjunto de datos mucho más pequeño y específico de la tarea deseada, normalmente con una tasa de aprendizaje baja para no "olvidar" el conocimiento general ya adquirido.`,
      `Hacer <em>fine-tuning completo</em> (actualizar todos los parámetros) funciona, pero en modelos de miles de millones de parámetros es costoso en memoria y cómputo. Por eso se usan técnicas de <strong>PEFT</strong> (<em>Parameter-Efficient Fine-Tuning</em>), y en particular <strong>LoRA</strong> (<em>Low-Rank Adaptation</em>, 2021): en vez de tocar los pesos originales, se <strong>congelan</strong> casi todos y se insertan matrices pequeñas adicionales que sí se entrenan. Con solo un 0.1%–1% de los parámetros originales, se logran resultados muy cercanos al fine-tuning completo, con una fracción del costo.`,
      `Una analogía útil: no se construye un instrumento musical nuevo desde cero para tocar un estilo distinto — se afina el que ya existe. El "cuerpo" del instrumento (el modelo preentrenado) se mantiene; solo se ajusta lo necesario para el nuevo uso.`,
    ],
    diagram: svg5a, diagramCaption: "Preentrenamiento general → modelo base → fine-tuning con datos específicos → modelo especializado.",
    diagram2: svg5b, diagram2Caption: "LoRA: los pesos originales quedan congelados; solo se entrenan matrices adicionales pequeñas (bajo rango).",
    examples: [
      { tag: "Visión", text: `Tomar un modelo preentrenado en <b>ImageNet</b> (millones de imágenes generales) y hacer fine-tuning con unos pocos miles de radiografías para detectar neumonía.` },
      { tag: "LLMs", text: `Aplicar <b>LoRA</b> sobre un modelo tipo Llama con las conversaciones de soporte técnico de una empresa, para crear un asistente especializado sin reentrenar el modelo completo.` },
    ],
    extra: `<div class="block">
      <div class="block-label">Fine-tuning completo vs. PEFT / LoRA</div>
      <table class="compare">
        <tr><th>Aspecto</th><th>Fine-tuning completo</th><th>PEFT / LoRA</th></tr>
        <tr><td>Parámetros ajustados</td><td>Todos</td><td><b>Solo unos pocos (matrices nuevas)</b></td></tr>
        <tr><td>Memoria / GPU necesaria</td><td>Muy alta</td><td><b>Baja</b></td></tr>
        <tr><td>Tamaño del resultado</td><td>Un modelo completo por tarea</td><td><b>Un archivo pequeño de "adaptador" por tarea</b></td></tr>
        <tr><td>Tiempo de entrenamiento</td><td>Lento</td><td><b>Rápido</b></td></tr>
        <tr><td>Riesgo de "olvidar" lo general</td><td>Mayor</td><td><b>Menor</b> (los pesos base no cambian)</td></tr>
      </table>
    </div>`,
    quiz: [
      { q: "¿Cuál es la diferencia entre transfer learning y fine-tuning?", options: ["Son sinónimos exactos, no hay diferencia", "Transfer learning es la idea general de reutilizar conocimiento; fine-tuning es la técnica concreta de continuar entrenando el modelo", "Transfer learning solo aplica a imágenes y fine-tuning solo a texto", "Fine-tuning nunca usa un modelo preentrenado"], correct: 1, exp: "Fine-tuning es la forma más común de hacer transfer learning, pero el concepto de transfer learning es más amplio (por ejemplo, usar el modelo como extractor de características sin reentrenarlo también cuenta)." },
      { q: "¿Qué hace LoRA de forma distinta al fine-tuning completo?", options: ["Entrena absolutamente todos los parámetros del modelo", "Congela los pesos originales y entrena solo matrices adicionales pequeñas", "Elimina la necesidad de cualquier dato de entrenamiento", "Solo funciona con aprendizaje por refuerzo"], correct: 1, exp: "LoRA deja intactos los pesos preentrenados e inserta matrices de bajo rango que sí se ajustan, reduciendo drásticamente el costo." },
      { q: "¿Por qué se usa una tasa de aprendizaje baja durante el fine-tuning?", options: ["Para que el entrenamiento tarde más a propósito", "Para evitar que el modelo \"olvide\" el conocimiento general aprendido en el preentrenamiento", "Porque los datos de fine-tuning son de mala calidad", "Es un requisito técnico sin relación con el conocimiento previo"], correct: 1, exp: "Cambios bruscos en los pesos podrían destruir el conocimiento general útil que ya trae el modelo base." },
      { q: "Un ejemplo típico donde PEFT/LoRA es especialmente útil es…", options: ["Cuando se dispone de recursos de cómputo ilimitados", "Cuando se quiere adaptar un LLM grande a una tarea específica con recursos limitados", "Solo en aprendizaje no supervisado", "Cuando no existe ningún modelo preentrenado disponible"], correct: 1, exp: "PEFT/LoRA nació justamente para hacer viable especializar modelos enormes sin necesitar los recursos de un reentrenamiento completo." },
    ],
  },
  {
    id: "refuerzo", num: 6, title: "Aprendizaje por refuerzo", tag: "Aprender por prueba, error y recompensa",
    definicion: `Un <b>agente</b> aprende a tomar decisiones interactuando con un <b>entorno</b>, recibiendo <b>recompensas o castigos</b> según sus acciones, con el objetivo de maximizar la recompensa acumulada a largo plazo.`,
    explicacion: [
      `El proceso es un ciclo: el agente observa un <strong>estado</strong> del entorno, elige una <strong>acción</strong> según su <strong>política</strong> (su estrategia actual), el entorno responde con un nuevo estado y una <strong>recompensa</strong> numérica, y el agente usa esa señal para mejorar su política (por ejemplo con Q-learning o métodos de gradiente de política).`,
      `A diferencia del aprendizaje supervisado, aquí no existe una "respuesta correcta" explícita para cada acción — solo una señal de recompensa que puede llegar mucho después de la decisión que la causó, lo que hace el problema más difícil (crédito diferido).`,
    ],
    diagram: svg6, diagramCaption: "El agente actúa sobre el entorno; el entorno responde con un nuevo estado y una recompensa.",
    examples: [
      { tag: "Juegos", text: `<b>AlphaGo / AlphaZero</b> aprendió a jugar Go jugando millones de partidas contra sí mismo, mejorando su política con cada resultado.` },
      { tag: "Robótica", text: `Un <b>robot que aprende a caminar</b> en simulación, recibiendo recompensa por avanzar sin caerse y castigo por chocar o desestabilizarse.` },
    ],
    quiz: [
      { q: "¿Qué maximiza el agente en aprendizaje por refuerzo?", options: ["El número de datos etiquetados", "La recompensa acumulada a largo plazo", "La similitud entre datos", "El número de parámetros del modelo"], correct: 1, exp: "El objetivo central de RL es una política que maximice la recompensa total esperada, no solo la inmediata." },
      { q: "¿Qué es la \"política\" de un agente?", options: ["Un conjunto de datos etiquetados", "La estrategia que usa para decidir qué acción tomar en cada estado", "El nombre del algoritmo de clustering", "La arquitectura de red neuronal únicamente"], correct: 1, exp: "La política mapea estados a acciones (o a probabilidades de acción); es lo que el agente va mejorando con la experiencia." },
      { q: "¿Por qué se dice que RL enfrenta el problema del \"crédito diferido\"?", options: ["Porque los datos siempre están etiquetados de antemano", "Porque la recompensa de una acción puede llegar mucho después de haberla tomado", "Porque no existen entornos en RL", "Porque el modelo nunca actualiza sus parámetros"], correct: 1, exp: "Una buena o mala decisión puede no reflejarse en la recompensa hasta varios pasos después, dificultando saber qué acción fue realmente responsable." },
    ],
  },
  {
    id: "rlhf-rlaif", num: 7, title: "Alineación mediante RLHF y RLAIF", tag: "Ajustar el comportamiento del modelo a preferencias",
    definicion: `Técnicas de <b>alineación</b> que ajustan el comportamiento de un modelo ya preentrenado (típicamente un LLM) para que sus respuestas se acerquen a las preferencias o principios deseados, usando aprendizaje por refuerzo con retroalimentación <b>humana (RLHF)</b> o <b>de otra IA (RLAIF)</b>.`,
    explicacion: [
      `En <strong>RLHF</strong> (<em>Reinforcement Learning from Human Feedback</em>), personas comparan varias respuestas del modelo ante un mismo prompt y eligen cuál prefieren. Con esas comparaciones se entrena un <strong>modelo de recompensa</strong> que aprende a predecir qué respuesta preferiría un humano. Luego, un algoritmo de refuerzo (comúnmente PPO) ajusta el modelo original para que genere respuestas con mayor recompensa según ese modelo.`,
      `<strong>RLAIF</strong> (<em>Reinforcement Learning from AI Feedback</em>) sigue el mismo esquema, pero reemplaza al evaluador humano por otro modelo de IA que juzga las respuestas siguiendo un conjunto explícito de principios llamado <strong>"constitución"</strong> (de ahí el nombre <em>Constitutional AI</em>). Esto hace el proceso mucho más rápido y escalable que depender solo de miles de horas de evaluación humana, aunque la calidad final depende de qué tan buena sea esa "constitución" y el modelo evaluador.`,
    ],
    diagram: svg7, diagramCaption: "Comparaciones de preferencia → modelo de recompensa → RL ajusta el modelo → modelo alineado.",
    examples: [
      { tag: "RLHF", text: `Un modelo base de lenguaje (que solo completa texto) se convierte en un <b>asistente que sigue instrucciones</b> y evita respuestas dañinas gracias a rondas de RLHF.` },
      { tag: "RLAIF", text: `Anthropic usa <b>Constitutional AI</b> para que Claude evalúe y corrija sus propias respuestas según principios escritos, reduciendo la dependencia de evaluación humana masiva.` },
    ],
    quiz: [
      { q: "¿Cuál es la diferencia principal entre RLHF y RLAIF?", options: ["RLHF no usa aprendizaje por refuerzo y RLAIF sí", "En RLHF el evaluador es humano; en RLAIF el evaluador es otro modelo de IA guiado por principios", "RLAIF solo se usa en robótica", "No hay ninguna diferencia real entre ambos"], correct: 1, exp: "El esquema es el mismo (comparar respuestas, entrenar un modelo de recompensa, ajustar con RL); lo que cambia es quién hace la evaluación." },
      { q: "¿Qué es la \"constitución\" en Constitutional AI / RLAIF?", options: ["Un conjunto de datos de imágenes", "Un conjunto de principios explícitos que guían cómo debe evaluar el modelo evaluador", "El nombre del algoritmo de entrenamiento por gradiente", "Una ley sobre uso de datos personales"], correct: 1, exp: "La \"constitución\" son reglas o principios escritos que la IA evaluadora usa como criterio para preferir una respuesta sobre otra." },
      { q: "¿Para qué sirve el \"modelo de recompensa\" en RLHF/RLAIF?", options: ["Para generar imágenes nuevas", "Para aprender a predecir qué respuesta sería preferida, y así guiar el ajuste del modelo con RL", "Para etiquetar datos de forma automática sin ningún criterio", "Para reemplazar por completo al modelo original"], correct: 1, exp: "El modelo de recompensa traduce las preferencias (humanas o de IA) en una señal numérica que el algoritmo de RL puede usar para optimizar." },
    ],
  },
  {
    id: "in-context", num: 8, title: "Aprendizaje en contexto", tag: "Aprender desde el prompt, sin actualizar pesos",
    definicion: `Capacidad de un modelo grande (típicamente un LLM) de resolver una tarea nueva a partir de <b>ejemplos o instrucciones dados directamente en el prompt</b>, <b>sin actualizar ni un solo peso</b> del modelo.`,
    explicacion: [
      `Gracias al mecanismo de <strong>autoatención</strong> del transformer, el modelo usa los ejemplos presentes en el contexto como referencia para inferir el patrón de la tarea en el momento mismo de generar la respuesta (en <em>inferencia</em>, no en entrenamiento). Lo relevante no es solo la cantidad de ejemplos, sino qué tan pertinentes son para la tarea.`,
      `Se distingue el caso <strong>zero-shot</strong> (solo una instrucción, sin ejemplos) del <strong>few-shot</strong> (varios ejemplos dentro del mismo prompt). En ambos casos, el "aprendizaje" es temporal: existe solo durante esa conversación y desaparece al terminarla — es la diferencia clave frente al fine-tuning, que sí modifica el modelo de forma permanente.`,
    ],
    diagram: svg8, diagramCaption: "El modelo usa los ejemplos del propio prompt para inferir el patrón, sin modificar sus pesos.",
    examples: [
      { tag: "Few-shot", text: `Darle a un LLM tres pares de traducción <b>inglés-francés</b> en el prompt y pedirle que traduzca una cuarta frase nueva, sin haberlo reentrenado para traducción.` },
      { tag: "Formato", text: `Mostrarle a un chatbot el formato exacto de una <b>tabla</b> en el prompt para que continúe generando filas con ese mismo formato.` },
    ],
    quiz: [
      { q: "¿Qué NO ocurre durante el aprendizaje en contexto?", options: ["El modelo lee ejemplos del prompt", "Se actualizan los pesos del modelo", "El modelo genera una respuesta", "El modelo usa autoatención"], correct: 1, exp: "Es justamente lo que lo distingue del fine-tuning: los pesos permanecen exactamente iguales antes y después." },
      { q: "¿Cuál es la diferencia entre zero-shot y few-shot?", options: ["Zero-shot usa muchos ejemplos y few-shot ninguno", "Zero-shot no da ejemplos en el prompt (solo instrucción), few-shot sí incluye varios ejemplos", "Son exactamente lo mismo", "Few-shot requiere reentrenar el modelo"], correct: 1, exp: "La diferencia está en cuántos ejemplos de la tarea se incluyen directamente en el prompt." },
      { q: "El \"aprendizaje\" logrado por in-context learning…", options: ["Es permanente, como el fine-tuning", "Es temporal: solo dura esa conversación o prompt", "Modifica el preentrenamiento del modelo", "Requiere reiniciar el modelo desde cero"], correct: 1, exp: "Al no tocar los pesos, ese \"conocimiento\" desaparece cuando termina la conversación." },
    ],
  },
  {
    id: "world-models", num: 9, title: "Modelos del mundo (World Models)", tag: "Simular el entorno para predecir e imaginar",
    definicion: `Sistemas que aprenden una <b>representación interna</b> de cómo funciona un entorno —sus reglas, su física, su causalidad— para poder <b>predecir o simular</b> cómo evolucionará ante distintas acciones, sin necesidad de interactuar con el entorno real cada vez.`,
    explicacion: [
      `En vez de solo reaccionar a lo que percibe, el sistema construye una especie de <strong>simulador mental</strong> del mundo que le permite "imaginar" las consecuencias futuras de sus acciones y planificar antes de actuar, o incluso generar mundos completamente nuevos y coherentes a partir de una imagen o una descripción.`,
      `Es un área muy activa: <strong>Genie</strong>, de Google DeepMind, evolucionó desde generar mundos en 2D no jugables (2024) hasta <strong>Genie 3</strong> (agosto de 2025), capaz de generar y modificar mundos explorables en tiempo real, a 720p y 24 fps, con memoria de hasta un minuto de interacción.`,
    ],
    diagram: svg9, diagramCaption: "El world model simula el siguiente estado del entorno antes de que el agente actúe realmente.",
    examples: [
      { tag: "Mundos generativos", text: `<b>Genie 3</b> (DeepMind) genera mundos virtuales explorables e interactivos en tiempo real a partir de una imagen o texto, manteniendo coherencia mientras el usuario se mueve dentro de ellos.` },
      { tag: "Video / física", text: `<b>Sora</b> (OpenAI), al generar video, aprende implícitamente propiedades del mundo físico —objetos que no desaparecen, sombras consistentes— actuando como un world model implícito.` },
    ],
    quiz: [
      { q: "¿Qué aprende principalmente un \"world model\"?", options: ["Solo a clasificar imágenes en categorías fijas", "Una representación interna de cómo funciona un entorno, para predecir su evolución", "A traducir texto entre idiomas", "A comparar preferencias humanas"], correct: 1, exp: "Su valor está en poder simular o predecir el entorno, no solo en reaccionar a él." },
      { q: "¿Qué ventaja da tener un world model antes de actuar en el mundo real?", options: ["Ninguna, siempre hay que actuar directamente", "Permite \"imaginar\" el resultado de una acción y planificar sin ejecutar errores costosos", "Elimina la necesidad de cualquier tipo de entrenamiento", "Solo sirve para generar texto"], correct: 1, exp: "Simular antes de actuar evita errores costosos o irreversibles en el mundo real (por ejemplo, en robótica)." },
      { q: "Genie 3, de Google DeepMind, es un ejemplo de world model porque…", options: ["Solo genera texto sin ninguna interacción", "Genera y permite explorar mundos virtuales coherentes en tiempo real a partir de una imagen o texto", "Es un modelo de clasificación de imágenes médicas", "Solo funciona con datos etiquetados manualmente"], correct: 1, exp: "Genie 3 simula un entorno explorable que responde de forma coherente a las acciones del usuario, la esencia de un world model." },
    ],
  },
];

/* ---------- Render ---------- */
function renderNav() {
  const ul = document.getElementById("navList");
  let html = `<li><a class="nav-item" data-target="inicio"><span class="nav-num">◆</span><span>Inicio</span></a></li>
  <li class="nav-group-label">Los 9 paradigmas</li>`;
  for (const t of TOPICS) {
    html += `<li><a class="nav-item" data-target="${t.id}">
      <span class="nav-num">${t.num}</span><span>${t.title}</span>
      ${t.expo ? `<span class="exposicion-dot" title="Tu tema de exposición"></span>` : `<svg class="nav-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6"/></svg>`}
    </a></li>`;
  }
  ul.innerHTML = html;
}

function exampleCardsHtml(examples) {
  return `<div class="examples-grid">${examples.map(e => `<div class="example-card"><div class="ex-tag">${e.tag}</div><p>${e.text}</p></div>`).join("")}</div>`;
}

function quizHtml(topicId, quiz) {
  return quiz.map((item, qi) => `
    <div class="quiz-card" data-topic="${topicId}" data-qi="${qi}">
      <p class="quiz-q"><span class="qn">P${qi + 1}.</span>${item.q}</p>
      <div class="quiz-options">
        ${item.options.map((op, oi) => `<button class="quiz-opt" data-oi="${oi}">${op}</button>`).join("")}
      </div>
      <div class="quiz-feedback"></div>
    </div>`).join("");
}

function topicSectionHtml(t, i) {
  const prev = i === 0 ? { id: "inicio", title: "Inicio" } : { id: TOPICS[i - 1].id, title: TOPICS[i - 1].title };
  const next = i === TOPICS.length - 1 ? null : { id: TOPICS[i + 1].id, title: TOPICS[i + 1].title };
  return `
  <section class="panel" id="panel-${t.id}" data-id="${t.id}">
    <div class="topic-eyebrow">
      <span class="num">TEMA ${t.num} / 9</span>
      ${t.expo ? `<span class="expo-badge">★ Tu tema de exposición</span>` : ""}
    </div>
    <h2 class="topic-title">${t.title}</h2>
    <p class="topic-sub">${t.tag}</p>

    <div class="block">
      <div class="block-label">Definición</div>
      <div class="def-card">${t.definicion}</div>
    </div>

    <div class="block">
      <div class="block-label">Explicación</div>
      <div class="explain">${t.explicacion.map(p => `<p>${p}</p>`).join("")}</div>
    </div>

    <div class="block">
      <div class="block-label">Cómo funciona</div>
      <div class="diagram-wrap">${t.diagram}</div>
      <div class="diagram-caption">${t.diagramCaption}</div>
    </div>

    ${t.diagram2 ? `<div class="block">
      <div class="diagram-wrap">${t.diagram2}</div>
      <div class="diagram-caption">${t.diagram2Caption}</div>
    </div>` : ""}

    <div class="block">
      <div class="block-label">Ejemplos didácticos</div>
      ${exampleCardsHtml(t.examples)}
    </div>

    ${t.extra || ""}

    <div class="block">
      <div class="block-label">Ejercicios</div>
      ${quizHtml(t.id, t.quiz)}
    </div>

    <div class="section-nav">
      <a data-target="${prev.id}"><span class="dir">← Anterior</span><span class="lbl">${prev.title}</span></a>
      ${next ? `<a class="next" data-target="${next.id}"><span class="dir">Siguiente →</span><span class="lbl">${next.title}</span></a>` : `<a class="next" data-target="inicio"><span class="dir">Volver →</span><span class="lbl">Inicio</span></a>`}
    </div>
  </section>`;
}

function introHtml() {
  const cards = TOPICS.map(t => `
    <button class="topic-card ${t.expo ? "expo" : ""}" data-target="${t.id}">
      <span class="tc-num">0${t.num}</span>
      <span class="tc-title">${t.title}</span>
      <span class="tc-tag">${t.tag}</span>
    </button>`).join("");
  return `
  <section class="panel active" id="panel-inicio" data-id="inicio">
    <div class="hero">
      <div class="hero-kicker">Inteligencia Artificial · Guía interactiva</div>
      <h1>Los 9 paradigmas de aprendizaje en IA</h1>
      <p class="lead">Definiciones, explicaciones, ejemplos y ejercicios sobre las principales formas en que un sistema de IA puede aprender — desde el clásico aprendizaje supervisado hasta la frontera de los modelos del mundo.</p>
      <div class="topic-grid">${cards}</div>
      <div class="intro-note">
        <b>Tema de exposición:</b> Transfer Learning y Fine-tuning (#5) — está desarrollado con mayor profundidad, incluyendo LoRA/PEFT y una comparación práctica.
      </div>
    </div>
  </section>`;
}

function renderContent() {
  const content = document.getElementById("content");
  content.innerHTML = introHtml() + TOPICS.map((t, i) => topicSectionHtml(t, i)).join("");
}

/* ---------- Navegación entre secciones ---------- */
const visited = new Set();
const ALL_IDS = ["inicio", ...TOPICS.map(t => t.id)];

function goTo(id, push = true) {
  if (!ALL_IDS.includes(id)) id = "inicio";
  document.querySelectorAll("section.panel").forEach(s => s.classList.toggle("active", s.dataset.id === id));
  document.querySelectorAll(".nav-item").forEach(a => a.classList.toggle("active", a.dataset.target === id));
  visited.add(id);
  updateProgress();
  document.getElementById("content").scrollTo({ top: 0, behavior: "instant" in document.documentElement.style ? "instant" : "auto" });
  window.scrollTo(0, 0);
  if (push) history.replaceState(null, "", "#" + id);
  closeMobileMenu();
}

function updateProgress() {
  const total = ALL_IDS.length;
  const done = visited.size;
  document.querySelectorAll(".nav-item").forEach(a => {
    a.classList.toggle("visited", visited.has(a.dataset.target));
  });
  const pct = Math.round((done / total) * 100);
  const bar = document.getElementById("miniProgressBar");
  if (bar) bar.style.width = pct + "%";
  const txt = document.getElementById("progressText");
  if (txt) txt.textContent = `${done} de ${total} secciones vistas`;
  const pill = document.getElementById("progressPill");
  if (pill) pill.textContent = `${done}/${total}`;
}

function closeMobileMenu() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
  document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
}
function openMobileMenu() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("overlay").classList.add("show");
  document.getElementById("menuBtn").setAttribute("aria-expanded", "true");
}

/* ---------- Quiz interactivo ---------- */
function handleQuizClick(e) {
  const btn = e.target.closest(".quiz-opt");
  if (!btn) return;
  const card = btn.closest(".quiz-card");
  if (card.dataset.answered === "1") return;
  card.dataset.answered = "1";

  const topicId = card.dataset.topic;
  const qi = Number(card.dataset.qi);
  const item = TOPICS.find(t => t.id === topicId).quiz[qi];
  const oi = Number(btn.dataset.oi);

  card.querySelectorAll(".quiz-opt").forEach((b, i) => {
    b.disabled = true;
    if (i === item.correct) b.classList.add("correct");
    else if (i === oi) b.classList.add("incorrect");
  });

  const fb = card.querySelector(".quiz-feedback");
  const ok = oi === item.correct;
  fb.classList.add("show", ok ? "ok" : "no");
  fb.innerHTML = `<b>${ok ? "✓ Correcto" : "✗ No es la respuesta correcta"}</b>${item.exp}`;
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderContent();

  document.body.addEventListener("click", (e) => {
    const navEl = e.target.closest("[data-target]");
    if (navEl) {
      e.preventDefault();
      goTo(navEl.dataset.target);
      return;
    }
    handleQuizClick(e);
  });

  document.getElementById("menuBtn").addEventListener("click", () => {
    const isOpen = document.getElementById("sidebar").classList.contains("open");
    isOpen ? closeMobileMenu() : openMobileMenu();
  });
  document.getElementById("overlay").addEventListener("click", closeMobileMenu);

  window.addEventListener("hashchange", () => goTo(location.hash.slice(1), false));

  const initial = location.hash ? location.hash.slice(1) : "inicio";
  goTo(initial, false);
  updateProgress();
});

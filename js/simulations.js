/* =========================================================
   simulations.js — "Aprender haciendo"

   Cuatro experiencias interactivas. En todas la prioridad es
   la claridad pedagógica sobre la fidelidad técnica: son
   versiones simplificadas, correctas en el mecanismo que
   ilustran, no implementaciones de producción.
   ========================================================= */

const SIM_COLORS = {
  a: "#4f46e5", b: "#d97706", c: "#0891b2",
  gris: "#9aa1b5", linea: "#171a2b",
  ok: "#047857", err: "#c8302f", grid: "#e3e7f2",
};

/* Prepara un canvas nítido en pantallas de alta densidad */
function setupCanvas(cv, w, h) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = w * dpr; cv.height = h * dpr;
  cv.style.aspectRatio = `${w} / ${h}`;
  const ctx = cv.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function simShell(id, titulo, desc, controles, extra = "") {
  return `
  <div class="sim" data-sim="${id}">
    <div class="sim-head">
      <span class="sim-tag">Aprender haciendo</span>
      <h3>${titulo}</h3>
      <p>${desc}</p>
    </div>
    <div class="sim-stage">
      <canvas class="sim-canvas"></canvas>
      <div class="sim-side">
        <div class="sim-stats"></div>
        ${extra}
      </div>
    </div>
    <div class="sim-controls">${controles}</div>
    <div class="sim-note"></div>
  </div>`;
}

const btn = (accion, texto, tipo = "secondary") =>
  `<button class="btn btn-${tipo} btn-sm" data-sim-action="${accion}">${texto}</button>`;

/* =========================================================
   1. Perceptrón — aprendizaje supervisado
   ========================================================= */
const SIM_PERCEPTRON = {
  titulo: "Entrena un clasificador",
  desc: "Cada punto es un ejemplo con su etiqueta ya conocida (azul o naranja). El modelo traza una frontera y la corrige cada vez que se equivoca. Eso es el ciclo predicción → error → ajuste.",
  controles: btn("paso", "Un paso") + btn("entrenar", "Entrenar", "primary") + btn("reiniciar", "Reiniciar"),

  crear(root) {
    const cv = root.querySelector(".sim-canvas");
    const W = 460, H = 280;
    const ctx = setupCanvas(cv, W, H);
    const st = { pts: [], w: [0, 0], b: 0, paso: 0, timer: null };

    function datos() {
      st.pts = [];
      for (let i = 0; i < 26; i++) {
        const clase = i % 2 === 0 ? 1 : -1;
        // dos nubes separables, con algo de dispersión
        const cx = clase === 1 ? 0.32 : 0.68;
        const cy = clase === 1 ? 0.36 : 0.64;
        st.pts.push({
          x: Math.max(.06, Math.min(.94, cx + (Math.random() - .5) * .34)),
          y: Math.max(.08, Math.min(.92, cy + (Math.random() - .5) * .34)),
          c: clase,
        });
      }
      st.w = [0, 0]; st.b = 0; st.paso = 0;
    }

    const pred = p => (st.w[0] * p.x + st.w[1] * p.y + st.b) >= 0 ? 1 : -1;
    const errores = () => st.pts.filter(p => pred(p) !== p.c).length;

    function pintar() {
      ctx.clearRect(0, 0, W, H);
      // rejilla
      ctx.strokeStyle = SIM_COLORS.grid; ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo((W / 6) * i, 0); ctx.lineTo((W / 6) * i, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, (H / 6) * i); ctx.lineTo(W, (H / 6) * i); ctx.stroke();
      }
      // frontera de decisión: w0*x + w1*y + b = 0
      if (st.w[0] !== 0 || st.w[1] !== 0) {
        const pts = [];
        for (const x of [0, 1]) {
          if (st.w[1] !== 0) { const y = -(st.w[0] * x + st.b) / st.w[1]; if (y >= -0.5 && y <= 1.5) pts.push([x, y]); }
        }
        for (const y of [0, 1]) {
          if (st.w[0] !== 0) { const x = -(st.w[1] * y + st.b) / st.w[0]; if (x >= -0.5 && x <= 1.5) pts.push([x, y]); }
        }
        if (pts.length >= 2) {
          ctx.strokeStyle = SIM_COLORS.linea; ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(pts[0][0] * W, pts[0][1] * H);
          ctx.lineTo(pts[1][0] * W, pts[1][1] * H);
          ctx.stroke();
        }
      }
      // puntos
      st.pts.forEach(p => {
        const mal = pred(p) !== p.c;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, mal ? 7 : 5.5, 0, Math.PI * 2);
        ctx.fillStyle = p.c === 1 ? SIM_COLORS.a : SIM_COLORS.b;
        ctx.fill();
        if (mal) { ctx.strokeStyle = SIM_COLORS.err; ctx.lineWidth = 2.4; ctx.stroke(); }
      });
      const e = errores();
      root.querySelector(".sim-stats").innerHTML = `
        <div class="ss"><span>Pasos</span><b>${st.paso}</b></div>
        <div class="ss"><span>Errores</span><b class="${e === 0 ? "bien" : ""}">${e} / ${st.pts.length}</b></div>
        <div class="ss"><span>Aciertos</span><b>${Math.round((1 - e / st.pts.length) * 100)}%</b></div>`;
      root.querySelector(".sim-note").innerHTML = e === 0 && st.paso > 0
        ? `<span class="bien">Frontera aprendida: el modelo clasifica bien los ${st.pts.length} ejemplos.</span>`
        : `Los puntos con borde rojo son los que el modelo todavía clasifica mal. Cada paso corrige la frontera usando uno de ellos.`;
    }

    function paso() {
      const malos = st.pts.filter(p => pred(p) !== p.c);
      if (!malos.length) { detener(); pintar(); return false; }
      const p = malos[Math.floor(Math.random() * malos.length)];
      const lr = 0.9;
      st.w[0] += lr * p.c * p.x;
      st.w[1] += lr * p.c * p.y;
      st.b += lr * p.c * 0.1;
      st.paso++;
      pintar();
      return true;
    }
    function detener() { clearInterval(st.timer); st.timer = null; }

    return {
      pintar,
      accion(a) {
        if (a === "paso") { detener(); paso(); }
        if (a === "entrenar") {
          if (st.timer) { detener(); return; }
          st.timer = setInterval(() => { if (!paso() || st.paso > 120) detener(); }, 160);
        }
        if (a === "reiniciar") { detener(); datos(); pintar(); }
      },
      destruir: detener,
      iniciar() { datos(); pintar(); },
    };
  },
};

/* =========================================================
   2. K-means — aprendizaje no supervisado
   ========================================================= */
const SIM_KMEANS = {
  titulo: "Descubre los grupos",
  desc: "Los mismos puntos, pero sin ninguna etiqueta: todos grises. El algoritmo solo mide distancias. Observa cómo encuentra la estructura sin que nadie le diga qué buscar.",
  controles: btn("paso", "Una iteración") + btn("entrenar", "Ejecutar", "primary") + btn("reiniciar", "Reiniciar"),

  crear(root) {
    const cv = root.querySelector(".sim-canvas");
    const W = 460, H = 280;
    const ctx = setupCanvas(cv, W, H);
    const K = 3;
    const paleta = [SIM_COLORS.a, SIM_COLORS.b, SIM_COLORS.c];
    const st = { pts: [], cent: [], iter: 0, asignado: false, timer: null, estable: false };

    function datos() {
      st.pts = [];
      const centros = [[.25, .3], [.72, .32], [.5, .74]];
      centros.forEach(c => {
        for (let i = 0; i < 14; i++) {
          st.pts.push({
            x: Math.max(.05, Math.min(.95, c[0] + (Math.random() - .5) * .26)),
            y: Math.max(.08, Math.min(.92, c[1] + (Math.random() - .5) * .26)),
            g: -1,
          });
        }
      });
      st.cent = Array.from({ length: K }, () => ({ x: .2 + Math.random() * .6, y: .2 + Math.random() * .6 }));
      st.iter = 0; st.asignado = false; st.estable = false;
    }

    function pintar() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = SIM_COLORS.grid; ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath(); ctx.moveTo((W / 6) * i, 0); ctx.lineTo((W / 6) * i, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, (H / 6) * i); ctx.lineTo(W, (H / 6) * i); ctx.stroke();
      }
      st.pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = p.g >= 0 ? paleta[p.g] : SIM_COLORS.gris;
        ctx.globalAlpha = p.g >= 0 ? .85 : .6;
        ctx.fill(); ctx.globalAlpha = 1;
      });
      st.cent.forEach((c, i) => {
        ctx.beginPath();
        ctx.arc(c.x * W, c.y * H, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#fff"; ctx.fill();
        ctx.strokeStyle = paleta[i]; ctx.lineWidth = 3.2; ctx.stroke();
        ctx.beginPath(); ctx.arc(c.x * W, c.y * H, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = paleta[i]; ctx.fill();
      });
      const asignados = st.pts.filter(p => p.g >= 0).length;
      root.querySelector(".sim-stats").innerHTML = `
        <div class="ss"><span>Iteración</span><b>${st.iter}</b></div>
        <div class="ss"><span>Agrupados</span><b>${asignados} / ${st.pts.length}</b></div>
        <div class="ss"><span>Grupos</span><b>${K}</b></div>`;
      root.querySelector(".sim-note").innerHTML = st.estable
        ? `<span class="bien">Convergió: los centros dejaron de moverse. Los grupos que ves los descubrió el algoritmo, nadie los definió.</span>`
        : (st.asignado
          ? `Ahora cada centro se mueve al promedio de los puntos que le tocaron.`
          : `Cada punto se asigna al centro más cercano. Los círculos huecos son los centros del algoritmo.`);
    }

    function paso() {
      if (!st.asignado) {
        st.pts.forEach(p => {
          let mejor = 0, dmin = Infinity;
          st.cent.forEach((c, i) => {
            const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
            if (d < dmin) { dmin = d; mejor = i; }
          });
          p.g = mejor;
        });
        st.asignado = true;
      } else {
        let movio = false;
        st.cent.forEach((c, i) => {
          const g = st.pts.filter(p => p.g === i);
          if (!g.length) return;
          const nx = g.reduce((a, p) => a + p.x, 0) / g.length;
          const ny = g.reduce((a, p) => a + p.y, 0) / g.length;
          if (Math.abs(nx - c.x) > 0.002 || Math.abs(ny - c.y) > 0.002) movio = true;
          c.x = nx; c.y = ny;
        });
        st.asignado = false;
        st.iter++;
        if (!movio && st.iter > 1) { st.estable = true; detener(); }
      }
      pintar();
      return !st.estable;
    }
    function detener() { clearInterval(st.timer); st.timer = null; }

    return {
      pintar,
      accion(a) {
        if (a === "paso") { detener(); paso(); }
        if (a === "entrenar") {
          if (st.timer) { detener(); return; }
          st.timer = setInterval(() => { if (!paso() || st.iter > 30) detener(); }, 420);
        }
        if (a === "reiniciar") { detener(); datos(); pintar(); }
      },
      destruir: detener,
      iniciar() { datos(); pintar(); },
    };
  },
};

/* =========================================================
   3. Mundo de rejilla — aprendizaje por refuerzo
   ========================================================= */
const SIM_GRID = {
  titulo: "Enseña a un agente a llegar a la meta",
  desc: "El agente empieza sin saber nada. Solo recibe recompensa al llegar a la meta y castigo si cae en la trampa. Observa el ciclo estado → acción → recompensa → nuevo estado, y cómo mejora al repetir episodios.",
  controles: btn("paso", "1 episodio") + btn("entrenar", "20 episodios", "primary") + btn("reiniciar", "Reiniciar"),
  extra: `<div class="sim-trace"></div>`,

  crear(root) {
    const cv = root.querySelector(".sim-canvas");
    const N = 5, CELL = 52, W = N * CELL, H = N * CELL;
    const ctx = setupCanvas(cv, W, H);
    const META = [4, 4], TRAMPA = [2, 3];
    const ACC = [[0, -1, "arriba"], [0, 1, "abajo"], [-1, 0, "izquierda"], [1, 0, "derecha"]];
    const st = { Q: {}, ep: 0, ultima: [], recompensas: [], timer: null };

    const clave = (x, y, a) => `${x},${y},${a}`;
    const q = (x, y, a) => st.Q[clave(x, y, a)] || 0;
    const mejorA = (x, y) => {
      let mejor = 0, v = -Infinity;
      ACC.forEach((_, i) => { if (q(x, y, i) > v) { v = q(x, y, i); mejor = i; } });
      return mejor;
    };

    function episodio() {
      let x = 0, y = 0, pasos = 0, total = 0;
      const traza = [];
      const eps = Math.max(0.05, 0.9 - st.ep * 0.04);   // menos exploración con el tiempo
      while (pasos < 60) {
        const a = Math.random() < eps ? Math.floor(Math.random() * 4) : mejorA(x, y);
        const nx = Math.max(0, Math.min(N - 1, x + ACC[a][0]));
        const ny = Math.max(0, Math.min(N - 1, y + ACC[a][1]));
        let r = -1;
        let fin = false;
        if (nx === META[0] && ny === META[1]) { r = 100; fin = true; }
        else if (nx === TRAMPA[0] && ny === TRAMPA[1]) { r = -60; fin = true; }
        const maxSig = Math.max(...ACC.map((_, i) => q(nx, ny, i)));
        st.Q[clave(x, y, a)] = q(x, y, a) + 0.5 * (r + 0.92 * maxSig - q(x, y, a));
        if (traza.length < 5) traza.push({ e: `(${x},${y})`, a: ACC[a][2], r, n: `(${nx},${ny})` });
        total += r; x = nx; y = ny; pasos++;
        if (fin) break;
      }
      st.ep++; st.ultima = traza; st.recompensas.push(total);
      pintar();
    }

    function pintar() {
      ctx.clearRect(0, 0, W, H);
      for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) {
        const esMeta = x === META[0] && y === META[1];
        const esTrampa = x === TRAMPA[0] && y === TRAMPA[1];
        ctx.fillStyle = esMeta ? "#ecfdf5" : esTrampa ? "#fef2f2" : "#fff";
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        ctx.strokeStyle = SIM_COLORS.grid; ctx.lineWidth = 1;
        ctx.strokeRect(x * CELL, y * CELL, CELL, CELL);
        if (esMeta || esTrampa) {
          ctx.fillStyle = esMeta ? SIM_COLORS.ok : SIM_COLORS.err;
          ctx.font = "600 11px Inter, sans-serif"; ctx.textAlign = "center";
          ctx.fillText(esMeta ? "META" : "TRAMPA", x * CELL + CELL / 2, y * CELL + CELL / 2 + 4);
          continue;
        }
        // política aprendida: flecha hacia la mejor acción conocida
        const tieneValor = ACC.some((_, i) => q(x, y, i) !== 0);
        if (tieneValor) {
          const a = mejorA(x, y);
          const cx = x * CELL + CELL / 2, cy = y * CELL + CELL / 2;
          const dx = ACC[a][0] * 12, dy = ACC[a][1] * 12;
          ctx.strokeStyle = SIM_COLORS.a; ctx.lineWidth = 2; ctx.globalAlpha = .75;
          ctx.beginPath(); ctx.moveTo(cx - dx, cy - dy); ctx.lineTo(cx + dx, cy + dy); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx + dx, cy + dy);
          ctx.lineTo(cx + dx - dy * .45 - dx * .35, cy + dy + dx * .45 - dy * .35);
          ctx.lineTo(cx + dx + dy * .45 - dx * .35, cy + dy - dx * .45 - dy * .35);
          ctx.closePath(); ctx.fillStyle = SIM_COLORS.a; ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      // inicio
      ctx.fillStyle = "#171a2b"; ctx.font = "600 10px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("INICIO", CELL / 2, 14);

      const ult = st.recompensas.slice(-5);
      const media = ult.length ? Math.round(ult.reduce((a, b) => a + b, 0) / ult.length) : 0;
      root.querySelector(".sim-stats").innerHTML = `
        <div class="ss"><span>Episodios</span><b>${st.ep}</b></div>
        <div class="ss"><span>Recompensa media</span><b class="${media > 50 ? "bien" : ""}">${media}</b></div>`;
      root.querySelector(".sim-trace").innerHTML = st.ultima.length ? `
        <div class="trace-l">Primeros pasos del último episodio</div>
        <table class="trace-t">
          <tr><th>Estado</th><th>Acción</th><th>Recomp.</th><th>Nuevo</th></tr>
          ${st.ultima.map(t => `<tr><td>${t.e}</td><td>${t.a}</td><td class="${t.r > 0 ? "bien" : t.r < -1 ? "mal" : ""}">${t.r}</td><td>${t.n}</td></tr>`).join("")}
        </table>` : "";
      root.querySelector(".sim-note").innerHTML = st.ep === 0
        ? `Aún no ha aprendido nada: no hay flechas. Ejecuta episodios y verás aparecer la política.`
        : (media > 50
          ? `<span class="bien">Las flechas muestran la política aprendida: hacia dónde conviene moverse desde cada casilla.</span>`
          : `Las flechas son la política actual. Todavía es imperfecta: necesita más episodios para afinarla.`);
    }
    function detener() { clearInterval(st.timer); st.timer = null; }

    return {
      pintar,
      accion(a) {
        if (a === "paso") { detener(); episodio(); }
        if (a === "entrenar") {
          if (st.timer) { detener(); return; }
          let n = 0;
          st.timer = setInterval(() => { episodio(); if (++n >= 20) detener(); }, 90);
        }
        if (a === "reiniciar") { detener(); st.Q = {}; st.ep = 0; st.ultima = []; st.recompensas = []; pintar(); }
      },
      destruir: detener,
      iniciar: pintar,
    };
  },
};

/* =========================================================
   4. El caso del hospital

   Todo el ejercicio se apoya en una sola metáfora: un modelo es
   una máquina con millones de perillas, y entrenarlo es girarlas
   hasta que acierte. Con eso, "congelar una capa" pasa a ser
   "dejar esas perillas quietas" y no hace falta saber qué es un
   parámetro ni una capa para poder jugar.

   La aritmética es real: las perillas se suman de verdad y la
   relación perillas-por-ejemplo se calcula de verdad.
   ========================================================= */
const SIM_TRANSFER = {
  titulo: "El caso del hospital",

  html(id) {
    return `
    <div class="sim" data-sim="${id}">
      <div class="sim-head">
        <span class="sim-tag">Aprender haciendo</span>
        <h3>El caso del hospital</h3>
      </div>

      <div class="brief">
        <div class="brief-fila">
          <span class="brief-n">1</span>
          <p>Un modelo de IA es como una <b>máquina con millones de perillas</b>. Entrenarlo es girar esas perillas hasta que acierte.</p>
        </div>
        <div class="brief-fila">
          <span class="brief-n">2</span>
          <p>Este modelo ya viene con sus <b>96,6 millones de perillas puestas</b> para reconocer objetos en fotos: perros, sillas, coches.</p>
        </div>
        <div class="brief-fila">
          <span class="brief-n">3</span>
          <p>Un hospital quiere usarlo para <b>detectar neumonía en radiografías</b>. Tú decides qué perillas dejas quietas y cuáles vuelves a ajustar.</p>
        </div>
        <div class="brief-fila destacada">
          <span class="brief-n">!</span>
          <p><b>El problema:</b> cada perilla que muevas hay que ajustarla con ejemplos. Y el hospital tiene pocas radiografías.</p>
        </div>
      </div>

      <div class="reto-caja"></div>
      <div class="ajuste">
        <div class="capas"></div>
        <div class="panel"></div>
      </div>
      <div class="sim-controls">
        <button class="btn btn-secondary btn-sm" data-sim-action="lora">Usar LoRA</button>
        <button class="btn btn-primary btn-sm" data-sim-action="comprobar">Comprobar</button>
        <button class="btn btn-secondary btn-sm" data-sim-action="reiniciar">Empezar el reto de nuevo</button>
      </div>
      <div class="sim-note"></div>
    </div>`;
  },

  crear(root) {
    /* Cada bloque, descrito por lo que HACE, no por su nombre técnico */
    const CAPAS = [
      { t: "Ve bordes y manchas",        d: "Lo más básico. Un borde se ve igual en una foto que en una radiografía: esto ya lo sabe hacer.",  p: 18.4e6 },
      { t: "Ve formas",                   d: "Junta bordes para formar figuras. Todavía sirve para cualquier imagen.",                          p: 24.1e6 },
      { t: "Ve objetos y sus partes",     d: "Aquí ya está pensado para fotos de cosas cotidianas: ruedas, patas, ventanas.",                    p: 31.7e6 },
      { t: "Entiende la imagen completa", d: "Muy pegado a las fotos con las que aprendió. A una radiografía no le sirve igual.",                p: 22.3e6 },
      { t: "Da su respuesta final",       d: "Hoy responde 'perro' o 'silla'. Necesitas que responda 'neumonía' o 'sano'.",                      p: 0.082e6 },
    ];
    const TOTAL = CAPAS.reduce((a, c) => a + c.p, 0);
    const LORA_FRAC = 0.003;

    const RETOS = [
      {
        n: "Reto 1",
        titulo: "Lo mínimo para que sirva",
        ej: 800,
        tarea: `Ahora mismo el modelo responde <b>"perro"</b> o <b>"silla"</b>. Necesitas que responda <b>"neumonía"</b> o <b>"sano"</b>. Vuelve a ajustar <b>solo el último bloque</b>, el que da la respuesta, y deja todos los demás quietos.`,
        pista: `Toca un bloque para cambiarlo entre quieto y "hay que ajustarlo".`,
        ok: (st, m) => !st.lora && !st.entrena[0] && !st.entrena[1] && !st.entrena[2] && !st.entrena[3] && st.entrena[4],
        bien: `Correcto. Solo mueves <b>82 mil perillas</b> y tienes 800 radiografías para hacerlo: unas 100 perillas por ejemplo. Es poco y alcanza. Todo lo que el modelo ya sabía sobre ver imágenes se aprovecha tal cual, y solo le enseñas a dar la respuesta nueva.`,
        mal: (st, m) => {
          if (m.ent === 0) return `No estás moviendo ninguna perilla, así que el modelo seguirá respondiendo "perro". Toca el último bloque, el que da la respuesta.`;
          if (st.lora) return `Las perillas están bien elegidas, pero LoRA aquí no hace falta: el último bloque ya es pequeño. Desactívalo.`;
          return `Estás moviendo demasiadas: <b>${m.entTxt} perillas</b> con solo 800 radiografías. Deja quietos todos los bloques menos el último.`;
        },
      },
      {
        n: "Reto 2",
        titulo: "Que mire mejor las radiografías",
        ej: 800,
        tarea: `Con eso el modelo responde lo correcto, pero <b>sigue mirando la radiografía como si fuera la foto de un objeto</b>. Haz que el cuarto bloque —el que entiende la imagen completa— también se ajuste, sin que el semáforo se ponga en rojo.`,
        pista: `Actívalo y mira el semáforo. Si se pone en rojo, no lo vuelvas a apagar: hay otra forma de bajar las perillas.`,
        ok: (st, m) => st.entrena[3] && m.estado === "bien",
        bien: `Eso es, y aquí está la idea de <b>LoRA</b>: en lugar de mover los 22,3 millones de perillas que ese bloque ya tiene puestas, le añade <b>unas pocas perillas nuevas</b> y solo mueve esas. Pasas de 22,3 millones a <b>149 mil</b>, y con 800 radiografías eso sí es asumible.`,
        mal: (st, m) => {
          if (!st.entrena[3]) return `El cuarto bloque sigue quieto, así que sigue mirando la radiografía como una foto. Actívalo.`;
          if (!st.lora) return `Ya se ajusta, pero mira el semáforo: <b>${m.porEjTxt} perillas por radiografía</b>. Le estás pidiendo que reaprenda 22 millones de cosas con 800 ejemplos, y con eso solo puede adivinar. Prueba el botón <b>Usar LoRA</b>.`;
          return `Con LoRA vas bien, pero tienes demasiados bloques activados a la vez: ${m.porEjTxt} perillas por radiografía. Deja solo el cuarto bloque y el último.`;
        },
      },
      {
        n: "Reto 3",
        titulo: "Ajustarlo entero con un solo computador",
        ej: 800,
        tarea: `Quieres que <b>los cinco bloques</b> se adapten a las radiografías. Pero el hospital tiene un solo computador con tarjeta gráfica: consigue que todos se ajusten moviendo <b>menos de 500 mil perillas</b> en total.`,
        pista: `Actívalos todos. Los 96,6 millones no caben; hay una forma de que sí quepan.`,
        ok: (st, m) => st.entrena.every(Boolean) && m.ent < 500000,
        bien: `Ahí está el porqué de LoRA. Los cinco bloques se adaptan y aun así solo mueves <b>372 mil perillas</b>: el 0,39 % del modelo. Sin LoRA serían 96,6 millones y no cabrían en ese computador. El artículo original de LoRA reporta hasta <b>10.000 veces menos perillas</b> que ajustarlo todo.`,
        mal: (st, m) => {
          if (!st.entrena.every(Boolean)) return `Todavía quedan bloques quietos. El reto pide que se ajusten los cinco.`;
          return `Los cinco se ajustan, pero son <b>${m.entTxt} perillas</b>, muy por encima del límite de 500 mil. Activa <b>LoRA</b>.`;
        },
      },
      {
        n: "Reto 4",
        titulo: "Cuando ya no faltan radiografías",
        ej: 60000,
        tarea: `Pasan los años y el hospital acumula <b>60.000 radiografías</b> diagnosticadas. Ahora sí puede permitirse ajustar el modelo entero a la antigua. <b>Activa los cinco bloques y apaga LoRA</b>: mira cómo cambia el semáforo.`,
        pista: `Son exactamente las mismas perillas del reto 3. Lo único distinto es cuántos ejemplos hay.`,
        ok: (st, m) => st.entrena.every(Boolean) && !st.lora && m.estado !== "mal",
        bien: `Correcto, y esta es la otra cara del tema. Mueves los mismos <b>96,6 millones</b> de perillas que en el reto 3, pero ahora hay 60.000 radiografías para ajustarlas: bajas a <b>{POR} por ejemplo</b> y el semáforo deja de estar en rojo. <b>Transferir sirve sobre todo cuando faltan datos</b>; cuando sobran, la ventaja se encoge.`,
        mal: (st, m) => {
          if (st.lora) return `El reto pide hacerlo <b>sin</b> LoRA, para poder comparar con el reto 3. Desactívalo.`;
          if (!st.entrena.every(Boolean)) return `Faltan bloques por activar: el reto pide los cinco.`;
          return `Revisa que estén los cinco bloques activados y LoRA apagado.`;
        },
      },
    ];

    const st = { r: 0, entrena: [false, false, false, false, false], lora: false, resultado: null };

    const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(".", ",") + " millones"
                   : n >= 1e3 ? Math.round(n / 1e3) + " mil" : Math.round(n);
    const num = n => n < 1 ? n.toFixed(2).replace(".", ",") : Math.round(n).toLocaleString("es");

    function medir() {
      const reto = RETOS[Math.min(st.r, RETOS.length - 1)];
      const ej = reto.ej;
      const ent = CAPAS.reduce((a, c, i) =>
        a + (st.entrena[i] ? c.p * (st.lora && i < 4 ? LORA_FRAC : 1) : 0), 0);
      const porEj = ent / ej;
      const estado = ent === 0 ? "vacio" : porEj > 2000 ? "mal" : porEj > 200 ? "medio" : "bien";
      return { ej, ent, porEj, estado, entTxt: fmt(ent), porEjTxt: num(porEj) };
    }

    function pintar() {
      const m = medir();
      const reto = RETOS[Math.min(st.r, RETOS.length - 1)];
      const fin = st.r >= RETOS.length;

      root.querySelector(".reto-caja").innerHTML = fin ? `
        <div class="reto-hd completado">
          <div class="reto-n">Los 4 retos resueltos</div>
          <p>La regla que resume el tema: <b>deja quieto lo que ya sabe, ajusta solo lo que le falta, y usa LoRA cuando no te alcancen ni los datos ni el computador.</b></p>
          <button class="btn btn-secondary btn-sm" data-sim-action="volver">Empezar de nuevo</button>
        </div>` : `
        <div class="reto-hd">
          <div class="reto-top">
            <span class="reto-n">${reto.n} · ${reto.titulo}</span>
            <span class="reto-datos">Tienes ${reto.ej.toLocaleString("es")} radiografías</span>
          </div>
          <p class="reto-tarea">${reto.tarea}</p>
          <p class="reto-pista">${reto.pista}</p>
        </div>
        ${st.resultado ? `
        <div class="reto-res ${st.resultado.ok ? "bien" : "mal"}">
          <b>${st.resultado.ok ? "Correcto" : "Todavía no"}</b>
          <p>${st.resultado.texto}</p>
          ${st.resultado.ok ? `<button class="btn btn-primary btn-sm" data-sim-action="siguiente">
            ${st.r < RETOS.length - 1 ? "Siguiente reto →" : "Terminar →"}</button>` : ""}
        </div>` : ""}`;

      root.querySelector(".capas").innerHTML = CAPAS.map((c, i) => {
        const on = st.entrena[i];
        const p = on ? c.p * (st.lora && i < 4 ? LORA_FRAC : 1) : 0;
        return `
        <button class="capa ${on ? "entrena" : "congelada"}" data-capa="${i}">
          <span class="capa-ic">${on ? "🔧" : "🔒"}</span>
          <span class="capa-b"><b>${c.t}</b><span class="capa-d">${c.d}</span></span>
          <span class="capa-p"><em>${on ? fmt(p) : "quieto"}</em>
            <span>${on ? "perillas a mover" : "no se toca"}</span></span>
        </button>`;
      }).join("");

      const etiqueta = {
        vacio: ["No estás ajustando nada", "El modelo seguiría respondiendo “perro”."],
        mal:   ["Demasiadas perillas, muy pocos ejemplos", "Con tan pocos ejemplos por perilla el modelo solo puede adivinar."],
        medio: ["Justo, pero puede salir", "Está en el límite. Vigílalo."],
        bien:  ["Bien equilibrado", "Hay ejemplos suficientes para las perillas que mueves."],
      }[m.estado];

      root.querySelector(".panel").innerHTML = `
        <div class="cuenta">
          <div class="cuenta-fila">
            <span>Perillas que hay que mover</span>
            <b>${m.ent === 0 ? "0" : m.entTxt}</b>
          </div>
          <div class="cuenta-fila">
            <span>Radiografías para ajustarlas</span>
            <b>${m.ej.toLocaleString("es")}</b>
          </div>
          <div class="cuenta-div"></div>
          <div class="cuenta-fila total">
            <span>Perillas por cada radiografía</span>
            <b>${m.ent === 0 ? "—" : m.porEjTxt}</b>
          </div>
        </div>
        <div class="semaforo ${m.estado}">
          <b>${etiqueta[0]}</b>
          <span>${etiqueta[1]}</span>
        </div>`;

      root.querySelector('[data-sim-action="lora"]').textContent = st.lora ? "Quitar LoRA" : "Usar LoRA";
      root.querySelector('[data-sim-action="comprobar"]').style.display = fin ? "none" : "";
      root.querySelector(".sim-note").innerHTML = st.lora
        ? `<b>LoRA activado.</b> En vez de mover los millones de perillas que ya están bien puestas, le añade unas pocas perillas nuevas y mueve solo esas. Por eso las cuentas bajan tanto.`
        : `🔒 quieto = el modelo conserva lo que ya sabía ahí. 🔧 a mover = tienes que volver a enseñárselo con tus radiografías.`;
    }

    function comprobar() {
      const reto = RETOS[st.r], m = medir();
      const ok = reto.ok(st, m);
      st.resultado = { ok, texto: (ok ? reto.bien : reto.mal(st, m)).replace("{POR}", m.porEjTxt) };
      pintar();
    }

    root.addEventListener("click", (e) => {
      const c = e.target.closest(".capa");
      if (!c) return;
      const i = Number(c.dataset.capa);
      st.entrena[i] = !st.entrena[i];
      st.resultado = null;
      pintar();
    });

    const limpiar = () => { st.entrena = [false,false,false,false,false]; st.lora = false; st.resultado = null; };

    return {
      accion(a) {
        if (a === "lora") { st.lora = !st.lora; st.resultado = null; }
        if (a === "comprobar") { comprobar(); return; }
        if (a === "siguiente") { st.r++; limpiar(); }
        if (a === "reiniciar") { limpiar(); }
        if (a === "volver") { st.r = 0; limpiar(); }
        pintar();
      },
      destruir() {},
      iniciar: pintar,
    };
  },
};

/* ---------- Registro y montaje ---------- */
const SIMS = {
  perceptron: SIM_PERCEPTRON,
  kmeans: SIM_KMEANS,
  gridworld: SIM_GRID,
  transferpipeline: SIM_TRANSFER,
};

let simsActivas = [];

function simHtml(id) {
  const s = SIMS[id];
  if (!s) return "";
  if (s.html) return s.html(id);
  return simShell(id, s.titulo, s.desc, s.controles, s.extra || "");
}

function initSims(root) {
  simsActivas.forEach(s => s.destruir && s.destruir());
  simsActivas = [];
  root.querySelectorAll(".sim").forEach(el => {
    const def = SIMS[el.dataset.sim];
    if (!def) return;
    const inst = def.crear(el);
    el._sim = inst;
    inst.iniciar();
    simsActivas.push(inst);
  });
}

function manejarSim(e) {
  const b = e.target.closest("[data-sim-action]");
  if (!b) return false;
  const el = b.closest(".sim");
  if (el && el._sim) el._sim.accion(b.dataset.simAction);
  return true;
}

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
   4. Pipeline de transferencia — transfer learning
   ========================================================= */
const SIM_TRANSFER = {
  titulo: "Recorre el pipeline de transferencia",
  desc: "Avanza etapa por etapa y compara lo que cuesta entrenar desde cero frente a partir de un modelo ya entrenado.",
  controles: btn("paso", "Siguiente etapa", "primary") + btn("reiniciar", "Reiniciar"),
  canvasOff: true,

  crear(root) {
    const ETAPAS = [
      { t: "Modelo preentrenado", d: "Un modelo ya entrenado sobre datos masivos y generales. No sabe nada de tu problema concreto, pero entiende el dominio.", cero: 100, tl: 0, nota: "Este trabajo ya está hecho: no lo pagas tú." },
      { t: "Conocimiento previo", d: "Sus capas iniciales codifican lo general: bordes y texturas en visión, sintaxis y semántica en lenguaje. Eso es lo que se va a transferir.", cero: 100, tl: 0, nota: "Un borde sigue siendo un borde en una radiografía." },
      { t: "Nueva tarea", d: "Llega tu problema específico, con un conjunto de datos mucho más pequeño: unos miles de ejemplos en lugar de millones.", cero: 100, tl: 5, nota: "Aquí empieza realmente tu trabajo." },
      { t: "Fine-tuning", d: "Se continúa el entrenamiento con esos datos y una tasa de aprendizaje baja, para especializar sin destruir lo aprendido.", cero: 100, tl: 12, nota: "Tasa baja: evita el olvido catastrófico." },
      { t: "Modelo adaptado", d: "El resultado resuelve tu tarea concreta conservando el conocimiento general de base.", cero: 100, tl: 14, nota: "Mismo resultado, una fracción del costo." },
    ];
    let i = -1;

    function pintar() {
      const wrap = root.querySelector(".sim-pipeline");
      wrap.innerHTML = ETAPAS.map((e, n) => `
        <div class="pipe-step ${n <= i ? "on" : ""} ${n === i ? "now" : ""}">
          <div class="pipe-dot">${n <= i ? "✓" : n + 1}</div>
          <div class="pipe-body">
            <b>${e.t}</b>
            ${n === i ? `<p>${e.d}</p><span class="pipe-nota">${e.nota}</span>` : ""}
          </div>
        </div>`).join("");

      const e = ETAPAS[Math.max(0, i)];
      const tl = i < 0 ? 0 : e.tl;
      root.querySelector(".sim-stats").innerHTML = `
        <div class="ss-bar">
          <span>Entrenar desde cero</span>
          <div class="sb"><i style="width:${i < 0 ? 0 : e.cero}%; background:var(--warn)"></i></div>
          <em>${i < 0 ? 0 : e.cero}% del esfuerzo</em>
        </div>
        <div class="ss-bar">
          <span>Con transfer learning</span>
          <div class="sb"><i style="width:${tl}%; background:var(--ok)"></i></div>
          <em>${tl}% del esfuerzo</em>
        </div>`;
      root.querySelector(".sim-note").innerHTML = i >= ETAPAS.length - 1
        ? `<span class="bien">Ese es el punto: el conocimiento caro se paga una vez y se reutiliza indefinidamente.</span>`
        : `Avanza para ver cómo se acumula el esfuerzo en cada enfoque.`;
    }

    return {
      pintar,
      accion(a) {
        if (a === "paso") { i = Math.min(i + 1, ETAPAS.length - 1); pintar(); }
        if (a === "reiniciar") { i = -1; pintar(); }
      },
      destruir() {},
      iniciar() { i = 0; pintar(); },
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
  const extra = s.extra || (id === "transferpipeline" ? `<div class="sim-pipeline"></div>` : "");
  const html = simShell(id, s.titulo, s.desc, s.controles, extra);
  return id === "transferpipeline" ? html.replace('<canvas class="sim-canvas"></canvas>', "") : html;
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

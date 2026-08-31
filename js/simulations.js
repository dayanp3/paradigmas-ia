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
   4. El caso del hospital: arma tu ajuste

   Un caso concreto con cuatro retos que se comprueban. En cada
   uno el estudiante sabe qué tiene que conseguir y recibe un
   veredicto de si lo logró o no, con la razón.

   La aritmética es real: los parámetros entrenables se suman y la
   relación parámetros-por-ejemplo se calcula de verdad. De ahí
   sale el diagnóstico, que es el principio que gobierna el
   compromiso: cuantos más parámetros libres por ejemplo, más fácil
   es que el modelo memorice en vez de aprender.
   ========================================================= */
const SIM_TRANSFER = {
  titulo: "El caso del hospital",
  desc: "Un hospital rural quiere detectar neumonía en radiografías. Tiene un modelo preentrenado con fotos de objetos cotidianos, una sola GPU y pocas radiografías diagnosticadas. Tu trabajo: decidir qué capas congelar y cuáles entrenar.",

  html(id) {
    return `
    <div class="sim" data-sim="${id}">
      <div class="sim-head">
        <span class="sim-tag">Aprender haciendo</span>
        <h3>${this.titulo}</h3>
        <p>${this.desc}</p>
      </div>
      <div class="reto-caja"></div>
      <div class="ajuste">
        <div class="capas"></div>
        <div class="panel"></div>
      </div>
      <div class="sim-controls">
        <button class="btn btn-secondary btn-sm" data-sim-action="lora">Activar LoRA</button>
        <button class="btn btn-primary btn-sm" data-sim-action="comprobar">Comprobar</button>
        <button class="btn btn-secondary btn-sm" data-sim-action="reiniciar">Reiniciar reto</button>
      </div>
      <div class="sim-note"></div>
    </div>`;
  },

  crear(root) {
    const CAPAS = [
      { t: "Capa 1 · bordes y texturas",     d: "Lo más general. Un borde es un borde igual en una foto que en una radiografía.", p: 18.4e6 },
      { t: "Capa 2 · formas y patrones",      d: "Combina bordes en formas. Sigue siendo bastante general.",                        p: 24.1e6 },
      { t: "Capa 3 · partes y composiciones", d: "Empieza a especializarse en el dominio original.",                                p: 31.7e6 },
      { t: "Capa 4 · representaciones altas", d: "Muy pegada a las fotos de objetos con las que se preentrenó.",                    p: 22.3e6 },
      { t: "Cabeza · salida de la tarea",     d: "Hoy predice categorías de objetos, no 'neumonía' o 'sano'.",                      p: 0.082e6 },
    ];
    const TOTAL = CAPAS.reduce((a, c) => a + c.p, 0);
    const LORA_FRAC = 0.003;

    const RETOS = [
      {
        n: "Reto 1 · lo mínimo para empezar",
        ej: 800,
        tarea: `La capa de salida del modelo hoy predice categorías de objetos cotidianos, no <b>neumonía</b> o <b>sano</b>. <b>Deja entrenable solo lo imprescindible</b> para que aprenda tu tarea, y nada más.`,
        pista: "Toca una capa para congelarla o descongelarla. Con 800 radiografías conviene tocar lo menos posible.",
        ok: (st, m) => !st.lora && !st.entrena[0] && !st.entrena[1] && !st.entrena[2] && !st.entrena[3] && st.entrena[4],
        bien: `Correcto. Con solo la cabeza entrenable son <b>82 mil parámetros para 800 radiografías</b>: 164 por ejemplo, margen sano. Esto se llama <b>extracción de características</b>: el modelo preentrenado se usa tal cual y solo se aprende a leer su salida. Es la primera opción cuando hay pocos datos.`,
        mal: (st, m) => {
          if (m.ent === 0) return `Con todas las capas congeladas no se entrena nada: el modelo seguiría prediciendo categorías de objetos. Descongela la cabeza.`;
          if (st.lora) return `Vas bien de capas, pero LoRA aquí sobra: la cabeza es tan pequeña que no hace falta. Desactívalo.`;
          return `Estás entrenando de más. Con ${m.entTxt} parámetros para 800 radiografías te salen <b>${m.porEjTxt} por ejemplo</b>: el modelo tiene margen de sobra para memorizarlas. Congela todo menos la cabeza.`;
        },
      },
      {
        n: "Reto 2 · adaptarse más, sin romperlo",
        ej: 800,
        tarea: `Solo con la cabeza el modelo se queda corto: la <b>capa 4</b> está muy pegada a las fotos de objetos y a las radiografías no les sirve igual. <b>Consigue que la capa 4 también se adapte</b> y que el diagnóstico se quede en verde.`,
        pista: "Descongela la capa 4 y mira qué pasa. Si se pone en rojo, no vuelvas a congelarla: busca otra forma de reducir los parámetros entrenables.",
        ok: (st, m) => st.entrena[3] && m.estado === "bien",
        bien: `Eso es. La capa 4 se adapta a las radiografías, pero con <b>LoRA</b> no ajusta sus 22,3 millones de pesos: entrena unas matrices pequeñas añadidas. Pasas de 22,3 M a <b>149 mil parámetros</b>, y con 800 ejemplos eso sí es razonable.`,
        mal: (st, m) => {
          if (!st.entrena[3]) return `La capa 4 sigue congelada, así que no se está adaptando. Descongélala.`;
          if (!st.lora) return `Ya se adapta, pero mira el diagnóstico: <b>${m.porEjTxt} parámetros por radiografía</b>. Ajustar los 22,3 M de la capa 4 con 800 ejemplos es pedirle que memorice. Prueba el botón <b>Activar LoRA</b>.`;
          return `Vas por buen camino con LoRA, pero tienes demasiadas capas sueltas: ${m.porEjTxt} parámetros por ejemplo. Deja solo la capa 4 y la cabeza.`;
        },
      },
      {
        n: "Reto 3 · todo el modelo, una sola GPU",
        ej: 800,
        tarea: `Ahora quieres que <b>las cinco capas</b> se adapten a las radiografías. Pero solo tienes una GPU: consigue que todo sea entrenable manteniéndote <b>por debajo de 500 mil parámetros entrenables</b>.`,
        pista: "Descongélalo todo. Los 96,6 millones no caben; hay una forma de que sí quepan.",
        ok: (st, m) => st.entrena.every(Boolean) && m.ent < 500000,
        bien: `Ahí está el porqué de LoRA. Las cinco capas se adaptan y aun así solo entrenas <b>372 mil parámetros</b>: el 0,39 % del modelo. Sin LoRA serían 96,6 millones, que no caben en una sola GPU. El artículo original reporta hasta 10.000 veces menos parámetros entrenables.`,
        mal: (st, m) => {
          if (!st.entrena.every(Boolean)) return `Todavía te quedan capas congeladas. El reto pide que las cinco sean entrenables.`;
          return `Las cinco están entrenables, pero son <b>${m.entTxt} parámetros</b>: muy por encima del límite de 500 mil. Activa <b>LoRA</b>.`;
        },
      },
      {
        n: "Reto 4 · cuando sí sobran los datos",
        ej: 60000,
        tarea: `Pasan los años y el hospital reúne <b>60.000 radiografías</b> diagnosticadas. Con tantos datos ya puedes permitirte el ajuste completo. <b>Deja las cinco capas entrenables, sin LoRA</b>, y comprueba que ahora la relación ya no es descabellada.`,
        pista: "Fíjate en cómo cambia el diagnóstico con los mismos parámetros, solo por tener más datos.",
        ok: (st, m) => st.entrena.every(Boolean) && !st.lora && m.estado !== "mal",
        bien: `Correcto, y esta es la otra cara del tema. Los parámetros son los mismos <b>96,6 M</b> que en el reto 3, pero ahora hay 60.000 ejemplos: bajas a <b>${'{POR}'} por ejemplo</b>. <b>La ventaja de transferir es mayor cuanto menos datos tengas</b>, y se encoge cuando sobran.`,
        mal: (st, m) => {
          if (st.lora) return `El reto pide hacerlo <b>sin</b> LoRA, para comparar con el reto 3. Desactívalo.`;
          if (!st.entrena.every(Boolean)) return `Faltan capas por descongelar: el reto pide el ajuste completo, las cinco.`;
          return `Todavía no. Revisa que estén las cinco capas entrenables y LoRA desactivado.`;
        },
      },
    ];

    const st = { r: 0, entrena: [false, false, false, false, false], lora: false, resultado: null, libre: false };

    const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(".", ",") + " M"
                   : n >= 1e3 ? Math.round(n / 1e3) + " mil" : Math.round(n);
    const num = n => n < 1 ? n.toFixed(2).replace(".", ",") : Math.round(n).toLocaleString("es");

    function medir() {
      const reto = RETOS[Math.min(st.r, RETOS.length - 1)];
      const ej = st.libre ? 800 : reto.ej;
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

      /* Enunciado del reto y su resultado */
      root.querySelector(".reto-caja").innerHTML = fin ? `
        <div class="reto-hd completado">
          <div class="reto-n">Los 4 retos resueltos</div>
          <p>Ya puedes probar libremente: cambia capas y LoRA y mira cómo se mueve el diagnóstico. El escenario queda en 800 radiografías.</p>
          <button class="btn btn-secondary btn-sm" data-sim-action="volver">Empezar de nuevo</button>
        </div>` : `
        <div class="reto-hd">
          <div class="reto-top">
            <span class="reto-n">${reto.n}</span>
            <span class="reto-datos">${reto.ej.toLocaleString("es")} radiografías diagnosticadas</span>
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

      /* Capas */
      root.querySelector(".capas").innerHTML = CAPAS.map((c, i) => {
        const on = st.entrena[i];
        const p = on ? c.p * (st.lora && i < 4 ? LORA_FRAC : 1) : 0;
        return `
        <button class="capa ${on ? "entrena" : "congelada"}" data-capa="${i}">
          <span class="capa-ic">${on ? "🔥" : "❄"}</span>
          <span class="capa-b"><b>${c.t}</b><span class="capa-d">${c.d}</span></span>
          <span class="capa-p"><em>${on ? fmt(p) : "0"}</em>
            <span>${on ? (st.lora && i < 4 ? "con LoRA" : "entrenables") : "congelada"}</span></span>
        </button>`;
      }).join("");

      /* Panel de cifras */
      const pct = (m.ent / TOTAL) * 100;
      const etiqueta = { vacio: "Nada se entrena", mal: "Muy pocos datos", medio: "Justo", bien: "Buena relación" }[m.estado];
      root.querySelector(".panel").innerHTML = `
        <div class="pv"><span>Parámetros entrenables</span><b>${m.entTxt}</b>
          <em>de ${fmt(TOTAL)} en total</em></div>
        <div class="barra-capas"><i style="width:${Math.max(pct, m.ent > 0 ? 0.6 : 0)}%"></i></div>
        <div class="pv-mini">
          <div><span>Del modelo</span><b>${pct < 1 ? pct.toFixed(2).replace(".", ",") : pct.toFixed(1).replace(".", ",")} %</b></div>
          <div><span>Por radiografía</span><b>${m.ent === 0 ? "—" : m.porEjTxt}</b></div>
        </div>
        <div class="semaforo ${m.estado}"><b>${etiqueta}</b></div>`;

      root.querySelector('[data-sim-action="lora"]').textContent = st.lora ? "Desactivar LoRA" : "Activar LoRA";
      root.querySelector('[data-sim-action="comprobar"]').style.display = fin ? "none" : "";
      root.querySelector(".sim-note").innerHTML = fin
        ? `Las capas de arriba son las más generales y las de abajo las más pegadas a la tarea original. La regla que resume todo el tema: <b>congela lo general, ajusta lo específico, y usa LoRA cuando no te alcancen los datos o la GPU</b>.`
        : `Toca una capa para congelarla (❄) o dejarla entrenable (🔥). Cuando creas que está, pulsa <b>Comprobar</b>.`;
    }

    function comprobar() {
      const reto = RETOS[st.r];
      const m = medir();
      const ok = reto.ok(st, m);
      let texto = ok ? reto.bien : reto.mal(st, m);
      texto = texto.replace("{POR}", m.porEjTxt);
      st.resultado = { ok, texto };
      pintar();
    }

    root.addEventListener("click", (e) => {
      const c = e.target.closest(".capa");
      if (!c) return;
      st.entrena[Number(c.dataset.capa)] = !st.entrena[Number(c.dataset.capa)];
      st.resultado = null;
      pintar();
    });

    return {
      accion(a) {
        if (a === "lora") { st.lora = !st.lora; st.resultado = null; }
        if (a === "comprobar") { comprobar(); return; }
        if (a === "siguiente") { st.r++; st.entrena = [false,false,false,false,false]; st.lora = false; st.resultado = null; }
        if (a === "reiniciar") { st.entrena = [false,false,false,false,false]; st.lora = false; st.resultado = null; }
        if (a === "volver") { st.r = 0; st.entrena = [false,false,false,false,false]; st.lora = false; st.resultado = null; }
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

/* =========================================================
   exercises.js — Motor de ejercicios variados

   Tipos soportados:
     vf          verdadero / falso
     ordenar     poner pasos en el orden correcto
     relacionar  emparejar concepto con su definición
     clasificar  repartir elementos entre categorías
     escenario   caso práctico con opciones

   Interacción: todo funciona con "tocar y tocar" (tocas el
   elemento y luego el destino). En escritorio además se
   puede arrastrar. El arrastre puro falla en móvil, y la
   página tiene que servir en un celular.
   ========================================================= */

const PTS_RETO = 15;  // acertar un ejercicio de la mini evaluación

function mezclar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const esc = s => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- Render de cada tipo ---------- */

function retoHtml(t, r, idx) {
  const key = `${t.id}:${idx}`;
  const hecho = State.retos[key] !== undefined;
  const body = {
    vf: renderVF,
    ordenar: renderOrdenar,
    relacionar: renderRelacionar,
    clasificar: renderClasificar,
    escenario: renderEscenario,
  }[r.tipo];

  const etiquetaTipo = {
    vf: "Verdadero o falso",
    ordenar: "Ordena los pasos",
    relacionar: "Relaciona los conceptos",
    clasificar: "Clasifica cada elemento",
    escenario: "Resuelve el caso",
  }[r.tipo] || "Ejercicio";

  return `
  <div class="reto" data-topic="${t.id}" data-idx="${idx}" data-tipo="${r.tipo}" ${hecho ? 'data-hecho="1"' : ""}>
    <div class="reto-head">
      <span class="reto-tipo">${etiquetaTipo}</span>
      ${hecho ? `<span class="chip ${State.retos[key] ? "chip-done" : "chip-time"}">${State.retos[key] ? "Acertado" : "Fallado"}</span>` : ""}
    </div>
    <p class="reto-q">${r.q}</p>
    ${body ? body(r, hecho, key) : ""}
    <div class="reto-fb ${hecho ? "show " + (State.retos[key] ? "ok" : "no") : ""}">
      ${hecho ? `<b>${State.retos[key] ? "Correcto" : "No exactamente"}</b>${r.exp}` : ""}
    </div>
  </div>`;
}

function renderVF(r, hecho, key) {
  const val = State.retos[key];
  const cls = v => {
    if (!hecho) return "";
    if (v === r.correct) return "correct";
    return val === false ? "wrong" : "";
  };
  return `
  <div class="vf-row">
    <button class="vf-btn ${cls(true)}" data-v="true" ${hecho ? "disabled" : ""}>Verdadero</button>
    <button class="vf-btn ${cls(false)}" data-v="false" ${hecho ? "disabled" : ""}>Falso</button>
  </div>`;
}

function renderEscenario(r, hecho, key) {
  return `
  ${r.contexto ? `<div class="escenario">${r.contexto}</div>` : ""}
  <div class="quiz-opts">
    ${r.options.map((o, i) => `
      <button class="quiz-opt esc-opt ${hecho && i === r.correct ? "correct" : ""}" data-oi="${i}" ${hecho ? "disabled" : ""}>
        <span class="mark">${String.fromCharCode(65 + i)}</span><span>${o}</span>
      </button>`).join("")}
  </div>`;
}

function renderOrdenar(r, hecho, key) {
  const items = hecho ? r.items : mezclar(r.items);
  return `
  <p class="reto-hint">Toca los pasos en el orden correcto.</p>
  <div class="ord-list">
    ${items.map(it => `
      <button class="ord-item ${hecho ? "correct" : ""}" data-val="${esc(it)}" ${hecho ? "disabled" : ""}>
        <span class="ord-n"></span><span>${it}</span>
      </button>`).join("")}
  </div>`;
}

function renderRelacionar(r, hecho, key) {
  const izq = r.pares.map(p => p.a);
  const der = hecho ? r.pares.map(p => p.b) : mezclar(r.pares.map(p => p.b));
  return `
  <p class="reto-hint">Toca un concepto de la izquierda y luego su pareja de la derecha.</p>
  <div class="rel-grid">
    <div class="rel-col">
      ${izq.map(v => `<button class="rel-item ${hecho ? "correct" : ""}" data-lado="a" data-val="${esc(v)}" ${hecho ? "disabled" : ""}>${v}</button>`).join("")}
    </div>
    <div class="rel-col">
      ${der.map(v => `<button class="rel-item ${hecho ? "correct" : ""}" data-lado="b" data-val="${esc(v)}" ${hecho ? "disabled" : ""}>${v}</button>`).join("")}
    </div>
  </div>`;
}

function renderClasificar(r, hecho, key) {
  const items = hecho ? r.items.map(i => i.t) : mezclar(r.items.map(i => i.t));
  return `
  <p class="reto-hint">Toca un elemento y luego la categoría a la que pertenece.</p>
  <div class="cls-pool">
    ${items.map(v => `<button class="cls-item" data-val="${esc(v)}" draggable="true" ${hecho ? "disabled" : ""}>${v}</button>`).join("")}
  </div>
  <div class="cls-cats">
    ${r.categorias.map(c => `
      <div class="cls-cat" data-cat="${esc(c)}">
        <div class="cls-cat-t">${c}</div>
        <div class="cls-drop"></div>
      </div>`).join("")}
  </div>`;
}

/* ---------- Evaluación ---------- */

function marcarReto(card, ok, r) {
  const t = byId(card.dataset.topic);
  const idx = Number(card.dataset.idx);
  const key = `${t.id}:${idx}`;
  if (State.retos[key] !== undefined) return;

  const antes = snapshotLogros();
  State.retos[key] = ok;
  if (ok) State.points += PTS_RETO;
  card.dataset.hecho = "1";

  const fb = card.querySelector(".reto-fb");
  fb.className = "reto-fb show " + (ok ? "ok" : "no");
  fb.innerHTML = `<b>${ok ? "Correcto" : "No exactamente"}</b>${r.exp}`;

  const head = card.querySelector(".reto-head");
  if (!head.querySelector(".chip")) {
    head.insertAdjacentHTML("beforeend",
      `<span class="chip ${ok ? "chip-done" : "chip-time"}">${ok ? "Acertado" : "Fallado"}</span>`);
  }

  registrarActividad();
  saveState();
  updateRing();
  revisarLogros(antes);
  actualizarResumen(t);
}

/* Resumen final de la mini evaluación */
function resumenHtml(t) {
  if (!t.reto) return "";
  const total = t.reto.length;
  const hechos = t.reto.filter((_, i) => State.retos[`${t.id}:${i}`] !== undefined).length;
  if (hechos < total) {
    return `<div class="resumen pendiente" id="resumen-${t.id}">
      <div class="res-txt">Has resuelto <b>${hechos}</b> de <b>${total}</b> ejercicios de esta evaluación.</div>
    </div>`;
  }
  const ok = t.reto.filter((_, i) => State.retos[`${t.id}:${i}`] === true).length;
  const pct = Math.round((ok / total) * 100);
  const bien = pct >= 70;
  const fallados = t.reto
    .map((r, i) => ({ r, i }))
    .filter(({ i }) => State.retos[`${t.id}:${i}`] === false)
    .map(({ r }) => r.concepto)
    .filter(Boolean);

  return `
  <div class="resumen ${bien ? "bien" : "repasar"}" id="resumen-${t.id}">
    <div class="res-top">
      <div class="res-score">${ok}<span>/${total}</span></div>
      <div>
        <h4>${bien ? "Concepto dominado" : "Te recomendamos repasar"}</h4>
        <p>${bien
          ? "Respondiste bien la mayoría. Puedes seguir con el siguiente tema."
          : "Vuelve sobre la explicación de este tema antes de continuar: son conceptos que se apoyan unos en otros."}</p>
      </div>
    </div>
    ${fallados.length ? `<div class="res-review">
      <span class="rr-l">Conceptos por reforzar</span>
      <div class="rr-chips">${[...new Set(fallados)].map(c => `<span class="chip chip-time">${c}</span>`).join("")}</div>
    </div>` : ""}
  </div>`;
}

function actualizarResumen(t) {
  const el = document.getElementById("resumen-" + t.id);
  if (el) el.outerHTML = resumenHtml(t);
}

/* ---------- Interacción ---------- */
/* Estado temporal de los ejercicios en curso (no se persiste) */
const enCurso = {};

function estadoDe(card) {
  const k = card.dataset.topic + ":" + card.dataset.idx;
  if (!enCurso[k]) enCurso[k] = { orden: [], pares: [], sel: null, asignados: {} };
  return enCurso[k];
}

function manejarReto(e) {
  const card = e.target.closest(".reto");
  if (!card || card.dataset.hecho === "1") return false;

  const t = byId(card.dataset.topic);
  const r = t.reto[Number(card.dataset.idx)];
  const st = estadoDe(card);

  /* --- verdadero / falso --- */
  const vf = e.target.closest(".vf-btn");
  if (vf) {
    const val = vf.dataset.v === "true";
    const ok = val === r.correct;
    card.querySelectorAll(".vf-btn").forEach(b => {
      b.disabled = true;
      if ((b.dataset.v === "true") === r.correct) b.classList.add("correct");
      else if (b === vf) b.classList.add("wrong");
    });
    marcarReto(card, ok, r);
    return true;
  }

  /* --- escenario --- */
  const eo = e.target.closest(".esc-opt");
  if (eo) {
    const i = Number(eo.dataset.oi);
    const ok = i === r.correct;
    card.querySelectorAll(".esc-opt").forEach((b, j) => {
      b.disabled = true;
      if (j === r.correct) b.classList.add("correct");
      else if (b === eo) b.classList.add("wrong");
    });
    marcarReto(card, ok, r);
    return true;
  }

  /* --- ordenar --- */
  const oi = e.target.closest(".ord-item");
  if (oi) {
    if (oi.classList.contains("picked")) return true;
    oi.classList.add("picked");
    st.orden.push(oi.dataset.val);
    oi.querySelector(".ord-n").textContent = st.orden.length;
    if (st.orden.length === r.items.length) {
      const ok = st.orden.every((v, i) => v === r.items[i]);
      card.querySelectorAll(".ord-item").forEach(b => {
        b.disabled = true;
        const pos = st.orden.indexOf(b.dataset.val);
        b.classList.add(r.items[pos] === b.dataset.val ? "correct" : "wrong");
      });
      if (!ok) {
        card.querySelector(".ord-list").insertAdjacentHTML("afterend",
          `<p class="reto-hint correcto">Orden correcto: ${r.items.map((x, i) => `${i + 1}. ${x}`).join(" · ")}</p>`);
      }
      marcarReto(card, ok, r);
    }
    return true;
  }

  /* --- relacionar --- */
  const ri = e.target.closest(".rel-item");
  if (ri) {
    if (ri.classList.contains("usado")) return true;
    if (ri.dataset.lado === "a") {
      card.querySelectorAll('.rel-item[data-lado="a"]').forEach(b => b.classList.remove("sel"));
      ri.classList.add("sel");
      st.sel = ri;
      return true;
    }
    if (!st.sel) return true;
    st.pares.push({ a: st.sel.dataset.val, b: ri.dataset.val });
    st.sel.classList.remove("sel"); st.sel.classList.add("usado");
    ri.classList.add("usado");
    const n = st.pares.length;
    st.sel.querySelector(".rel-n")?.remove();
    st.sel.insertAdjacentHTML("beforeend", `<span class="rel-n">${n}</span>`);
    ri.insertAdjacentHTML("beforeend", `<span class="rel-n">${n}</span>`);
    st.sel = null;

    if (st.pares.length === r.pares.length) {
      const ok = st.pares.every(p => r.pares.some(q => q.a === p.a && q.b === p.b));
      card.querySelectorAll(".rel-item").forEach(b => b.disabled = true);
      st.pares.forEach(p => {
        const correcto = r.pares.some(q => q.a === p.a && q.b === p.b);
        card.querySelectorAll(".rel-item").forEach(b => {
          if (b.dataset.val === p.a || b.dataset.val === p.b) b.classList.add(correcto ? "correct" : "wrong");
        });
      });
      if (!ok) {
        card.querySelector(".rel-grid").insertAdjacentHTML("afterend",
          `<p class="reto-hint correcto">Parejas correctas: ${r.pares.map(p => `${p.a} → ${p.b}`).join(" · ")}</p>`);
      }
      marcarReto(card, ok, r);
    }
    return true;
  }

  /* --- clasificar --- */
  const ci = e.target.closest(".cls-item");
  if (ci && !ci.closest(".cls-drop")) {
    card.querySelectorAll(".cls-item").forEach(b => b.classList.remove("sel"));
    ci.classList.add("sel");
    st.sel = ci;
    return true;
  }
  const cat = e.target.closest(".cls-cat");
  if (cat && st.sel) {
    const drop = cat.querySelector(".cls-drop");
    st.sel.classList.remove("sel");
    drop.appendChild(st.sel);
    st.asignados[st.sel.dataset.val] = cat.dataset.cat;
    st.sel = null;

    // El contenedor de origen se oculta cuando ya no queda nada por repartir
    const pool = card.querySelector(".cls-pool");
    if (pool && !pool.querySelector(".cls-item")) pool.classList.add("vacio");

    if (Object.keys(st.asignados).length === r.items.length) {
      let ok = true;
      card.querySelectorAll(".cls-item").forEach(b => {
        b.disabled = true;
        const esperado = r.items.find(x => x.t === b.dataset.val).cat;
        const puesto = st.asignados[b.dataset.val];
        const bien = esperado === puesto;
        b.classList.add(bien ? "correct" : "wrong");
        if (!bien) ok = false;
      });
      marcarReto(card, ok, r);
    }
    return true;
  }

  return false;
}

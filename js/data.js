/* =========================================================
   data.js — Contenido de los 9 paradigmas
   Toda la información pedagógica vive aquí. Editar este
   archivo cambia el sitio sin tocar la lógica.
   ========================================================= */

const TOPICS = [
  /* ---------------------------------------------------- 1 */
  {
    id: "supervisado", num: 1,
    title: "Aprendizaje supervisado",
    tag: "Aprende de ejemplos que ya traen la respuesta correcta",
    nivel: "Básico", minutos: 8,
    intro: `Es el punto de partida de casi todo el aprendizaje automático y el más fácil de entender: se le muestran al modelo miles de ejemplos junto con su respuesta correcta, y él aprende a reproducir esa relación en casos nuevos.`,
    definicion: `El modelo aprende una función que relaciona <b>entradas</b> con <b>salidas</b> a partir de datos <b>etiquetados</b>: cada ejemplo de entrenamiento ya trae la respuesta correcta.`,
    explicacion: [
      `Durante el entrenamiento se le muestran al modelo pares <code>(entrada, salida)</code>. El modelo hace una predicción, se compara contra la etiqueta real usando una <strong>función de pérdida</strong>, y sus parámetros se ajustan —normalmente con descenso de gradiente— para reducir ese error.`,
      `El ciclo se repite miles o millones de veces hasta que el modelo <strong>generaliza</strong>: predice correctamente sobre ejemplos nuevos que nunca vio, en lugar de limitarse a memorizar los de entrenamiento.`,
    ],
    diagram: SVG_SUPERVISADO,
    diagramCaption: "Ciclo de entrenamiento: predicción, comparación con la etiqueta real y ajuste de parámetros.",
    examples: [
      { tag: "Clasificación", text: `Un filtro de <b>spam</b>: se entrena con miles de correos ya marcados como "spam" o "no spam", y aprende a clasificar correos nuevos.` },
      { tag: "Regresión", text: `Predecir el <b>precio de una vivienda</b> a partir de metros cuadrados y ubicación, usando precios reales de ventas pasadas como etiqueta.` },
    ],
    quiz: [
      { q: "¿Qué necesita obligatoriamente el aprendizaje supervisado para entrenar?", options: ["Solo datos, sin ninguna estructura", "Datos etiquetados (entrada y salida conocida)", "Un entorno con recompensas", "Una gran cantidad de texto sin procesar"], correct: 1, exp: "El supervisado requiere pares entrada-salida ya conocidos: es exactamente lo que lo distingue del no supervisado." },
      { q: "¿Para qué sirve la función de pérdida?", options: ["Para generar datos nuevos", "Para medir qué tan lejos está la predicción de la etiqueta real", "Para agrupar datos similares", "Para decidir cuántas capas tiene el modelo"], correct: 1, exp: "La pérdida cuantifica el error; el entrenamiento ajusta los parámetros para minimizarla." },
      { q: "Un modelo que predice el precio de una casa está resolviendo un problema de…", options: ["Clasificación", "Regresión", "Clustering", "Aprendizaje por refuerzo"], correct: 1, exp: "Predecir un valor numérico continuo es regresión, un caso particular de aprendizaje supervisado." },
    ],
  },

  /* ---------------------------------------------------- 2 */
  {
    id: "no-supervisado", num: 2,
    title: "Aprendizaje no supervisado",
    tag: "Encuentra estructura oculta sin que nadie le diga qué buscar",
    nivel: "Básico", minutos: 8,
    intro: `Aquí desaparece la respuesta correcta. El modelo recibe datos "en crudo" y su tarea es encontrar por sí mismo la estructura que hay dentro: qué se parece a qué, qué grupos existen, qué patrones se repiten.`,
    definicion: `El modelo busca <b>patrones o estructuras</b> ocultas en los datos <b>sin usar etiquetas</b>: nadie le indica cuál es la respuesta correcta.`,
    explicacion: [
      `Como no hay una respuesta que aprender, el algoritmo se apoya en la <strong>similitud o distancia</strong> entre los datos para organizarlos: agrupa los que se parecen (<code>clustering</code>) o reduce su dimensionalidad para encontrar la estructura esencial detrás de muchas variables.`,
      `El resultado no es una predicción exacta sino una nueva forma de ver los datos —grupos, jerarquías, representaciones más simples— que después un humano interpreta y nombra.`,
    ],
    diagram: SVG_NO_SUPERVISADO,
    diagramCaption: "El algoritmo agrupa datos sin etiquetar según su similitud, descubriendo la estructura por sí solo.",
    examples: [
      { tag: "Clustering", text: `<b>Segmentar clientes</b> de una tienda según su comportamiento de compra con K-means, sin saber de antemano qué grupos existen.` },
      { tag: "Reducción de dimensionalidad", text: `Usar <b>PCA o autoencoders</b> para comprimir datos de muchas variables en pocas, y poder visualizarlos o almacenarlos mejor.` },
    ],
    quiz: [
      { q: "¿Qué NO tiene el aprendizaje no supervisado que sí tiene el supervisado?", options: ["Datos", "Un algoritmo", "Etiquetas (respuestas conocidas)", "Parámetros"], correct: 2, exp: "La ausencia de etiquetas es justamente lo que define a este paradigma." },
      { q: "Agrupar clientes similares sin conocer de antemano los grupos es un ejemplo de…", options: ["Clasificación", "Clustering", "Fine-tuning", "Aprendizaje por refuerzo"], correct: 1, exp: "El clustering agrupa datos por similitud sin etiquetas previas: es la técnica no supervisada más común." },
      { q: "¿En qué se basa un algoritmo no supervisado para organizar los datos?", options: ["En instrucciones escritas por un humano", "En la similitud o distancia entre los datos", "En una recompensa numérica", "En una etiqueta correcta"], correct: 1, exp: "Sin etiquetas, la única señal disponible es qué tan parecidos o distintos son los datos entre sí." },
    ],
  },

  /* ---------------------------------------------------- 3 */
  {
    id: "semisupervisado", num: 3,
    title: "Aprendizaje semisupervisado",
    tag: "Pocas etiquetas caras y muchos datos sin etiquetar",
    nivel: "Intermedio", minutos: 7,
    intro: `Nace de un problema muy real: etiquetar datos cuesta dinero y tiempo experto, pero conseguir datos sin etiquetar es casi gratis. Este paradigma exprime esa asimetría.`,
    definicion: `Combina una <b>pequeña cantidad de datos etiquetados</b> con una <b>gran cantidad de datos sin etiquetar</b> para entrenar el modelo.`,
    explicacion: [
      `El modelo aprende primero con los pocos datos etiquetados disponibles. Con ese conocimiento inicial genera <strong>pseudo-etiquetas</strong> para los datos sin etiquetar —predice cuál sería su etiqueta— y las usa para seguir entrenando, refinándose de forma iterativa.`,
      `La clave está en que la estructura de los datos sin etiquetar aporta información aunque no tengan respuesta: ayuda al modelo a entender cómo se distribuyen los ejemplos en el espacio.`,
    ],
    diagram: SVG_SEMISUPERVISADO,
    diagramCaption: "Un modelo entrenado con pocas etiquetas genera pseudo-etiquetas para el resto de los datos.",
    examples: [
      { tag: "Medicina", text: `Diagnóstico por <b>imágenes médicas</b>: solo unas pocas radiografías tienen diagnóstico confirmado por un especialista, pero hay miles sin etiquetar.` },
      { tag: "Voz", text: `<b>Transcripción de audio</b>: solo una fracción de las horas grabadas fue transcrita a mano; el resto se aprovecha sin etiquetar.` },
    ],
    quiz: [
      { q: "¿Qué combina el aprendizaje semisupervisado?", options: ["Solo datos etiquetados", "Solo datos sin etiquetar", "Pocos datos etiquetados y muchos sin etiquetar", "Recompensas y castigos"], correct: 2, exp: "Es su definición: una mezcla de ambos tipos, aprovechando lo poco etiquetado que hay disponible." },
      { q: "¿Qué es una pseudo-etiqueta?", options: ["Una etiqueta puesta por un humano experto", "Una etiqueta que el propio modelo genera para datos sin etiquetar", "Un error del modelo", "Una recompensa en aprendizaje por refuerzo"], correct: 1, exp: "El modelo usa lo que ya aprendió para estimar etiquetas de los datos restantes y seguir entrenando con ellas." },
      { q: "¿Cuándo conviene más este enfoque?", options: ["Cuando etiquetar es barato y rápido", "Cuando etiquetar es caro o requiere expertos, pero hay muchos datos sin etiquetar", "Cuando no hay ningún dato etiquetado", "Cuando el problema es un juego con recompensas"], correct: 1, exp: "Su valor está en aprovechar datos sin etiquetar cuando conseguir etiquetas resulta costoso." },
    ],
  },

  /* ---------------------------------------------------- 4 */
  {
    id: "autosupervisado", num: 4,
    title: "Aprendizaje autosupervisado",
    tag: "El propio dato genera su etiqueta, sin intervención humana",
    nivel: "Intermedio", minutos: 9,
    intro: `Es el motor silencioso detrás de los grandes modelos de lenguaje actuales. Resuelve el cuello de botella del etiquetado de una forma elegante: si el dato ya contiene la respuesta, no hace falta que nadie la escriba.`,
    definicion: `El modelo genera <b>sus propias etiquetas</b> a partir de la estructura interna de los datos, sin que ningún humano etiquete nada.`,
    explicacion: [
      `Se diseña una <strong>tarea pretexto</strong>: se oculta una parte del dato y se le pide al modelo que la prediga usando el resto. Como el dato original ya contiene la respuesta correcta —la parte que se ocultó—, la etiqueta se crea sola.`,
      `Esa tarea pretexto no es el objetivo final: es un pretexto, literalmente, para forzar al modelo a construir representaciones ricas del dominio. Sobre esas representaciones se resuelve después la tarea que sí interesa.`,
    ],
    diagram: SVG_AUTOSUPERVISADO,
    diagramCaption: "Se oculta una parte del dato y el modelo la predice: el dato original hace de etiqueta.",
    examples: [
      { tag: "Texto", text: `<b>BERT y GPT</b> se preentrenan prediciendo palabras enmascaradas o la palabra siguiente sobre enormes cantidades de texto que nadie etiquetó.` },
      { tag: "Visión", text: `Modelos como <b>MAE o SimCLR</b> ocultan parches de una imagen y aprenden a reconstruirlos, o a reconocer que dos recortes vienen de la misma foto.` },
    ],
    quiz: [
      { q: "¿De dónde salen las etiquetas en el aprendizaje autosupervisado?", options: ["Las pone un anotador humano", "Las genera el propio dato al ocultar una parte de sí mismo", "Vienen de una recompensa del entorno", "No existe ninguna señal de entrenamiento"], correct: 1, exp: "La etiqueta es la parte oculta del dato original: no requiere anotación humana." },
      { q: "¿Qué es una tarea pretexto?", options: ["La tarea final que le interesa al usuario", "Una tarea auxiliar que fuerza al modelo a aprender representaciones útiles", "Un tipo de recompensa", "Un conjunto de datos etiquetado por expertos"], correct: 1, exp: "Predecir la parte oculta no es el objetivo final, pero obliga al modelo a aprender patrones que después sirven." },
      { q: "¿Con qué paradigma se preentrenan hoy la mayoría de los grandes modelos de lenguaje?", options: ["Aprendizaje por refuerzo puro", "Supervisado, con miles de humanos etiquetando cada palabra", "Autosupervisado sobre texto masivo", "Semisupervisado"], correct: 2, exp: "Predecir la siguiente palabra sobre grandes corpus es autosupervisado: el propio texto aporta la señal." },
    ],
  },

  /* ---------------------------------------------------- 5 */
  {
    id: "transfer-learning", num: 5,
    title: "Transfer Learning y Fine-tuning",
    tag: "Reutilizar conocimiento ya aprendido en lugar de empezar de cero",
    nivel: "Intermedio", minutos: 12,
    destacado: true,
    intro: `Entrenar un modelo grande desde cero cuesta millones y exige datos que casi nadie tiene. Este paradigma resuelve el problema de la forma más sensata posible: aprovechar lo que otro modelo ya aprendió.`,
    definicion: `<b>Transfer learning</b> es reutilizar el conocimiento de un modelo ya entrenado para resolver una tarea distinta pero relacionada. El <b>fine-tuning</b> es la técnica más común para lograrlo: continuar entrenando ese modelo con datos de la nueva tarea.`,
    explicacion: [
      `El proceso tiene dos etapas muy asimétricas. Primero, un <strong>preentrenamiento</strong> sobre datos masivos y generales —casi siempre autosupervisado— produce un <strong>modelo base</strong> con representaciones amplias del dominio. Después, el <strong>fine-tuning</strong> continúa ese entrenamiento con un conjunto mucho más pequeño y específico, con una tasa de aprendizaje baja para no destruir lo ya aprendido.`,
      `Funciona porque las capas iniciales de una red aprenden lo general —bordes y texturas en visión, sintaxis en lenguaje— y solo las finales aprenden lo específico de la tarea original. Un borde sigue siendo un borde en una radiografía: eso es exactamente lo que se transfiere.`,
      `El fine-tuning completo actualiza todos los parámetros, lo que en modelos de miles de millones es caro. Por eso se usa <strong>PEFT</strong> (<em>Parameter-Efficient Fine-Tuning</em>) y en particular <strong>LoRA</strong> (Hu et al., 2021): se congelan los pesos originales y se entrenan solo matrices pequeñas añadidas. El artículo original reporta <strong>10.000 veces menos parámetros entrenables</strong> y <strong>3 veces menos memoria</strong> que el ajuste completo de GPT-3, con calidad igual o mejor.`,
    ],
    diagram: SVG_TRANSFER_PIPELINE,
    diagramCaption: "Preentrenamiento general, modelo base, fine-tuning específico y modelo especializado.",
    diagram2: SVG_LORA,
    diagram2Caption: "LoRA: los pesos originales quedan congelados y solo se entrenan matrices pequeñas de bajo rango.",
    examples: [
      { tag: "Visión", text: `Partir de un modelo preentrenado en <b>ImageNet</b> (1,28 millones de imágenes generales) y ajustarlo con unos pocos miles de radiografías para detectar una patología.` },
      { tag: "Modelos de lenguaje", text: `Aplicar <b>LoRA</b> sobre un modelo abierto usando las conversaciones de soporte de una empresa, para crear un asistente especializado sin reentrenar nada grande.` },
    ],
    extra: `<div class="block">
      <h3 class="block-h3">Fine-tuning completo frente a PEFT / LoRA</h3>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Aspecto</th><th>Fine-tuning completo</th><th>PEFT / LoRA</th></tr></thead>
        <tbody>
        <tr><td>Parámetros ajustados</td><td>Todos</td><td class="hl">Solo unas matrices nuevas</td></tr>
        <tr><td>Memoria GPU necesaria</td><td>Muy alta</td><td class="hl">Baja</td></tr>
        <tr><td>Tamaño del resultado</td><td>Un modelo completo por tarea</td><td class="hl">Un adaptador pequeño por tarea</td></tr>
        <tr><td>Tiempo de entrenamiento</td><td>Lento</td><td class="hl">Rápido</td></tr>
        <tr><td>Riesgo de olvido catastrófico</td><td>Mayor</td><td class="hl">Menor: los pesos base no cambian</td></tr>
        </tbody>
      </table></div>
    </div>`,
    quiz: [
      { q: "¿Cuál es la diferencia entre transfer learning y fine-tuning?", options: ["Son sinónimos exactos", "Transfer learning es la estrategia general de reutilizar conocimiento; fine-tuning es la técnica concreta de seguir entrenando el modelo", "Transfer learning solo aplica a imágenes y fine-tuning solo a texto", "El fine-tuning nunca parte de un modelo preentrenado"], correct: 1, exp: "Todo fine-tuning es transfer learning, pero no al revés: usar el modelo como extractor de características también es transferencia y no toca sus pesos." },
      { q: "¿Qué hace LoRA distinto del fine-tuning completo?", options: ["Entrena absolutamente todos los parámetros", "Congela los pesos originales y entrena solo matrices pequeñas añadidas", "Elimina la necesidad de datos de entrenamiento", "Solo funciona con aprendizaje por refuerzo"], correct: 1, exp: "LoRA deja intactos los pesos preentrenados e inyecta matrices de bajo rango que sí se ajustan, reduciendo drásticamente el costo." },
      { q: "¿Por qué se usa una tasa de aprendizaje baja en el fine-tuning?", options: ["Para que tarde más a propósito", "Para evitar el olvido catastrófico del conocimiento general", "Porque los datos de ajuste son de mala calidad", "Es un requisito técnico sin relación con el conocimiento previo"], correct: 1, exp: "Cambios bruscos en los pesos pueden destruir el conocimiento general que trae el modelo base." },
      { q: "¿En qué caso PEFT/LoRA aporta más valor?", options: ["Cuando hay recursos de cómputo ilimitados", "Cuando se quiere adaptar un modelo grande con recursos limitados", "Solo en aprendizaje no supervisado", "Cuando no existe ningún modelo preentrenado"], correct: 1, exp: "PEFT nació para hacer viable especializar modelos enormes sin la infraestructura de un reentrenamiento completo." },
    ],
  },

  /* ---------------------------------------------------- 6 */
  {
    id: "refuerzo", num: 6,
    title: "Aprendizaje por refuerzo",
    tag: "Aprender por prueba, error y recompensa",
    nivel: "Intermedio", minutos: 9,
    intro: `Aquí no hay un conjunto de datos preparado. Hay un agente, un entorno y una señal de recompensa. El modelo aprende actuando y viendo qué consecuencias tienen sus decisiones, igual que se aprende a montar en bicicleta.`,
    definicion: `Un <b>agente</b> aprende a tomar decisiones interactuando con un <b>entorno</b>, recibiendo <b>recompensas o castigos</b> según sus acciones, con el objetivo de maximizar la recompensa acumulada a largo plazo.`,
    explicacion: [
      `El ciclo es siempre el mismo: el agente observa un <strong>estado</strong>, elige una <strong>acción</strong> según su <strong>política</strong> —su estrategia actual—, el entorno responde con un nuevo estado y una <strong>recompensa</strong> numérica, y el agente usa esa señal para mejorar la política.`,
      `A diferencia del supervisado, no existe una respuesta correcta para cada acción: solo una recompensa que puede llegar mucho después de la decisión que la causó. Ese desfase se conoce como el problema del <strong>crédito diferido</strong> y es lo que hace difícil este paradigma.`,
    ],
    diagram: SVG_REFUERZO,
    diagramCaption: "El agente actúa sobre el entorno y el entorno responde con un nuevo estado y una recompensa.",
    examples: [
      { tag: "Juegos", text: `<b>AlphaGo y AlphaZero</b> aprendieron a jugar Go jugando millones de partidas contra sí mismos, mejorando su política con cada resultado.` },
      { tag: "Robótica", text: `Un <b>robot que aprende a caminar</b> en simulación, con recompensa por avanzar sin caerse y penalización por desestabilizarse.` },
    ],
    quiz: [
      { q: "¿Qué maximiza el agente en aprendizaje por refuerzo?", options: ["El número de datos etiquetados", "La recompensa acumulada a largo plazo", "La similitud entre los datos", "El número de parámetros del modelo"], correct: 1, exp: "El objetivo es una política que maximice la recompensa total esperada, no solo la inmediata." },
      { q: "¿Qué es la política de un agente?", options: ["Un conjunto de datos etiquetados", "La estrategia que usa para decidir qué acción tomar en cada estado", "El nombre del algoritmo de clustering", "La arquitectura de la red neuronal"], correct: 1, exp: "La política asigna acciones (o probabilidades de acción) a cada estado; es lo que el agente va mejorando." },
      { q: "¿Qué significa el problema del crédito diferido?", options: ["Que los datos vienen etiquetados de antemano", "Que la recompensa de una acción puede llegar mucho después de tomarla", "Que no existen entornos en este paradigma", "Que el modelo nunca actualiza sus parámetros"], correct: 1, exp: "Una decisión buena o mala puede no reflejarse en la recompensa hasta varios pasos después, y cuesta saber qué acción fue la responsable." },
    ],
  },

  /* ---------------------------------------------------- 7 */
  {
    id: "rlhf-rlaif", num: 7,
    title: "Alineación mediante RLHF y RLAIF",
    tag: "Ajustar el comportamiento del modelo a preferencias y principios",
    nivel: "Avanzado", minutos: 11,
    intro: `Un modelo preentrenado sabe completar texto, pero no sabe ser útil, honesto ni inofensivo. Estas técnicas son las que convierten un modelo base en un asistente con el que se puede conversar.`,
    definicion: `Técnicas de <b>alineación</b> que ajustan el comportamiento de un modelo ya preentrenado para que sus respuestas se acerquen a las preferencias o principios deseados, usando aprendizaje por refuerzo con retroalimentación <b>humana (RLHF)</b> o <b>de otra IA (RLAIF)</b>.`,
    explicacion: [
      `En <strong>RLHF</strong> (<em>Reinforcement Learning from Human Feedback</em>), personas comparan varias respuestas del modelo ante un mismo prompt y eligen la que prefieren. Con esas comparaciones se entrena un <strong>modelo de recompensa</strong> que aprende a predecir la preferencia humana. Después, un algoritmo de refuerzo —habitualmente PPO— ajusta el modelo original para maximizar esa recompensa.`,
      `<strong>RLAIF</strong> (<em>Reinforcement Learning from AI Feedback</em>) mantiene el mismo esquema pero sustituye al evaluador humano por otro modelo de IA que juzga siguiendo un conjunto explícito de principios llamado <strong>"constitución"</strong> —de ahí el nombre <em>Constitutional AI</em>—.`,
      `La diferencia importa: RLAIF es mucho más rápido y escalable que pagar miles de horas de evaluación humana, pero la calidad del resultado queda condicionada a qué tan buena sea esa constitución y qué tan fiable sea el modelo evaluador. No son intercambiables sin más.`,
    ],
    diagram: SVG_ALINEACION,
    diagramCaption: "Comparaciones de preferencia, modelo de recompensa, ajuste por refuerzo y modelo alineado.",
    examples: [
      { tag: "RLHF", text: `Un modelo base que solo completa texto se convierte en un <b>asistente que sigue instrucciones</b> y evita respuestas dañinas gracias a rondas de RLHF.` },
      { tag: "RLAIF", text: `Anthropic usa <b>Constitutional AI</b> para que el modelo evalúe y corrija sus propias respuestas según principios escritos, reduciendo la dependencia de evaluación humana masiva.` },
    ],
    quiz: [
      { q: "¿Cuál es la diferencia principal entre RLHF y RLAIF?", options: ["RLHF no usa aprendizaje por refuerzo y RLAIF sí", "En RLHF el evaluador es humano; en RLAIF es otro modelo de IA guiado por principios explícitos", "RLAIF solo se usa en robótica", "No hay ninguna diferencia real"], correct: 1, exp: "El esquema es idéntico —comparar respuestas, entrenar un modelo de recompensa, ajustar con RL—; lo que cambia es quién evalúa." },
      { q: "¿Qué es la constitución en Constitutional AI / RLAIF?", options: ["Un conjunto de datos de imágenes", "Un conjunto de principios explícitos que guían al modelo evaluador", "El nombre del algoritmo de gradiente", "Una ley sobre datos personales"], correct: 1, exp: "Son reglas escritas que la IA evaluadora usa como criterio para preferir una respuesta sobre otra." },
      { q: "¿Para qué sirve el modelo de recompensa?", options: ["Para generar imágenes", "Para predecir qué respuesta sería preferida y guiar el ajuste por refuerzo", "Para etiquetar datos sin ningún criterio", "Para reemplazar al modelo original"], correct: 1, exp: "Traduce las preferencias —humanas o de IA— en una señal numérica que el algoritmo de refuerzo puede optimizar." },
    ],
  },

  /* ---------------------------------------------------- 8 */
  {
    id: "in-context", num: 8,
    title: "Aprendizaje en contexto",
    tag: "Aprender desde el prompt, sin actualizar un solo peso",
    nivel: "Intermedio", minutos: 8,
    intro: `Es la capacidad más sorprendente de los modelos de lenguaje grandes: resolver una tarea que nunca entrenaron, solo porque se les mostró cómo hacerla en el propio mensaje. Y sin cambiar absolutamente nada en su interior.`,
    definicion: `Capacidad de un modelo grande de resolver una tarea nueva a partir de <b>ejemplos o instrucciones dados en el prompt</b>, <b>sin actualizar ni un solo peso</b>.`,
    explicacion: [
      `Gracias al mecanismo de <strong>autoatención</strong> del Transformer, el modelo usa los ejemplos presentes en el contexto como referencia para inferir el patrón de la tarea en el momento de generar la respuesta —en inferencia, no en entrenamiento—. Lo determinante no es solo cuántos ejemplos hay, sino qué tan pertinentes son.`,
      `Se distingue el caso <strong>zero-shot</strong> —solo una instrucción, sin ejemplos— del <strong>few-shot</strong>, con varios ejemplos en el mismo prompt.`,
      `La diferencia crucial con el fine-tuning es que aquí el aprendizaje es <strong>temporal</strong>: existe solo durante esa conversación y desaparece al terminarla. El fine-tuning, en cambio, modifica el modelo de forma permanente.`,
    ],
    diagram: SVG_EN_CONTEXTO,
    diagramCaption: "El modelo usa los ejemplos del propio prompt para inferir el patrón, sin modificar sus pesos.",
    examples: [
      { tag: "Few-shot", text: `Dar tres pares de traducción <b>inglés-francés</b> en el prompt y pedir la traducción de una cuarta frase, sin haber reentrenado el modelo para traducir.` },
      { tag: "Formato", text: `Mostrar el formato exacto de una <b>tabla</b> en el prompt para que el modelo continúe generando filas con esa misma estructura.` },
    ],
    quiz: [
      { q: "¿Qué NO ocurre durante el aprendizaje en contexto?", options: ["El modelo lee ejemplos del prompt", "Se actualizan los pesos del modelo", "El modelo genera una respuesta", "El modelo usa autoatención"], correct: 1, exp: "Es justamente lo que lo distingue del fine-tuning: los pesos quedan idénticos antes y después." },
      { q: "¿Cuál es la diferencia entre zero-shot y few-shot?", options: ["Zero-shot usa muchos ejemplos y few-shot ninguno", "Zero-shot no incluye ejemplos en el prompt, solo instrucción; few-shot incluye varios", "Son lo mismo", "Few-shot exige reentrenar el modelo"], correct: 1, exp: "La diferencia está en cuántos ejemplos de la tarea se incluyen dentro del prompt." },
      { q: "El aprendizaje logrado en contexto…", options: ["Es permanente, como el fine-tuning", "Es temporal: dura solo esa conversación", "Modifica el preentrenamiento", "Obliga a reiniciar el modelo"], correct: 1, exp: "Al no tocar los pesos, ese conocimiento desaparece cuando termina la conversación." },
    ],
  },

  /* ---------------------------------------------------- 9 */
  {
    id: "world-models", num: 9,
    title: "Modelos del mundo (World Models)",
    tag: "Aprender cómo funciona un entorno para predecir y planificar",
    nivel: "Avanzado", minutos: 10,
    intro: `La frontera actual. En lugar de limitarse a reaccionar, el sistema construye un modelo interno de cómo funciona el mundo, y lo usa para imaginar qué pasaría antes de actuar.`,
    definicion: `Sistemas que aprenden una <b>representación interna de la dinámica de un entorno</b> —sus reglas, su física, su causalidad— y la usan para <b>predecir o simular</b> cómo evolucionará ante distintas acciones.`,
    explicacion: [
      `En vez de reaccionar únicamente a lo que percibe, el sistema construye una especie de <strong>simulador interno</strong> que le permite anticipar las consecuencias de sus acciones y planificar antes de ejecutarlas. También puede generar entornos nuevos y coherentes a partir de una imagen o una descripción.`,
      `La ventaja práctica es grande: equivocarse dentro de una simulación no cuesta nada, mientras que equivocarse con un brazo robótico real cuesta piezas rotas. Por eso es un área central en robótica y en agentes autónomos.`,
      `Es un campo muy activo. <strong>Genie</strong>, de Google DeepMind, evolucionó desde generar mundos 2D no jugables en 2024 hasta <strong>Genie 3</strong> en agosto de 2025, capaz de generar mundos explorables en tiempo real a 720p y 24 fps con memoria de aproximadamente un minuto de interacción.`,
    ],
    diagram: SVG_WORLD_MODELS,
    diagramCaption: "El world model simula el siguiente estado del entorno antes de que el agente actúe realmente.",
    examples: [
      { tag: "Mundos generativos", text: `<b>Genie 3</b> genera mundos virtuales explorables e interactivos en tiempo real a partir de una imagen o un texto, manteniendo coherencia mientras el usuario se mueve dentro.` },
      { tag: "Video y física", text: `<b>Sora</b>, al generar video, aprende implícitamente propiedades del mundo físico —permanencia de objetos, sombras consistentes— actuando como un world model implícito.` },
    ],
    quiz: [
      { q: "¿Qué aprende principalmente un world model?", options: ["Solo a clasificar imágenes en categorías fijas", "Una representación interna de la dinámica del entorno, para predecir su evolución", "A traducir entre idiomas", "A comparar preferencias humanas"], correct: 1, exp: "Su valor está en poder simular o anticipar el entorno, no solo en reaccionar ante él." },
      { q: "¿Qué ventaja da simular antes de actuar?", options: ["Ninguna, siempre hay que actuar directamente", "Permite anticipar el resultado y planificar sin pagar el costo de un error real", "Elimina la necesidad de entrenamiento", "Solo sirve para generar texto"], correct: 1, exp: "Equivocarse dentro del simulador es gratis; equivocarse con un robot real, no." },
      { q: "¿Por qué Genie 3 se considera un world model?", options: ["Porque solo genera texto", "Porque genera mundos explorables que responden de forma coherente a las acciones del usuario", "Porque clasifica imágenes médicas", "Porque solo funciona con datos etiquetados"], correct: 1, exp: "Simula un entorno navegable y consistente en el tiempo, que es la esencia de un world model." },
    ],
  },
];

/* Ruta de aprendizaje sugerida: agrupa los temas en bloques con sentido pedagógico */
const RUTA = [
  {
    bloque: "Fundamentos",
    desc: "Las dos formas clásicas de aprender: con respuestas y sin ellas.",
    temas: ["supervisado", "no-supervisado"],
  },
  {
    bloque: "Aprender con pocas etiquetas",
    desc: "Cómo la IA superó el cuello de botella del etiquetado manual.",
    temas: ["semisupervisado", "autosupervisado"],
  },
  {
    bloque: "Reutilizar y especializar",
    desc: "El paradigma que hace viable la IA moderna fuera de los grandes laboratorios.",
    temas: ["transfer-learning"],
  },
  {
    bloque: "Aprender de la experiencia",
    desc: "Decisiones, recompensas y alineación con lo que las personas esperan.",
    temas: ["refuerzo", "rlhf-rlaif"],
  },
  {
    bloque: "La frontera",
    desc: "Capacidades emergentes de los modelos actuales.",
    temas: ["in-context", "world-models"],
  },
];

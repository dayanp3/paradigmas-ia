/* =========================================================
   data.js — Contenido de los 9 paradigmas
   Toda la información pedagógica vive aquí. Editar este
   archivo cambia el sitio sin tocar la lógica.

   Estructura de cada tema:
     intro              introducción breve
     definicion         definición formal
     enUnaFrase         explicación sencilla, lenguaje llano
     explicacion[]      desarrollo conceptual
     pasos[]            ¿cómo funciona?, paso a paso
     ejemploCotidiano   analogía de la vida diaria
     ejemploIA          caso aplicado a inteligencia artificial
     diagram            visualización del mecanismo
     aplicaciones[]     ¿dónde se utiliza?
     ventajas[]         fortalezas
     limitaciones[]     límites reales
     conceptosClave[]   resumen de términos
     quiz[]             ejercicios con retroalimentación
   ========================================================= */

const TOPICS = [
  /* ---------------------------------------------------- 1 */
  {
    id: "supervisado", num: 1,
    sim: "perceptron",
    title: "Aprendizaje supervisado",
    tag: "Aprende de ejemplos que ya traen la respuesta correcta",
    nivel: "Básico", minutos: 8,
    intro: `Es el punto de partida de casi todo el aprendizaje automático y el más fácil de entender: se le muestran al modelo miles de ejemplos junto con su respuesta correcta, y él aprende a reproducir esa relación en casos nuevos.`,
    definicion: `El modelo aprende una función que relaciona <b>entradas</b> con <b>salidas</b> a partir de datos <b>etiquetados</b>: cada ejemplo de entrenamiento ya trae la respuesta correcta.`,
    enUnaFrase: `Aprende como un estudiante que practica con un libro de ejercicios ya resueltos: ve el problema y también la respuesta.`,
    objetivo: `Predecir correctamente la salida para entradas que el modelo nunca vio durante el entrenamiento.`,
    explicacion: [
      `Durante el entrenamiento se le muestran al modelo pares <code>(entrada, salida)</code>. El modelo hace una predicción, se compara contra la etiqueta real usando una <strong>función de pérdida</strong>, y sus parámetros se ajustan —normalmente con descenso de gradiente— para reducir ese error.`,
      `El ciclo se repite miles o millones de veces hasta que el modelo <strong>generaliza</strong>: predice correctamente sobre ejemplos nuevos que nunca vio, en lugar de limitarse a memorizar los de entrenamiento. Cuando memoriza en vez de generalizar se dice que hay <strong>sobreajuste</strong>.`,
    ],
    pasos: [
      { t: "Reunir datos etiquetados", d: "Cada ejemplo debe venir acompañado de su respuesta correcta. Es la parte más costosa del proceso." },
      { t: "El modelo predice", d: "Con sus parámetros actuales, produce una salida para cada entrada." },
      { t: "Medir el error", d: "La función de pérdida cuantifica cuánto se aleja la predicción de la etiqueta real." },
      { t: "Ajustar y repetir", d: "Los parámetros se corrigen en la dirección que reduce el error, y el ciclo vuelve a empezar." },
    ],
    ejemploCotidiano: {
      t: "Enseñar frutas a un niño",
      d: `Le muestras una manzana y le dices "esto es una manzana". Repites con peras, bananos y naranjas. Después de suficientes ejemplos, el niño reconoce una manzana que nunca había visto antes. Nadie le explicó una regla: aprendió de ejemplos con su respuesta.`,
    },
    ejemploIA: {
      t: "Filtro de correo no deseado",
      d: `Se entrena con cientos de miles de correos que los usuarios ya marcaron como "spam" o "no spam". El modelo aprende qué combinaciones de palabras, remitentes y patrones caracterizan a cada clase, y clasifica correos nuevos automáticamente.`,
    },
    diagram: SVG_SUPERVISADO,
    diagramCaption: "Ciclo de entrenamiento: predicción, comparación con la etiqueta real y ajuste de parámetros.",
    examples: [
      { tag: "Clasificación", text: `Un filtro de <b>spam</b>: se entrena con miles de correos ya marcados, y aprende a clasificar correos nuevos.` },
      { tag: "Regresión", text: `Predecir el <b>precio de una vivienda</b> a partir de metros cuadrados y ubicación, usando precios reales de ventas pasadas como etiqueta.` },
    ],
    aplicaciones: [
      "Detección de correo no deseado",
      "Diagnóstico asistido por imágenes médicas",
      "Predicción de precios y demanda",
      "Reconocimiento de voz y clasificación de imágenes",
    ],
    ventajas: [
      "Alta precisión cuando hay suficientes datos de calidad.",
      "Los resultados se miden con métricas claras y objetivas.",
      "Es el paradigma mejor comprendido y con más herramientas maduras.",
    ],
    limitaciones: [
      "Etiquetar datos es caro, lento y a veces requiere expertos.",
      "Solo aprende lo que las etiquetas describen: no descubre patrones nuevos.",
      "Cualquier sesgo presente en las etiquetas se hereda y se amplifica.",
    ],
    conceptosClave: [
      { t: "Etiqueta", d: "La respuesta correcta que acompaña a cada ejemplo de entrenamiento." },
      { t: "Función de pérdida", d: "Medida numérica de cuánto se equivoca el modelo en cada predicción." },
      { t: "Generalización", d: "Capacidad de acertar en datos nuevos, no solo en los de entrenamiento." },
      { t: "Sobreajuste", d: "Cuando el modelo memoriza los datos de entrenamiento y falla con datos nuevos." },
    ],
    quiz: [
      { q: "¿Qué necesita obligatoriamente el aprendizaje supervisado para entrenar?", options: ["Solo datos, sin ninguna estructura", "Datos etiquetados (entrada y salida conocida)", "Un entorno con recompensas", "Una gran cantidad de texto sin procesar"], correct: 1, exp: "El supervisado requiere pares entrada-salida ya conocidos: es exactamente lo que lo distingue del no supervisado." },
      { q: "¿Para qué sirve la función de pérdida?", options: ["Para generar datos nuevos", "Para medir qué tan lejos está la predicción de la etiqueta real", "Para agrupar datos similares", "Para decidir cuántas capas tiene el modelo"], correct: 1, exp: "La pérdida cuantifica el error; el entrenamiento ajusta los parámetros para minimizarla." },
      { q: "Un modelo que predice el precio de una casa está resolviendo un problema de…", options: ["Clasificación", "Regresión", "Clustering", "Aprendizaje por refuerzo"], correct: 1, exp: "Predecir un valor numérico continuo es regresión, un caso particular de aprendizaje supervisado." },
      { q: "Si un modelo acierta casi siempre en entrenamiento pero falla con datos nuevos, ocurre…", options: ["Generalización", "Sobreajuste", "Clustering", "Transferencia"], correct: 1, exp: "El sobreajuste es memorizar en lugar de aprender la relación general. Se detecta comparando el error de entrenamiento con el de validación." },
    ],
  },

  /* ---------------------------------------------------- 2 */
  {
    id: "no-supervisado", num: 2,
    sim: "kmeans",
    title: "Aprendizaje no supervisado",
    tag: "Encuentra estructura oculta sin que nadie le diga qué buscar",
    nivel: "Básico", minutos: 8,
    intro: `Aquí desaparece la respuesta correcta. El modelo recibe datos en crudo y su tarea es encontrar por sí mismo la estructura que hay dentro: qué se parece a qué, qué grupos existen, qué patrones se repiten.`,
    definicion: `El modelo busca <b>patrones o estructuras</b> ocultas en los datos <b>sin usar etiquetas</b>: nadie le indica cuál es la respuesta correcta.`,
    enUnaFrase: `Le entregas los datos sin decirle nada, y él te dice qué grupos y regularidades encuentra dentro.`,
    objetivo: `Descubrir la organización interna de un conjunto de datos que nadie ha clasificado previamente.`,
    explicacion: [
      `Como no hay una respuesta que aprender, el algoritmo se apoya en la <strong>similitud o distancia</strong> entre los datos para organizarlos: agrupa los que se parecen (<code>clustering</code>) o reduce su dimensionalidad para encontrar la estructura esencial detrás de muchas variables.`,
      `El resultado no es una predicción exacta sino una nueva forma de ver los datos —grupos, jerarquías, representaciones más simples— que después un humano interpreta y nombra. Esa interpretación es parte imprescindible del método: el algoritmo encuentra tres grupos, pero es una persona quien decide que corresponden a "clientes ocasionales", "habituales" y "mayoristas".`,
    ],
    pasos: [
      { t: "Partir de datos sin etiquetas", d: "Solo se dispone de las características de cada ejemplo, sin ninguna respuesta asociada." },
      { t: "Definir una medida de similitud", d: "El algoritmo necesita saber qué significa que dos datos se parezcan: normalmente una distancia matemática." },
      { t: "Agrupar o comprimir", d: "Se forman grupos de elementos parecidos, o se reduce el número de variables conservando la estructura esencial." },
      { t: "Interpretar el resultado", d: "Una persona analiza los grupos encontrados y les da significado. Sin este paso el resultado no es útil." },
    ],
    ejemploCotidiano: {
      t: "Ordenar una caja de fotos viejas",
      d: `Tienes cientos de fotos familiares sin nombres ni fechas. Empiezas a hacer montones: las de la playa, las de navidades, las de un cumpleaños. Nadie te dijo qué categorías usar — las descubriste tú al notar qué fotos se parecían entre sí.`,
    },
    ejemploIA: {
      t: "Segmentación de clientes",
      d: `Una tienda tiene el historial de compras de 50.000 clientes pero ninguna clasificación previa. Un algoritmo de clustering encuentra que se agrupan naturalmente en perfiles distintos según frecuencia y monto de compra, y el equipo de marketing diseña una estrategia para cada perfil.`,
    },
    diagram: SVG_NO_SUPERVISADO,
    diagramCaption: "El algoritmo agrupa datos sin etiquetar según su similitud, descubriendo la estructura por sí solo.",
    examples: [
      { tag: "Clustering", text: `<b>Segmentar clientes</b> según su comportamiento de compra con K-means, sin saber de antemano qué grupos existen.` },
      { tag: "Reducción de dimensionalidad", text: `Usar <b>PCA o autoencoders</b> para comprimir datos de muchas variables en pocas, y poder visualizarlos o almacenarlos mejor.` },
    ],
    aplicaciones: [
      "Segmentación de clientes y estudios de mercado",
      "Detección de anomalías y fraude",
      "Sistemas de recomendación",
      "Compresión y visualización de datos complejos",
    ],
    ventajas: [
      "No necesita datos etiquetados, que son el recurso más caro.",
      "Puede descubrir estructuras que nadie sospechaba que existían.",
      "Es la herramienta natural para explorar un conjunto de datos desconocido.",
    ],
    limitaciones: [
      "No hay una respuesta correcta contra la cual validar objetivamente el resultado.",
      "Exige interpretación humana para que los grupos signifiquen algo.",
      "Es sensible a la escala de las variables y a la métrica de distancia elegida.",
    ],
    conceptosClave: [
      { t: "Clustering", d: "Agrupar elementos parecidos entre sí sin categorías predefinidas." },
      { t: "K-means", d: "Algoritmo de clustering que organiza los datos en un número de grupos fijado de antemano." },
      { t: "Reducción de dimensionalidad", d: "Representar los datos con menos variables conservando su estructura esencial." },
      { t: "Anomalía", d: "Dato que se aleja del patrón general; detectarlas es una aplicación central de este paradigma." },
    ],
    quiz: [
      { q: "¿Qué NO tiene el aprendizaje no supervisado que sí tiene el supervisado?", options: ["Datos", "Un algoritmo", "Etiquetas (respuestas conocidas)", "Parámetros"], correct: 2, exp: "La ausencia de etiquetas es justamente lo que define a este paradigma." },
      { q: "Agrupar clientes similares sin conocer de antemano los grupos es un ejemplo de…", options: ["Clasificación", "Clustering", "Fine-tuning", "Aprendizaje por refuerzo"], correct: 1, exp: "El clustering agrupa datos por similitud sin etiquetas previas: es la técnica no supervisada más común." },
      { q: "¿En qué se basa un algoritmo no supervisado para organizar los datos?", options: ["En instrucciones escritas por un humano", "En la similitud o distancia entre los datos", "En una recompensa numérica", "En una etiqueta correcta"], correct: 1, exp: "Sin etiquetas, la única señal disponible es qué tan parecidos o distintos son los datos entre sí." },
      { q: "¿Por qué es difícil validar un resultado no supervisado?", options: ["Porque los algoritmos son lentos", "Porque no existe una respuesta correcta de referencia para comparar", "Porque siempre requiere GPU", "Porque los datos son demasiado pequeños"], correct: 1, exp: "Sin etiquetas no hay verdad de referencia: la calidad del agrupamiento depende en buena parte del juicio experto." },
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
    enUnaFrase: `Aprende con unas pocas respuestas conocidas y completa el resto por su cuenta.`,
    objetivo: `Alcanzar una precisión cercana a la del aprendizaje supervisado usando una fracción de las etiquetas.`,
    explicacion: [
      `El modelo aprende primero con los pocos datos etiquetados disponibles. Con ese conocimiento inicial genera <strong>pseudo-etiquetas</strong> para los datos sin etiquetar —predice cuál sería su etiqueta— y las usa para seguir entrenando, refinándose de forma iterativa.`,
      `La clave está en que la estructura de los datos sin etiquetar aporta información aunque no tengan respuesta: ayuda al modelo a entender cómo se distribuyen los ejemplos. Esto solo funciona bajo un supuesto importante: que los datos etiquetados y los no etiquetados provienen de la misma distribución.`,
    ],
    pasos: [
      { t: "Entrenar con lo poco etiquetado", d: "Se construye un primer modelo usando únicamente los ejemplos que sí tienen respuesta." },
      { t: "Generar pseudo-etiquetas", d: "Ese modelo predice etiquetas para los datos sin etiquetar, normalmente conservando solo las predicciones de alta confianza." },
      { t: "Reentrenar con todo", d: "Se entrena de nuevo combinando etiquetas reales y pseudo-etiquetas." },
      { t: "Iterar con cuidado", d: "El ciclo se repite. Si las pseudo-etiquetas son malas, el error se refuerza a sí mismo en cada vuelta." },
    ],
    ejemploCotidiano: {
      t: "Estudiar con pocas respuestas al final del libro",
      d: `El libro trae 200 ejercicios pero solo 10 vienen resueltos. Estudias esos 10 con detalle, deduces el método, y con él resuelves los otros 190 comprobando que tus resultados sean coherentes entre sí.`,
    },
    ejemploIA: {
      t: "Diagnóstico por imagen médica",
      d: `Un hospital tiene 200.000 radiografías archivadas, pero solo 2.000 fueron revisadas y diagnosticadas por un radiólogo. Entrenar solo con esas 2.000 daría un modelo pobre; el enfoque semisupervisado aprovecha las 198.000 restantes para mejorar el desempeño.`,
    },
    diagram: SVG_SEMISUPERVISADO,
    diagramCaption: "Un modelo entrenado con pocas etiquetas genera pseudo-etiquetas para el resto de los datos.",
    examples: [
      { tag: "Medicina", text: `Solo unas pocas radiografías tienen diagnóstico confirmado por un especialista, pero hay miles sin etiquetar.` },
      { tag: "Voz", text: `<b>Transcripción de audio</b>: solo una fracción de las horas grabadas fue transcrita a mano; el resto se aprovecha sin etiquetar.` },
    ],
    aplicaciones: [
      "Diagnóstico asistido por imagen médica",
      "Transcripción y reconocimiento de voz",
      "Clasificación de documentos legales o técnicos",
      "Detección de fraude con pocos casos confirmados",
    ],
    ventajas: [
      "Reduce drásticamente el costo de etiquetado.",
      "Aprovecha datos abundantes que de otro modo se desperdiciarían.",
      "Suele superar al supervisado puro cuando las etiquetas son escasas.",
    ],
    limitaciones: [
      "Si las pseudo-etiquetas son incorrectas, el error se amplifica en cada iteración.",
      "Supone que los datos etiquetados y los no etiquetados comparten distribución.",
      "Es más difícil de ajustar y depurar que un entrenamiento supervisado normal.",
    ],
    conceptosClave: [
      { t: "Pseudo-etiqueta", d: "Etiqueta estimada por el propio modelo para un dato que no tenía respuesta." },
      { t: "Autoentrenamiento", d: "Estrategia de reentrenar el modelo con sus propias predicciones más confiables." },
      { t: "Distribución de datos", d: "Cómo se reparten los ejemplos; el método asume que es la misma en datos etiquetados y no etiquetados." },
      { t: "Propagación de errores", d: "Riesgo de que una pseudo-etiqueta equivocada se refuerce en las siguientes iteraciones." },
    ],
    quiz: [
      { q: "¿Qué combina el aprendizaje semisupervisado?", options: ["Solo datos etiquetados", "Solo datos sin etiquetar", "Pocos datos etiquetados y muchos sin etiquetar", "Recompensas y castigos"], correct: 2, exp: "Es su definición: una mezcla de ambos tipos, aprovechando lo poco etiquetado que hay disponible." },
      { q: "¿Qué es una pseudo-etiqueta?", options: ["Una etiqueta puesta por un humano experto", "Una etiqueta que el propio modelo genera para datos sin etiquetar", "Un error del modelo", "Una recompensa en aprendizaje por refuerzo"], correct: 1, exp: "El modelo usa lo que ya aprendió para estimar etiquetas de los datos restantes y seguir entrenando con ellas." },
      { q: "¿Cuándo conviene más este enfoque?", options: ["Cuando etiquetar es barato y rápido", "Cuando etiquetar es caro o requiere expertos, pero hay muchos datos sin etiquetar", "Cuando no hay ningún dato etiquetado", "Cuando el problema es un juego con recompensas"], correct: 1, exp: "Su valor está en aprovechar datos sin etiquetar cuando conseguir etiquetas resulta costoso." },
      { q: "¿Cuál es el riesgo principal del autoentrenamiento?", options: ["Que consuma demasiada memoria", "Que una pseudo-etiqueta equivocada se refuerce en cada iteración", "Que no se pueda usar con imágenes", "Que necesite obligatoriamente una GPU"], correct: 1, exp: "El modelo aprende de sus propias predicciones: si se equivoca con confianza, consolida el error en lugar de corregirlo." },
    ],
  },

  /* ---------------------------------------------------- 4 */
  {
    id: "autosupervisado", num: 4,
    title: "Aprendizaje autosupervisado",
    tag: "El propio dato genera su etiqueta, sin intervención humana",
    nivel: "Intermedio", minutos: 9,
    intro: `Es el motor silencioso detrás de los grandes modelos de lenguaje actuales. Resuelve el cuello de botella del etiquetado de forma elegante: si el dato ya contiene la respuesta, no hace falta que nadie la escriba.`,
    definicion: `El modelo genera <b>sus propias etiquetas</b> a partir de la estructura interna de los datos, sin que ningún humano etiquete nada.`,
    enUnaFrase: `Se inventa sus propios ejercicios: tapa una parte del dato e intenta adivinarla con el resto.`,
    objetivo: `Aprender representaciones ricas y transferibles a partir de datos crudos, para después resolver tareas concretas con poco esfuerzo adicional.`,
    explicacion: [
      `Se diseña una <strong>tarea pretexto</strong>: se oculta una parte del dato y se le pide al modelo que la prediga usando el resto. Como el dato original ya contiene la respuesta correcta —la parte que se ocultó—, la etiqueta se crea sola.`,
      `Esa tarea pretexto no es el objetivo final: es un pretexto, literalmente, para forzar al modelo a construir representaciones ricas del dominio. Sobre esas representaciones se resuelve después la tarea que sí interesa, normalmente mediante transfer learning.`,
      `Conviene no confundirlo con el aprendizaje supervisado. Ambos usan pares entrada-salida, pero en el supervisado la salida la escribe una persona, mientras que en el autosupervisado se extrae automáticamente del propio dato. La diferencia no es técnica sino de origen de la etiqueta, y es lo que permite entrenar con volúmenes imposibles de anotar a mano.`,
    ],
    pasos: [
      { t: "Tomar un dato completo", d: "Una frase, una imagen o un fragmento de audio, sin ninguna anotación." },
      { t: "Ocultar una parte", d: "Se enmascara una palabra, un parche de la imagen o un tramo de sonido." },
      { t: "Predecir lo oculto", d: "El modelo intenta reconstruir la parte que falta usando el contexto disponible." },
      { t: "Comparar con el original", d: "La parte ocultada actúa como etiqueta. El error se calcula y los parámetros se ajustan." },
    ],
    ejemploCotidiano: {
      t: "Completar la frase por contexto",
      d: `Si lees "después de la lluvia salió el ___", tu mente completa "sol" sin esfuerzo. Nadie te dio la respuesta: la dedujiste del contexto. Y al hacerlo, demuestras que entiendes el idioma. Eso es exactamente lo que se le pide al modelo.`,
    },
    ejemploIA: {
      t: "Preentrenamiento de un modelo de lenguaje",
      d: `Un modelo como GPT se entrena prediciendo la siguiente palabra sobre enormes cantidades de texto. Para acertar consistentemente necesita capturar gramática, hechos del mundo y relaciones entre conceptos. Esa comprensión emerge de una tarea aparentemente trivial.`,
    },
    diagram: SVG_AUTOSUPERVISADO,
    diagramCaption: "Se oculta una parte del dato y el modelo la predice: el dato original hace de etiqueta.",
    examples: [
      { tag: "Texto", text: `<b>BERT y GPT</b> se preentrenan prediciendo palabras enmascaradas o la siguiente palabra sobre texto que nadie etiquetó.` },
      { tag: "Visión", text: `Modelos como <b>MAE o SimCLR</b> ocultan parches de una imagen y aprenden a reconstruirlos, o a reconocer que dos recortes vienen de la misma foto.` },
    ],
    aplicaciones: [
      "Preentrenamiento de modelos de lenguaje",
      "Modelos de visión por computador",
      "Modelos de audio y reconocimiento de voz",
      "Generación de embeddings para búsqueda semántica",
    ],
    ventajas: [
      "No necesita ninguna anotación humana.",
      "Puede aprovechar volúmenes de datos imposibles de etiquetar a mano.",
      "Produce representaciones muy generales y transferibles a otras tareas.",
    ],
    limitaciones: [
      "El preentrenamiento exige una cantidad enorme de cómputo.",
      "Diseñar una buena tarea pretexto no es trivial y condiciona todo el resultado.",
      "Hereda los sesgos y errores presentes en los datos crudos.",
    ],
    conceptosClave: [
      { t: "Tarea pretexto", d: "Tarea auxiliar cuya respuesta se extrae del propio dato, diseñada para forzar el aprendizaje de representaciones." },
      { t: "Enmascaramiento", d: "Ocultar deliberadamente parte de la entrada para que el modelo la reconstruya." },
      { t: "Representación", d: "Codificación interna que el modelo construye de los datos y que resulta útil para muchas tareas." },
      { t: "Preentrenamiento", d: "Primera fase de entrenamiento sobre datos generales, previa a cualquier especialización." },
    ],
    quiz: [
      { q: "¿De dónde salen las etiquetas en el aprendizaje autosupervisado?", options: ["Las pone un anotador humano", "Las genera el propio dato al ocultar una parte de sí mismo", "Vienen de una recompensa del entorno", "No existe ninguna señal de entrenamiento"], correct: 1, exp: "La etiqueta es la parte oculta del dato original: no requiere anotación humana." },
      { q: "¿Qué es una tarea pretexto?", options: ["La tarea final que le interesa al usuario", "Una tarea auxiliar que fuerza al modelo a aprender representaciones útiles", "Un tipo de recompensa", "Un conjunto de datos etiquetado por expertos"], correct: 1, exp: "Predecir la parte oculta no es el objetivo final, pero obliga al modelo a aprender patrones que después sirven." },
      { q: "¿Con qué paradigma se preentrenan hoy la mayoría de los grandes modelos de lenguaje?", options: ["Aprendizaje por refuerzo puro", "Supervisado, con miles de humanos etiquetando cada palabra", "Autosupervisado sobre texto masivo", "Semisupervisado"], correct: 2, exp: "Predecir la siguiente palabra sobre grandes corpus es autosupervisado: el propio texto aporta la señal." },
      { q: "¿Cuál es la diferencia clave entre supervisado y autosupervisado?", options: ["Uno usa redes neuronales y el otro no", "En el supervisado la etiqueta la escribe una persona; en el autosupervisado se extrae del propio dato", "El autosupervisado no usa función de pérdida", "El supervisado solo funciona con imágenes"], correct: 1, exp: "Técnicamente ambos aprenden de pares entrada-salida. Lo que cambia es el origen de la etiqueta, y eso es lo que permite escalar a datos masivos." },
    ],
  },

  /* ---------------------------------------------------- 5 */
  {
    id: "transfer-learning", num: 5,
    sim: "transferpipeline",
    title: "Transfer Learning y Fine-tuning",
    tag: "Reutilizar conocimiento ya aprendido en lugar de empezar de cero",
    nivel: "Intermedio", minutos: 12,
    destacado: true,
    intro: `Entrenar un modelo grande desde cero cuesta millones y exige datos que casi nadie tiene. Este paradigma resuelve el problema de la forma más sensata posible: aprovechar lo que otro modelo ya aprendió.`,
    definicion: `<b>Transfer learning</b> es reutilizar el conocimiento de un modelo ya entrenado para resolver una tarea distinta pero relacionada. El <b>fine-tuning</b> es la técnica más común para lograrlo: continuar entrenando ese modelo con datos de la nueva tarea.`,
    enUnaFrase: `En vez de aprender desde cero, parte de un modelo que ya sabe mucho y solo lo especializa en lo que te interesa.`,
    objetivo: `Obtener un modelo competente en una tarea específica con una fracción de los datos y del cómputo que exigiría entrenarlo desde cero.`,
    explicacion: [
      `El proceso tiene dos etapas muy asimétricas. Primero, un <strong>preentrenamiento</strong> sobre datos masivos y generales —casi siempre autosupervisado— produce un <strong>modelo base</strong> con representaciones amplias del dominio. Después, el <strong>fine-tuning</strong> continúa ese entrenamiento con un conjunto mucho más pequeño y específico, con una tasa de aprendizaje baja para no destruir lo ya aprendido.`,
      `Funciona porque las capas iniciales de una red aprenden lo general —bordes y texturas en visión, sintaxis en lenguaje— y solo las finales aprenden lo específico de la tarea original. Un borde sigue siendo un borde en una radiografía: eso es exactamente lo que se transfiere.`,
      `Conviene separar bien los dos términos: <strong>transfer learning es la estrategia</strong> y <strong>fine-tuning es una técnica concreta</strong> dentro de ella. Usar el modelo preentrenado como simple extractor de características, sin modificar ni uno de sus pesos, también es transfer learning y no es fine-tuning. Todo fine-tuning es transferencia; no toda transferencia es fine-tuning.`,
      `El fine-tuning completo actualiza todos los parámetros, lo que en modelos de miles de millones resulta carísimo. Por eso se usa <strong>PEFT</strong> (<em>Parameter-Efficient Fine-Tuning</em>) y en particular <strong>LoRA</strong> (Hu et al., 2021): se congelan los pesos originales y se entrenan solo matrices pequeñas añadidas. El artículo original reporta <strong>10.000 veces menos parámetros entrenables</strong> y <strong>3 veces menos memoria</strong> que el ajuste completo de GPT-3, con calidad igual o mejor.`,
    ],
    pasos: [
      { t: "Preentrenamiento masivo", d: "Un modelo se entrena sobre datos generales y abundantes. Esta etapa es la cara y la hacen pocas organizaciones." },
      { t: "Se obtiene el modelo base", d: "Un sistema con representaciones generales del dominio, listo para especializarse." },
      { t: "Fine-tuning específico", d: "Se continúa el entrenamiento con datos de la tarea deseada, con tasa de aprendizaje baja para no borrar lo aprendido." },
      { t: "Modelo especializado", d: "El resultado resuelve la tarea concreta conservando el conocimiento general de base." },
    ],
    ejemploCotidiano: {
      t: "El médico que se especializa",
      d: `Un médico general que quiere ser cardiólogo no vuelve a estudiar biología celular desde cero. Aprovecha toda su formación previa —anatomía, fisiología, farmacología— y sobre ella construye lo específico. Le toma años, no décadas.`,
    },
    ejemploIA: {
      t: "De ImageNet a las radiografías",
      d: `Se parte de una red entrenada sobre ImageNet, con 1,28 millones de imágenes generales, y se ajusta con unos pocos miles de radiografías etiquetadas. El modelo no tiene que aprender qué es un borde o una textura: ya lo sabe. Solo aprende qué configuraciones corresponden a un hallazgo clínico.`,
    },
    diagram: SVG_TRANSFER_PIPELINE,
    diagramCaption: "Preentrenamiento general, modelo base, fine-tuning específico y modelo especializado.",
    diagram2: SVG_LORA,
    diagram2Caption: "LoRA: los pesos originales quedan congelados y solo se entrenan matrices pequeñas de bajo rango.",
    examples: [
      { tag: "Visión", text: `Partir de un modelo preentrenado en <b>ImageNet</b> y ajustarlo con unos pocos miles de radiografías para detectar una patología.` },
      { tag: "Modelos de lenguaje", text: `Aplicar <b>LoRA</b> sobre un modelo abierto usando las conversaciones de soporte de una empresa, para crear un asistente especializado.` },
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
    aplicaciones: [
      "Visión artificial médica con pocos datos",
      "Asistentes de lenguaje especializados por empresa",
      "Adaptación a idiomas y jergas técnicas",
      "Clasificación de imágenes en dominios muy específicos",
    ],
    ventajas: [
      "Reduce drásticamente los datos y el cómputo necesarios.",
      "Pone al alcance de equipos pequeños modelos de calidad alta.",
      "Con LoRA, los adaptadores son archivos pequeños e intercambiables sobre un mismo modelo base.",
    ],
    limitaciones: [
      "Riesgo de olvido catastrófico si el ajuste es demasiado agresivo.",
      "Exige que la tarea nueva esté razonablemente relacionada con la original.",
      "Hereda los sesgos, errores y limitaciones del modelo base.",
    ],
    conceptosClave: [
      { t: "Modelo base", d: "Modelo preentrenado sobre datos generales que sirve como punto de partida." },
      { t: "Fine-tuning", d: "Continuar el entrenamiento de un modelo preentrenado con datos de una tarea específica." },
      { t: "Congelar capas", d: "Marcar pesos como no entrenables para conservar el conocimiento general." },
      { t: "LoRA / PEFT", d: "Técnicas que ajustan un número mínimo de parámetros nuevos dejando intacto el modelo base." },
      { t: "Olvido catastrófico", d: "Pérdida abrupta del conocimiento previo al entrenar con datos nuevos." },
    ],
    quiz: [
      { q: "¿Cuál es la diferencia entre transfer learning y fine-tuning?", options: ["Son sinónimos exactos", "Transfer learning es la estrategia general de reutilizar conocimiento; fine-tuning es la técnica concreta de seguir entrenando el modelo", "Transfer learning solo aplica a imágenes y fine-tuning solo a texto", "El fine-tuning nunca parte de un modelo preentrenado"], correct: 1, exp: "Todo fine-tuning es transfer learning, pero no al revés: usar el modelo como extractor de características también es transferencia y no toca sus pesos." },
      { q: "¿Qué hace LoRA distinto del fine-tuning completo?", options: ["Entrena absolutamente todos los parámetros", "Congela los pesos originales y entrena solo matrices pequeñas añadidas", "Elimina la necesidad de datos de entrenamiento", "Solo funciona con aprendizaje por refuerzo"], correct: 1, exp: "LoRA deja intactos los pesos preentrenados e inyecta matrices de bajo rango que sí se ajustan, reduciendo drásticamente el costo." },
      { q: "¿Por qué se usa una tasa de aprendizaje baja en el fine-tuning?", options: ["Para que tarde más a propósito", "Para evitar el olvido catastrófico del conocimiento general", "Porque los datos de ajuste son de mala calidad", "Es un requisito técnico sin relación con el conocimiento previo"], correct: 1, exp: "Cambios bruscos en los pesos pueden destruir el conocimiento general que trae el modelo base." },
      { q: "¿En qué caso PEFT/LoRA aporta más valor?", options: ["Cuando hay recursos de cómputo ilimitados", "Cuando se quiere adaptar un modelo grande con recursos limitados", "Solo en aprendizaje no supervisado", "Cuando no existe ningún modelo preentrenado"], correct: 1, exp: "PEFT nació para hacer viable especializar modelos enormes sin la infraestructura de un reentrenamiento completo." },
      { q: "Usar un modelo preentrenado solo como extractor de características, sin modificar sus pesos, es…", options: ["Fine-tuning", "Transfer learning, pero no fine-tuning", "Aprendizaje por refuerzo", "Aprendizaje no supervisado"], correct: 1, exp: "Es transferencia de conocimiento sin ajuste: el modelo grande queda intacto y solo se entrena un clasificador pequeño encima." },
    ],
  },

  /* ---------------------------------------------------- 6 */
  {
    id: "refuerzo", num: 6,
    sim: "gridworld",
    title: "Aprendizaje por refuerzo",
    tag: "Aprender por prueba, error y recompensa",
    nivel: "Intermedio", minutos: 9,
    intro: `Aquí no hay un conjunto de datos preparado. Hay un agente, un entorno y una señal de recompensa. El modelo aprende actuando y viendo qué consecuencias tienen sus decisiones, igual que se aprende a montar en bicicleta.`,
    definicion: `Un <b>agente</b> aprende a tomar decisiones interactuando con un <b>entorno</b>, recibiendo <b>recompensas o castigos</b> según sus acciones, con el objetivo de maximizar la recompensa acumulada a largo plazo.`,
    enUnaFrase: `Aprende probando: hace algo, observa si le fue bien o mal, y ajusta su estrategia para la próxima vez.`,
    objetivo: `Descubrir una política de decisión que maximice la recompensa total a lo largo del tiempo, no solo la inmediata.`,
    explicacion: [
      `El ciclo es siempre el mismo: el agente observa un <strong>estado</strong>, elige una <strong>acción</strong> según su <strong>política</strong> —su estrategia actual—, el entorno responde con un nuevo estado y una <strong>recompensa</strong> numérica, y el agente usa esa señal para mejorar la política.`,
      `A diferencia del supervisado, no existe una respuesta correcta para cada acción: solo una recompensa que puede llegar mucho después de la decisión que la causó. Ese desfase se conoce como el problema del <strong>crédito diferido</strong> y es lo que hace difícil este paradigma.`,
      `Aparece además una tensión permanente entre <strong>explorar</strong> —probar acciones nuevas que podrían ser mejores— y <strong>explotar</strong> —repetir lo que ya se sabe que funciona—. Un agente que solo explota se queda en soluciones mediocres; uno que solo explora nunca aprovecha lo aprendido.`,
    ],
    pasos: [
      { t: "Observar el estado", d: "El agente percibe la situación actual del entorno." },
      { t: "Elegir una acción", d: "Según su política, decide qué hacer, equilibrando exploración y explotación." },
      { t: "Recibir recompensa y nuevo estado", d: "El entorno responde con una señal numérica y una nueva situación." },
      { t: "Actualizar la política", d: "El agente ajusta su estrategia para que las acciones que dan más recompensa sean más probables." },
    ],
    ejemploCotidiano: {
      t: "Aprender a montar en bicicleta",
      d: `Nadie te da la lista de ángulos e inclinaciones correctas. Te subes, te tambaleas, te caes, corriges. La caída es la recompensa negativa; avanzar sin caerte, la positiva. Después de suficientes intentos, la política queda aprendida sin que nadie la escriba.`,
    },
    ejemploIA: {
      t: "AlphaZero aprendiendo a jugar",
      d: `El sistema empieza sin conocer estrategia alguna y juega millones de partidas contra sí mismo. La única señal es ganar o perder al final. A partir de esa información escasísima, desarrolla estrategias que sorprendieron a los mejores jugadores humanos.`,
    },
    diagram: SVG_REFUERZO,
    diagramCaption: "El agente actúa sobre el entorno y el entorno responde con un nuevo estado y una recompensa.",
    examples: [
      { tag: "Juegos", text: `<b>AlphaGo y AlphaZero</b> aprendieron jugando millones de partidas contra sí mismos, mejorando su política con cada resultado.` },
      { tag: "Robótica", text: `Un <b>robot que aprende a caminar</b> en simulación, con recompensa por avanzar sin caerse y penalización por desestabilizarse.` },
    ],
    aplicaciones: [
      "Robótica y control de movimiento",
      "Juegos y simulaciones estratégicas",
      "Optimización de logística y recursos",
      "Control industrial y gestión energética",
    ],
    ventajas: [
      "No necesita datos etiquetados: aprende de su propia experiencia.",
      "Puede descubrir estrategias que superan el desempeño humano.",
      "Optimiza objetivos a largo plazo, no solo resultados inmediatos.",
    ],
    limitaciones: [
      "Requiere una cantidad enorme de interacciones para aprender.",
      "Diseñar bien la función de recompensa es difícil: una mal planteada produce comportamientos absurdos.",
      "Entrenar directamente en el mundo real puede ser lento, caro o peligroso.",
    ],
    conceptosClave: [
      { t: "Agente", d: "El sistema que toma decisiones y aprende de sus consecuencias." },
      { t: "Entorno", d: "El mundo con el que interactúa el agente y que responde a sus acciones." },
      { t: "Política", d: "Estrategia que asigna una acción a cada estado posible." },
      { t: "Recompensa", d: "Señal numérica que indica qué tan buena fue una acción." },
      { t: "Exploración y explotación", d: "Tensión entre probar cosas nuevas y aprovechar lo que ya funciona." },
    ],
    quiz: [
      { q: "¿Qué maximiza el agente en aprendizaje por refuerzo?", options: ["El número de datos etiquetados", "La recompensa acumulada a largo plazo", "La similitud entre los datos", "El número de parámetros del modelo"], correct: 1, exp: "El objetivo es una política que maximice la recompensa total esperada, no solo la inmediata." },
      { q: "¿Qué es la política de un agente?", options: ["Un conjunto de datos etiquetados", "La estrategia que usa para decidir qué acción tomar en cada estado", "El nombre del algoritmo de clustering", "La arquitectura de la red neuronal"], correct: 1, exp: "La política asigna acciones (o probabilidades de acción) a cada estado; es lo que el agente va mejorando." },
      { q: "¿Qué significa el problema del crédito diferido?", options: ["Que los datos vienen etiquetados de antemano", "Que la recompensa de una acción puede llegar mucho después de tomarla", "Que no existen entornos en este paradigma", "Que el modelo nunca actualiza sus parámetros"], correct: 1, exp: "Una decisión buena o mala puede no reflejarse en la recompensa hasta varios pasos después, y cuesta saber qué acción fue la responsable." },
      { q: "Un agente que siempre repite la acción que ya conoce, sin probar alternativas, está…", options: ["Explorando demasiado", "Explotando sin explorar", "Sobreajustando las etiquetas", "Aplicando transfer learning"], correct: 1, exp: "Sin exploración el agente nunca descubre estrategias mejores y se estanca en una solución subóptima." },
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
    enUnaFrase: `Se le enseña qué tipo de respuesta se prefiere comparando alternativas, hasta que responde como se espera.`,
    objetivo: `Alinear el comportamiento del modelo con preferencias y valores que son difíciles de expresar como reglas explícitas.`,
    explicacion: [
      `En <strong>RLHF</strong> (<em>Reinforcement Learning from Human Feedback</em>), personas comparan varias respuestas del modelo ante un mismo prompt y eligen la que prefieren. Con esas comparaciones se entrena un <strong>modelo de recompensa</strong> que aprende a predecir la preferencia humana. Después, un algoritmo de refuerzo —habitualmente PPO— ajusta el modelo original para maximizar esa recompensa.`,
      `<strong>RLAIF</strong> (<em>Reinforcement Learning from AI Feedback</em>) mantiene el mismo esquema pero sustituye al evaluador humano por otro modelo de IA que juzga siguiendo un conjunto explícito de principios llamado <strong>"constitución"</strong> —de ahí el nombre <em>Constitutional AI</em>—.`,
      `La diferencia importa y no deben presentarse como equivalentes. RLAIF es mucho más rápido y escalable que pagar miles de horas de evaluación humana, pero traslada la responsabilidad a la calidad de esa constitución y a la fiabilidad del modelo evaluador. RLHF captura matices humanos que ninguna regla escrita recoge del todo, a cambio de un costo mucho mayor y de la inconsistencia propia de evaluadores distintos.`,
    ],
    pasos: [
      { t: "El modelo genera varias respuestas", d: "Ante un mismo prompt se producen alternativas distintas." },
      { t: "Un evaluador las compara", d: "Una persona (RLHF) o un modelo guiado por principios (RLAIF) indica cuál es preferible." },
      { t: "Se entrena el modelo de recompensa", d: "Aprende a predecir qué respuesta sería preferida, convirtiendo el juicio en una señal numérica." },
      { t: "Refuerzo ajusta el modelo", d: "Un algoritmo como PPO modifica el modelo para que genere respuestas con mayor recompensa." },
    ],
    ejemploCotidiano: {
      t: "El aprendiz de cocina",
      d: `El chef no le entrega una receta con gramos exactos. Prueba dos versiones de un plato y le dice cuál está mejor. Tras muchas comparaciones, el aprendiz interioriza un criterio de sabor que nadie escribió nunca en un papel.`,
    },
    ejemploIA: {
      t: "De modelo base a asistente conversacional",
      d: `Un modelo preentrenado solo continúa texto: ante una pregunta podría responder con más preguntas. Tras rondas de RLHF aprende a seguir instrucciones, admitir cuando no sabe algo y rechazar peticiones dañinas. Es la diferencia entre un motor de texto y un asistente.`,
    },
    diagram: SVG_ALINEACION,
    diagramCaption: "Comparaciones de preferencia, modelo de recompensa, ajuste por refuerzo y modelo alineado.",
    examples: [
      { tag: "RLHF", text: `Un modelo base que solo completa texto se convierte en un <b>asistente que sigue instrucciones</b> gracias a rondas de RLHF.` },
      { tag: "RLAIF", text: `Anthropic usa <b>Constitutional AI</b> para que el modelo evalúe y corrija sus propias respuestas según principios escritos.` },
    ],
    aplicaciones: [
      "Asistentes conversacionales de propósito general",
      "Moderación y seguridad de contenido",
      "Ajuste de tono y estilo corporativo",
      "Reducción de respuestas dañinas o engañosas",
    ],
    ventajas: [
      "Alinea el modelo con preferencias que serían imposibles de codificar como reglas.",
      "Mejora de forma medible la utilidad y la seguridad de las respuestas.",
      "RLAIF escala a un costo muy inferior al de la evaluación humana masiva.",
    ],
    limitaciones: [
      "Las preferencias humanas son subjetivas y varían entre evaluadores.",
      "El modelo puede sobreoptimizar la recompensa y degradar su calidad real.",
      "En RLAIF, todo depende de qué tan buena sea la constitución y el modelo que evalúa.",
    ],
    conceptosClave: [
      { t: "Alineación", d: "Ajustar el comportamiento de un modelo a valores o preferencias deseadas." },
      { t: "Modelo de recompensa", d: "Modelo auxiliar que predice qué respuesta sería preferida." },
      { t: "PPO", d: "Algoritmo de aprendizaje por refuerzo usado habitualmente en esta fase de ajuste." },
      { t: "Constitución", d: "Conjunto de principios explícitos que guían al evaluador en RLAIF." },
    ],
    quiz: [
      { q: "¿Cuál es la diferencia principal entre RLHF y RLAIF?", options: ["RLHF no usa aprendizaje por refuerzo y RLAIF sí", "En RLHF el evaluador es humano; en RLAIF es otro modelo de IA guiado por principios explícitos", "RLAIF solo se usa en robótica", "No hay ninguna diferencia real"], correct: 1, exp: "El esquema es idéntico —comparar respuestas, entrenar un modelo de recompensa, ajustar con RL—; lo que cambia es quién evalúa." },
      { q: "¿Qué es la constitución en Constitutional AI / RLAIF?", options: ["Un conjunto de datos de imágenes", "Un conjunto de principios explícitos que guían al modelo evaluador", "El nombre del algoritmo de gradiente", "Una ley sobre datos personales"], correct: 1, exp: "Son reglas escritas que la IA evaluadora usa como criterio para preferir una respuesta sobre otra." },
      { q: "¿Para qué sirve el modelo de recompensa?", options: ["Para generar imágenes", "Para predecir qué respuesta sería preferida y guiar el ajuste por refuerzo", "Para etiquetar datos sin ningún criterio", "Para reemplazar al modelo original"], correct: 1, exp: "Traduce las preferencias —humanas o de IA— en una señal numérica que el algoritmo de refuerzo puede optimizar." },
      { q: "¿Cuál es una limitación propia de RLAIF frente a RLHF?", options: ["Es mucho más lento y costoso", "La calidad queda condicionada a lo buena que sea la constitución y el modelo evaluador", "No puede usarse con modelos de lenguaje", "No permite ajustar el comportamiento"], correct: 1, exp: "RLAIF gana en escala y costo, pero delega el criterio en reglas escritas y en un evaluador automático que también puede equivocarse." },
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
    enUnaFrase: `Le muestras unos ejemplos dentro del mensaje y resuelve la tarea al instante, sin entrenarse.`,
    objetivo: `Adaptar el comportamiento del modelo a una tarea concreta en tiempo de inferencia, sin ningún proceso de entrenamiento.`,
    explicacion: [
      `Gracias al mecanismo de <strong>autoatención</strong> del Transformer, el modelo usa los ejemplos presentes en el contexto como referencia para inferir el patrón de la tarea en el momento de generar la respuesta —en inferencia, no en entrenamiento—. Lo determinante no es solo cuántos ejemplos hay, sino qué tan pertinentes son.`,
      `Se distingue el caso <strong>zero-shot</strong> —solo una instrucción, sin ejemplos— del <strong>few-shot</strong>, con varios ejemplos en el mismo prompt.`,
      `La diferencia crucial con el fine-tuning es que aquí el aprendizaje es <strong>temporal</strong>: existe solo durante esa conversación y desaparece al terminarla. El fine-tuning, en cambio, modifica el modelo de forma permanente. Esta capacidad es además <strong>emergente</strong>: aparece de forma notable solo en modelos suficientemente grandes, y es una propiedad de los llamados modelos fundacionales.`,
    ],
    pasos: [
      { t: "Escribir instrucción y ejemplos", d: "Se redacta el prompt incluyendo qué se quiere y, opcionalmente, varios ejemplos resueltos." },
      { t: "El modelo atiende al contexto", d: "El mecanismo de autoatención relaciona la consulta nueva con los ejemplos presentes en el prompt." },
      { t: "Infiere el patrón", d: "Deduce la regla implícita que conecta las entradas con las salidas mostradas." },
      { t: "Responde sin cambiar", d: "Genera la respuesta siguiendo ese patrón. Sus pesos quedan exactamente igual que antes." },
    ],
    ejemploCotidiano: {
      t: "Enseñar a llenar un formulario",
      d: `Le muestras a alguien tres formularios ya diligenciados como ejemplo y le pides que llene el cuarto. No hizo un curso ni estudió un manual: dedujo el patrón de los ejemplos que tenía delante.`,
    },
    ejemploIA: {
      t: "Traducción few-shot",
      d: `Se le dan a un modelo tres pares de frases inglés-francés dentro del prompt y se le pide traducir una cuarta. El modelo nunca fue entrenado específicamente para traducir ese estilo, pero infiere la tarea de los ejemplos y la resuelve.`,
    },
    diagram: SVG_EN_CONTEXTO,
    diagramCaption: "El modelo usa los ejemplos del propio prompt para inferir el patrón, sin modificar sus pesos.",
    examples: [
      { tag: "Few-shot", text: `Dar tres pares de traducción <b>inglés-francés</b> en el prompt y pedir la traducción de una cuarta frase.` },
      { tag: "Formato", text: `Mostrar el formato exacto de una <b>tabla</b> en el prompt para que el modelo continúe generando filas con esa estructura.` },
    ],
    aplicaciones: [
      "Prototipado rápido de tareas sin entrenar nada",
      "Extracción estructurada de datos de textos",
      "Traducción, resumen y reformateo",
      "Clasificación de textos sin conjunto de entrenamiento",
    ],
    ventajas: [
      "Inmediato: no hay entrenamiento, ni datos, ni GPU.",
      "Se cambia el comportamiento con solo editar el prompt.",
      "Ideal para explorar si una tarea es viable antes de invertir en fine-tuning.",
    ],
    limitaciones: [
      "Está limitado por el tamaño de la ventana de contexto.",
      "Menos consistente y fiable que un modelo ajustado para la tarea.",
      "El costo por consulta crece con la longitud del prompt.",
    ],
    conceptosClave: [
      { t: "Prompt", d: "El mensaje completo que recibe el modelo, incluyendo instrucciones y ejemplos." },
      { t: "Zero-shot", d: "Resolver la tarea solo con una instrucción, sin ejemplos." },
      { t: "Few-shot", d: "Resolver la tarea con unos pocos ejemplos incluidos en el prompt." },
      { t: "Ventana de contexto", d: "Cantidad máxima de texto que el modelo puede considerar a la vez." },
      { t: "Autoatención", d: "Mecanismo del Transformer que relaciona cada parte del texto con las demás." },
    ],
    quiz: [
      { q: "¿Qué NO ocurre durante el aprendizaje en contexto?", options: ["El modelo lee ejemplos del prompt", "Se actualizan los pesos del modelo", "El modelo genera una respuesta", "El modelo usa autoatención"], correct: 1, exp: "Es justamente lo que lo distingue del fine-tuning: los pesos quedan idénticos antes y después." },
      { q: "¿Cuál es la diferencia entre zero-shot y few-shot?", options: ["Zero-shot usa muchos ejemplos y few-shot ninguno", "Zero-shot no incluye ejemplos en el prompt, solo instrucción; few-shot incluye varios", "Son lo mismo", "Few-shot exige reentrenar el modelo"], correct: 1, exp: "La diferencia está en cuántos ejemplos de la tarea se incluyen dentro del prompt." },
      { q: "El aprendizaje logrado en contexto…", options: ["Es permanente, como el fine-tuning", "Es temporal: dura solo esa conversación", "Modifica el preentrenamiento", "Obliga a reiniciar el modelo"], correct: 1, exp: "Al no tocar los pesos, ese conocimiento desaparece cuando termina la conversación." },
      { q: "¿Cuál es una limitación propia de este enfoque?", options: ["Necesita miles de GPU", "Está limitado por el tamaño de la ventana de contexto", "Requiere etiquetar datos manualmente", "Solo funciona con imágenes"], correct: 1, exp: "Todo lo que el modelo puede usar debe caber en el prompt, y esa ventana tiene un límite." },
    ],
  },

  /* ---------------------------------------------------- 9 */
  {
    id: "world-models", num: 9,
    title: "Modelos del mundo (World Models)",
    tag: "Aprender cómo funciona un entorno para predecir y planificar",
    nivel: "Avanzado", minutos: 10,
    intro: `La frontera actual. En lugar de limitarse a reaccionar, el sistema construye un modelo interno de cómo funciona el mundo y lo usa para imaginar qué pasaría antes de actuar.`,
    definicion: `Sistemas que aprenden una <b>representación interna de la dinámica de un entorno</b> —sus reglas, su física, su causalidad— y la usan para <b>predecir o simular</b> cómo evolucionará ante distintas acciones.`,
    enUnaFrase: `Construye un simulador mental del entorno y lo usa para imaginar consecuencias antes de actuar de verdad.`,
    objetivo: `Poder anticipar y planificar dentro de una simulación aprendida, en lugar de tener que probar todo en el mundo real.`,
    explicacion: [
      `En vez de reaccionar únicamente a lo que percibe, el sistema construye una especie de <strong>simulador interno</strong> que le permite anticipar las consecuencias de sus acciones y planificar antes de ejecutarlas. También puede generar entornos nuevos y coherentes a partir de una imagen o una descripción.`,
      `La ventaja práctica es grande: equivocarse dentro de una simulación no cuesta nada, mientras que equivocarse con un brazo robótico real cuesta piezas rotas. Por eso es un área central en robótica y en agentes autónomos, y por eso mejora mucho la eficiencia en datos del aprendizaje por refuerzo.`,
      `Es un campo muy activo. <strong>Genie</strong>, de Google DeepMind, evolucionó desde generar mundos 2D no jugables en 2024 hasta <strong>Genie 3</strong> en agosto de 2025, capaz de generar mundos explorables en tiempo real a 720p y 24 fps con memoria de aproximadamente un minuto de interacción.`,
    ],
    pasos: [
      { t: "Observar transiciones", d: "El sistema registra cómo el entorno pasa de un estado a otro cuando ocurren acciones." },
      { t: "Aprender la dinámica", d: "Construye una representación interna de las reglas que gobiernan esos cambios." },
      { t: "Simular futuros posibles", d: "Ante una acción candidata, predice el estado que resultaría sin ejecutarla realmente." },
      { t: "Planificar y decidir", d: "Compara las consecuencias imaginadas de varias acciones y elige la mejor." },
    ],
    ejemploCotidiano: {
      t: "Antes de adelantar en carretera",
      d: `Ves un camión delante y un carro que viene de frente. Antes de mover el volante, imaginas la maniobra completa: si alcanzas o no. Esa simulación mental —hecha en un segundo y sin riesgo— es exactamente lo que hace un world model.`,
    },
    ejemploIA: {
      t: "Un robot que ensaya en su cabeza",
      d: `Un brazo robótico que debe manipular una pieza frágil puede simular internamente varios agarres y descartar los que harían caer el objeto, antes de mover un solo motor. Aprende de errores que nunca llegó a cometer físicamente.`,
    },
    diagram: SVG_WORLD_MODELS,
    diagramCaption: "El world model simula el siguiente estado del entorno antes de que el agente actúe realmente.",
    examples: [
      { tag: "Mundos generativos", text: `<b>Genie 3</b> genera mundos virtuales explorables en tiempo real a partir de una imagen o un texto, manteniendo coherencia mientras el usuario se mueve.` },
      { tag: "Video y física", text: `<b>Sora</b>, al generar video, aprende implícitamente propiedades del mundo físico —permanencia de objetos, sombras consistentes—.` },
    ],
    aplicaciones: [
      "Robótica y planificación de movimientos",
      "Conducción autónoma",
      "Generación de entornos virtuales interactivos",
      "Agentes que deben planificar varios pasos por adelantado",
    ],
    ventajas: [
      "Permite planificar sin pagar el costo de un error real.",
      "Mucho más eficiente en datos que el aprendizaje por refuerzo puro.",
      "Habilita generación y simulación de entornos completos.",
    ],
    limitaciones: [
      "Si el modelo del entorno es impreciso, las decisiones basadas en él fallan.",
      "Entrenarlo es costoso en datos y cómputo.",
      "Capturar toda la complejidad del mundo real sigue siendo un problema abierto.",
    ],
    conceptosClave: [
      { t: "Dinámica del entorno", d: "Reglas que determinan cómo cambia el entorno ante cada acción." },
      { t: "Simulación interna", d: "Predecir estados futuros sin ejecutar la acción en el mundo real." },
      { t: "Planificación", d: "Elegir una secuencia de acciones evaluando sus consecuencias imaginadas." },
      { t: "Modelo latente", d: "Representación comprimida del estado del entorno sobre la que el sistema razona." },
    ],
    quiz: [
      { q: "¿Qué aprende principalmente un world model?", options: ["Solo a clasificar imágenes en categorías fijas", "Una representación interna de la dinámica del entorno, para predecir su evolución", "A traducir entre idiomas", "A comparar preferencias humanas"], correct: 1, exp: "Su valor está en poder simular o anticipar el entorno, no solo en reaccionar ante él." },
      { q: "¿Qué ventaja da simular antes de actuar?", options: ["Ninguna, siempre hay que actuar directamente", "Permite anticipar el resultado y planificar sin pagar el costo de un error real", "Elimina la necesidad de entrenamiento", "Solo sirve para generar texto"], correct: 1, exp: "Equivocarse dentro del simulador es gratis; equivocarse con un robot real, no." },
      { q: "¿Por qué Genie 3 se considera un world model?", options: ["Porque solo genera texto", "Porque genera mundos explorables que responden de forma coherente a las acciones del usuario", "Porque clasifica imágenes médicas", "Porque solo funciona con datos etiquetados"], correct: 1, exp: "Simula un entorno navegable y consistente en el tiempo, que es la esencia de un world model." },
      { q: "¿Cuál es el riesgo principal de planificar con un world model?", options: ["Que consuma poca memoria", "Que si el modelo del entorno es impreciso, las decisiones basadas en él sean erróneas", "Que no permita usar recompensas", "Que solo funcione en 2D"], correct: 1, exp: "La planificación es tan buena como el simulador: un modelo del mundo equivocado produce planes convincentes pero inútiles." },
    ],
  },
];

/* Ruta de aprendizaje sugerida: agrupa los temas en bloques con sentido pedagógico */
const RUTA = [
  { bloque: "Fundamentos", desc: "Las dos formas clásicas de aprender: con respuestas y sin ellas.", temas: ["supervisado", "no-supervisado"] },
  { bloque: "Aprender con pocas etiquetas", desc: "Cómo la IA superó el cuello de botella del etiquetado manual.", temas: ["semisupervisado", "autosupervisado"] },
  { bloque: "Reutilizar y especializar", desc: "El paradigma que hace viable la IA moderna fuera de los grandes laboratorios.", temas: ["transfer-learning"] },
  { bloque: "Aprender de la experiencia", desc: "Decisiones, recompensas y alineación con lo que las personas esperan.", temas: ["refuerzo", "rlhf-rlaif"] },
  { bloque: "La frontera", desc: "Capacidades emergentes de los modelos actuales.", temas: ["in-context", "world-models"] },
];

/* =========================================================
   Mini evaluaciones — ejercicios variados por tema
   Tipos: vf, ordenar, relacionar, clasificar, escenario
   Cada ejercicio declara el "concepto" que evalúa, para poder
   decirle al estudiante qué debe repasar si falla.
   ========================================================= */

const RETOS = {
  supervisado: [
    { tipo: "vf", concepto: "Etiquetas",
      q: "En el aprendizaje supervisado el modelo puede entrenarse sin conocer la respuesta correcta de los ejemplos.",
      correct: false,
      exp: "Falso. La etiqueta —la respuesta correcta— es justamente el requisito que define este paradigma. Sin ella no hay contra qué comparar la predicción." },
    { tipo: "ordenar", concepto: "Ciclo de entrenamiento",
      q: "Ordena las etapas del ciclo de entrenamiento supervisado.",
      items: ["Reunir datos etiquetados", "El modelo predice", "Medir el error con la función de pérdida", "Ajustar los parámetros"],
      exp: "El ciclo siempre va de los datos a la predicción, de ahí a la medición del error y termina ajustando los parámetros, para volver a empezar." },
    { tipo: "clasificar", concepto: "Clasificación y regresión",
      q: "Reparte cada problema según el tipo de salida que produce.",
      categorias: ["Clasificación", "Regresión"],
      items: [
        { t: "¿Este correo es spam?", cat: "Clasificación" },
        { t: "¿Cuánto costará esta casa?", cat: "Regresión" },
        { t: "¿Qué animal aparece en la foto?", cat: "Clasificación" },
        { t: "¿Cuántos clientes vendrán mañana?", cat: "Regresión" },
      ],
      exp: "La clasificación predice una categoría discreta; la regresión predice un número continuo. Ambas son aprendizaje supervisado." },
    { tipo: "escenario", concepto: "Sobreajuste",
      q: "¿Qué está ocurriendo y qué conviene hacer?",
      contexto: "Entrenas un modelo y obtiene 99 % de acierto sobre los datos de entrenamiento, pero apenas 62 % sobre datos que nunca vio.",
      options: [
        "El modelo generaliza muy bien y está listo para producción",
        "Hay sobreajuste: el modelo memorizó en vez de aprender la relación general",
        "Falta aumentar la tasa de aprendizaje",
        "El problema es de aprendizaje no supervisado"],
      correct: 1,
      exp: "Esa brecha entre entrenamiento y validación es la firma del sobreajuste. Se corrige con más datos, regularización o un modelo menos complejo." },
  ],

  "no-supervisado": [
    { tipo: "vf", concepto: "Ausencia de etiquetas",
      q: "El aprendizaje no supervisado necesita que un experto etiquete al menos una parte de los datos.",
      correct: false,
      exp: "Falso. Trabaja íntegramente sin etiquetas: esa es su definición. Si hubiera algunas etiquetas, estaríamos hablando de aprendizaje semisupervisado." },
    { tipo: "clasificar", concepto: "Supervisado frente a no supervisado",
      q: "Reparte cada tarea según el paradigma al que corresponde.",
      categorias: ["Supervisado", "No supervisado"],
      items: [
        { t: "Predecir si un cliente se irá, con historial de bajas", cat: "Supervisado" },
        { t: "Descubrir perfiles de compra sin categorías previas", cat: "No supervisado" },
        { t: "Detectar transacciones atípicas sin ejemplos de fraude", cat: "No supervisado" },
        { t: "Clasificar radiografías con diagnósticos confirmados", cat: "Supervisado" },
      ],
      exp: "La pregunta decisiva siempre es la misma: ¿los datos traen la respuesta correcta? Si la traen, es supervisado." },
    { tipo: "escenario", concepto: "Validación de resultados",
      q: "¿Cuál es la dificultad principal en esta situación?",
      contexto: "Ejecutas un algoritmo de clustering sobre datos de clientes y obtienes cuatro grupos. Tu jefe pregunta si el resultado es correcto.",
      options: [
        "Basta con medir la exactitud contra las etiquetas verdaderas",
        "No existe una respuesta de referencia: la calidad depende de métricas internas y del juicio experto",
        "El clustering siempre da el resultado óptimo",
        "Hay que reentrenar con más épocas"],
      correct: 1,
      exp: "Sin etiquetas no hay verdad contra la cual comparar. Se usan métricas internas de cohesión y separación, pero la validación final es interpretativa." },
  ],

  semisupervisado: [
    { tipo: "ordenar", concepto: "Proceso semisupervisado",
      q: "Ordena las etapas del autoentrenamiento semisupervisado.",
      items: ["Entrenar con los pocos datos etiquetados", "Predecir pseudo-etiquetas para el resto", "Reentrenar combinando ambos conjuntos", "Repetir el ciclo vigilando la calidad"],
      exp: "Primero se aprovecha lo poco etiquetado, luego se generan pseudo-etiquetas y se reentrena. La vigilancia final es clave: los errores se propagan." },
    { tipo: "vf", concepto: "Propagación de errores",
      q: "Si el modelo genera pseudo-etiquetas equivocadas con alta confianza, el error tiende a corregirse solo en las siguientes iteraciones.",
      correct: false,
      exp: "Falso, y es el riesgo central de este paradigma: el modelo reentrena sobre sus propios errores y los consolida en lugar de corregirlos." },
    { tipo: "escenario", concepto: "Cuándo usar semisupervisado",
      q: "¿Qué enfoque conviene aquí?",
      contexto: "Un hospital tiene 200.000 radiografías archivadas, pero solo 2.000 fueron diagnosticadas por un radiólogo. Contratar más especialistas es inviable.",
      options: [
        "Descartar las no etiquetadas y entrenar solo con las 2.000",
        "Aprendizaje semisupervisado, aprovechando las 198.000 restantes",
        "Aprendizaje por refuerzo con un agente en el hospital",
        "Etiquetar las 200.000 a mano igualmente"],
      correct: 1,
      exp: "Es el caso de libro: etiquetas escasas y costosas, datos sin etiquetar abundantes. El semisupervisado existe exactamente para esto." },
  ],

  autosupervisado: [
    { tipo: "vf", concepto: "Origen de la etiqueta",
      q: "En el aprendizaje autosupervisado las etiquetas se extraen automáticamente del propio dato.",
      correct: true,
      exp: "Verdadero. Se oculta una parte del dato y esa parte oculta hace de etiqueta. Ningún humano interviene, y por eso puede escalar a datos masivos." },
    { tipo: "relacionar", concepto: "Terminología del autosupervisado",
      q: "Relaciona cada término con lo que significa.",
      pares: [
        { a: "Tarea pretexto", b: "Tarea auxiliar que fuerza a aprender representaciones" },
        { a: "Enmascaramiento", b: "Ocultar parte de la entrada para reconstruirla" },
        { a: "Representación", b: "Codificación interna útil para muchas tareas" },
        { a: "Preentrenamiento", b: "Fase inicial sobre datos generales" },
      ],
      exp: "Estos cuatro términos describen el ciclo completo: se enmascara, se resuelve una tarea pretexto, emergen representaciones y todo eso constituye el preentrenamiento." },
    { tipo: "escenario", concepto: "Supervisado frente a autosupervisado",
      q: "¿Qué paradigma es y por qué?",
      contexto: "Un modelo se entrena con millones de textos de internet prediciendo la siguiente palabra de cada frase. Nadie anotó esos textos.",
      options: [
        "Supervisado, porque hay una respuesta correcta para cada predicción",
        "Autosupervisado, porque la respuesta la aporta el propio texto sin anotación humana",
        "No supervisado, porque no hay ninguna respuesta correcta",
        "Por refuerzo, porque recibe recompensas"],
      correct: 1,
      exp: "Hay una respuesta correcta —la palabra real—, así que no es no supervisado. Pero nadie la escribió a mano: se extrae del dato. Eso es autosupervisado." },
  ],

  "transfer-learning": [
    { tipo: "ordenar", concepto: "Pipeline de transferencia",
      q: "Ordena las etapas del transfer learning.",
      items: ["Preentrenamiento sobre datos masivos", "Se obtiene el modelo base", "Fine-tuning con datos específicos", "Modelo especializado"],
      exp: "La etapa cara se paga una sola vez y se reutiliza indefinidamente: esa asimetría es todo el valor del paradigma." },
    { tipo: "clasificar", concepto: "Transfer learning frente a fine-tuning",
      q: "Reparte cada afirmación según a qué concepto corresponde.",
      categorias: ["Transfer learning", "Fine-tuning"],
      items: [
        { t: "Es la estrategia general de reutilizar conocimiento", cat: "Transfer learning" },
        { t: "Continúa entrenando los pesos con datos nuevos", cat: "Fine-tuning" },
        { t: "Incluye usar el modelo como extractor de características", cat: "Transfer learning" },
        { t: "Modifica el modelo de forma permanente", cat: "Fine-tuning" },
      ],
      exp: "Todo fine-tuning es transfer learning, pero no al revés. Usar el modelo congelado como extractor también transfiere conocimiento y no es fine-tuning." },
    { tipo: "vf", concepto: "LoRA",
      q: "LoRA entrena todos los parámetros del modelo preentrenado, pero más rápido.",
      correct: false,
      exp: "Falso. LoRA hace justo lo contrario: congela los pesos originales y entrena solo matrices pequeñas añadidas. El artículo original reporta 10.000 veces menos parámetros entrenables." },
    { tipo: "escenario", concepto: "Fine-tuning frente a RAG",
      q: "¿Qué recomendarías?",
      contexto: "Una empresa quiere un asistente que responda sobre su catálogo de precios, que cambia cada semana.",
      options: [
        "Hacer fine-tuning del modelo cada semana con los precios nuevos",
        "Usar RAG: que el modelo consulte una base de datos actualizable al responder",
        "Entrenar un modelo desde cero",
        "Usar aprendizaje por refuerzo"],
      correct: 1,
      exp: "El fine-tuning enseña comportamiento, no hechos actualizables. Para información que cambia, RAG es la herramienta correcta: consulta la fuente en el momento de responder." },
  ],

  refuerzo: [
    { tipo: "relacionar", concepto: "Elementos del refuerzo",
      q: "Relaciona cada elemento con su papel.",
      pares: [
        { a: "Agente", b: "Toma las decisiones y aprende" },
        { a: "Entorno", b: "Responde a las acciones con estados y recompensas" },
        { a: "Política", b: "Estrategia que asigna una acción a cada estado" },
        { a: "Recompensa", b: "Señal numérica que indica qué tan buena fue una acción" },
      ],
      exp: "Estos cuatro elementos forman el bucle completo del aprendizaje por refuerzo: el agente actúa según su política, el entorno responde con recompensa." },
    { tipo: "ordenar", concepto: "Ciclo agente-entorno",
      q: "Ordena el ciclo de interacción.",
      items: ["Observar el estado", "Elegir una acción", "Recibir recompensa y nuevo estado", "Actualizar la política"],
      exp: "Es un bucle cerrado: cada vuelta mejora la política a partir de la consecuencia observada." },
    { tipo: "escenario", concepto: "Exploración y explotación",
      q: "¿Qué le está pasando al agente?",
      contexto: "Un agente encontró pronto una estrategia que da recompensa moderada y desde entonces la repite siempre, sin probar nada distinto. Su desempeño dejó de mejorar.",
      options: [
        "Está explorando demasiado",
        "Está explotando sin explorar: no descubre estrategias mejores",
        "Tiene sobreajuste en las etiquetas",
        "Le falta un modelo de recompensa"],
      correct: 1,
      exp: "Sin exploración el agente queda atrapado en un óptimo local. El equilibrio entre explorar y explotar es una decisión de diseño central en refuerzo." },
  ],

  "rlhf-rlaif": [
    { tipo: "ordenar", concepto: "Pipeline de alineación",
      q: "Ordena las etapas del proceso de alineación.",
      items: ["El modelo genera varias respuestas", "Un evaluador indica cuál prefiere", "Se entrena el modelo de recompensa", "El algoritmo de refuerzo ajusta el modelo"],
      exp: "El juicio de preferencia se convierte primero en un modelo de recompensa, y solo entonces el refuerzo puede optimizar contra esa señal." },
    { tipo: "clasificar", concepto: "RLHF frente a RLAIF",
      q: "Reparte cada característica según la técnica.",
      categorias: ["RLHF", "RLAIF"],
      items: [
        { t: "El evaluador es una persona", cat: "RLHF" },
        { t: "El evaluador es otro modelo de IA", cat: "RLAIF" },
        { t: "Se guía por una constitución escrita", cat: "RLAIF" },
        { t: "Captura matices difíciles de escribir como reglas", cat: "RLHF" },
        { t: "Escala a un costo mucho menor", cat: "RLAIF" },
      ],
      exp: "El esquema técnico es el mismo en ambas; lo que cambia es quién evalúa, y de ahí se derivan todas las demás diferencias de costo y de matiz." },
    { tipo: "vf", concepto: "Modelo de recompensa",
      q: "El modelo de recompensa reemplaza al modelo de lenguaje original una vez terminado el entrenamiento.",
      correct: false,
      exp: "Falso. Es un modelo auxiliar: su única función es traducir preferencias en una señal numérica para guiar el ajuste. El modelo que se despliega es el de lenguaje, ya alineado." },
  ],

  "in-context": [
    { tipo: "vf", concepto: "Pesos congelados",
      q: "Durante el aprendizaje en contexto, los pesos del modelo se actualizan ligeramente para adaptarse a los ejemplos del prompt.",
      correct: false,
      exp: "Falso, y es el punto central de este paradigma: los pesos quedan exactamente iguales antes y después. Toda la adaptación ocurre en la inferencia." },
    { tipo: "clasificar", concepto: "Contexto frente a fine-tuning",
      q: "Reparte cada afirmación según el enfoque que describe.",
      categorias: ["Aprendizaje en contexto", "Fine-tuning"],
      items: [
        { t: "El efecto dura solo esa conversación", cat: "Aprendizaje en contexto" },
        { t: "Modifica el modelo de forma permanente", cat: "Fine-tuning" },
        { t: "No requiere GPU ni datos de entrenamiento", cat: "Aprendizaje en contexto" },
        { t: "Está limitado por la ventana de contexto", cat: "Aprendizaje en contexto" },
        { t: "Necesita un conjunto de datos preparado", cat: "Fine-tuning" },
      ],
      exp: "La diferencia de fondo es dónde queda el aprendizaje: en el prompt (temporal) o en los pesos (permanente)." },
    { tipo: "escenario", concepto: "Cuándo basta el prompt",
      q: "¿Qué conviene intentar primero?",
      contexto: "Necesitas que un modelo devuelva siempre sus respuestas en un formato JSON concreto. Tienes tres ejemplos del formato y ninguna GPU disponible.",
      options: [
        "Fine-tuning completo del modelo",
        "Aprendizaje en contexto: incluir los tres ejemplos en el prompt",
        "Entrenar un modelo desde cero",
        "Aplicar RLHF"],
      correct: 1,
      exp: "La regla práctica es intentarlo primero por prompt. Si con ejemplos en el contexto se resuelve de forma consistente, no hay razón para entrenar nada." },
  ],

  "world-models": [
    { tipo: "vf", concepto: "Simulación interna",
      q: "Un world model permite evaluar las consecuencias de una acción sin ejecutarla en el entorno real.",
      correct: true,
      exp: "Verdadero. Esa es su utilidad principal: equivocarse dentro de la simulación no cuesta nada, mientras que un error con un robot real sí." },
    { tipo: "ordenar", concepto: "Ciclo de planificación",
      q: "Ordena el proceso de un agente que planifica con un world model.",
      items: ["Observar las transiciones del entorno", "Aprender su dinámica", "Simular futuros posibles", "Elegir la mejor acción"],
      exp: "Primero se aprende cómo funciona el entorno, y solo entonces esa comprensión se usa para imaginar y decidir." },
    { tipo: "escenario", concepto: "Límites del modelo del mundo",
      q: "¿Cuál es la causa más probable?",
      contexto: "Un robot planifica sus movimientos con un world model y en simulación funciona perfectamente, pero al ejecutarlos en el laboratorio falla de forma sistemática.",
      options: [
        "El robot necesita más recompensa",
        "El modelo del entorno es impreciso: la simulación no refleja la física real",
        "Faltan datos etiquetados",
        "Hay que aplicar fine-tuning al modelo de lenguaje"],
      correct: 1,
      exp: "La planificación es tan buena como el simulador que la sostiene. Un world model impreciso produce planes convincentes que fracasan al contacto con la realidad." },
  ],
};

/* Adjunta cada mini evaluación a su tema */
TOPICS.forEach(t => { t.reto = RETOS[t.id] || []; });

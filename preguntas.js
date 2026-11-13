/* =========================================================
   CONTENIDO EDITABLE DEL JUEGO
   Abrí este archivo con el Bloc de notas para cambiar
   preguntas, colores de categorías y el temporizador.
   ========================================================= */

const CONFIG = {
  duraciones: [15, 30, 45, 60],  // botones de tiempo disponibles (segundos)
  duracionInicial: 30,           // tiempo con el que arranca cada pregunta
  sonido: true                   // false = sin sonidos
};

// Colores de cada categoría: color principal y color claro (fondo)
const CATEGORIAS = {
  emociones:   { nombre: "Emociones",              icono: "💗", color: "#ff4f87", claro: "#ff9ac0" },
  amigos:      { nombre: "Entre amigos",           icono: "🤝", color: "#1fa2ff", claro: "#7cd0ff" },
  estereotipos:{ nombre: "Estereotipos",           icono: "🧩", color: "#8a5cf6", claro: "#c0a4ff" },
  cotidianas:  { nombre: "Situaciones cotidianas", icono: "🏠", color: "#ff8a1f", claro: "#ffc17a" },
  pensar:      { nombre: "Para pensar",            icono: "💭", color: "#14b87a", claro: "#6fe3b4" }
};

// Preguntas de apoyo para la charla (el presentador decide si las usa).
// Se van alternando una por pregunta.
const REFLEXIONES = [
  "¿Por qué creen que ganó esta opción?",
  "¿Alguien piensa diferente?",
  "¿Creen que todos reaccionarían de la misma manera?",
  "¿Alguna vez habían pensado en esta situación?"
];

// Para agregar una pregunta, copiá un bloque { ... }, y cambiá el texto.
// "cat" debe ser: emociones, amigos, estereotipos, cotidianas o pensar.
// Cada pregunta tiene que tener 4 opciones (A, B, C, D).
const PREGUNTAS = [
  // ---------- EMOCIONES ----------
  { cat: "emociones",
    texto: "Un amigo tuyo está pasando por un mal momento y se pone a llorar delante del grupo. ¿Qué harías?",
    opciones: ["Le preguntaría qué le pasa.", "Intentaría hacerlo reír para distraerlo.", "Me quedaría acompañándolo.", "No sabría muy bien cómo reaccionar."] },
  { cat: "emociones",
    texto: "¿Cuál de estas frases te parece más acertada?",
    opciones: ["Los hombres tienen que aprender a controlar sus emociones.", "Mostrar tristeza no significa ser débil.", "Hay emociones que es mejor guardarse.", "Cada persona expresa lo que siente de manera diferente."] },
  { cat: "emociones",
    texto: "Un amigo te cuenta algo que le preocupa, pero te pide que no se lo cuentes a nadie. ¿Cómo reaccionarías?",
    opciones: ["Lo escucharía y respetaría su confianza.", "Le diría que no se preocupe, que no es para tanto.", "Intentaría darle algún consejo.", "No sabría qué decirle, pero lo acompañaría."] },

  // ---------- ENTRE AMIGOS ----------
  { cat: "amigos",
    texto: "En tu grupo de amigos empiezan a burlarse de uno porque le gusta una actividad que consideran poco masculina. ¿Qué harías?",
    opciones: ["Me sumaría a las bromas.", "No diría nada.", "Le preguntaría por qué les importa tanto lo que le gusta.", "Intentaría cambiar de tema."] },
  { cat: "amigos",
    texto: "Un amigo te dice que no quiere jugar al fútbol porque prefiere quedarse dibujando. ¿Qué pensás?",
    opciones: ["Cada uno tiene sus gustos.", "Es raro, pero no tiene nada de malo.", "Debería probar algo diferente.", "No entiendo por qué no querría jugar."] },
  { cat: "amigos",
    texto: "¿Cuál de estas situaciones te parece más difícil?",
    opciones: ["Decirle a un amigo que estás triste.", "Reconocer que te equivocaste.", "Pedir ayuda cuando la necesitás.", "Decir que algo te incomoda."] },

  // ---------- ESTEREOTIPOS ----------
  { cat: "estereotipos",
    texto: "¿Cuál de estas cosas puede hacer un hombre sin que eso lo haga menos hombre?",
    opciones: ["Cocinar.", "Bailar.", "Llorar.", "Todas las anteriores."] },
  { cat: "estereotipos",
    texto: "Un chico quiere usar una prenda de ropa que está socialmente asociada con las mujeres. ¿Qué opinás?",
    opciones: ["Debería usar lo que le guste.", "Depende de dónde vaya.", "Probablemente reciba burlas, pero eso no significa que esté mal.", "No me parece algo importante."] },
  { cat: "estereotipos",
    texto: "¿De dónde creen que vienen muchas de las ideas sobre cómo debería comportarse un hombre?",
    opciones: ["De la familia.", "De los amigos.", "De las redes sociales, películas y televisión.", "De una combinación de todas."] },
  { cat: "estereotipos",
    texto: "¿Cuál de estas frases escuchaste más veces?",
    opciones: ["«Los hombres no lloran».", "«Tenés que hacerte respetar».", "«Eso es cosa de mujeres».", "«Tenés que ser fuerte»."] },

  // ---------- SITUACIONES COTIDIANAS ----------
  { cat: "cotidianas",
    texto: "Un amigo pierde un partido y empieza a enojarse muchísimo. ¿Qué pensás?",
    opciones: ["Es normal frustrarse cuando perdés.", "No debería tomárselo tan en serio.", "Tiene que aprender a perder.", "Depende de cómo reaccione."] },
  { cat: "cotidianas",
    texto: "Si un chico quiere aprender a bailar, pero le da vergüenza porque sus amigos podrían burlarse, ¿qué le dirías?",
    opciones: ["Que haga lo que le gusta.", "Que primero aprenda y después les muestre.", "Que no les dé importancia a sus amigos.", "Que no tiene por qué hacer algo que lo incomode."] },
  { cat: "cotidianas",
    texto: "En una película, el protagonista siempre es el más fuerte, nunca tiene miedo y siempre resuelve todo solo. ¿Te parece una representación realista?",
    opciones: ["Sí, porque tiene que ser un héroe.", "No, nadie puede resolver todo solo.", "Depende del tipo de película.", "Nunca lo había pensado."] },

  // ---------- PARA PENSAR ----------
  { cat: "pensar",
    texto: "¿Creés que a veces las personas hacen cosas solamente para encajar con sus amigos?",
    opciones: ["Sí, bastante.", "Algunas veces.", "No necesariamente.", "Nunca lo había pensado."] },
  { cat: "pensar",
    texto: "¿Qué te parece más importante en una amistad?",
    opciones: ["Poder confiar en la otra persona.", "Divertirse juntos.", "Poder hablar de cualquier cosa.", "Respetarse incluso cuando piensan diferente."] },
  { cat: "pensar",
    texto: "Si pudieras eliminar una expectativa que la sociedad tiene sobre los hombres, ¿cuál sería?",
    opciones: ["Que siempre tienen que ser fuertes.", "Que no pueden mostrar tristeza.", "Que tienen que demostrar constantemente su valentía.", "Que no pueden hacer determinadas cosas porque son «de mujeres»."] }
];

(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var LETRAS = ["A", "B", "C", "D"];
  var COLORES = ["var(--A)", "var(--B)", "var(--C)", "var(--D)"];

  var pantallas = { inicio: $("#inicio"), juego: $("#juego"), final: $("#final") };
  var idx = 0;
  var votos = [];                       // votos[i] = índice de la opción elegida (o undefined)
  var duracion = CONFIG.duracionInicial;
  var restante = duracion;
  var intervalo = null;
  var audioCtx = null;
  var accionModal = null;

  /* ---------- Utilidades ---------- */
  function mostrar(nombre) {
    for (var k in pantallas) pantallas[k].classList.remove("activa");
    pantallas[nombre].classList.add("activa");
  }
  function reanimar(el, clase) {
    el.classList.remove(clase); void el.offsetWidth; el.classList.add(clase);
  }
  function sonido(f, dur, delay) {
    if (!CONFIG.sonido) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      var t = audioCtx.currentTime + (delay || 0);
      o.frequency.value = f; o.type = "sine";
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch (e) { /* sin sonido, no pasa nada */ }
  }

  /* ---------- Temporizador ---------- */
  function pintarReloj() {
    var r = $("#reloj");
    $("#relojNum").textContent = restante > 0 ? restante : "¡Tiempo!";
    r.style.setProperty("--p", duracion ? restante / duracion : 0);
    r.classList.toggle("poco", restante > 0 && restante <= 5 && (intervalo !== null));
    r.classList.toggle("fin", restante === 0);
    $("#btnTimer").textContent = intervalo !== null ? "⏸ Pausar" : (restante > 0 && restante < duracion ? "▶ Seguir" : "▶ Iniciar");
  }
  function detener() { if (intervalo !== null) { clearInterval(intervalo); intervalo = null; } }
  function reiniciarTimer() { detener(); restante = duracion; pintarReloj(); }
  function alternarTimer() {
    if (intervalo !== null) { detener(); pintarReloj(); return; }
    if (restante <= 0) restante = duracion;
    intervalo = setInterval(function () {
      restante--;
      if (restante <= 5 && restante > 0) sonido(880, 0.12);
      if (restante <= 0) {
        restante = 0; detener();
        sonido(660, 0.25); sonido(520, 0.25, 0.3); sonido(392, 0.5, 0.6);
      }
      pintarReloj();
    }, 1000);
    pintarReloj();
  }
  function cambiarDuracion(s) {
    duracion = s; reiniciarTimer();
    var bs = document.querySelectorAll("#duraciones button");
    for (var i = 0; i < bs.length; i++) bs[i].classList.toggle("sel", Number(bs[i].dataset.s) === s);
  }

  /* ---------- Pregunta ---------- */
  function pintarSeleccion() {
    var ops = document.querySelectorAll(".opcion");
    var v = votos[idx];
    for (var i = 0; i < ops.length; i++) {
      ops[i].classList.remove("ganadora", "apagada");
      if (v !== undefined) ops[i].classList.add(i === v ? "ganadora" : "apagada");
    }
    var ref = $("#reflexion");
    if (v !== undefined) {
      $("#reflexionTexto").textContent = REFLEXIONES[idx % REFLEXIONES.length];
      ref.classList.add("ver");
    } else ref.classList.remove("ver");
  }

  function mostrarPregunta() {
    var p = PREGUNTAS[idx], c = CATEGORIAS[p.cat];
    var st = document.body.style;
    st.setProperty("--cat", c.color); st.setProperty("--claro", c.claro);
    $("#catIcono").textContent = c.icono;
    $("#catNombre").textContent = c.nombre;
    $("#progTexto").textContent = "Pregunta " + (idx + 1) + " de " + PREGUNTAS.length;
    $("#progRelleno").style.width = ((idx + 1) / PREGUNTAS.length * 100) + "%";
    $("#pregunta").textContent = p.texto;
    reanimar($("#tarjeta"), "entra");

    var cont = $("#opciones");
    cont.innerHTML = "";
    p.opciones.forEach(function (txt, i) {
      var b = document.createElement("button");
      b.className = "opcion";
      b.dataset.l = LETRAS[i];
      b.style.setProperty("--c", COLORES[i]);
      b.style.setProperty("--i", i);
      var l = document.createElement("span"); l.className = "letra"; l.textContent = LETRAS[i];
      var t = document.createElement("span"); t.textContent = txt;
      b.appendChild(l); b.appendChild(t);
      b.addEventListener("click", function () { elegir(i); });
      cont.appendChild(b);
    });
    $("#btnAnterior").disabled = idx === 0;
    $("#btnSiguiente").textContent = idx === PREGUNTAS.length - 1 ? "Finalizar ★" : "Siguiente ▶";
    reiniciarTimer();
    pintarSeleccion();
  }

  function elegir(i) {
    if (!pantallas.juego.classList.contains("activa")) return;
    if (i >= PREGUNTAS[idx].opciones.length) return;
    if (votos[idx] === i) return;
    votos[idx] = i;
    detener(); pintarReloj();
    pintarSeleccion();
    sonido(523, 0.15); sonido(659, 0.15, 0.12); sonido(784, 0.3, 0.24);
  }

  /* ---------- Navegación ---------- */
  function irA(n) {
    if (n < 0) return;
    if (n >= PREGUNTAS.length) { terminar(); return; }
    idx = n; mostrarPregunta();
  }
  function reiniciarPregunta() { votos[idx] = undefined; reiniciarTimer(); pintarSeleccion(); }

  function nuevaPartida() { votos = []; idx = 0; mostrarPregunta(); }
  function comenzar() { nuevaPartida(); mostrar("juego"); }

  function terminar() {
    detener();
    document.body.style.removeProperty("--cat");
    confeti();
    mostrar("final");
    sonido(523, 0.2); sonido(659, 0.2, 0.2); sonido(784, 0.2, 0.4); sonido(1047, 0.5, 0.6);
  }
  function confeti() {
    var cols = ["#ffe066", "#ff5a5f", "#2f9bff", "#2ed17a", "#fff"], h = "";
    for (var i = 0; i < 50; i++) {
      h += '<i style="--x:' + (Math.random() * 100) + '%;--c:' + cols[i % cols.length] +
           ';--t:' + (4 + Math.random() * 4) + 's;--d:' + (-Math.random() * 8) + 's"></i>';
    }
    $("#confeti").innerHTML = h;
  }

  /* ---------- Confirmaciones ---------- */
  function confirmar(texto, accion) {
    $("#modalTexto").textContent = texto; accionModal = accion;
    $("#modal").classList.add("ver");
  }
  function cerrarModal() { $("#modal").classList.remove("ver"); accionModal = null; }
  function modalAbierto() { return $("#modal").classList.contains("ver"); }

  /* ---------- Eventos ---------- */
  $("#btnComenzar").addEventListener("click", comenzar);
  $("#btnJugarOtraVez").addEventListener("click", comenzar);
  $("#btnAnterior").addEventListener("click", function () { irA(idx - 1); });
  $("#btnSiguiente").addEventListener("click", function () { irA(idx + 1); });
  $("#btnSaltar").addEventListener("click", function () { irA(idx + 1); });
  $("#btnReiniciarPreg").addEventListener("click", reiniciarPregunta);
  $("#btnTimer").addEventListener("click", alternarTimer);
  $("#btnTimerReset").addEventListener("click", reiniciarTimer);
  $("#btnReiniciarPartida").addEventListener("click", function () {
    confirmar("¿Reiniciar toda la partida desde la pregunta 1?", function () { nuevaPartida(); });
  });
  $("#btnInicio").addEventListener("click", function () {
    confirmar("¿Volver a la pantalla de inicio?", function () { detener(); mostrar("inicio"); });
  });
  $("#modalNo").addEventListener("click", cerrarModal);
  $("#modalSi").addEventListener("click", function () { var f = accionModal; cerrarModal(); if (f) f(); });

  // Que los botones no queden "enfocados" (así la barra espaciadora no los vuelve a activar)
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button") : null;
    if (b) b.blur();
  });

  document.addEventListener("keyup", function (e) { if (e.key === " ") e.preventDefault(); });
  document.addEventListener("keydown", function (e) {
    var k = e.key;
    if (modalAbierto()) { if (k === "Escape") cerrarModal(); return; }
    if (pantallas.inicio.classList.contains("activa")) { if (k === "Enter") comenzar(); return; }
    if (pantallas.final.classList.contains("activa")) { if (k === "Enter") comenzar(); return; }
    var n = "abcd".indexOf(k.toLowerCase());
    if (k.length === 1 && n >= 0) { elegir(n); return; }
    if (k >= "1" && k <= "4") { elegir(Number(k) - 1); return; }
    if (k === "ArrowRight") irA(idx + 1);
    else if (k === "ArrowLeft") irA(idx - 1);
    else if (k === " ") { e.preventDefault(); alternarTimer(); }
    else if (k.toLowerCase() === "r") reiniciarPregunta();
  });

  /* ---------- Arranque ---------- */
  var cd = $("#duraciones");
  CONFIG.duraciones.forEach(function (s) {
    var b = document.createElement("button");
    b.textContent = s + "s"; b.dataset.s = s;
    b.addEventListener("click", function () { cambiarDuracion(s); });
    cd.appendChild(b);
  });
  cambiarDuracion(CONFIG.duracionInicial);
})();

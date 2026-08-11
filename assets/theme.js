/* ============================================================================
   RespiraHome — Tema Shopify · lógica de interfaz
   Lee los datos inyectados por las secciones (JSON en el DOM):
     #data-config   → WhatsApp y recargo fuera de horario (global)
     #data-services → servicios y adicionales (sección Servicios)
     #data-zones    → zonas y comunas (sección Cobertura)
   ========================================================================== */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clp = function (n) { return "$" + Number(n || 0).toLocaleString("es-CL"); };

  function readJSON(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { console.warn("JSON inválido en #" + id, e); return null; }
  }

  var CFG = readJSON("data-config") || {};
  var SERVICIOS = readJSON("data-services") || [];
  var ZONAS = readJSON("data-zones") || [];

  function waLink(msg) {
    var num = String(CFG.whatsapp || "").replace(/[^0-9]/g, "");
    var text = msg || CFG.whatsappMensaje || "";
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
  }

  /* ================= NAV MÓVIL ======================================= */
  function setupNav() {
    var toggle = $(".nav-toggle");
    var nav = $(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ================= FAQ ============================================= */
  function setupFaq() {
    $$(".faq-q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq-item");
        var ans = $(".faq-a", item);
        var open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0";
      });
    });
  }

  /* ================= COTIZADOR ====================================== */
  function setupCotizador() {
    var selServicio = $("#q-servicio");
    var selComuna = $("#q-comuna");
    var selHorario = $("#q-horario");
    var adicWrap = $("#q-adicionales-wrap");
    var adicBox = $("#q-adicionales");
    var totalEl = $("#q-total");
    var breakdown = $("#q-breakdown");
    if (!selServicio || !selComuna || !SERVICIOS.length) return;

    // Índice comuna -> zona
    var comunaMap = {};
    ZONAS.forEach(function (z) {
      (z.comunas || []).forEach(function (c) { comunaMap[c] = z; });
    });

    // Poblar servicios
    selServicio.innerHTML = SERVICIOS.map(function (s) {
      return '<option value="' + s.id + '">' + s.nombre + "</option>";
    }).join("");

    // Poblar comunas (ordenadas)
    var comunas = [];
    ZONAS.forEach(function (z) { (z.comunas || []).forEach(function (c) { if (comunas.indexOf(c) === -1) comunas.push(c); }); });
    comunas.sort(function (a, b) { return a.localeCompare(b, "es"); });
    selComuna.innerHTML = comunas.map(function (c) {
      var z = comunaMap[c];
      var label = z && z.recargo > 0 ? c + " (+" + clp(z.recargo) + ")" : c;
      return '<option value="' + c + '">' + label + "</option>";
    }).join("");

    // Comuna preseleccionada (se configura en la sección Cotizador).
    // Si no calza con ninguna de la lista, queda la primera.
    var comunaPorDefecto = selComuna.getAttribute("data-default");
    if (comunaPorDefecto && comunas.indexOf(comunaPorDefecto) !== -1) {
      selComuna.value = comunaPorDefecto;
    }

    // Etiqueta horario fuera
    var recargoFuera = Number(CFG.recargoFueraHorario || 0);
    var optFuera = selHorario && selHorario.querySelector('option[value="fuera"]');
    if (optFuera) optFuera.textContent = "Fuera de horario (+" + clp(recargoFuera) + ")";

    function currentServicio() {
      return SERVICIOS.filter(function (s) { return s.id === selServicio.value; })[0] || SERVICIOS[0];
    }

    function renderAdicionales() {
      var s = currentServicio();
      if (s.adicionales && s.adicionales.length) {
        adicWrap.hidden = false;
        adicBox.innerHTML = s.adicionales.map(function (a) {
          return '<label class="check"><input type="checkbox" value="' + a.id + '" data-price="' + a.precio + '">' +
                 '<span class="c-name">' + a.nombre + '</span>' +
                 '<span class="c-price">+' + clp(a.precio) + "</span></label>";
        }).join("");
      } else {
        adicWrap.hidden = true;
        adicBox.innerHTML = "";
      }
    }

    function recalc() {
      var s = currentServicio();
      var z = comunaMap[selComuna.value];
      var fuera = selHorario && selHorario.value === "fuera";
      var total = Number(s.precio || 0);
      var rows = ['<li><span>' + s.nombre + '</span> <b>' + clp(s.precio) + "</b></li>"];

      $$('input[type="checkbox"]:checked', adicBox).forEach(function (chk) {
        var p = Number(chk.dataset.price);
        total += p;
        rows.push('<li><span>' + chk.closest(".check").querySelector(".c-name").textContent + '</span> <b>+' + clp(p) + "</b></li>");
      });

      if (z && z.recargo > 0) { total += Number(z.recargo); rows.push('<li><span>Traslado · ' + selComuna.value + '</span> <b>+' + clp(z.recargo) + "</b></li>"); }
      if (fuera && recargoFuera > 0) { total += recargoFuera; rows.push('<li><span>Recargo fuera de horario</span> <b>+' + clp(recargoFuera) + "</b></li>"); }

      totalEl.textContent = clp(total);
      breakdown.innerHTML = rows.join("");

      window.__respiraQuote = {
        servicio: s.nombre,
        comuna: selComuna.value,
        horario: fuera ? "fuera de horario" : "horario normal",
        total: clp(total),
      };
    }

    selServicio.addEventListener("change", function () { renderAdicionales(); recalc(); });
    selComuna.addEventListener("change", recalc);
    if (selHorario) selHorario.addEventListener("change", recalc);
    adicBox.addEventListener("change", recalc);

    renderAdicionales();
    recalc();
  }

  /* ================= WHATSAPP DEL COTIZADOR ========================= */
  function setupWhatsappQuote() {
    var q = $("[data-whatsapp-quote]");
    if (!q) return;
    q.addEventListener("click", function () {
      var d = window.__respiraQuote;
      if (d) {
        var msg = "¡Hola RespiraHome! Quiero agendar:\n" +
          "• Servicio: " + d.servicio + "\n" +
          "• Comuna: " + d.comuna + "\n" +
          "• Horario: " + d.horario + "\n" +
          "• Valor estimado: " + d.total;
        q.setAttribute("href", waLink(msg));
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupNav();
    setupFaq();
    setupCotizador();
    setupWhatsappQuote();
  });
})();

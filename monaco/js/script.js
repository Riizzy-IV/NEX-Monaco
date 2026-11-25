document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('headerToggle');
  var nav = document.getElementById('headerNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var toggleBtns = document.querySelectorAll('.gallery__toggle-btn');
  var tracks = document.querySelectorAll('.gallery__track');
  var prevBtn = document.getElementById('galleryPrev');
  var nextBtn = document.getElementById('galleryNext');

  var getActiveTrack = function () {
    return document.querySelector('.gallery__track:not(.is-hidden)');
  };

  var setPeek = function (track) {
    if (!track) return;
    if (window.innerWidth < 700) {
      track.scrollLeft = 0;
      return;
    }
    var gutter = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    track.scrollLeft = gutter + 170;
  };

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      toggleBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      var targetName = btn.getAttribute('data-target');
      tracks.forEach(function (t) {
        t.classList.toggle('is-hidden', t.getAttribute('data-track') !== targetName);
      });

      setPeek(getActiveTrack());
    });
  });

  if (tracks.length && prevBtn && nextBtn) {
    var scrollByCard = function (direction) {
      var track = getActiveTrack();
      if (!track) return;
      var card = track.querySelector('.gallery__card');
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var distance = card ? card.getBoundingClientRect().width + gap : 300;
      track.scrollBy({ left: direction * distance, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', function () { scrollByCard(-1); });
    nextBtn.addEventListener('click', function () { scrollByCard(1); });

    // Peek: start slightly scrolled so the first card is partially cropped on the left
    var initPeek = function () { setPeek(getActiveTrack()); };
    window.addEventListener('load', initPeek);
    setTimeout(initPeek, 400);
  }

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');

  if (lightbox && lightboxImg) {
    var currentTrack = null;
    var currentIndex = 0;

    var showCard = function (track, index) {
      var cards = track.querySelectorAll('.gallery__card');
      if (!cards.length) return;
      index = (index + cards.length) % cards.length;
      currentTrack = track;
      currentIndex = index;

      var card = cards[index];
      var img = card.querySelector('img');
      var label = card.querySelector('.gallery__card-label');

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.innerHTML = label ? label.innerHTML : '';
    };

    var openLightbox = function (track, index) {
      showCard(track, index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    var closeLightbox = function () {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.gallery__card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.preventDefault();
        var track = card.closest('.gallery__track');
        var cards = Array.prototype.slice.call(track.querySelectorAll('.gallery__card'));
        openLightbox(track, cards.indexOf(card));
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { showCard(currentTrack, currentIndex - 1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { showCard(currentTrack, currentIndex + 1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showCard(currentTrack, currentIndex - 1);
      if (e.key === 'ArrowRight') showCard(currentTrack, currentIndex + 1);
    });
  }

  // Plantas
  var plansImg = document.getElementById('plansImg');
  var plansFinals = document.getElementById('plansFinals');
  var plansSize = document.getElementById('plansSize');
  var plansPrev = document.getElementById('plansPrev');
  var plansNext = document.getElementById('plansNext');

  if (plansImg && plansPrev && plansNext) {
    var plans = [
      { img: '/monaco/assets/img/planta-02.avif', finals: 'Finais - 01 | 10', size: '60,82m<sup>2</sup>' },
      { img: '/monaco/assets/img/planta-01.avif', finals: 'Finais - 02 | 04 | 07 | 09', size: '59,98m<sup>2</sup>' },
      { img: '/monaco/assets/img/planta-03.avif', finals: 'Finais - 03 | 08', size: '73,53m<sup>2</sup>' },
      { img: '/monaco/assets/img/planta-04.avif', finals: 'Finais - 05 | 06', size: '60,73m<sup>2</sup>' }
    ];
    var plansIndex = 0;

    var renderPlan = function () {
      var plan = plans[plansIndex];
      plansImg.src = plan.img;
      plansFinals.textContent = plan.finals;
      plansSize.innerHTML = plan.size;
    };

    plansPrev.addEventListener('click', function () {
      plansIndex = (plansIndex - 1 + plans.length) % plans.length;
      renderPlan();
    });

    plansNext.addEventListener('click', function () {
      plansIndex = (plansIndex + 1) % plans.length;
      renderPlan();
    });
  }

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var WEBHOOK_URL = 'https://hook.us1.make.com/9xr41axpck24oezqv7giv9nv7csz13dh';

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('.contact__submit');
      var originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      var payload = {
        nome: contactForm.nome.value,
        email: contactForm.email.value,
        telefone: contactForm.telefone.value,
        origem: 'Monaco Residencial - Landing Page'
      };

      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function () {
          alert('Obrigado! Em breve nossa equipe entrará em contato.');
          contactForm.reset();
        })
        .catch(function () {
          alert('Não foi possível enviar seu contato agora. Tente novamente em instantes.');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        });
    });
  }
});

/* ── Orientação solar sobre o pavimento tipo ─────────────────────────────
   Mesma fórmula da SunCalc (usada no Touch). Terreno: Mineiros-GO.
   Orientação da planta tirada da imagem enviada pelo cliente: poente no canto superior esquerdo e
   nascente no inferior direito, ou seja, o topo da imagem aponta para ~315° (noroeste). CONFIRMAR. */
(function () {
  var root = document.getElementById('sunStudy');
  if (!root) return;

  var LAT = -17.54966, LNG = -52.55316, FUSO = -3;
  var TOPO = 315;                      // azimute para onde aponta o topo da imagem
  var CX = 1000, CY = 620, RX = 900, RY = 470, ALTURA = 300;
  var RAD = Math.PI / 180;

  /* centro de cada final na imagem e para onde fica a fachada externa (graus a partir do topo, horário) */
  var UNIDADES = [
    { n: '04', c: [426, 320], f: 315 }, { n: '05', c: [808, 472], f: 0 },   { n: '06', c: [1192, 472], f: 0 },
    { n: '07', c: [1574, 320], f: 45 }, { n: '03', c: [308, 600], f: 270 }, { n: '08', c: [1692, 600], f: 90 },
    { n: '02', c: [426, 880], f: 225 }, { n: '01', c: [798, 733], f: 180 }, { n: '10', c: [1202, 733], f: 180 },
    { n: '09', c: [1574, 880], f: 135 }
  ];
  var ESTACOES = { verao: [2026, 12, 21], equinocio: [2026, 3, 20], inverno: [2026, 6, 21] };

  function posicaoSol(data) {
    var d = data.getTime() / 864e5 - 0.5 + 2440588 - 2451545;
    var M = RAD * (357.5291 + 0.98560028 * d);
    var L = M + RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) + RAD * 102.9372 + Math.PI;
    var ob = RAD * 23.4397;
    var dec = Math.asin(Math.sin(ob) * Math.sin(L));
    var ra = Math.atan2(Math.sin(L) * Math.cos(ob), Math.cos(L));
    var phi = RAD * LAT;
    var H = RAD * (280.16 + 360.9856235 * d) - RAD * -LNG - ra;
    var alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
    var az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));
    return { az: (az / RAD + 180 + 360) % 360, alt: alt / RAD };
  }
  function dataLocal(e, min) { return new Date(Date.UTC(e[0], e[1] - 1, e[2]) + (min - FUSO * 60) * 6e4); }
  function nascerPor(e) {
    var n = 0, p = 1440, antes = posicaoSol(dataLocal(e, 0)).alt;
    for (var m = 1; m <= 1440; m++) {
      var h = posicaoSol(dataLocal(e, m)).alt;
      if (antes < -0.83 && h >= -0.83) n = m;
      if (antes >= -0.83 && h < -0.83) p = m;
      antes = h;
    }
    return [n, p];
  }
  /* azimute + altura -> ponto na imagem (cúpula vista de cima, levemente inclinada) */
  function tela(az, alt) {
    var d = (az - TOPO) * RAD, a = Math.max(-2, alt) * RAD, g = Math.cos(a);
    return [CX + Math.sin(d) * RX * g, CY - Math.cos(d) * RY * g - Math.sin(a) * ALTURA];
  }
  function difAng(a, b) { return Math.abs(((a - b + 540) % 360) - 180); }
  function hhmm(m) { m = Math.round(m); return String(Math.floor(m / 60)).padStart(2, '0') + 'h' + String(m % 60).padStart(2, '0'); }

  var NS = 'http://www.w3.org/2000/svg';
  var gUn = document.getElementById('sunUnits'), path = document.getElementById('sunPath');
  var ball = document.getElementById('sunBall'), rumos = document.getElementById('sunRumos');
  var light = root.querySelector('#sunLight'), lightRect = root.querySelector('.sun__light'), night = root.querySelector('.sun__night');
  var bar = document.getElementById('sunBar'), fill = document.getElementById('sunFill');
  var thumb = document.getElementById('sunThumb'), hora = document.getElementById('sunHour');
  var now = document.getElementById('sunNow');

  var glows = UNIDADES.map(function (u) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', u.c[0]); c.setAttribute('cy', u.c[1]); c.setAttribute('r', 190);
    c.setAttribute('fill', 'url(#unitGlow)'); c.setAttribute('class', 'sun__unit');
    gUn.appendChild(c); return c;
  });
  [['N', 0], ['L', 90], ['S', 180], ['O', 270]].forEach(function (r) {
    var p = tela(r[1], 0), t = document.createElementNS(NS, 'text');
    t.setAttribute('x', Math.min(1960, Math.max(40, p[0])));
    t.setAttribute('y', Math.min(1170, Math.max(50, p[1])));
    t.textContent = r[0]; rumos.appendChild(t);
  });

  var est = 'inverno', dia = nascerPor(ESTACOES[est]), min = 9 * 60 + 30;

  function desenhaCaminho() {
    var pts = [];
    for (var m = dia[0]; m <= dia[1]; m += 6) {
      var s = posicaoSol(dataLocal(ESTACOES[est], m));
      pts.push(tela(s.az, s.alt).map(function (v) { return v.toFixed(0); }).join(','));
    }
    path.setAttribute('points', pts.join(' '));
  }

  function render() {
    var s = posicaoSol(dataLocal(ESTACOES[est], min));
    var p = tela(s.az, s.alt), acima = s.alt > 0;
    ball.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')');
    ball.style.opacity = acima ? 1 : 0;

    /* luz entrando pelo lado do sol */
    var d = (s.az - TOPO) * RAD, dx = Math.sin(d), dy = -Math.cos(d);
    light.setAttribute('x1', CX + dx * 900); light.setAttribute('y1', 600 + dy * 900);
    light.setAttribute('x2', CX - dx * 900); light.setAttribute('y2', 600 - dy * 900);
    var forca = Math.max(0, Math.min(1, s.alt / 12));
    lightRect.style.opacity = forca;
    night.style.opacity = (1 - forca) * 0.35;

    var lit = [];
    UNIDADES.forEach(function (u, i) {
      var on = acima && difAng(s.az, (TOPO + u.f) % 360) < 80;
      glows[i].classList.toggle('is-on', on);
      if (on) lit.push(u.n);
    });
    lit.sort();

    var t = (min - dia[0]) / (dia[1] - dia[0]);
    fill.style.width = (t * 100) + '%';
    thumb.style.left = (t * 100) + '%';
    hora.textContent = hhmm(min);
    bar.setAttribute('aria-valuetext', hhmm(min));
    now.innerHTML = acima && lit.length
      ? 'Sol direto nos finais <b>' + lit.join(', ') + '</b> · ' + Math.round(s.alt) + '° acima do horizonte'
      : 'Sol baixo no horizonte';
  }

  function setMin(m) { min = Math.max(dia[0], Math.min(dia[1], m)); render(); }

  function porPonteiro(e) {
    var r = bar.getBoundingClientRect();
    setMin(dia[0] + ((e.clientX - r.left) / r.width) * (dia[1] - dia[0]));
  }
  var arrastando = false;
  bar.addEventListener('pointerdown', function (e) { arrastando = true; bar.setPointerCapture(e.pointerId); porPonteiro(e); });
  bar.addEventListener('pointermove', function (e) { if (arrastando) porPonteiro(e); });
  ['pointerup', 'pointercancel'].forEach(function (ev) { bar.addEventListener(ev, function () { arrastando = false; }); });
  bar.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { setMin(min + 15); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { setMin(min - 15); e.preventDefault(); }
  });

  /* arrastar a própria planta (mouse) também passa o dia, como no Touch */
  var stage = root.querySelector('.sun__stage'), ini = null;
  stage.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') { ini = { x: e.clientX, m: min }; stage.setPointerCapture(e.pointerId); } });
  stage.addEventListener('pointermove', function (e) { if (ini) setMin(ini.m + (e.clientX - ini.x) * ((dia[1] - dia[0]) / stage.clientWidth)); });
  ['pointerup', 'pointercancel'].forEach(function (ev) { stage.addEventListener(ev, function () { ini = null; }); });

  root.querySelectorAll('#sunSeasons button').forEach(function (b) {
    b.addEventListener('click', function () {
      root.querySelectorAll('#sunSeasons button').forEach(function (x) { x.classList.toggle('is-active', x === b); });
      est = b.dataset.s; dia = nascerPor(ESTACOES[est]);
      desenhaCaminho(); setMin(min);
    });
  });

  desenhaCaminho(); render();
})();

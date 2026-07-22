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
      { img: '/monaco/assets/img/planta-01.avif', finals: 'Finais - 01 | 10', size: '60,82m<sup>2</sup>' },
      { img: '/monaco/assets/img/planta-02.avif', finals: 'Finais - 02 | 04 | 07 | 09', size: '59,98m<sup>2</sup>' },
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
    var WEBHOOK_URL = 'https://backend-pi-three-61.vercel.app/webhook/lead/4e176fb5-d17c-4a3f-bbd0-b6dc00bd4adf';

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

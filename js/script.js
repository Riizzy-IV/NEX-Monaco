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
  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      toggleBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });

  var track = document.querySelector('.gallery__track');
  var prevBtn = document.getElementById('galleryPrev');
  var nextBtn = document.getElementById('galleryNext');

  if (track && prevBtn && nextBtn) {
    var scrollByCard = function (direction) {
      var card = track.querySelector('.gallery__card');
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var distance = card ? card.getBoundingClientRect().width + gap : 300;
      track.scrollBy({ left: direction * distance, behavior: 'smooth' });
    };

    prevBtn.addEventListener('click', function () { scrollByCard(-1); });
    nextBtn.addEventListener('click', function () { scrollByCard(1); });

    // Peek: start slightly scrolled so the first card is partially cropped on the left
    var setPeek = function () {
      var gutter = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      track.scrollLeft = gutter + 170;
    };
    window.addEventListener('load', setPeek);
    setTimeout(setPeek, 400);
  }

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Obrigado! Em breve nossa equipe entrará em contato.');
      contactForm.reset();
    });
  }
});

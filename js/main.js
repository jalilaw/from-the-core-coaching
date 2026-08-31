// From The Core Coaching — shared site behavior (no build step, no framework)

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initTestimonialCarousel();
  initTestimonialModal();
  initForms();
  initInquiryPrefill();
  loadCredlyBadge();
});

/* ---------- Mobile nav ---------- */
function initMobileMenu() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', function () {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
    });
  });
}

/* ---------- Testimonial carousel ---------- */
function initTestimonialCarousel() {
  var panel = document.querySelector('[data-carousel-panel]');
  if (!panel) return;

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-testimonial-slide]'));
  var dotsWrap = document.querySelector('[data-carousel-dots]');
  var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll('button')) : [];
  var modal = document.querySelector('[data-testimonial-modal]');
  var index = 0;
  var timer = null;
  var intervalMs = 6000;

  function render() {
    slides.forEach(function (slide, i) {
      slide.style.display = i === index ? '' : 'none';
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  function start() {
    stop();
    timer = setInterval(next, intervalMs);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  document.querySelectorAll('[data-carousel-next]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.stopPropagation(); next(); });
  });
  document.querySelectorAll('[data-carousel-prev]').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function (e) { e.stopPropagation(); go(i); });
  });

  // Pause on hover, and while the "see all" modal is open.
  panel.addEventListener('mouseenter', stop);
  panel.addEventListener('mouseleave', function () {
    if (!modal || !modal.classList.contains('open')) start();
  });

  render();
  start();

  // Expose so the modal handler below can pause/resume it.
  window.__ftccCarousel = { start: start, stop: stop };
}

/* ---------- "See all testimonials" modal ---------- */
function initTestimonialModal() {
  var modal = document.querySelector('[data-testimonial-modal]');
  if (!modal) return;
  var openers = document.querySelectorAll('[data-open-testimonials]');
  var closers = modal.querySelectorAll('[data-close-testimonials]');
  var panel = modal.querySelector('[data-testimonial-modal-panel]');

  function open() {
    modal.classList.add('open');
    if (window.__ftccCarousel) window.__ftccCarousel.stop();
  }
  function close() {
    modal.classList.remove('open');
    if (window.__ftccCarousel) window.__ftccCarousel.start();
  }

  openers.forEach(function (btn) { btn.addEventListener('click', open); });
  closers.forEach(function (btn) { btn.addEventListener('click', close); });
  modal.addEventListener('click', close);
  if (panel) panel.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
}

/* ---------- Offering CTAs prefill the inquiry-type select ---------- */
function initInquiryPrefill() {
  var select = document.querySelector('#inquiryType');
  if (!select) return;
  document.querySelectorAll('[data-prefill-inquiry]').forEach(function (link) {
    link.addEventListener('click', function () {
      select.value = link.getAttribute('data-prefill-inquiry');
    });
  });
}

/* ---------- Forms: Netlify Forms via AJAX, inline validation, inline success ---------- */
function encodeForNetlify(formEl) {
  var data = new FormData(formEl);
  var pairs = [];
  data.forEach(function (value, key) {
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  });
  return pairs.join('&');
}

function showError(input, message) {
  var group = input.closest('.field-group') || input.parentElement;
  var err = group.querySelector('.field-error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'field-error';
    group.appendChild(err);
  }
  err.textContent = message;
  err.classList.add('visible');
}

function clearErrors(formEl) {
  formEl.querySelectorAll('.field-error').forEach(function (err) {
    err.classList.remove('visible');
    err.textContent = '';
  });
}

function initForms() {
  document.querySelectorAll('form[data-ftcc-form]').forEach(function (formEl) {
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(formEl);

      var valid = true;
      formEl.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value || !field.value.trim()) {
          valid = false;
          var label = field.getAttribute('data-label') || 'This field';
          showError(field, label + ' is required.');
        }
      });
      var emailField = formEl.querySelector('input[type="email"][required]');
      if (emailField && emailField.value && !/^\S+@\S+\.\S+$/.test(emailField.value)) {
        valid = false;
        showError(emailField, 'Enter a valid email address.');
      }
      if (!valid) return;

      var submitBtn = formEl.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForNetlify(formEl),
      })
        .then(function () {
          var successEl = document.querySelector(formEl.getAttribute('data-success-target'));
          if (successEl) {
            formEl.style.display = 'none';
            successEl.style.display = '';
          }
        })
        .catch(function () {
          if (submitBtn) submitBtn.disabled = false;
          alert('Something went wrong sending that — please try again, or email coaching@jayme-alilaw.com directly.');
        });
    });
  });
}

/* ---------- Credly badge: load the embed script after the target div exists ---------- */
function loadCredlyBadge() {
  if (!document.querySelector('[data-share-badge-id]')) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = '//cdn.credly.com/assets/utilities/embed.js';
  document.body.appendChild(s);
}

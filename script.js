/* SellerBeacon — script.js */

/* ---- Navbar scroll shadow ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ---- Mobile menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});
window.closeMob = () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
};

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ---- CountUp ---- */
function runCount(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const dur = 1800;
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(runCount);
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const aboutVisual = document.querySelector('.about-visual');
if (aboutVisual) countObs.observe(aboutVisual);

/* ---- FAQ accordion ---- */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const ans  = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');

    // close all
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      ans.style.maxHeight = ans.scrollHeight + 'px';
    }
  });
});

/* ---- Hero GSAP entrance ---- */
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-urgency', { y: 20, opacity: 0, duration: .6, ease: 'power2.out', delay: .1 });
  gsap.from('.hero-text h1',  { y: 28, opacity: 0, duration: .7, ease: 'power3.out', delay: .25 });
  gsap.from('.hero-text .lead', { y: 22, opacity: 0, duration: .7, ease: 'power2.out', delay: .4 });
  gsap.from('.hero-ctas',     { y: 18, opacity: 0, duration: .6, ease: 'power2.out', delay: .55 });
  gsap.from('.hero-trust',    { y: 14, opacity: 0, duration: .6, ease: 'power2.out', delay: .65 });
  gsap.from('.hero-card',     { y: 32, opacity: 0, duration: .8, ease: 'power3.out', delay: .4 });
}

/* ---- Smooth anchor scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const tgt = document.querySelector(a.getAttribute('href'));
    if (!tgt) return;
    e.preventDefault();
    window.scrollTo({ top: tgt.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
  });
});

/* ---- Contact form ---- */
const form    = document.getElementById('contact-form');
const fBtn    = document.getElementById('f-btn');
const fBtnTxt = document.getElementById('f-btn-text');
const fStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const msg   = document.getElementById('f-msg').value.trim();

    fStatus.className = 'form-status';

    if (!name || !email || !msg) {
      fStatus.className = 'form-status error';
      fStatus.textContent = 'Please fill in your name, email and message.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fStatus.className = 'form-status error';
      fStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    fBtn.disabled = true;
    fBtnTxt.textContent = 'Sending…';

    setTimeout(() => {
      fBtn.disabled = false;
      fBtnTxt.textContent = 'Send Message';
      fStatus.className = 'form-status success';
      fStatus.textContent = '✓ Message sent! I\'ll be in touch within 24 hours. You can also reach me on WhatsApp for a faster response.';
      form.reset();
    }, 1400);
  });
}

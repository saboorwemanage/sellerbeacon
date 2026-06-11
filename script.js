/* =============================================
   SellerBeacon — script.js
   ============================================= */

gsap.registerPlugin(ScrollTrigger);

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- Mobile menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

window.closeMobileMenu = function () {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
};

/* ---- Signature animation: rising chart bars ---- */
(function buildChartBars() {
  const canvas = document.getElementById('chart-canvas');
  if (!canvas) return;

  const heights = [22, 38, 55, 44, 68, 52, 80, 63, 88, 74, 95, 82, 72, 90];
  const maxH = 380; // px

  heights.forEach((pct, i) => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = Math.round((pct / 100) * maxH) + 'px';
    bar.style.animation = `bar-grow 1.2s ease-out ${i * 0.07}s both, bar-pulse ${2 + (i % 3) * 0.4}s ease-in-out ${1.5 + i * 0.07}s infinite`;
    canvas.appendChild(bar);
  });

  /* floating data-point dots */
  for (let i = 0; i < 6; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:absolute;
      width:${5 + Math.random() * 5}px;
      height:${5 + Math.random() * 5}px;
      border-radius:50%;
      background:var(--teal);
      top:${10 + Math.random() * 60}%;
      left:${5 + Math.random() * 90}%;
      animation: float-dot ${2.5 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite;
      opacity:0.5;
    `;
    canvas.appendChild(dot);
  }
})();

/* ---- Hero GSAP stagger entrance ---- */
gsap.from('.hero-content .gsap-fade-up', {
  y: 36, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2
});

/* ---- Section fade-up on scroll ---- */
gsap.utils.toArray('.gsap-fade-up').forEach(el => {
  /* skip elements already animated by the hero entrance */
  if (el.closest('#hero')) return;
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    y: 30, opacity: 0, duration: 0.7, ease: 'power2.out'
  });
});

/* ---- CountUp pillars ---- */
function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = Math.min(now - start, duration);
    const progress = elapsed / duration;
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (elapsed < duration) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

const pillarsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.pillar-number').forEach(countUp);
      pillarsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const pillarsSection = document.getElementById('pillars');
if (pillarsSection) pillarsObserver.observe(pillarsSection);

/* ---- Contact form (idle → sending → sent) ---- */
const form = document.getElementById('contact-form');
const formBtn = document.getElementById('form-btn');
const formBtnText = document.getElementById('form-btn-text');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* basic validation */
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Please fill in your name, email and message before sending.';
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    /* sending state */
    formStatus.className = 'form-status';
    formBtn.disabled = true;
    formBtnText.textContent = 'Sending…';

    /* simulate async send — replace with real fetch/mailto if needed */
    setTimeout(() => {
      formBtn.disabled = false;
      formBtnText.textContent = 'Send Message';
      formStatus.className = 'form-status success';
      formStatus.textContent = '✓ Message sent — I\'ll be in touch soon. You can also reach me directly on WhatsApp.';
      form.reset();
    }, 1400);
  });
}

/* ---- Smooth anchor scroll (offset for fixed nav) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

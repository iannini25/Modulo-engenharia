/* ============================================================
   MÓDULO ENGENHARIA — interactions (Astro / self-hosted)
   Lenis smooth scroll · GSAP ScrollTrigger · cinematic hero
   (parallax + dust) · scroll telemetry rail · pinned horizontal
   showcase · animated counters · interactive sector tabs ·
   magnetic CTAs · WhatsApp message builder. Degrades gracefully
   and guards every element (internal pages lack some sections).
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { site } from '../data/site';
import { waURL, buildContactMessage, greetingURL } from '../lib/wa';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP = site.contact.whatsappDigits;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer:fine)').matches;
const animate = !reduce;

if (animate) document.documentElement.classList.add('js');

/* ---------- WhatsApp wiring (greeting defaults; form overrides) ---------- */
(function wireWA() {
  const url = greetingURL(WHATSAPP);
  ['telLink', 'telLink2', 'fab', 'waDirect'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('href', url);
  });
})();

/* ============================================================ PRELOADER */
(function preloader() {
  const pl = document.getElementById('preloader');
  const bar = document.getElementById('plBar');
  const pct = document.getElementById('plPct');
  if (!pl) return;
  let p = 0;
  const tick = window.setInterval(() => {
    p += Math.random() * 16 + 6;
    if (p >= 100) {
      p = 100;
      window.clearInterval(tick);
      finish();
    }
    if (bar) bar.style.width = p + '%';
    if (pct) pct.textContent = String(Math.round(p)).padStart(3, '0');
  }, 130);
  function finish() {
    window.setTimeout(() => {
      pl!.classList.add('is-done');
      window.setTimeout(() => ScrollTrigger.refresh(), 600);
      document.dispatchEvent(new Event('modulo:ready'));
    }, 280);
  }
  window.setTimeout(() => {
    window.clearInterval(tick);
    pl.classList.add('is-done');
  }, 4000);
})();

/* ============================================================ LENIS */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.1, duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });
  lenis.on('scroll', () => ScrollTrigger.update());
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const onScroll = (fn: () => void) => {
  if (lenis) lenis.on('scroll', fn);
  window.addEventListener('scroll', fn, { passive: true });
};

/* ============================================================ HERO DUST */
(function dust() {
  const c = document.getElementById('heroDust') as HTMLCanvasElement | null;
  const hero = document.getElementById('inicio');
  if (!c || !hero || reduce) return;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  let w = 0, h = 0, parts: { x: number; y: number; r: number; vy: number; vx: number; a: number }[] = [];
  let raf = 0;
  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = c!.clientWidth; h = c!.clientHeight;
    c!.width = w * dpr; c!.height = h * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function seed() {
    const n = Math.round((w * h) / 26000);
    parts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.18,
      a: Math.random() * 0.4 + 0.1,
    }));
  }
  function frame() {
    ctx!.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      if (p.x < -5) p.x = w + 5; if (p.x > w + 5) p.x = -5;
      ctx!.beginPath();
      ctx!.fillStyle = `rgba(255,236,210,${p.a})`;
      ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx!.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  const start = () => { if (!raf) frame(); };
  const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
  size(); seed(); start();
  window.addEventListener('resize', () => { size(); seed(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((e) => { e[0].isIntersecting ? start() : stop(); }, { threshold: 0.02 }).observe(hero);
  }
})();

/* ============================================================ RAIL */
(function rail() {
  const draw = document.getElementById('railDraw');
  const dot = document.getElementById('railDot');
  const pct = document.getElementById('railPct');
  const secEl = document.getElementById('railSec');
  if (!draw) return;
  const map = [
    ['inicio', 'INÍCIO'], ['sobre', 'A EMPRESA'], ['servicos', 'SERVIÇOS'],
    ['equipamentos', 'CAMPO'], ['numeros', 'DADOS'], ['processo', 'MÉTODO'],
    ['atuacao', 'SEGMENTOS'], ['contato', 'CONTATO'],
  ].map(([id, label]) => ({ el: document.getElementById(id), label })).filter((s) => s.el) as { el: HTMLElement; label: string }[];
  if (!map.length) return;

  function update() {
    const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const prog = clamp(window.scrollY / max, 0, 1);
    draw!.style.strokeDashoffset = String(1 - prog);
    if (dot) dot.style.top = prog * 100 + '%';
    if (pct) pct.textContent = String(Math.round(prog * 100)).padStart(2, '0') + '%';
    const center = window.scrollY + window.innerHeight * 0.5;
    let cur = map[0];
    for (const s of map) { if (s.el.offsetTop <= center) cur = s; }
    if (secEl && secEl.textContent !== cur.label) secEl.textContent = cur.label;
  }
  update(); onScroll(update); window.addEventListener('resize', update);
})();

/* ============================================================ NAV + MENU */
(function nav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (nav) {
    const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    update(); onScroll(update);
  }
  if (burger && menu && nav) {
    const toggle = (open: boolean) => {
      nav.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      if (lenis) open ? lenis.stop() : lenis.start();
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(!menu.classList.contains('is-open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  }
})();

/* ============================================================ SMOOTH ANCHORS */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t as HTMLElement, { offset: -8, duration: 1.25 });
    else (t as HTMLElement).scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================================================ GSAP SCENES */
if (animate) {
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });

  // Hero: slow cinematic push-in across the whole (tall, sticky) section.
  const heroMedia = document.querySelector('.hero__media');
  if (heroMedia) {
    gsap.fromTo(heroMedia, { scale: 1, yPercent: 0 }, {
      scale: 1.16, yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
  }
  // Title/HUD drift + fade over the first portion, freeing the view of the machine.
  if (document.querySelector('.hero__inner')) {
    gsap.to('.hero__inner', {
      yPercent: -26, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '40% top', scrub: true },
    });
  }
  if (document.querySelector('.hero__cue')) {
    gsap.to('.hero__cue', {
      opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '8% top', scrub: true },
    });
  }
  if (document.querySelector('#hudCross')) {
    gsap.to('#hudCross', { x: 10, y: -8, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }

  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const img = el.querySelector('img');
    if (!img) return;
    const amt = parseFloat(el.dataset.parallax || '0.12') || 0.12;
    gsap.fromTo(img, { yPercent: -amt * 26 }, {
      yPercent: amt * 26, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  const marquee = document.getElementById('marquee');
  if (marquee) gsap.to(marquee, { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });

  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count || '0') || 0;
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 86%', once: true,
      onEnter: () => gsap.to(obj, {
        v: end, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = pre + Math.round(obj.v) + suf; },
      }),
    });
  });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    const track = document.getElementById('equipTrack');
    const pin = document.getElementById('equipPin');
    if (!track || !pin) return;
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '#equipamentos', start: 'top top',
        end: () => '+=' + dist(), scrub: 0.6, pin: pin,
        anticipatePin: 1, invalidateOnRefresh: true,
      },
    });
    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); };
  });
  mm.add('(max-width: 860px)', () => {
    document.getElementById('equipamentos')?.classList.add('equip--native');
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
} else {
  document.getElementById('equipamentos')?.classList.add('equip--native');
  // Reduced motion: no count-up animation — show final values immediately.
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    el.textContent = (el.dataset.prefix || '') + (el.dataset.count || '') + (el.dataset.suffix || '');
  });
}

/* ============================================================
   HERO — scroll-driven frame sequence (cinematic scroll-video)
   Preloads frames, draws the scrubbed frame on a canvas (cover,
   DPR-capped, mobile right-bias) via the GSAP/Lenis ticker.
   If frames are absent/disabled it no-ops and the poster shows.
   ============================================================ */
(function heroFrames() {
  const hero = document.getElementById('inicio');
  const canvas = document.getElementById('heroCanvas') as HTMLCanvasElement | null;
  if (!hero || !canvas || reduce) return;
  const mobile = window.matchMedia('(max-width:860px)').matches;
  const count = parseInt((mobile ? hero.dataset.frameCountMobile : hero.dataset.frameCount) || '0', 10);
  if (!count) { canvas.style.display = 'none'; return; }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const base = (mobile ? hero.dataset.framesMobile : hero.dataset.framesDesktop) || '/frames/desktop/f_';
  const ext = hero.dataset.frameExt || '.webp';
  const pad = parseInt(hero.dataset.framePad || '3', 10);
  const biasX = mobile ? 0.78 : 0.5;

  const frames: HTMLImageElement[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.src = base + String(i + 1).padStart(pad, '0') + ext;
    img.onload = () => { if (i === 0) draw(0); };
    frames[i] = img;
  }

  let cw = 0, ch = 0, dpr = 1;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    cw = canvas!.clientWidth; ch = canvas!.clientHeight;
    canvas!.width = Math.round(cw * dpr); canvas!.height = Math.round(ch * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function nearestLoaded(i: number): HTMLImageElement | null {
    const ready = (img?: HTMLImageElement) => !!(img && img.complete && img.naturalWidth);
    if (ready(frames[i])) return frames[i];
    for (let d = 1; d < count; d++) {
      if (ready(frames[i - d])) return frames[i - d];
      if (ready(frames[i + d])) return frames[i + d];
    }
    return null;
  }
  function draw(i: number) {
    const img = nearestLoaded(clamp(i, 0, count - 1));
    if (!img) return;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
    ctx!.clearRect(0, 0, cw, ch);
    ctx!.drawImage(img, (cw - dw) * biasX, (ch - dh) * 0.5, dw, dh);
  }
  function progress() {
    const total = hero!.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    return clamp(-hero!.getBoundingClientRect().top / total, 0, 1);
  }

  let eased = 0, last = -1;
  size();
  window.addEventListener('resize', () => { size(); last = -1; draw(Math.round(eased)); });
  gsap.ticker.add(() => {
    const target = progress() * (count - 1);
    eased += (target - eased) * 0.18;
    const i = Math.round(eased);
    if (i !== last) { draw(i); last = i; }
  });
})();

/* ============================================================ SECTOR TABS */
(function sectors() {
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.seg-tab'));
  const img = document.getElementById('secImg') as HTMLImageElement | null;
  const badge = document.getElementById('secBadge');
  const title = document.getElementById('secTitle');
  const desc = document.getElementById('secDesc');
  const list = document.getElementById('secList');
  const media = document.querySelector('.sectors__media');
  if (!tabs.length || !img) return;

  function swap(key: string) {
    const d = (site.segments as Record<string, (typeof site.segments)['mineracao']>)[key];
    if (!d) return;
    if (media) media.classList.add('is-swapping');
    window.setTimeout(() => {
      img!.src = d.img; img!.alt = `Operação de ${d.title.toLowerCase()}`;
      if (badge) badge.textContent = d.badge;
      if (title) title.textContent = d.title;
      if (desc) desc.textContent = d.description;
      if (list) list.innerHTML = d.capabilities.map((x) => `<li>${x}</li>`).join('');
      if (media) media.classList.remove('is-swapping');
    }, 260);
  }

  function activate(tab: HTMLButtonElement) {
    tabs.forEach((x) => { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); x.tabIndex = -1; });
    tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true'); tab.tabIndex = 0;
    swap(tab.dataset.sector || '');
  }

  tabs.forEach((t) => t.addEventListener('click', () => activate(t)));

  // Keyboard: Left/Right/Home/End roving tabindex.
  tabs.forEach((t, i) => {
    t.addEventListener('keydown', (e) => {
      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      activate(tabs[next]);
      tabs[next].focus();
    });
  });
})();

/* ============================================================ MAGNETIC BUTTONS */
if (finePointer && !reduce) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.32;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ============================================================ CONTACT BUILDER */
(function contact() {
  let seg = '';
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('.chip'));
  chips.forEach((c) => c.addEventListener('click', () => {
    const on = c.classList.contains('is-active');
    chips.forEach((x) => x.classList.remove('is-active'));
    if (!on) { c.classList.add('is-active'); seg = c.dataset.val || ''; } else seg = '';
  }));

  const val = (id: string) => { const e = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null; return e ? e.value.trim() : ''; };
  const form = document.getElementById('cform') as HTMLFormElement | null;
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = buildContactMessage({ nome: val('cf-nome'), empresa: val('cf-empresa'), seg, msg: val('cf-msg') });
    window.open(waURL(WHATSAPP, text), '_blank', 'noopener');
  });
})();

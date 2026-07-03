/* ============================================================
   MÓDULO ENGENHARIA: "Grafite e Brasa" one-page interactions.
   Lenis + GSAP scroll layer (hero scroll-video, quiet reveals,
   one horizontal pin for loop-check, SVG diamond draw) and a
   light anime-free micro layer (magnetic CTAs, odometers).
   Everything guards its target and degrades under reduced motion.
   ============================================================ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { site } from '../data/site';
import { waURL, buildContactMessage } from '../lib/wa';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP = site.contact.whatsappDigits;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animate = !reduce;

/* ---------------------------------------------------- LENIS */
let lenis: Lenis | null = null;
if (animate) {
  lenis = new Lenis({ lerp: 0.1, duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });
  lenis.on('scroll', () => ScrollTrigger.update());
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const onScroll = (fn: () => void) => {
  if (lenis) lenis.on('scroll', fn);
  else window.addEventListener('scroll', fn, { passive: true });
};

/* ---------------------------------------------------- NAV + MENU */
(function nav() {
  const nav = document.getElementById('homeNav');
  const burger = document.getElementById('homeBurger');
  const menu = document.getElementById('homeMenu');
  if (nav) {
    const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    update();
    onScroll(update);
  }
  if (burger && menu && nav) {
    const toggle = (open: boolean) => {
      nav.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
      if (lenis) open ? lenis.stop() : lenis.start();
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menu.setAttribute('inert', '');
    burger.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      toggle(open);
      if (open) (menu.querySelector('a') as HTMLElement | null)?.focus();
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { toggle(false); burger.focus(); }
    });
  }
})();

/* ---------------------------------------------------- SMOOTH ANCHORS */
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

/* ---------------------------------------------------- REVEAL (robust, headless-safe) */
(function reveal() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!els.length) return;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { (en.target as HTMLElement).classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
})();

/* ---------------------------------------------------- SVG DIAMOND DRAW (no premium plugin) */
(function svgDraw() {
  if (reduce) return;
  document.querySelectorAll<SVGGeometryElement>('.dmark--draw .d-wire, [data-draw-line]').forEach((el) => {
    try {
      const len = (el as any).getTotalLength ? (el as SVGGeometryElement).getTotalLength() : 0;
      if (!len) return;
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
      const host = el.closest('.dmark--draw, [data-draw-line]') as HTMLElement | null;
      const trigger = host || el;
      ScrollTrigger.create({
        trigger, start: 'top 90%', once: true,
        onEnter: () => gsap.to(el, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }),
      });
    } catch { /* getTotalLength unsupported: leave as-is (visible) */ }
  });
})();

/* ---------------------------------------------------- ODOMETERS */
(function counters() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  els.forEach((el) => {
    const end = parseFloat(el.dataset.count || '0') || 0;
    const pre = el.dataset.prefix || '';
    const suf = el.dataset.suffix || '';
    const set = (v: number) => { el.textContent = pre + Math.round(v) + suf; };
    if (reduce) { set(end); return; }
    const obj = { v: 0 };
    set(0);
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(obj, { v: end, duration: 1.7, ease: 'power2.out', onUpdate: () => set(obj.v) }),
    });
  });
})();

/* ---------------------------------------------------- HERO scenes */
if (animate) {
  const heroMedia = document.querySelector('.hero__media');
  if (heroMedia) {
    gsap.fromTo(heroMedia, { scale: 1.04 }, {
      scale: 1.14, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
  }
  if (document.querySelector('.hero__inner')) {
    gsap.to('.hero__inner', {
      yPercent: -22, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '42% top', scrub: true },
    });
  }
  if (document.querySelector('.hero__cue')) {
    gsap.to('.hero__cue', {
      opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '8% top', scrub: true },
    });
  }

  /* Desktop-only scroll layer: parallax + the ONE horizontal pin (loop-check).
     Gated with matchMedia so phones/touch stay static; both auto-revert on resize. */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    /* light parallax inside image modules */
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const img = el.querySelector('img');
      if (!img) return;
      const amt = parseFloat(el.dataset.parallax || '0.1') || 0.1;
      gsap.fromTo(img, { yPercent: -amt * 24 }, {
        yPercent: amt * 24, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    /* horizontal pin. Section: [data-pin] with [data-pin-track]. */
    const pin = document.querySelector<HTMLElement>('[data-pin]');
    const track = pin?.querySelector<HTMLElement>('[data-pin-track]');
    if (!pin || !track) return;
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => '+=' + dist(),
        scrub: 0.6, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      },
    });
    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); };
  });
  mm.add('(max-width: 900px)', () => {
    const el = document.querySelector('[data-pin]');
    el?.classList.add('is-native');
    return () => el?.classList.remove('is-native');
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
} else {
  document.querySelector('[data-pin]')?.classList.add('is-native');
}

/* ---------------------------------------------------- HERO frame sequence (preserved effect) */
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

/* ---------------------------------------------------- CONTACT (WhatsApp builder) */
(function contact() {
  let seg = '';
  const chips = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-seg]'));
  chips.forEach((c) => c.addEventListener('click', () => {
    const on = c.classList.contains('is-active');
    chips.forEach((x) => { x.classList.remove('is-active'); x.setAttribute('aria-pressed', 'false'); });
    if (!on) { c.classList.add('is-active'); c.setAttribute('aria-pressed', 'true'); seg = c.dataset.seg || ''; } else seg = '';
  }));
  const val = (id: string) => {
    const e = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
    return e ? e.value.trim() : '';
  };
  const form = document.getElementById('waForm') as HTMLFormElement | null;
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = buildContactMessage({ nome: val('wf-nome'), empresa: val('wf-empresa'), seg, msg: val('wf-msg') });
    window.open(waURL(WHATSAPP, text), '_blank', 'noopener');
  });
})();

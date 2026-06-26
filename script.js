/* ============================================================
   MÓDULO ENGENHARIA — interactions
   Lenis smooth scroll · GSAP ScrollTrigger · cinematic hero
   (parallax + dust) · scroll telemetry rail · pinned horizontal
   showcase · animated counters · interactive sector tabs ·
   magnetic CTAs · WhatsApp message builder. Degrades gracefully.
   ============================================================ */
(function () {
  "use strict";

  /* ⚠️ CONFIRMAR: número de WhatsApp conforme publicado no site atual.
     Ajuste aqui o número oficial (somente dígitos, com DDI+DDD).      */
  const WHATSAPP = "55319994858169";

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer:fine)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";
  const animate = !reduce && hasGSAP && hasST;

  if (animate) document.documentElement.classList.add("js");

  /* ---------- year ---------- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- WhatsApp helpers ---------- */
  const waURL = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  function wireWA() {
    const greet = "Olá, Módulo Engenharia! Gostaria de falar com a engenharia.";
    ["telLink", "telLink2", "fab", "waDirect"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("href", waURL(greet));
    });
  }
  wireWA();

  /* ============================================================
     PRELOADER
     ============================================================ */
  (function preloader() {
    const pl = document.getElementById("preloader");
    const bar = document.getElementById("plBar");
    const pct = document.getElementById("plPct");
    if (!pl) return;
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 16 + 6;
      if (p >= 100) { p = 100; clearInterval(tick); finish(); }
      if (bar) bar.style.width = p + "%";
      if (pct) pct.textContent = String(Math.round(p)).padStart(3, "0");
    }, 130);
    function finish() {
      setTimeout(() => {
        pl.classList.add("is-done");
        if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 600);
        document.dispatchEvent(new Event("modulo:ready"));
      }, 280);
    }
    // safety: never trap the page
    setTimeout(() => { clearInterval(tick); pl.classList.add("is-done"); }, 4000);
  })();

  /* ============================================================
     LENIS smooth scroll
     ============================================================ */
  let lenis = null;
  if (!reduce && hasLenis) {
    lenis = new Lenis({ lerp: 0.1, duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 });
    if (hasGSAP) {
      lenis.on("scroll", () => { if (hasST) ScrollTrigger.update(); });
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const onScroll = (fn) => {
    if (lenis) lenis.on("scroll", fn);
    window.addEventListener("scroll", fn, { passive: true });
  };

  /* ============================================================
     HERO — dust particles (canvas)
     ============================================================ */
  (function dust() {
    const c = document.getElementById("heroDust");
    const hero = document.getElementById("inicio");
    if (!c || !hero || reduce) return;
    const ctx = c.getContext("2d");
    let w, h, parts = [], raf, visible = true;
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) p.x = w + 5; if (p.x > w + 5) p.x = -5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,236,210,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf) frame(); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    size(); seed(); start();
    window.addEventListener("resize", () => { size(); seed(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((e) => {
        visible = e[0].isIntersecting; visible ? start() : stop();
      }, { threshold: 0.02 }).observe(hero);
    }
  })();

  /* ============================================================
     SCROLL TELEMETRY RAIL (signature) + section readout
     ============================================================ */
  (function rail() {
    const fill = document.getElementById("railFill");
    const dot = document.getElementById("railDot");
    const pct = document.getElementById("railPct");
    const secEl = document.getElementById("railSec");
    if (!fill) return;
    const map = [
      ["inicio", "INÍCIO"], ["sobre", "A EMPRESA"], ["servicos", "SERVIÇOS"],
      ["equipamentos", "CAMPO"], ["numeros", "DADOS"], ["processo", "MÉTODO"],
      ["atuacao", "SEGMENTOS"], ["contato", "CONTATO"],
    ].map(([id, label]) => ({ el: document.getElementById(id), label })).filter(s => s.el);

    function update() {
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const prog = clamp(window.scrollY / max, 0, 1);
      fill.style.height = (prog * 100) + "%";
      if (dot) dot.style.top = (prog * 100) + "%";
      if (pct) pct.textContent = String(Math.round(prog * 100)).padStart(2, "0") + "%";
      const center = window.scrollY + window.innerHeight * 0.5;
      let cur = map[0];
      for (const s of map) { if (s.el.offsetTop <= center) cur = s; }
      if (secEl && secEl.textContent !== cur.label) secEl.textContent = cur.label;
    }
    update(); onScroll(update); window.addEventListener("resize", update);
  })();

  /* ============================================================
     NAV state + mobile menu
     ============================================================ */
  (function nav() {
    const nav = document.getElementById("nav");
    const burger = document.getElementById("burger");
    const menu = document.getElementById("menu");
    if (nav) {
      const update = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
      update(); onScroll(update);
    }
    if (burger && menu && nav) {
      const toggle = (open) => {
        nav.classList.toggle("is-open", open);
        menu.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-hidden", String(!open));
        if (lenis) open ? lenis.stop() : lenis.start();
        document.body.style.overflow = open ? "hidden" : "";
      };
      burger.addEventListener("click", () => toggle(!menu.classList.contains("is-open")));
      menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));
    }
  })();

  /* ============================================================
     Smooth anchor scroll
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(t, { offset: -8, duration: 1.25 });
      else t.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ============================================================
     GSAP — reveals, parallax, hero, marquee, horizontal, counters
     ============================================================ */
  if (animate) {
    gsap.registerPlugin(ScrollTrigger);

    // reveals (batch, staggered)
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      onEnter: (els) => gsap.to(els, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, overwrite: true,
      }),
    });

    // hero parallax + scale + content drift
    const heroMedia = document.querySelector(".hero__media");
    if (heroMedia) {
      gsap.to(heroMedia, {
        yPercent: 16, scale: 1.16, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
    gsap.to(".hero__inner", {
      yPercent: -22, opacity: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 55%", scrub: true },
    });
    // subtle HUD crosshair drift
    gsap.to("#hudCross", { x: 10, y: -8, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // parallax frames
    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      const img = el.querySelector("img");
      if (!img) return;
      const amt = parseFloat(el.dataset.parallax) || 0.12;
      gsap.fromTo(img, { yPercent: -amt * 26 }, {
        yPercent: amt * 26, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // marquee loop
    const marquee = document.getElementById("marquee");
    if (marquee) {
      gsap.to(marquee, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
    }

    // counters
    gsap.utils.toArray("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count) || 0;
      const pre = el.dataset.prefix || "";
      const suf = el.dataset.suffix || "";
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 86%", once: true,
        onEnter: () => gsap.to(obj, {
          v: end, duration: 1.6, ease: "power2.out",
          onUpdate: () => { el.textContent = pre + Math.round(obj.v) + suf; },
        }),
      });
    });

    // horizontal pinned showcase (desktop)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 861px)", () => {
      const track = document.getElementById("equipTrack");
      const pin = document.getElementById("equipPin");
      if (!track || !pin) return;
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: "#equipamentos", start: "top top",
          end: () => "+=" + dist(), scrub: 0.6, pin: pin,
          anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      return () => tween.scrollTrigger && tween.scrollTrigger.kill();
    });
    mm.add("(max-width: 860px)", () => {
      document.getElementById("equipamentos")?.classList.add("equip--native");
    });

    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    // no animation: native horizontal scroll for showcase
    document.getElementById("equipamentos")?.classList.add("equip--native");
  }

  /* ============================================================
     INTERACTIVE — sector tabs
     ============================================================ */
  (function sectors() {
    const data = {
      mineracao: {
        title: "Mineração", badge: "MINERAÇÃO", img: "assets/img/empilhadeira.jpg",
        desc: "Automação e manutenção de máquinas de pátio, transportadores e plantas de beneficiamento — alta disponibilidade em ambiente abrasivo e crítico.",
        list: ["Recuperadoras e empilhadeiras", "Transportadores de longa distância", "Supervisório de pátio e beneficiamento"],
      },
      siderurgia: {
        title: "Siderurgia", badge: "SIDERURGIA", img: "assets/img/laminacao.jpg",
        desc: "Instrumentação e controle para processos de alta temperatura — do alto-forno à laminação, com foco em estabilidade e segurança operacional.",
        list: ["Instrumentação de alto-forno", "Controle de acionamento de laminação", "Elétrica e automação de planta"],
      },
      offshore: {
        title: "Offshore", badge: "OFFSHORE", img: "assets/img/offshore-2.jpg",
        desc: "Sistemas de controle e segurança para plataformas e navios-sonda, projetados para o ambiente mais exigente: o mar aberto.",
        list: ["Sistemas de controle e supervisão", "Intertravamentos de segurança", "Manutenção em ambiente crítico"],
      },
      energia: {
        title: "Energia", badge: "ENERGIA", img: "assets/img/paineis.jpg",
        desc: "Engenharia elétrica e painéis de potência e automação que garantem energia confiável e medida para toda a operação industrial.",
        list: ["Painéis de potência e comando", "Automação de subestações e CCM", "Eficiência e qualidade de energia"],
      },
    };
    const tabs = document.querySelectorAll(".seg-tab");
    const img = document.getElementById("secImg");
    const badge = document.getElementById("secBadge");
    const title = document.getElementById("secTitle");
    const desc = document.getElementById("secDesc");
    const list = document.getElementById("secList");
    const media = document.querySelector(".sectors__media");
    if (!tabs.length || !img) return;

    function swap(key) {
      const d = data[key]; if (!d) return;
      if (media) media.classList.add("is-swapping");
      setTimeout(() => {
        img.src = d.img; img.alt = d.title;
        badge.textContent = d.badge; title.textContent = d.title; desc.textContent = d.desc;
        list.innerHTML = d.list.map((x) => `<li>${x}</li>`).join("");
        if (media) media.classList.remove("is-swapping");
      }, 260);
    }
    tabs.forEach((t) => t.addEventListener("click", () => {
      tabs.forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
      t.classList.add("is-active"); t.setAttribute("aria-selected", "true");
      swap(t.dataset.sector);
    }));
  })();

  /* ============================================================
     INTERACTIVE — magnetic buttons (fine pointer only)
     ============================================================ */
  if (finePointer && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.32;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ============================================================
     CONTACT — chips + WhatsApp message builder
     ============================================================ */
  (function contact() {
    let seg = "";
    const chips = document.querySelectorAll(".chip");
    chips.forEach((c) => c.addEventListener("click", () => {
      const on = c.classList.contains("is-active");
      chips.forEach((x) => x.classList.remove("is-active"));
      if (!on) { c.classList.add("is-active"); seg = c.dataset.val; } else seg = "";
    }));

    const val = (id) => { const e = document.getElementById(id); return e ? e.value.trim() : ""; };
    function build() {
      const nome = val("cf-nome"), empresa = val("cf-empresa"), msg = val("cf-msg");
      const lines = [
        "Olá, Módulo Engenharia! ◆",
        nome ? (empresa ? `Sou ${nome}, da ${empresa}.` : `Sou ${nome}.`)
             : (empresa ? `Falo pela ${empresa}.` : "Quero falar com a engenharia."),
        `Segmento: ${seg || "a definir"}.`,
      ];
      if (msg) lines.push(`Desafio: ${msg}`);
      lines.push("Podemos conversar sobre um projeto?");
      return waURL(lines.join("\n"));
    }
    const form = document.getElementById("cform");
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.open(build(), "_blank", "noopener");
    });
  })();

})();

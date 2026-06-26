# Módulo Engenharia — Site v2 · Design Spec

**Date:** 2026-06-26
**Status:** Approved (with adjustments incorporated) — ready for implementation plan
**Author:** Claude (brainstorming session)

---

## 1. Context & goal

Evolve the existing one-page site for **Módulo Engenharia** (automation/engineering
for heavy industry: mineração, siderurgia, offshore, energia) into a production-grade,
multi-page **Astro** site with a cinematic, scroll-reactive hero. The current site
(`index.html`, `style.css`, `script.js`, `assets/img/`) is a polished vanilla one-pager;
its copy and design system are the source of truth for content and visual identity.

Two client briefings drive this: the original P0–P6 production brief and the **v2 briefing**
(cinematic hero + brand typography + anti-"AI look"). Where they conflict, v2 wins for the
hero and typography; everything else follows the approved Astro plan.

### Aesthetic north (priority order, from client)
1. **Cinematic hero**: a lone bucket-wheel excavator (Bagger 293 class) at sunset, scroll-reactive.
2. **Must not look like AI** — real, photographed, hand-made feel (film grain, natural light, texture).
   **This is the overriding constraint: real media is always preferred; AI is a last resort.**
3. **Typography that matches the logo** (one near-identical font family, ideally distinctive).
4. **Interactive + clean** at once (Apple/Stripe/Linear restraint + scroll storytelling).

### Honesty / positioning constraint (non-negotiable)
The excavator is a **symbol of the heavy-industry category**, **not** "Módulo's machine."
Módulo does **not** operate the Bagger 293. No copy, caption, alt text, or HUD label may
imply Módulo owns/operates it or claim any false capability. Hero text speaks to the
*category* (heavy industry, automation) — never "our machine."

---

## 2. Decisions locked (from brainstorming Q&A)

| Decision | Choice |
|---|---|
| Scope this round | **Full finish** — internal pages (P1) + production hardening (P2–P6) |
| Architecture | **Astro** static build, deployed to **Vercel** |
| Form backend | **Web3Forms** (host-agnostic), WhatsApp stays the **primary** action |
| Photo pipeline | Astro `<Image>`/`<Picture>` → webp/avif + srcset + lazy-load (keep existing client photos) |
| **Hero media** | **Real media first** (see §4.2 priority ladder). Site built/validated on the **real still hero**; AI frame-sequence is an **optional upgrade attempted last**, only if it passes frame-by-frame review |
| **Image licensing** | **No share-alike.** Use Pexels / Pixabay / Unsplash (commercial use OK, no attribution/share-alike obligation). Provenance + license recorded in `site.ts` regardless. **Avoid CC BY-SA.** |
| Typography | **A/B rendered comparison.** Working bet **Plus Jakarta Sans** (geometric-humanist, distinctive); **Poppins as the fidelity ruler** only. Single family for display + body |

### Feasibility confirmed
- Node 22.18 / npm 10.9 / git 2.52 present.
- Higgsfield MCP authenticated, **534 credits (Plus plan)** — reserved for the *optional* last-step AI upgrade only.
- FFmpeg not installed but obtainable (winget `Gyan.FFmpeg` / choco / portable static build).

---

## 3. Architecture (Astro)

**Safety first:** `git init` + commit the current site verbatim as the baseline
("baseline: site one-page original") before any change. All work is reversible.

```
modulo/
├── package.json · astro.config.mjs · vercel.json · .gitignore · tsconfig.json
├── public/
│   ├── assets/img/…            # current client photos (source)
│   ├── frames/desktop/ · frames/mobile/   # hero frames (from a real clip, or — last resort — AI)
│   ├── favicons/ · og-image.png
│   └── robots.txt
├── src/
│   ├── layouts/Base.astro      # <head>/SEO, preloader, rail, nav, mobile menu, footer, FAB, script include
│   ├── components/
│   │   ├── Seo.astro · JsonLd.astro · Nav.astro · Footer.astro · Rail.astro · Preloader.astro
│   │   ├── ContactSection.astro · CinematicHero.astro · SegmentPage.astro
│   │   └── (section components decomposed from the current home page)
│   ├── data/site.ts            # SINGLE editable source: contact, segments, services, nav, metrics, ⚠️ placeholders, media provenance/license
│   ├── pages/  index · mineracao · siderurgia · offshore · energia · servicos · sobre · contato · biblioteca
│   ├── scripts/main.ts         # current script.js refactored; imports gsap/scrolltrigger/lenis via npm
│   └── styles/global.css       # current style.css + internal-page styles + grain/grade layer
```

The home page keeps all current sections (Sobre, Serviços, Equipamentos, Números, Processo,
Atuação, Contato, Footer) — decomposed into components, **not redesigned**. Only the **hero**
and the **typography** change. Everything degrades gracefully (the existing script is already
defensively guarded with `if (!el) return`).

---

## 4. PRIORITY 1 — Cinematic scroll hero

### 4.1 Concept — "O Colosso ao Entardecer"
A single bucket-wheel excavator in silhouette/backlight against an incandescent sunset.
Clean scene: only machine, sky, earth. One slow continuous camera move (push-in / pull-back),
no cuts. As the user scrolls, the camera/sequence advances on a canvas; the title + technical HUD
fade/parallax over it. Brand red converses with the sun. Below the fold, a smooth transition to
the light, clean site. Copy speaks to the **category**, never claims the machine as Módulo's.

### 4.2 Media priority ladder (real first — the core change)
Build downward only when the tier above genuinely fails. **Real media is the goal; AI is last.**

1. **Tier 1 — Real licensed VIDEO clip → frame sequence.** Search hard for a commercial-use,
   no-share-alike clip (Pexels, Pixabay, Coverr, Mixkit, Videvo) of a bucket-wheel excavator at
   golden hour with slow continuous motion / no cuts. If found and it passes a hard-cut preview,
   extract frames (FFmpeg) → canvas scroll-video. **Zero AI.**
2. **Tier 2 — Real high-res PHOTO + scroll camera move (THE GUARANTEED FLOOR).** A commercial,
   no-share-alike high-res still (Pexels/Pixabay/Unsplash) of a bucket-wheel excavator at golden
   hour — or, accepted as a *category symbol*, a clean sunset excavator silhouette. Drive a
   scroll-linked cinematic camera move on it: slow scale/push-in + multi-layer parallax (machine vs
   sky) + dust canvas + film grain + HUD reveal. **This is what the entire site is built and
   validated on first.** It is also the `prefers-reduced-motion` / no-JS fallback.
3. **Tier 3 — AI frame-sequence (LAST RESORT, optional upgrade attempted at the very end).**
   Only if Tiers 1–2 are unsatisfying *and* the user wants more motion. Anchored to a real
   no-share-alike reference still, image→video (Higgsfield/Kling), slow pull-back, upscale, then
   **frame-by-frame human review**. Swap in **only if it passes the no-AI-look bar**; otherwise
   keep Tier 2. **Do not burn the 534 credits speculatively; do not block the build on generation.**

### 4.3 Dual-mode hero component
`CinematicHero.astro` renders one of two modes from `site.ts` config, so generation/quality never
breaks the site:
- **`mode: "still"`** (default, ships first) — Tier 2: real photo + scroll camera move + parallax +
  grain. Also the reduced-motion / no-JS fallback.
- **`mode: "frames"`** — Tier 1 (real clip) or, last resort, Tier 3 (AI): canvas frame-sequence,
  scroll-scrubbed. Selected only when a vetted frame set exists in `public/frames/`.

The static poster (still image or first frame) + title always render server-side; canvas scrubbing
is progressive enhancement (works with JS off, reduced motion, or frames absent).

### 4.4 Frame-sequence engineering (when a frame set exists — Tier 1 or 3)
- Hero section taller than viewport, canvas **`sticky`** inside: **~300vh desktop / ~200svh mobile**
  (`svh`/`dvh`, never raw `100vh`).
- **Preload** frames with a progress bar — reuse the existing preloader (bar + %).
- Draw with **cover**: `Math.max(cw/iw, ch/ih)` (no white borders).
- **DPR cap**: `Math.min(devicePixelRatio, 2)` desktop, `1.5` mobile.
- **rAF easing**: `eased += (target - eased) * 0.18` (tunable 0.10–0.25).
- **scroll→frame map** via the hero's `getBoundingClientRect`; integrate with **Lenis** on the GSAP ticker.
- **Per-device frame sets** via `matchMedia`: desktop ~120–150 frames @1280px; mobile ~60–80 @900px;
  **WebP**, ~40–120 KB/frame. FFmpeg extraction: `fps = frame_count ÷ clip_duration`.

### 4.5 Tier-3 AI pipeline (only if reached)
Reference = a **no-share-alike** (Pexels/Pixabay/Unsplash) golden-hour bucket-wheel still.
Steps: check `get_cost`/`balance` and **confirm spend with user**, `media_import_url` the reference,
`generate_video` image→video (Kling) with a photographic prompt (*slow continuous pull-back,
golden-hour backlight, lone bucket-wheel excavator, fine film grain, volumetric dusk haze, no cuts,
photoreal, 35–85mm*, ~5s, slow motion to limit lattice warping), `upscale_video`, download, FFmpeg →
WebP sets, **frame-by-frame review** (reject warped truss / impossible mechanics / plastic sky).
**Honesty:** if used, the final report states the hero is AI-generated from a real reference;
provenance recorded in `site.ts`. Never described as a real photograph.

### 4.6 Overlay & reduced motion
- Title (brand font), subtitle (mission, category-framed), 2 CTAs ("Iniciar um projeto" / "Ver
  atuação"), technical HUD (corners, FIG.01, ESCALA, SISTEMA ATIVO, crosshair) — reuse/adapt current
  HUD; HUD labels must not imply ownership. Text fade/parallax on scroll; scrim + `text-shadow` for legibility.
- `prefers-reduced-motion`: static poster + title, no scrub, no looping canvas.

---

## 5. PRIORITY 2 — Typography matching the logo

The logo is a rounded geometric-humanist sans ("Módulo" graphite, "Engenharia" red; near-circular
`o`, even strokes). Current Archivo + IBM Plex does **not** match — replace.

- **Decision method:** build a small rendered A/B page showing "Módulo Engenharia" + display/body
  samples in each candidate over `logo-original.png`; pick the most faithful *and* distinctive.
- **Working bet: Plus Jakarta Sans** — same geometric-humanist DNA as the logo, less ubiquitous
  (client wants a *single, distinctive* font). **Poppins is the fidelity ruler only** (faithful but
  overused). A/B pool if needed: Sansation, Hanken Grotesk, Montserrat.
- Chosen family used for **display (700–800)** and **body (400–500)** for full brand cohesion.
- **Mono accent** for HUD/coordinates retained (IBM Plex Mono or Space Mono) — small accent, not the voice.
- **Wordmark** (nav/footer) recreated as **SVG** to match the logo lockup exactly, independent of body font.
- Self-host via `@fontsource` / Fontshare. Update `:root` font tokens; remove old font references.

---

## 6. PRIORITY 3 — Anti-"AI look" imagery treatment

Make the existing real-but-upscaled photos feel like one cohesive, hand-shot editorial:
- Replace with high-res where the client provides it (placeholder-tracked). Otherwise keep, but apply treatment.
- **Cohesive color grade** across all images (consistent temperature/contrast) — consistent CSS overlay
  (non-destructive) and/or `sharp` at build.
- **Subtle global film grain** (~3–5% opacity noise overlay) site-wide for the hand-made, anti-plastic feel.
- **Subtle vignette** + existing technical corner marks reinforce "real field capture."
- Restraint — realism comes from coherent light + grain + framing, not flashy filters.

---

## 7. Internal pages (P1)

Eight pages reusing the design system:
- `/mineracao` `/siderurgia` `/offshore` `/energia` — one shared **`SegmentPage`** template driven by
  `site.ts`: segment hero (existing photo + HUD), expanded description (from existing copy), relevant
  capabilities, equipment strip, a **cases block as marked placeholders**, shared contact section.
- `/servicos` `/sobre` `/contato` `/biblioteca` — same shell. `/biblioteca` is a downloads/docs scaffold
  with an empty-state until files are supplied.
- Footer + "Conversar sobre este segmento" buttons now link to the real pages.

**Content rule:** reuse and expand the client's existing professional Portuguese copy + the official
mission statement. **Invent no** cases, numbers, or claims — those are visible placeholders. Respect
the honesty/positioning constraint (§1) throughout.

---

## 8. Production hardening (P2–P6)

- **P2 Form:** WhatsApp stays the primary CTA (current message builder kept). Add an email path via
  **Web3Forms**: AJAX submit, validation, **honeypot**, loading/success/error states. Access key is a
  `site.ts` placeholder.
- **P3 SEO/data:** per-page title/description/canonical/OG; **JSON-LD** `Organization`/`LocalBusiness`;
  generated `sitemap.xml` (`@astrojs/sitemap`); `robots.txt`; full favicon set; dedicated **1200×630 OG
  image** from the brand. CNPJ/CREA/address/metrics are marked placeholders in `site.ts`.
- **P4 Performance:** self-host fonts (`@fontsource`) and **self-host GSAP/ScrollTrigger/Lenis via npm**
  (no CDN). Astro minifies/tree-shakes; `vercel.json` cache headers. Hero frames lazy/preloaded smartly.
- **P0/P4 Photos:** Astro `<Image>`/`<Picture>` → webp/avif + srcset; below-the-fold lazy. `⚠️ real
  high-res originals still needed` noted. No external uploads of client photos, no AI fabrication of them.
- **P5 Accessibility:** skip-link, visible focus, **arrow-key navigation on segment tabs** (proper
  `tablist`), keyboard-operable mobile menu, hero-text contrast check.

---

## 9. Interaction suite (preserve/upgrade)

- **Lenis** smooth scroll (desktop wheel; native touch on mobile).
- **Hero scroll-video / camera move** (§4) — centerpiece.
- **Horizontal pinned gallery** `#equipamentos`: desktop only (`min-width:861px`, `scrub:0.6`,
  `invalidateOnRefresh:true`); mobile native swipe (`overflow-x:auto; scroll-snap`).
- **Parallax** on framed images (`scale(1.1)` to hide edges).
- **Signature SVG stroke**: convert the telemetry "rail" into an SVG path that draws with
  `stroke-dasharray`/`dashoffset` on scroll (`vector-effect="non-scaling-stroke"`).
- **Reveals** (`ScrollTrigger.batch`), **sector tabs** (now keyboard-navigable), **magnetic buttons**
  (`pointer:fine` only), **WhatsApp builder** (kept).
- Everything via `gsap.matchMedia()` for per-device behavior; graceful degradation throughout; touch targets ≥44px.

---

## 10. Single source of content & placeholders — `site.ts`

Centralized, each `⚠️`-marked for one-place editing:
- **WhatsApp number** — current code has `55319994858169`; published "+55 31 999485 8169" is
  ambiguous (both `99948-5816` and `99485-8169` are plausible — one extra digit). Use
  **`5531999485816`** as a **loud placeholder**; **do NOT publish without client confirmation.**
- **Metrics** (`+15 anos`, `+120 projetos`, `99%`) — illustrative; "4 segmentos" is real.
- **CNPJ / CREA / address.**
- **Web3Forms access key.**
- **Internal-page cases** and **Biblioteca files.**
- **Hero + image media provenance/license** (source, URL, license — must be commercial/no-share-alike).

---

## 11. Verification (report real output, not promises)

1. `npm run build` succeeds.
2. `npm run dev`: home renders with the **real-still hero** working — scroll camera move, parallax,
   reduced-motion fallback. (Frame-sequence path validated if/when a vetted frame set exists.)
3. Internal pages render; segment links resolve.
4. **Lighthouse** run for real (target 90+ Performance/SEO/Best Practices/Accessibility); paste real numbers.
5. Mobile checks: `svh`, native swipe, lean assets, no pin.
6. `prefers-reduced-motion`: static hero, no scrub.

---

## 12. Risks & mitigations

| Risk | Mitigation |
|---|---|
| No real golden-hour bucket-wheel clip/photo exists (Tier 1/2 thin) | Accept a clean sunset excavator silhouette as a **category symbol** (per §1); Tier-2 still + scroll camera move is the guaranteed floor |
| AI video warps the steel lattice ("looks like AI") | Tier 3 is last resort + optional; short/slow motion, real reference, upscale, frame-by-frame review; keep Tier-2 still if it fails |
| Burning credits / blocking the build on AI | Build & validate entirely on the real still first; AI attempted only at the end, with cost confirmed before spend |
| Licensing obligation (share-alike) | Use Pexels/Pixabay/Unsplash commercial, no-share-alike only; record provenance in `site.ts`; avoid CC BY-SA |
| False-capability implication (owning the Bagger) | Copy/alt/HUD framed as category symbol; explicit honesty review of hero text |
| Astro migration regresses the look | Git baseline first; decompose without redesign; visual diff of home vs current |
| FFmpeg not installed | Install via winget/choco or portable static build during setup |

---

## 13. Out of scope / blocked on client

Real high-res photos of the client's own work; confirmed WhatsApp number; real metrics; CNPJ/CREA/address;
Web3Forms key; internal-page case content; Biblioteca files; custom domain DNS. All wired as placeholders
so swap-in is a one-file (`site.ts`) edit (plus DNS at deploy).

---

## 14. Definition of done (this round)

- Astro project builds and deploys to Vercel (config in repo; actual deploy on user request).
- Home with the **real-still cinematic hero** (scroll camera move) + new brand typography; AI/real-clip
  frame-sequence wired as a drop-in upgrade if a vetted frame set is produced.
- 8 internal pages live, linked, content from existing copy + placeholders, honesty-constraint respected.
- Web3Forms email path + WhatsApp primary; SEO/JSON-LD/sitemap/robots/favicons/OG; self-hosted fonts + libs;
  responsive image pipeline; accessibility pass.
- Lighthouse measured; provenance/placeholders centralized; honest final report on hero provenance and what remains client-blocked.

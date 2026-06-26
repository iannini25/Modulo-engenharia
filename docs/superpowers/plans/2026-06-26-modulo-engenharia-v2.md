# Módulo Engenharia v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the existing vanilla one-pager to a production Astro site with a cinematic real-media scroll hero, logo-matching typography, 8 internal pages, and full production hardening — deployable to Vercel.

**Architecture:** Astro static site. The current home is decomposed into components without redesign; only the hero and typography change. All editable content + placeholders live in one `src/data/site.ts`. The hero is a dual-mode component that ships on a *real* still photo with a scroll camera move (the guaranteed floor) and can later swap to a vetted frame-sequence (real clip first; AI only as a last-resort upgrade). GSAP/ScrollTrigger/Lenis and fonts are self-hosted via npm — no CDN in production.

**Tech Stack:** Astro 4, TypeScript, GSAP + ScrollTrigger, Lenis, `@fontsource` (Plus Jakarta Sans / IBM Plex Mono), `sharp` (Astro `<Image>`), `@astrojs/sitemap`, Web3Forms, vitest, deploy to Vercel.

## Global Constraints

- **Git baseline first:** `git init` + commit the pristine original site before any change. Every change reversible.
- **No redesign** of existing sections — only hero + typography change. Visual parity with the current home for all other sections.
- **Real media first for the hero.** Priority ladder: (1) real licensed clip → frames; (2) real high-res photo + scroll camera move (the floor the whole site is built/validated on); (3) AI frames only last, only if they pass frame-by-frame review. Do NOT block the build on AI; do NOT spend Higgsfield credits without confirming cost with the user first.
- **Licensing:** hero/reference imagery must be **Pexels / Pixabay / Unsplash, commercial use, NO share-alike**. Avoid CC BY-SA. Record every media source + license in `site.ts`.
- **Honesty / positioning:** the excavator is a **symbol of the category**, never "Módulo's machine" (Módulo does not operate the Bagger 293). No copy/alt/HUD text may imply ownership or false capability.
- **No invented data:** metrics, cases, CNPJ/CREA/address, WhatsApp number stay as `⚠️`-marked placeholders in `site.ts`. WhatsApp placeholder `5531999485816` — **never publish without client confirmation.**
- **Typography:** single logo-matching family for display + body. Working bet **Plus Jakarta Sans**; Poppins is the fidelity ruler only. Decide via a rendered A/B over `logo-original.png`.
- **Accessibility:** skip-link, visible focus, `tablist` arrow-key nav, keyboard-operable mobile menu, ≥44px touch targets, `prefers-reduced-motion` honored everywhere.
- **Self-host** all fonts and GSAP/ScrollTrigger/Lenis (no CDN).
- **Brand tokens unchanged:** `--red:#BE1622`, `--red-700:#8C1016`, `--red-500:#E11D2A`, `--ink:#14171A`, `--bg:#F4F5F6`.

---

## File structure (created/modified across the plan)

```
modulo/
├── package.json · astro.config.mjs · tsconfig.json · vitest.config.ts · vercel.json · .gitignore
├── public/
│   ├── assets/img/…                  # existing client photos (moved here)
│   ├── hero/                          # real hero still(s) + poster
│   ├── frames/desktop/ · frames/mobile/   # OPTIONAL frame sets (Phase 5)
│   ├── favicons/ · og-image.png · robots.txt
├── src/
│   ├── data/site.ts                  # single source of content + placeholders + media provenance
│   ├── lib/wa.ts                     # WhatsApp URL + message builder (pure, tested)
│   ├── lib/form.ts                   # Web3Forms payload builder + honeypot (pure, tested)
│   ├── layouts/Base.astro
│   ├── components/ Seo.astro · JsonLd.astro · Nav.astro · MobileMenu.astro · Footer.astro ·
│   │               Rail.astro · Preloader.astro · Fab.astro · CinematicHero.astro ·
│   │               ContactSection.astro · SegmentPage.astro · EquipShowcase.astro ·
│   │               Services.astro · Manifesto.astro · Stats.astro · Process.astro · Sectors.astro
│   ├── pages/ index.astro · mineracao.astro · siderurgia.astro · offshore.astro · energia.astro ·
│   │          servicos.astro · sobre.astro · contato.astro · biblioteca.astro · type-test.astro (temp)
│   ├── scripts/main.ts               # refactored script.js
│   └── styles/global.css             # style.css + internal-page styles + grain/grade layer
└── tests/  site.test.ts · wa.test.ts · form.test.ts · build-smoke.test.ts
```

---

# PHASE 0 — Baseline & Astro foundation

### Task 0.1: Git baseline of the original site

**Files:** none created; snapshots existing tree.

- [ ] **Step 1: Initialize git and ignore nothing yet**
Run: `git init && git add -A && git status --short`
Expected: original files staged (index.html, style.css, script.js, assets/, README.md, CLAUDE_CODE_BRIEF.md, docs/).

- [ ] **Step 2: Commit the baseline**
```bash
git commit -m "baseline: site one-page original (pre-Astro)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
Expected: one commit on the default branch.

- [ ] **Step 3: Create a working branch**
Run: `git checkout -b astro-migration`
Expected: switched to `astro-migration`.

---

### Task 0.2: Scaffold Astro + dependencies + move assets

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- Move: `assets/img/*` → `public/assets/img/*`
- Create: `src/pages/index.astro` (temporary minimal)

**Interfaces:**
- Produces: a buildable Astro project; `public/assets/img/...` paths for all images.

- [ ] **Step 1: Create `package.json`**
```json
{
  "name": "modulo-engenharia",
  "type": "module",
  "version": "2.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^4.16.0",
    "@astrojs/sitemap": "^3.2.0",
    "sharp": "^0.33.5",
    "gsap": "^3.12.5",
    "lenis": "^1.1.14",
    "@fontsource-variable/plus-jakarta-sans": "^5.1.0",
    "@fontsource/ibm-plex-mono": "^5.1.0"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://moduloengenharia.com.br',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
```

- [ ] **Step 3: Create `tsconfig.json`**
```json
{ "extends": "astro/tsconfigs/strict", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"] }
```

- [ ] **Step 4: Create `.gitignore`**
```
node_modules/
dist/
.astro/
.vercel/
.DS_Store
*.log
```

- [ ] **Step 5: Move images into `public/`**
Run: `mkdir -p public/assets/img && git mv assets/img/* public/assets/img/ && rmdir assets/img assets`
Expected: images now under `public/assets/img/`. (Keep `logo-original.png` there too.)

- [ ] **Step 6: Minimal index to prove the build**
Create `src/pages/index.astro`:
```astro
---
---
<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Módulo</title></head>
<body><h1>Módulo — build OK</h1></body></html>
```

- [ ] **Step 7: Install and build**
Run: `npm install && npm run build`
Expected: `dist/` produced, no errors.

- [ ] **Step 8: Commit**
```bash
git add -A
git commit -m "chore: scaffold Astro project, move assets to public/"
```

---

### Task 0.3: Test harness (vitest) + first smoke test

**Files:**
- Create: `vitest.config.ts`, `tests/build-smoke.test.ts`

**Interfaces:**
- Produces: `npm test` runs vitest; a smoke test asserting the built home page exists and contains a landmark.

- [ ] **Step 1: Create `vitest.config.ts`**
```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['tests/**/*.test.ts'] } });
```

- [ ] **Step 2: Write the failing smoke test** (`tests/build-smoke.test.ts`)
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

describe('build output', () => {
  it('produces a home page with the build-OK landmark', () => {
    const p = 'dist/index.html';
    expect(existsSync(p), 'run `npm run build` first').toBe(true);
    expect(readFileSync(p, 'utf8')).toContain('build OK');
  });
});
```

- [ ] **Step 3: Run it after a build**
Run: `npm run build && npm test`
Expected: PASS (1 test).

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "test: add vitest + build smoke test"
```

---

# PHASE 1 — Home migration (no redesign)

### Task 1.1: Port the stylesheet

**Files:**
- Create: `src/styles/global.css` (verbatim copy of current `style.css`)
- Delete: `style.css` (now superseded; tracked in baseline)

- [ ] **Step 1: Copy CSS**
Run: `git mv style.css src/styles/global.css`
Expected: file moved; contents unchanged.

- [ ] **Step 2: Commit** `git add -A && git commit -m "refactor: move style.css to src/styles/global.css"`

---

### Task 1.2: Content model `site.ts` + integrity test

**Files:**
- Create: `src/data/site.ts`, `tests/site.test.ts`

**Interfaces:**
- Produces:
  - `site` object with: `contact { whatsappDigits: string; whatsappConfirmed: boolean; email; baseLocation }`,
    `brand { name; tagline; mission }`, `nav: {label;href}[]`, `services: {code;title;desc}[]`,
    `segments: Record<'mineracao'|'siderurgia'|'offshore'|'energia', Segment>`,
    `metrics: {value;label;illustrative:boolean}[]`, `legal { cnpj; crea; address }`,
    `forms { web3formsKey: string }`, `media: MediaCredit[]`.
  - `type Segment = { slug; title; badge; img; intro; description; capabilities: string[]; cases: Case[] }`
  - `type Case = { title; summary; placeholder: true }`
  - `type MediaCredit = { id; source; url; license; author? }`

- [ ] **Step 1: Write the failing test** (`tests/site.test.ts`)
```ts
import { describe, it, expect } from 'vitest';
import { site } from '../src/data/site';

describe('site.ts content model', () => {
  it('flags the WhatsApp number as unconfirmed placeholder', () => {
    expect(site.contact.whatsappConfirmed).toBe(false);
    expect(site.contact.whatsappDigits).toBe('5531999485816');
  });
  it('has all four segments with non-empty copy', () => {
    for (const k of ['mineracao','siderurgia','offshore','energia'] as const) {
      const s = site.segments[k];
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.description.length).toBeGreaterThan(20);
      expect(s.capabilities.length).toBeGreaterThanOrEqual(3);
    }
  });
  it('marks illustrative metrics and keeps "4 segmentos" real', () => {
    const seg = site.metrics.find(m => /segmento/i.test(m.label));
    expect(seg?.illustrative).toBe(false);
    expect(site.metrics.some(m => m.illustrative)).toBe(true);
  });
  it('records media provenance with non-share-alike licenses', () => {
    expect(site.media.length).toBeGreaterThan(0);
    for (const m of site.media) expect(m.license).not.toMatch(/BY-SA|ShareAlike/i);
  });
});
```

- [ ] **Step 2: Run to verify it fails**
Run: `npm test -- tests/site.test.ts`
Expected: FAIL (cannot find `src/data/site`).

- [ ] **Step 3: Implement `src/data/site.ts`** — populate from the existing copy in `index.html` and the `sectors()` data in the baseline `script.js`. Full types + data:
```ts
export type Case = { title: string; summary: string; placeholder: true };
export type Segment = {
  slug: string; title: string; badge: string; img: string;
  intro: string; description: string; capabilities: string[]; cases: Case[];
};
export type MediaCredit = { id: string; source: string; url: string; license: string; author?: string };

export const site = {
  brand: {
    name: 'Módulo Engenharia',
    tagline: 'Automação e engenharia para a indústria pesada.',
    mission:
      'A Módulo Engenharia procura o aumento da eficiência, maximizando a produtividade e a ' +
      'qualidade através de softwares e hardwares que melhoram a segurança, produtividade, ' +
      'qualidade e informação, além de reduzir o esforço ou a interferência humana sobre o ' +
      'processo ou máquina.',
  },
  contact: {
    whatsappDigits: '5531999485816',   // ⚠️ PLACEHOLDER — confirmar com o cliente antes de publicar
    whatsappConfirmed: false,
    email: 'rodolfocintra.modulo@gmail.com',
    baseLocation: 'Minas Gerais — Brasil',
  },
  nav: [
    { label: 'Sobre', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Mineração', href: '/mineracao' },
    { label: 'Siderurgia', href: '/siderurgia' },
    { label: 'Offshore', href: '/offshore' },
    { label: 'Energia', href: '/energia' },
  ],
  services: [
    { code: 'S—01', title: 'Automação & Controle de Processos', desc: 'Lógica de CLP, supervisórios SCADA, redes industriais e integração de chão de fábrica. Mais visibilidade, menos parada.' },
    { code: 'S—02', title: 'Engenharia Elétrica & Instrumentação', desc: 'Projeto, dimensionamento e montagem de painéis, sensores e malhas de instrumentação calibradas para ambiente severo.' },
    { code: 'S—03', title: 'Máquinas de Pátio', desc: 'Empilhadeiras e recuperadoras: automação, modernização e retrofit de controle para operação contínua e segura.' },
    { code: 'S—04', title: 'Transportadores de Correia', desc: 'Proteções, pesagem, intertravamentos e controle de acionamento para longas distâncias com alta disponibilidade.' },
    { code: 'S—05', title: 'Montagem & Manutenção Eletromecânica', desc: 'Equipes em campo para montagem, paradas programadas e manutenção corretiva com foco em retorno rápido à produção.' },
    { code: 'S—06', title: 'Comissionamento & Start-up', desc: 'Testes, loop-check e partida assistida. Entregamos o sistema validado, documentado e pronto para operar.' },
  ],
  segments: {
    mineracao: {
      slug: 'mineracao', title: 'Mineração', badge: 'MINERAÇÃO', img: '/assets/img/empilhadeira.jpg',
      intro: 'Disponibilidade alta em ambiente abrasivo e crítico.',
      description: 'Automação e manutenção de máquinas de pátio, transportadores e plantas de beneficiamento — alta disponibilidade em ambiente abrasivo e crítico.',
      capabilities: ['Recuperadoras e empilhadeiras', 'Transportadores de longa distância', 'Supervisório de pátio e beneficiamento'],
      cases: [{ title: 'Case a confirmar', summary: '⚠️ Placeholder — case real a ser fornecido pelo cliente.', placeholder: true }],
    },
    siderurgia: {
      slug: 'siderurgia', title: 'Siderurgia', badge: 'SIDERURGIA', img: '/assets/img/laminacao.jpg',
      intro: 'Estabilidade e segurança em processos de alta temperatura.',
      description: 'Instrumentação e controle para processos de alta temperatura — do alto-forno à laminação, com foco em estabilidade e segurança operacional.',
      capabilities: ['Instrumentação de alto-forno', 'Controle de acionamento de laminação', 'Elétrica e automação de planta'],
      cases: [{ title: 'Case a confirmar', summary: '⚠️ Placeholder — case real a ser fornecido pelo cliente.', placeholder: true }],
    },
    offshore: {
      slug: 'offshore', title: 'Offshore', badge: 'OFFSHORE', img: '/assets/img/offshore-2.jpg',
      intro: 'Controle e segurança no ambiente mais exigente: o mar aberto.',
      description: 'Sistemas de controle e segurança para plataformas e navios-sonda, projetados para o ambiente mais exigente: o mar aberto.',
      capabilities: ['Sistemas de controle e supervisão', 'Intertravamentos de segurança', 'Manutenção em ambiente crítico'],
      cases: [{ title: 'Case a confirmar', summary: '⚠️ Placeholder — case real a ser fornecido pelo cliente.', placeholder: true }],
    },
    energia: {
      slug: 'energia', title: 'Energia', badge: 'ENERGIA', img: '/assets/img/paineis.jpg',
      intro: 'Energia confiável e medida para toda a operação industrial.',
      description: 'Engenharia elétrica e painéis de potência e automação que garantem energia confiável e medida para toda a operação industrial.',
      capabilities: ['Painéis de potência e comando', 'Automação de subestações e CCM', 'Eficiência e qualidade de energia'],
      cases: [{ title: 'Case a confirmar', summary: '⚠️ Placeholder — case real a ser fornecido pelo cliente.', placeholder: true }],
    },
  } satisfies Record<string, Segment>,
  metrics: [
    { value: '4', prefix: '', suffix: '', label: 'Segmentos atendidos', illustrative: false },
    { value: '15', prefix: '+', suffix: '', label: 'Anos de campo', illustrative: true },
    { value: '120', prefix: '+', suffix: '', label: 'Projetos entregues', illustrative: true },
    { value: '99', prefix: '', suffix: '%', label: 'Disponibilidade média', illustrative: true },
  ],
  legal: {
    cnpj: '00.000.000/0000-00',  // ⚠️ PLACEHOLDER
    crea: '',                     // ⚠️ PLACEHOLDER (se aplicável)
    address: '',                  // ⚠️ PLACEHOLDER
  },
  forms: { web3formsKey: 'WEB3FORMS_ACCESS_KEY_PLACEHOLDER' }, // ⚠️ PLACEHOLDER
  media: [
    // Filled in Task 2.2 once the real hero still is chosen (Pexels/Pixabay/Unsplash, no share-alike).
  ] as MediaCredit[],
};
```

- [ ] **Step 4: Run tests** — `npm test -- tests/site.test.ts`. The media test will fail until Task 2.2; temporarily add one placeholder MediaCredit with license `'Pexels License'` to make the suite green, OR mark that assertion `.todo`. Choose the placeholder MediaCredit approach:
```ts
media: [{ id: 'hero', source: 'pending', url: 'pending', license: 'Pexels License' }] as MediaCredit[],
```
Expected: PASS.

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: site.ts content model + integrity tests"`

---

### Task 1.3: WhatsApp builder library + tests

**Files:** Create `src/lib/wa.ts`, `tests/wa.test.ts`

**Interfaces:**
- Produces: `waURL(digits: string, text: string): string`; `buildContactMessage(input: {nome?;empresa?;seg?;msg?}): string`; `greetingURL(digits: string): string`.

- [ ] **Step 1: Failing test** (`tests/wa.test.ts`)
```ts
import { describe, it, expect } from 'vitest';
import { waURL, buildContactMessage } from '../src/lib/wa';

describe('wa', () => {
  it('builds a wa.me url with encoded text', () => {
    expect(waURL('5531999485816', 'olá mundo')).toBe('https://wa.me/5531999485816?text=ol%C3%A1%20mundo');
  });
  it('composes a message with name + company + segment', () => {
    const m = buildContactMessage({ nome: 'Ana', empresa: 'ACME', seg: 'Mineração', msg: 'reduzir paradas' });
    expect(m).toContain('Sou Ana, da ACME.');
    expect(m).toContain('Segmento: Mineração.');
    expect(m).toContain('Desafio: reduzir paradas');
  });
  it('falls back gracefully with no input', () => {
    expect(buildContactMessage({})).toContain('Segmento: a definir.');
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- tests/wa.test.ts`

- [ ] **Step 3: Implement `src/lib/wa.ts`**
```ts
export const waURL = (digits: string, text: string) =>
  `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;

export function buildContactMessage(i: { nome?: string; empresa?: string; seg?: string; msg?: string }): string {
  const { nome = '', empresa = '', seg = '', msg = '' } = i;
  const who = nome ? (empresa ? `Sou ${nome}, da ${empresa}.` : `Sou ${nome}.`)
                   : (empresa ? `Falo pela ${empresa}.` : 'Quero falar com a engenharia.');
  const lines = ['Olá, Módulo Engenharia! ◆', who, `Segmento: ${seg || 'a definir'}.`];
  if (msg) lines.push(`Desafio: ${msg}`);
  lines.push('Podemos conversar sobre um projeto?');
  return lines.join('\n');
}

export const greetingURL = (digits: string) =>
  waURL(digits, 'Olá, Módulo Engenharia! Gostaria de falar com a engenharia.');
```

- [ ] **Step 4: Run → PASS.** `npm test -- tests/wa.test.ts`
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: WhatsApp url/message builder + tests"`

---

### Task 1.4: Base layout + chrome components (Nav, MobileMenu, Footer, Rail, Preloader, Fab)

**Files:** Create `src/layouts/Base.astro`, `src/components/{Nav,MobileMenu,Footer,Rail,Preloader,Fab,Seo}.astro`

**Interfaces:**
- Consumes: `site` from `site.ts`; `greetingURL` from `wa.ts`.
- Produces: `Base.astro` props `{ title: string; description: string; canonical?: string; ogImage?: string }` with a `<slot/>`; renders preloader, rail, nav, mobile menu, `<slot/>`, footer, FAB, and `<script src>` to `main.ts`.

- [ ] **Step 1:** Build `Seo.astro` (a stub for now — `<title>`, `<meta description>`, `theme-color`, OG basics from props; full version in Task 4.1).
- [ ] **Step 2:** Port the header/nav, mobile menu, footer, rail, preloader, FAB markup **verbatim** from baseline `index.html` into the respective components, replacing hard-coded nav/contact with `site` values and WhatsApp links with `greetingURL(site.contact.whatsappDigits)`. Recreate the brand wordmark SVG as in the baseline (logo lockup; refined in Task 2.1).
- [ ] **Step 3:** `Base.astro` imports `global.css`, the `@fontsource` packages, composes the chrome around `<slot/>`, and includes `<script>import '../scripts/main.ts'</script>`.
- [ ] **Step 4: Verify build** — temporarily wrap the minimal index in `Base`. Run: `npm run build` → expect success; `dist/index.html` contains `class="nav"`, `class="footer"`, `id="preloader"`.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: Base layout + chrome components from baseline markup"`

---

### Task 1.5: Home section components + `index.astro`

**Files:** Create `src/components/{Manifesto,Services,EquipShowcase,Stats,Process,Sectors,ContactSection,CinematicHero}.astro`; rewrite `src/pages/index.astro`.

**Interfaces:**
- Consumes: `site`. `CinematicHero` here is a **temporary** still using the current `hero_empilhadeira.jpg` (replaced in Phase 2). `Sectors` reads `site.segments`. `Services` reads `site.services`. `Stats` reads `site.metrics`.
- Produces: a home page visually equivalent to the baseline (minus the hero/type changes coming next).

- [ ] **Step 1:** Port each section's markup verbatim from baseline `index.html` into its component; swap repeated data (services, metrics, sectors, contact) to read from `site`. `ContactSection` keeps the WhatsApp message builder form.
- [ ] **Step 2:** `index.astro` composes: `Hero → Manifesto → Services → EquipShowcase → Stats → Process → Sectors → ContactSection`, inside `Base` with home SEO props.
- [ ] **Step 3: Visual parity check** — `npm run dev`, open `/`, compare against the baseline `index.html` (open the original in a second tab from git: `git show HEAD~N:index.html`). Confirm all sections present and styled. Note: animations wired in Task 1.6.
- [ ] **Step 4: Update smoke test** — change `tests/build-smoke.test.ts` to assert `dist/index.html` contains `id="servicos"` and `id="contato"`. Run `npm run build && npm test` → PASS.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: decompose home into Astro components (no redesign)"`

---

### Task 1.6: Port interactions (`main.ts`) + self-host GSAP/Lenis

**Files:** Create `src/scripts/main.ts`; remove CDN `<script>` tags (they live only in baseline).

**Interfaces:**
- Consumes: DOM ids from the ported components; `site.contact.whatsappDigits`; `greetingURL`.
- Produces: all current interactions running off npm imports.

- [ ] **Step 1:** Copy baseline `script.js` into `src/scripts/main.ts`. Replace global GSAP/Lenis usage with imports:
```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
```
Remove the `hasGSAP/hasLenis` CDN guards (now always present) but keep `prefers-reduced-motion` and `finePointer` guards and all `if (!el) return` defensive checks (needed for internal pages that lack some sections).
- [ ] **Step 2:** Replace the hard-coded `WHATSAPP` constant with an import of `site.contact.whatsappDigits`; replace `waURL`/greeting wiring with `wa.ts`.
- [ ] **Step 3: Verify** — `npm run dev`: preloader runs, Lenis smooth scroll works, reveals/parallax/horizontal-pin/counters/sector-tabs/magnetic/marquee all function; `npm run build` succeeds with no CDN references (grep `dist/` for `cdnjs|jsdelivr` → none).
- [ ] **Step 4: Commit** `git add -A && git commit -m "feat: self-hosted interactions (gsap/lenis via npm), wired to site.ts"`

---

# PHASE 2 — Hero (real-still) + typography + anti-AI imagery

### Task 2.1: Typography A/B → choose → swap tokens → SVG wordmark

**Files:** Create temp `src/pages/type-test.astro`; modify `src/styles/global.css` (`:root` font tokens, `.display`, `.brand__type`, etc.); update `Nav`/`Footer` wordmark SVG.

- [ ] **Step 1:** Build `type-test.astro`: render "Módulo Engenharia" + headline/body samples in **Plus Jakarta Sans**, **Poppins**, **Hanken Grotesk**, **Montserrat**, each row above an `<img src="/assets/img/logo-original.png">` for direct comparison.
- [ ] **Step 2:** `npm run dev`, open `/type-test`, screenshot, judge fidelity-to-logo + distinctiveness. Default to **Plus Jakarta Sans** unless another is clearly more faithful. Record the decision in a comment in `global.css`.
- [ ] **Step 3:** Swap `--display` and `--sans` tokens to the chosen family (keep `--mono`). Update `package.json` `@fontsource` dep if a different family wins; `npm install`. Remove Archivo/IBM Plex Sans references.
- [ ] **Step 4:** Recreate the brand wordmark as inline SVG text/paths in the chosen font so the lockup matches `logo-original.png` (graphite "Módulo" + red "Engenharia" + the two rotated squares).
- [ ] **Step 5:** Delete `type-test.astro`. `npm run build` → success. Visual check that headings/body now use the new family.
- [ ] **Step 6: Commit** `git add -A && git commit -m "feat: logo-matching typography (Plus Jakarta Sans) + SVG wordmark"`

---

### Task 2.2: Source the real hero still (no share-alike) + record provenance

**Files:** add `public/hero/hero-still.jpg` (+ a portrait crop `hero-still-portrait.jpg`); modify `src/data/site.ts` `media[]`.

- [ ] **Step 1:** Search Pexels / Pixabay / Unsplash for a **commercial, no-share-alike** high-res (≥2400px) golden-hour bucket-wheel excavator, or — accepted as a category symbol — a clean sunset excavator silhouette. Candidates surfaced in research: Pexels/Pixabay CC0 sunset silhouettes (~6123px), Unsplash "isolated giant excavator" plates (Wolfgang Weiser). Verify license on the source page.
- [ ] **Step 2:** Download the largest available; place at `public/hero/hero-still.jpg`; make a portrait crop for mobile.
- [ ] **Step 3:** Record provenance in `site.ts` `media[]`:
```ts
{ id: 'hero', source: 'Pexels|Pixabay|Unsplash', url: '<source page url>', license: '<Pexels License|Pixabay Content License|Unsplash License>', author: '<name>' }
```
Confirm `tests/site.test.ts` media assertion (no BY-SA) passes: `npm test -- tests/site.test.ts`.
- [ ] **Step 4: Commit** `git add -A && git commit -m "feat: real golden-hour hero still + provenance in site.ts"`

---

### Task 2.3: `CinematicHero` still-mode — scroll camera move + parallax + grain + HUD

**Files:** rewrite `src/components/CinematicHero.astro`; add hero logic to `src/scripts/main.ts`; styles in `global.css`.

**Interfaces:**
- Consumes: `site.brand`, hero still paths. Reads a `mode` prop: `'still' | 'frames'` (default `'still'`).
- Produces: a hero section ~300vh desktop / ~200svh mobile with a sticky stage; `mode:'still'` drives scale/push-in + 2-layer parallax (sky vs machine via duplicated layered images or a single image with scale+translate) + the existing dust canvas + HUD reveal; reduced-motion → static poster + title.

- [ ] **Step 1:** Markup: sticky stage containing the still (`<picture>` desktop/portrait sources), the dust `<canvas>`, the grade/grain overlay, and the HUD + title/CTA overlay. Category-framed copy (no ownership claim).
- [ ] **Step 2:** In `main.ts`, add a `heroStill()` module: GSAP ScrollTrigger scrubbing scale (1.06→1.18) + yPercent drift on the image, opacity/parallax on the title/HUD, tied to the hero section bounds. Guard with `prefers-reduced-motion` (static) and `if (!stage) return`.
- [ ] **Step 3:** Styles: `height:300vh` desktop / `200svh` mobile, `position:sticky` stage at `top:0; height:100svh`, `object-fit:cover`, scrim gradient + `text-shadow` retained.
- [ ] **Step 4: Verify** — `npm run dev`: scrolling the hero produces a smooth slow camera move; text fades/parallaxes; reduced-motion shows a clean static poster. `npm run build` OK.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: cinematic still-hero with scroll camera move (the guaranteed floor)"`

---

### Task 2.4: Signature SVG rail (stroke draws on scroll)

**Files:** modify `src/components/Rail.astro`, `src/scripts/main.ts`, `global.css`.

- [ ] **Step 1:** Replace the rail's `<div>` track with an inline `<svg>` path using `vector-effect="non-scaling-stroke"`; keep the section readout + % text.
- [ ] **Step 2:** In `main.ts`, drive `stroke-dashoffset` from scroll progress (reuse the existing rail update function; set `pathLength` and compute offset). Keep the existing section-label logic.
- [ ] **Step 3: Verify** — rail draws as you scroll; hidden <1180px (unchanged). Build OK.
- [ ] **Step 4: Commit** `git add -A && git commit -m "feat: signature SVG stroke rail (scroll-drawn)"`

---

### Task 2.5: Global anti-AI grade + film grain

**Files:** modify `global.css` (add a `.grain` overlay layer + a cohesive image grade); apply to `Base.astro`.

- [ ] **Step 1:** Add a fixed, `pointer-events:none`, low-opacity (~3–5%) tiled noise overlay (inline SVG `feTurbulence` data-URI) above content, below UI. Add a consistent subtle grade (e.g., a uniform `filter`/overlay) applied to content imagery via a shared class so all photos read as one editorial.
- [ ] **Step 2:** Respect `prefers-reduced-motion` (no animated grain) and ensure it never harms text contrast/legibility (overlay sits behind text where needed).
- [ ] **Step 3: Verify** — images look cohesive + slightly filmic; Lighthouse contrast unaffected (spot-check). Build OK.
- [ ] **Step 4: Commit** `git add -A && git commit -m "feat: global film-grain + cohesive image grade (anti-AI-look)"`

---

# PHASE 3 — Internal pages

### Task 3.1: `ContactSection` + `SegmentPage` template

**Files:** ensure `src/components/ContactSection.astro` is standalone; create `src/components/SegmentPage.astro`.

**Interfaces:**
- Consumes: a `Segment` (from `site.segments`). 
- Produces: `SegmentPage` props `{ segment: Segment }`, rendering: segment hero (photo + HUD, category-framed), expanded description, capabilities list, an equipment strip (reuse relevant `eq-card`s), a **cases block rendering `segment.cases` as visibly-marked placeholders**, then `ContactSection`. Reuses design-system classes only.

- [ ] **Step 1:** Implement `SegmentPage.astro` per the interface. Cases render with a visible `⚠️ a confirmar` treatment.
- [ ] **Step 2: Verify** in isolation via one page (Task 3.2). Commit folded into 3.2.

---

### Task 3.2: Four segment pages (data-driven)

**Files:** create `src/pages/{mineracao,siderurgia,offshore,energia}.astro`.

- [ ] **Step 1:** Each page is a thin wrapper:
```astro
---
import Base from '../layouts/Base.astro';
import SegmentPage from '../components/SegmentPage.astro';
import { site } from '../data/site';
const segment = site.segments.mineracao;   // (respectively siderurgia/offshore/energia)
---
<Base title={`${segment.title} — Módulo Engenharia`} description={segment.description}>
  <SegmentPage segment={segment} />
</Base>
```
- [ ] **Step 2: Verify** — `npm run dev`: `/mineracao`, `/siderurgia`, `/offshore`, `/energia` render with correct copy/photo and the shared contact section; reduced-motion OK.
- [ ] **Step 3: Build smoke** — extend `tests/build-smoke.test.ts` to assert `dist/mineracao/index.html` exists and contains the segment title. `npm run build && npm test` → PASS.
- [ ] **Step 4: Commit** `git add -A && git commit -m "feat: 4 data-driven segment pages via SegmentPage template"`

---

### Task 3.3: `servicos`, `sobre`, `contato`, `biblioteca` pages + cross-links

**Files:** create those four pages; modify `Nav`/`Footer`/`Sectors` links.

- [ ] **Step 1:** `servicos.astro` — full services grid (reuse `Services` + intro from `site`). `sobre.astro` — manifesto/mission + values. `contato.astro` — `ContactSection` full-page + direct details. `biblioteca.astro` — downloads scaffold with an explicit empty-state ("Documentos em breve").
- [ ] **Step 2:** Point footer "SEGMENTOS"/"EMPRESA" links and the Sectors "Conversar sobre este segmento" buttons to the real internal pages (segment pages link to `/<slug>`; "conversar" → `greetingURL` or `/contato`).
- [ ] **Step 3: Verify** — all nav/footer links resolve; no `#` dead links remain except in-page anchors on the home. Build OK.
- [ ] **Step 4: Commit** `git add -A && git commit -m "feat: servicos/sobre/contato/biblioteca pages + cross-page links"`

---

# PHASE 4 — Production hardening

### Task 4.1: Full SEO component (`Seo.astro`)

**Files:** finalize `src/components/Seo.astro`; pass real props from every page.

- [ ] **Step 1:** Render `<title>`, `<meta name="description">`, `<link rel="canonical">` (from `Astro.url`), Open Graph (`og:type/title/description/image/url`), Twitter card, `theme-color`, favicons links, and the `@fontsource` preloads. Defaults from `site`, overridable per page.
- [ ] **Step 2: Verify** — view source on `/` and `/mineracao`: correct unique titles/descriptions/canonicals. Build OK.
- [ ] **Step 3: Commit** `git add -A && git commit -m "feat: complete SEO/meta/canonical/OG component"`

---

### Task 4.2: JSON-LD (`JsonLd.astro`)

**Files:** create `src/components/JsonLd.astro`; include in `Base`.

- [ ] **Step 1:** Emit `Organization` + `LocalBusiness` JSON-LD from `site` (name, logo, url, email, telephone — only if `whatsappConfirmed`, areaServed = 4 segments, address only if present). Omit unconfirmed fields rather than emitting placeholders.
- [ ] **Step 2: Verify** — JSON-LD validates (paste into a structured-data linter); no placeholder phone/CNPJ leaks. Build OK.
- [ ] **Step 3: Commit** `git add -A && git commit -m "feat: Organization/LocalBusiness JSON-LD"`

---

### Task 4.3: sitemap + robots + favicons + OG image

**Files:** `@astrojs/sitemap` (already in config), `public/robots.txt`, `public/favicons/*`, `public/og-image.png`.

- [ ] **Step 1:** `robots.txt` allowing all + `Sitemap:` line. 
- [ ] **Step 2:** Generate a favicon set (svg + 32/180/192/512 png) from the brand mark; link them in `Seo`.
- [ ] **Step 3:** Produce a 1200×630 `og-image.png` from the brand (wordmark + tagline on graphite, with the hero still subtly). Reference it as the default OG image.
- [ ] **Step 4: Verify** — `npm run build`: `dist/sitemap-index.xml` lists all 9 pages; favicons + og-image present.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: sitemap, robots, favicons, OG image"`

---

### Task 4.4: Web3Forms email path + tests

**Files:** create `src/lib/form.ts`, `tests/form.test.ts`; modify `ContactSection.astro` + `main.ts`.

**Interfaces:**
- Produces: `buildWeb3FormsPayload(key, fields): Record<string,string>` (includes `access_key`, `from_name`, `subject`, `botcheck` honeypot); `isSpam(form): boolean` (honeypot filled → true).

- [ ] **Step 1: Failing test** (`tests/form.test.ts`)
```ts
import { describe, it, expect } from 'vitest';
import { buildWeb3FormsPayload, isSpam } from '../src/lib/form';

describe('form', () => {
  it('includes the access key and honeypot field', () => {
    const p = buildWeb3FormsPayload('KEY', { nome: 'Ana', email: 'a@b.com', msg: 'oi', segmento: 'Mineração' });
    expect(p.access_key).toBe('KEY');
    expect(p).toHaveProperty('botcheck');
    expect(p.subject).toMatch(/Módulo/);
  });
  it('flags spam when honeypot is filled', () => {
    expect(isSpam({ botcheck: 'x' })).toBe(true);
    expect(isSpam({ botcheck: '' })).toBe(false);
  });
});
```
- [ ] **Step 2: Run → FAIL.** `npm test -- tests/form.test.ts`
- [ ] **Step 3: Implement `src/lib/form.ts`** (pure functions matching the interface; `botcheck` defaults to '').
- [ ] **Step 4: Run → PASS.**
- [ ] **Step 5:** Wire `ContactSection`: keep "Abrir no WhatsApp" as the **primary** button; add a secondary "Enviar por e-mail" that AJAX-POSTs `buildWeb3FormsPayload(site.forms.web3formsKey, …)` to `https://api.web3forms.com/submit` with loading/success/error states + a hidden honeypot input. If the key is the placeholder, the email button shows a "configurar chave" notice instead of submitting.
- [ ] **Step 6: Verify** — WhatsApp path unchanged; email path shows states (test with a real key only when provided). Build + `npm test` PASS.
- [ ] **Step 7: Commit** `git add -A && git commit -m "feat: Web3Forms email path (WhatsApp stays primary) + honeypot + tests"`

---

### Task 4.5: Responsive image pipeline

**Files:** modify section components to use Astro `<Image>`/`<Picture>`.

- [ ] **Step 1:** Replace `<img>` in Manifesto, EquipShowcase, Sectors, SegmentPage with `astro:assets` `<Image>`/`<Picture>` (import sources from `src/assets` or use `<Picture>` with `formats={['avif','webp']}`), preserving `alt`, `loading="lazy"` below the fold, and the existing CSS classes. Keep the hero still as a `<picture>` with explicit desktop/portrait sources.
- [ ] **Step 2: Verify** — `npm run build`: generated `.avif`/`.webp` with `srcset` in markup; visual parity. Run Lighthouse later (Task 4.7).
- [ ] **Step 3: Commit** `git add -A && git commit -m "perf: responsive webp/avif image pipeline"`

---

### Task 4.6: Accessibility pass

**Files:** modify `Base.astro` (skip-link), `Sectors.astro`/`main.ts` (tablist keyboard), `MobileMenu`/`main.ts` (keyboard), `global.css` (focus-visible).

- [ ] **Step 1:** Add a visible-on-focus skip-link to `#main`. Add `:focus-visible` outlines for all interactive elements.
- [ ] **Step 2:** Sector tabs: proper `role="tablist"`/`tab`/`tabpanel`, `aria-controls`, roving `tabindex`, **Left/Right/Home/End** key handling in `main.ts`.
- [ ] **Step 3:** Mobile menu: focus trap while open, `Esc` to close, focus returns to the burger; burger `aria-expanded` already toggles.
- [ ] **Step 4: Verify** — keyboard-only walkthrough of nav, tabs, menu, form; visible focus throughout; hero text contrast checked against the chosen still (adjust scrim if needed). Build OK.
- [ ] **Step 5: Commit** `git add -A && git commit -m "a11y: skip-link, focus-visible, tablist arrow-keys, menu keyboard"`

---

### Task 4.7: Vercel config + Lighthouse measurement

**Files:** create `vercel.json`; run Lighthouse.

- [ ] **Step 1:** `vercel.json` with static build settings + cache headers for `/assets`, `/frames`, fonts (immutable, long max-age).
- [ ] **Step 2:** `npm run build && npm run preview`; run Lighthouse (Chrome `--headless` via `npx lighthouse http://localhost:4321 --quiet --chrome-flags="--headless"` or the IDE) for `/` and `/mineracao`. **Paste real scores.** Fix the cheapest wins to reach 90+ on Performance/SEO/Best-Practices/Accessibility.
- [ ] **Step 3: Commit** `git add -A && git commit -m "chore: vercel config + Lighthouse pass (scores in commit body)"`

---

# PHASE 5 — OPTIONAL hero upgrade (real clip → AI last resort)

> Only after Phases 0–4 are merged and the site is fully working on the real still. Does not block anything.

### Task 5.1: Hunt a real licensed clip (Tier 1)

- [ ] **Step 1:** Re-search Pexels/Pixabay/Coverr/Mixkit for a no-share-alike bucket-wheel (or category-symbol sunset excavator) clip with slow continuous motion. Download candidates; **preview each for hard cuts** (a single cut disqualifies it).
- [ ] **Step 2:** If a clip passes → Task 5.3 (extract frames). If none → Task 5.2.

### Task 5.2: AI generation (Tier 3, last resort)

- [ ] **Step 1:** Confirm with the user: show `models_explore(recommend)` choice + `get_cost` for the image→video + upscale, and **get explicit go-ahead to spend credits** (534 available).
- [ ] **Step 2:** `media_import_url` the no-share-alike reference still → `generate_video` (Kling, `start_image`, photographic slow pull-back prompt, ~5s) → `upscale_video` → download `.mp4`.

### Task 5.3: Frame extraction + review

- [ ] **Step 1:** Install FFmpeg (`winget install Gyan.FFmpeg` or portable static build).
- [ ] **Step 2:** Extract: `ffmpeg -i clip.mp4 -vf "fps=<N/DUR>,scale=1280:-1" -q:v 4 public/frames/desktop/f_%03d.webp` and a mobile set (`scale=900:-1`, ~72 frames).
- [ ] **Step 3:** **Review frames** for warped truss / impossible mechanics / plastic sky. If they fail the no-AI-look bar → discard, keep the still hero, report honestly.

### Task 5.4: Wire frames-mode

- [ ] **Step 1:** Implement the canvas frame-sequence path in `main.ts` (preload w/ existing progress bar, cover draw, DPR cap, rAF easing 0.18, scroll→frame map, Lenis-integrated, `matchMedia` desktop/mobile sets). Set `CinematicHero mode="frames"` + `FRAME_COUNT`.
- [ ] **Step 2: Verify** — scrub works desktop + mobile; reduced-motion still shows the static poster; build OK; provenance recorded in `site.ts`.
- [ ] **Step 3: Commit** `git add -A && git commit -m "feat(optional): frame-sequence hero upgrade (provenance recorded)"`

---

## Self-review — spec coverage

- §3 Astro architecture → Phase 0–1. ✓
- §4 Hero (real-first ladder, dual-mode, still floor, frame engine, AI last) → Tasks 1.5(temp), 2.2–2.3, 5.x. ✓
- §5 Typography (A/B, Plus Jakarta Sans, SVG wordmark) → Task 2.1. ✓
- §6 Anti-AI grade + grain → Task 2.5. ✓
- §7 Internal pages (SegmentPage + 8 pages, placeholders, honesty) → Phase 3. ✓
- §8 Hardening (Web3Forms, SEO, JSON-LD, sitemap/robots/favicons/OG, self-host, image pipeline, a11y) → Phase 4. ✓
- §9 Interaction suite (Lenis, pin desktop-only, parallax, SVG rail, reveals, tabs, magnetic, wa builder) → Tasks 1.6, 2.3, 2.4, 4.6. ✓
- §10 `site.ts` single source + placeholders (WhatsApp unconfirmed, metrics, CNPJ/CREA, web3 key, cases, media) → Task 1.2 (+2.2). ✓
- §11 Verification (build, dev, internal pages, Lighthouse, mobile, reduced-motion) → Tasks 0.3, 3.2, 4.7 + per-task verify. ✓
- §12 Risks (still floor, AI optional/last, no-credit-burn, licensing, honesty) → encoded in Global Constraints + Phase 5 gating. ✓
- §13 Out of scope / placeholders → Task 1.2 markers. ✓

**Placeholder scan:** all `⚠️` markers are intentional *content* placeholders surfaced to the user in `site.ts`, not plan hand-waving; every code step shows real code/commands. **Type consistency:** `Segment`/`Case`/`MediaCredit`, `waURL`/`buildContactMessage`/`greetingURL`, `buildWeb3FormsPayload`/`isSpam` used consistently across tasks.

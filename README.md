# Módulo Engenharia — Site v2 (Astro)

Site institucional da **Módulo Engenharia** (automação e engenharia para a
indústria pesada: mineração, siderurgia, offshore e energia). Construído em
**Astro** estático, com hero cinematográfico reativo ao scroll, tipografia da
marca (**Koralle NF**, a fonte da logo), GSAP/Lenis self-hosted e acessibilidade.

## Como rodar

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # gera dist/ (estático)
npm run preview   # serve o dist/
npm test          # vitest (site.ts, WhatsApp, formulário, build smoke)
```

Requer Node 18+. Sem dependências de CDN em produção (fontes e GSAP/Lenis são
empacotados pelo build).

## Estrutura

```
src/
├── data/site.ts        # FONTE ÚNICA de conteúdo + ⚠️ placeholders (editar aqui)
├── lib/                # wa.ts (WhatsApp), form.ts (Web3Forms) — testados
├── layouts/Base.astro  # <head>/SEO/JSON-LD, nav, menu, rail, footer, FAB
├── components/         # CinematicHero, SegmentPage, ContactSection, Nav, etc.
├── pages/              # index + mineracao/siderurgia/offshore/energia + servicos/sobre/contato/biblioteca
├── scripts/main.ts     # Lenis + GSAP + hero frame-sequence + tabs + formulário
└── styles/global.css   # design system "Engenharia de Precisão"
public/
├── frames/             # sequência de frames do hero (scroll-vídeo)
├── hero/               # pôster do hero (still) + recortes
├── assets/img/         # fotos da empresa (.jpg + .webp)
└── favicons/ · og-image.png · robots.txt · site.webmanifest
```

## Hero (scroll-vídeo: sequência de frames no canvas)

O hero é um **scroll-vídeo**: uma sequência de frames desenhada num `<canvas>` e
"scrubada" pelo scroll. Começa com a plataforma em enquadramento fechado e dá um
**pull-back lento, suave e estável** até a plataforma inteira caber na tela com
uma margem de mar dos lados — ondas e reflexos em movimento, ao entardecer. Texto
à esquerda, plataforma à direita.

O vídeo é **ilustrativo, gerado por IA** (Higgsfield: Kling 3.0, modo 4K) a partir
de uma **referência real** do acervo da Módulo (`offshore-3.jpg`). Representa o
**segmento offshore**, não é "a plataforma da Módulo" (procedência em `site.ts`,
crédito no rodapé).

Fallback (reduced-motion / sem-JS / frames ausentes): o pôster estático
(`public/hero/platform.*`, frame 1 do vídeo) + um leve movimento de câmera.

Para trocar os frames: gere um novo vídeo, extraia os frames para
`public/frames/desktop/` (`f_001.webp` … 1500px) e `public/frames/mobile/`
(900px), regenere `public/hero/platform.*` a partir do frame 1 e ajuste
`FRAME_COUNT` / `FRAME_COUNT_MOBILE` em `src/components/CinematicHero.astro`
(hoje 121 desktop / 70 mobile). `FRAME_COUNT = 0` volta o hero para still puro.

## ⚠️ Pendências do cliente (todas centralizadas em `src/data/site.ts`)

- **WhatsApp** — `5531999485816` é placeholder (o número publicado é ambíguo).
  **Não publicar sem confirmar.** (`contact.whatsappDigits` / `whatsappDisplay`)
- **Métricas** — `+15 anos`, `+120 projetos`, `99%` são ilustrativas (`metrics[].illustrative`).
  "4 segmentos" é real.
- **CNPJ / CREA / endereço** — `legal.*` (vazios = não aparecem no JSON-LD).
- **Chave do Web3Forms** — `forms.web3formsKey` (criar grátis em web3forms.com).
  Enquanto for placeholder, o botão de e-mail avisa e o WhatsApp segue como canal primário.
- **Cases dos segmentos** e **arquivos da Biblioteca** — placeholders marcados.
- **Fotos em alta resolução** — as fotos da empresa estão em baixa resolução;
  substituir os arquivos em `public/assets/img/` (mantendo os nomes).

## Deploy (Vercel)

`vercel.json` já configurado (framework Astro + cache de assets). Conectar o
repositório à Vercel ou `vercel --prod`. Apontar o domínio
(ex.: moduloengenharia.com.br) e ajustar `site:` em `astro.config.mjs`.

## Identidade

- Vermelho **`#DE1019`** (amostrado da logo · `#AC0C12` / `#F32630`) · grafite `#14171A` · base `#F4F5F6`
- Tipografia: **Koralle NF** (display, a fonte da logo) · **Plus Jakarta Sans** (corpo) · **Zilla Slab** (acento) · **IBM Plex Mono** (dados/HUD)
- Lighthouse: Performance 89 (mobile) / 97 (desktop) · Acessibilidade 97–100 · Best Practices 100 · SEO 100

Documentos de design/plano em `docs/superpowers/`.

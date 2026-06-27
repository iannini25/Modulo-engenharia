# Módulo Engenharia — Site v2 (Astro)

Site institucional da **Módulo Engenharia** (automação e engenharia para a
indústria pesada: mineração, siderurgia, offshore e energia). Construído em
**Astro** estático, com hero cinematográfico reativo ao scroll, tipografia da
marca (Plus Jakarta Sans), GSAP/Lenis self-hosted e acessibilidade.

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

## Hero (still 4K + movimento de câmera no scroll)

O hero é uma imagem **4K** (`public/hero/platform.*`, 3840px) com um **movimento
de câmera no scroll** (zoom lento via GSAP) e texto à esquerda. A imagem é
**ilustrativa, gerada por IA** (Higgsfield: Nano Banana Pro) a partir de uma
**referência real** do acervo da Módulo (`offshore-3.jpg`) — plataforma offshore
ao entardecer. Representa o **segmento offshore**, não é "a plataforma da Módulo"
(procedência em `site.ts`, crédito no rodapé).

Para trocar: substitua `public/hero/platform.webp/.jpg` (desktop) e
`platform-portrait.webp/.jpg` (mobile). O componente já tem o motor de
sequência-de-frames embutido (caso queira voltar a um scroll-vídeo no futuro):
basta colocar frames em `public/frames/` e ajustar `FRAME_COUNT` em
`src/components/CinematicHero.astro`.

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
- Tipografia: **Plus Jakarta Sans** (display + corpo) · **IBM Plex Mono** (dados/HUD)
- Lighthouse: Performance 89 (mobile) / 97 (desktop) · Acessibilidade 97–100 · Best Practices 100 · SEO 100

Documentos de design/plano em `docs/superpowers/`.

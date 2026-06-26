# Módulo Engenharia — Site institucional (one-page cinematográfico)

Site de página única, modo claro, com hero cinematográfico, efeitos de scroll
(GSAP + ScrollTrigger + Lenis) e identidade visual técnica ("Engenharia de
Precisão"). Construído para **Módulo Engenharia** — automação e engenharia para
mineração, siderurgia, offshore e energia.

## Como rodar localmente

O site usa GSAP e Lenis via CDN, então **precisa ser servido por HTTP** (abrir o
`index.html` direto com `file://` funciona, mas um servidor evita qualquer
bloqueio de CDN/relativo). Qualquer servidor estático serve:

```bash
# opção 1 — Python (já vem na maioria das máquinas)
cd modulo
python3 -m http.server 8080
# abra http://localhost:8080

# opção 2 — Node
npx serve .
```

> Em ambiente sem internet os scripts de CDN (GSAP/Lenis) não carregam; o site
> ainda renderiza e fica legível (degradação graciosa), mas sem as animações.
> Para uso offline, baixe GSAP, ScrollTrigger e Lenis e referencie localmente.

## Estrutura

```
modulo/
├── index.html          # marcação completa (uma página, âncoras por seção)
├── style.css           # design system "Engenharia de Precisão" + responsivo
├── script.js           # Lenis + GSAP (hero, rail, horizontal pin, tabs, etc.)
├── assets/img/         # fotos da empresa (renomeadas) + hero tratado + logo
└── CLAUDE_CODE_BRIEF.md # o que falta finalizar (prompt para o Claude Code)
```

## Seções

Hero · Sobre/Manifesto · Serviços (6) · Equipamentos (showcase horizontal) ·
Números · Processo (5 etapas) · Atuação (tabs por segmento) · Contato
(construtor de mensagem WhatsApp) · Rodapé.

## Identidade

- **Vermelho da marca:** `#BE1622` (variações `#8C1016` / `#E11D2A`)
- **Grafite/ink:** `#14171A` · **Base clara:** `#F4F5F6`
- **Tipografia:** Archivo (títulos) · IBM Plex Sans (texto) · IBM Plex Mono (dados)

## Pontos que precisam dos dados reais da empresa

Ver `CLAUDE_CODE_BRIEF.md`. Em resumo: número de WhatsApp exato, métricas reais
(seção Números está com valores ilustrativos marcados com `*`), CNPJ/CREA,
endereço e **fotografia em alta resolução**.

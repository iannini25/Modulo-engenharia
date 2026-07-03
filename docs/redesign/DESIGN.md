# DESIGN.md — Grafite e Brasa / Sistema Módulo

> Design system final da Módulo Engenharia. Direção vencedora sintetizada, com os melhores enxertos das direções Dossiê Técnico e Sistema Modular Cinético, e todos os riscos do crítico já resolvidos como regra dura.

## 1. Filosofia

Indústria pesada vista à noite, quando a planta segue rodando e a escala aparece. O site é um cinema de operação, não um folder de vendas. O silêncio grafite dá seriedade institucional, o vermelho da marca é a brasa que só acende no ponto crítico, no estado, no alerta, no dado que decide, no clique que importa. Tudo nasce do mark: dois losangos deslocados que se encaixam viram um sistema estrutural inteiro, não um enfeite. A coesão vem de repetir um único ângulo-mãe de 45 graus e um único motivo, o módulo, então mesmo o acervo heterogêneo e baixa-res se unifica sob duotone e forma. A régua é relatório de engenharia caro, respiro macro, tipografia larga e confiante, grafismo de instrumento de precisão. Se um output pareceria igual ao de qualquer prompt de IA, falhou.

Jornada B2B encenada como operação: fisgar em 3 segundos, enquadrar o risco antes da solução, provar capacidade em software e hardware, mostrar os quatro segmentos dominados, reduzir risco com honestidade, levar ao WhatsApp com baixíssima fricção.

## 2. Tokens

### 2.1 Cor (a economia do vermelho é lei)

Estratégia committed/drenched no escuro. Cerca de 90 por cento da tela é grafite. O vermelho aparece em menos de 10 por cento da superfície, sempre no ponto crítico, nunca decorativo.

| Token | Hex | OKLCH aprox | Papel |
|---|---|---|---|
| bg | `#0B0D0F` | oklch(0.16 0.006 240) | Void, cenário de planta à noite |
| surface | `#14171A` | oklch(0.22 0.007 240) | Painel elevado da marca, também o grafite do duotone |
| ink | `#ECEEF1` | oklch(0.94 0.004 250) | Texto primário |
| mutedInk | `#8A929B` | oklch(0.63 0.013 250) | Texto secundário, legendas, HUD neutro |
| line | `#22262B` | oklch(0.28 0.008 245) | Hairline de grade, cota, moldura. Sobre imagem usar rgba(236,238,241,0.08) |
| brandRed | `#DE1019` | oklch(0.57 0.243 27) | SÓ display grande e line-art (contraste >= 3:1). O vermelho da logo |
| accent | `#F32630` | oklch(0.62 0.232 27) | Vermelho de TEXTO, HUD, rótulo, ignite/glow, dot ao vivo. 4.76:1 em bg |
| redPressed | `#AC0C12` | oklch(0.46 0.205 27) | Estado pressed/escuro do CTA |
| amberDiegetic | `#E4933B` | oklch(0.72 0.13 63) | Exceção diegética, calor do aço, SÓ em laminacao.webp na Siderurgia, uma vez |

**Regra de contraste (crítica, não negociável):** `#DE1019` como texto pequeno falha WCAG AA no escuro (3.90:1 sobre bg). Portanto: qualquer vermelho em TEXTO, rótulo mono ou HUD usa `accent #F32630`. `brandRed #DE1019` fica reservado a display gigante e a traço de line-art (onde 3:1 basta). Nunca um rótulo IBM Plex Mono em `#DE1019`. O CTA de WhatsApp é o único bloco totalmente vermelho da página; se botões secundários, dots ou bordas também acenderem vermelho, a brasa perde significado. O âmbar e o azul da hora azul existem SÓ dentro da fotografia, jamais viram token de UI.

### 2.2 Tipografia

Quatro vozes num eixo de contraste real, não quatro sans quase iguais.

| Fonte | Papel | Notas |
|---|---|---|
| **Koralle NF** | Display. A fonte da própria logo, geométrica arredondada, vira voz de comando | Só display e números gigantes. NUNCA no corpo |
| **Plus Jakarta Sans** | Corpo. Humanista neutro de baixo contraste, quieto | Leitura editorial em medida larga |
| **IBM Plex Mono** | Dados, HUD, cotas, loop tags, bloco de carimbo, rótulos ilustrativo | A voz SCADA/máquina |
| **Zilla Slab** | Acento. Slab mecânico em pull-quotes, statement de missão, intros | A voz de engenharia carimbada |

Proibidas como display: Inter, Roboto, Arial, Open Sans, Helvetica.

**Escala (clamp fluido, base editorial larga):**
- Display XL (herói, CTA final): `clamp(3rem, 8vw, 8.5rem)`, Koralle, line-height 0.98, tracking -0.02em
- Display L (abre seção): `clamp(2.25rem, 5vw, 4.5rem)`, Koralle, lh 1.02
- H3 módulo: `clamp(1.5rem, 2.4vw, 2.25rem)`, Koralle
- Pull-quote/missão: `clamp(1.6rem, 3vw, 2.75rem)`, Zilla Slab, lh 1.2
- Corpo: `clamp(1rem, 1.15vw, 1.2rem)`, Plus Jakarta Sans, lh 1.6, medida 62ch máx
- HUD/cota/carimbo: `0.75rem` a `0.8125rem`, IBM Plex Mono, tracking 0.08em, uppercase nos rótulos
- Número gigante ilustrativo: `clamp(3.5rem, 10vw, 11rem)`, Koralle, com odômetro mono ao lado

Headline do herói em 2 a 3 linhas no máximo, nunca wrap de 6 linhas.

### 2.3 Espaço

Ritmo macro. Escala base 4px. Seções `py-24` a `py-40` (`6rem` a `10rem`). Container largo até `1360px` com `px-6` mobile, `px-10` desktop. Gutter de grade de 12 colunas. Assimetria é a regra, simetria de três colunas iguais é banida.

### 2.4 Raio e chanfro (o ângulo-mãe)

Não há `border-radius` grande e macio de SaaS. A geometria é chanfro reto de 45 graus.
- `--chf: clamp(28px, 3vw, 44px)` chanfro padrão do módulo
- `--sk: 8%` inclinação do parallelograma canted
- Cantoneiras em L: 2 traços de 1px de 24px de comprimento no vértice, cor `line` ou `accent` quando crítico
- Raio suave permitido só em pills de CTA (`rounded-full`) e na nav flutuante

### 2.5 Sombra e elevação

Sem drop-shadow escuro genérico. Elevação por: (1) mudança de superfície (`bg` para `surface`), (2) hairline `line`, (3) um inset highlight sutil no topo do módulo `inset 0 1px 0 rgba(236,238,241,0.06)`, (4) glow `accent` só no estado crítico/hover, `0 0 24px rgba(243,38,48,0.35)`. Nada de `shadow-md` padrão.

## 3. Elemento-assinatura

Ver campo `signatureElement`. Em síntese: o duplo losango da logo vira sistema estrutural. Imagens em módulos chanfrados, seções que se montam de módulos de footprints desiguais com snap, marca de dois losangos como marcador persistente, fio SVG que tricota o losango em 1 ou 2 entradas-chave, transição split-diamond reservada.

Enxerto do Dossiê Técnico: o **bloco de carimbo** do desenho técnico vira a seção de contato (o rodapé é a aprovação do desenho). Enxerto do Sistema Cinético: **âmbar exatamente uma vez** na Siderurgia como regra dura de economia de cor.

## 4. Tratamento de imagem não-convencional

Ver campo `imageTreatment` para os clip-paths concretos das três famílias de forma (módulo chanfrado, parallelograma canted, losango pleno), a proteção de rosto e a regra cor versus duotone. Pontos-chave: nunca retângulo/quadrado/círculo; duotone só no acervo datado; três fotos novas quase em cor cheia; offshore-3 em cor plena; âmbar uma vez; balão DET A apontando o ponto crítico real.

## 5. Linguagem de motion

Ver campo `motionLanguage`. Dois motores particionados (scroll-cinematic com GSAP/ScrollTrigger/Lenis/DrawSVG na camada de scroll e todo SVG; anime.js só micro sem colisão de transform). Dois momentos cinematográficos no teto: herói scroll-vídeo e pin horizontal do loop-check. Só transform e opacity. prefers-reduced-motion entrega versão estática completa.

## 6. Acessibilidade e contraste

- Texto vermelho SÓ em `accent #F32630` (>= 4.5:1 no escuro), display/line-art pode usar `brandRed`.
- `mutedInk #8A929B` sobre `bg` fica em ~5:1, ok para corpo secundário; se cair abaixo em fundo de imagem, escurecer o overlay atrás.
- Alvo de toque mínimo 44px. Pill de WhatsApp fixa usa `dvh` e `env(safe-area-inset-bottom)`.
- Todo scroll-driven degrada com `prefers-reduced-motion`, e o conteúdo estático fica 100 por cento visível (nada preso em hidden).
- Foco visível com anel `accent` de 2px. Legendas e alt em pt-BR. HUD tem equivalente textual.
- Foto humana nunca tem rosto cortado pela máscara.

## 7. Honestidade de dados (regra dura)

Métricas são ilustrativas e rotuladas como `(ilustrativo)` em IBM Plex Mono, dentro da própria estética de documento técnico (enxerto do Dossiê). Só o número 4 (segmentos) é real e ganha destaque cromático. Proibido inventar cliente, case, logo, CNPJ ou endereço preciso. Sem travessão em nenhum texto, tudo reescrito com vírgula, incluindo o statement da missão e ranges em mono (escrever REV A, REV B, nunca com traço entre eles).

## 8. Seções

Jornada AIDA em 11 blocos. Dois momentos cinematográficos: hero e ciclo-loop. Detalhe de layout, imagens e copy no array `sections`.

1. hero, Herói scroll-vídeo, a plataforma que não pode parar (Atenção)
2. tese-risco, O custo de parar, risk register frio mais contador de downtime (Interesse/dor)
3. servicos-modulos, Seis serviços que se encaixam (Prova de capacidade)
4. software-humano, Software e mão na máquina, a missão (Desejo/diferencial)
5. ciclo-loop, Loop-check ao vivo, pin horizontal (Prova técnica, momento cinematográfico 2)
6. retrofit, Rev A para Rev B, modernização de ativos (Diferencial)
7. segmentos, Quatro temperaturas dominadas, o único dado real (Autoridade)
8. prova-campo, Prova de campo, engenharia que vai à planta (Prova)
9. confianca, Painel de disponibilidade, supervisório SCADA (Redução de risco)
10. contato, Bloco de carimbo, aprovação do desenho mais WhatsApp (Ação)
11. footer, O módulo se fecha (Fecho de marca)
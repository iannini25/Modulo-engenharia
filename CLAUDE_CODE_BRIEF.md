# BRIEFING PARA O CLAUDE CODE — Finalizar o site da Módulo Engenharia

Cole este arquivo (ou seu conteúdo) no Claude Code, dentro da pasta do projeto.
Ele descreve o que já existe e o que falta para o site ir ao ar em nível
profissional.

---

## 1. Contexto

**Cliente:** Módulo Engenharia — empresa de **automação e engenharia para a
indústria pesada**. Atende quatro segmentos: **Mineração, Siderurgia, Offshore e
Energia**. Especialidades: automação e controle, engenharia elétrica e
instrumentação, máquinas de pátio (empilhadeiras/recuperadoras), transportadores
de correia, montagem e manutenção eletromecânica, comissionamento.

**Missão (texto oficial do cliente):** "A Módulo Engenharia procura o aumento da
eficiência, maximizando a produtividade e a qualidade através de softwares e
hardwares que melhoram a segurança, produtividade, qualidade e informação, além
de reduzir o esforço ou a interferência humana sobre o processo ou máquina."

**Site atual do cliente (referência de conteúdo):**
https://rodolfo4032.wixsite.com/moduloengenharia
Páginas existentes lá: Principal, Offshore, Siderurgia, Energia, Mineração,
Sobre, Serviços, Biblioteca, Contato.

**Contato (do site atual):** Rodolfo Cintra · rodolfocintra.modulo@gmail.com ·
+55 31 99948-58169 (⚠️ ver item 4) · Minas Gerais.

## 2. O que já está pronto (nesta entrega)

Site **one-page** completo, modo claro, com identidade visual "Engenharia de
Precisão" (HUD técnico/datasheet, vermelho da marca + grafite), hero
cinematográfico usando a própria **recuperadora de minério** da empresa, e
animações com **GSAP + ScrollTrigger + Lenis**.

- `index.html` · `style.css` · `script.js` · `assets/img/`
- Seções: Hero, Sobre, Serviços (6 cards), Equipamentos (showcase horizontal
  pinado), Números, Processo (5 etapas), Atuação (tabs interativas por
  segmento), Contato (construtor de mensagem para WhatsApp), Rodapé.
- Responsivo (desktop/tablet/mobile) e com fallback para `prefers-reduced-motion`.
- Todas as 14 fotos enviadas pelo cliente foram usadas.

**Design tokens** (já em `:root` no `style.css`):
`--red:#BE1622` · `--red-700:#8C1016` · `--red-500:#E11D2A` · `--ink:#14171A` ·
`--bg:#F4F5F6`. Fontes: Archivo (display), IBM Plex Sans (texto), IBM Plex Mono
(dados).

## 3. Tarefas para finalizar (em ordem de prioridade)

### P0 — Fotografia em alta resolução  ⬅️ mais importante
As imagens vieram em baixa resolução (máx. ~693 px de largura) e foram
ampliadas + tratadas (Lanczos + sharpen + grade cinematográfico) como paliativo.
Para produção:
- Substituir os arquivos em `assets/img/` por versões em alta (idealmente o hero
  ≥ 2400 px de largura). Manter os mesmos nomes para não quebrar referências, ou
  atualizar os `src` no HTML/JS.
- Se o cliente tiver fotos originais das obras, priorizar: recuperadora/
  empilhadeira (hero), painéis, alto-forno, laminação, plataformas offshore.
- Otimizar: gerar `.webp`/`.avif` + `srcset` responsivo; comprimir; lazy-load já
  está nas imagens abaixo da dobra.

### P1 — Páginas internas por segmento
O site atual do cliente tem páginas separadas. Recomendação: manter esta
landing one-page como home e adicionar páginas de profundidade:
`/mineracao`, `/siderurgia`, `/offshore`, `/energia`, `/servicos`,
`/biblioteca`, `/sobre`, `/contato`.
- Reaproveitar o design system (mesmas tokens/componentes).
- Conteúdo de cada página: puxar da Wix atual (link acima) e expandir com cases,
  fotos e descrições técnicas reais.
- Os botões "Conversar sobre este segmento" e os itens do rodapé podem apontar
  para essas páginas quando existirem.
- Sugestão de stack se for evoluir para multipágina com componentes: Astro
  (estático, rápido, SEO bom) ou Next.js. Para manter simples, dá para duplicar
  o padrão HTML/CSS/JS por página.

### P2 — Backend do formulário de contato
Hoje o formulário **monta uma mensagem e abre o WhatsApp** (sem servidor).
Para também receber por e-mail:
- Integrar um serviço de forms (Formspree, Web3Forms, Netlify Forms) **ou** um
  endpoint próprio.
- Validar campos, estado de loading/sucesso/erro, honeypot anti-spam.
- Manter o WhatsApp como canal primário (é o mais usado pelo cliente).

### P3 — Dados reais e SEO
- **Números** (seção `#numeros`): os valores `+15 anos`, `+120 projetos`,
  `99% disponibilidade` são **ilustrativos** (marcados com `*` e nota). Trocar
  pelos reais ou remover. "4 segmentos" é real.
- Preencher **CNPJ** (rodapé tem placeholder `00.000.000/0000-00*`) e **CREA**,
  se aplicável.
- Endereço real (se houver) para `schema.org/LocalBusiness` + Google Maps.
- Meta tags: já há `description` e Open Graph; gerar uma imagem OG dedicada
  (1200×630). Adicionar `sitemap.xml`, `robots.txt`, favicons completos
  (atualmente é um SVG inline), `lang`/`canonical`.
- JSON-LD `Organization`/`LocalBusiness` com nome, logo, contatos, área de
  atuação.

### P4 — Performance e produção
- **Self-host das fontes** (hoje via Google Fonts) e dos scripts GSAP/Lenis
  (hoje via CDN) para velocidade e funcionamento offline/CSP.
- Minificar CSS/JS; adicionar cache headers no deploy.
- Lighthouse: mirar 90+ em Performance/SEO/Best Practices/Acessibilidade.

### P5 — Acessibilidade (revisão final)
- Verificar contraste do texto do hero sobre a foto (já há scrim + text-shadow,
  mas confirmar com fonte real em alta).
- Foco visível em todos os interativos; navegação por teclado nas tabs de
  segmento (adicionar suporte a setas) e no menu mobile.
- `alt` descritivos (já preenchidos) e revisão com leitor de tela.

### P6 — Deploy
- Hospedar em **Netlify**, **Vercel** ou **GitHub Pages** (site estático).
- Apontar domínio próprio (ex.: moduloengenharia.com.br) + HTTPS.
- Opcional: Google Analytics 4 / Plausible.

## 4. ⚠️ Itens que dependem de confirmação do cliente

1. **Número de WhatsApp/telefone.** No site atual aparece "+55 31 999485 8169",
   cujo agrupamento de dígitos está ambíguo. No código está como
   `const WHATSAPP = "55319994858169"` em `script.js` (e exibido como
   "+55 (31) 99948-58169"). **Confirmar o número correto** e ajustar a constante
   e os textos no HTML.
2. **Métricas reais** para a seção Números (ver P3).
3. **CNPJ / CREA / endereço.**
4. **Fotos em alta resolução** (ver P0).
5. **Conteúdo das páginas internas** (cases, textos técnicos por segmento).

## 5. Notas técnicas

- `script.js` está encapsulado em IIFE, sem dependências além de GSAP/
  ScrollTrigger/Lenis. Tudo degrada se os scripts não carregarem.
- O showcase horizontal (`#equipamentos`) usa `ScrollTrigger.pin` no desktop
  (≥861px) e scroll nativo com snap no mobile.
- A "rail" lateral esquerda é a assinatura visual (telemetria de scroll) — some
  abaixo de 1180px.
- As tabs de Atuação trocam imagem/descrição via objeto `data` em `script.js`
  (função `sectors()`), fácil de editar.
- Logo: recriado como **SVG inline** (dois quadrados girados, ink + vermelho).
  O PNG original está em `assets/img/logo-original.png` para referência/uso.

---

**Resumo do pedido ao Claude Code:** começar pela P0 (fotos em alta) e P1
(páginas internas), depois P2–P6. Manter o design system e a identidade já
estabelecidos. Não inventar números/dados — usar placeholders marcados até o
cliente confirmar.

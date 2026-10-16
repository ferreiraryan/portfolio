# CONTEXTO.md — Portfólio Cinematográfico (Ryan Ferreira)

> Documento de contexto do projeto: visão geral, arquitetura, mapa de seções e
> roadmap priorizado de melhorias. Atualizado em 2026-10-16.

---

## 1. Visão geral

Portfólio pessoal de **Ryan Ferreira**, construído como uma **jornada cinematográfica
em scroll único**. A tese criativa é:

> "Código, histórias e mundos — tudo em um só scroll."

O site é dividido em **6 mundos** (seções) encadeados por **5 transições animadas**,
cada uma com identidade visual, tipografia e paleta próprias. O scroll atua como
"câmera": conforme o usuário rola, um mundo se transforma no próximo através de um
efeito temático (papel rasgando, vidro estilhaçando, barra de XP enchendo, painel de
quadrinho abrindo, tubo CRT ligando).

---

## 2. Stack & versões reais

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router, Turbopack) | **16.4.2** |
| UI | React / React DOM | **19.3.0** |
| Linguagem | TypeScript (strict) | ^5 |
| Estilo | Tailwind CSS (`@tailwindcss/turbopack`) | v4 |
| Animação (scroll/pin) | GSAP + ScrollTrigger | ^3.15 |
| Smooth scroll | Lenis | ^1.3 |
| Animação declarativa | Framer Motion | ^14.3 |
| Fontes | `next/font/google` | Inter, Syne, Playfair Display, JetBrains Mono |
| Lint | ESLint 9 + `eslint-config-next` | — |

Caminho de import: alias `@/*` → `./src/*` (ver `tsconfig.json`).

### Scripts

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção
npm run start    # serve o build
npm run lint     # eslint
```

---

## 3. Arquitetura

### Palco único — `src/components/TransitionStage.tsx`

Diferente da abordagem "uma seção pinada por vez", o projeto usa **um único palco**:

- `main` com `h-screen w-full overflow-hidden` é **pinado** por **um único
  `ScrollTrigger`** (`start: "top top"`).
- Todas as camadas (mundos e transições) ficam **empilhadas em `absolute inset-0`** e
  são trocadas via `autoAlpha`.
- Uma **timeline master** (`gsap.timeline({ paused: true })`) orquestra tudo; o
  `ScrollTrigger` faz `scrub` dela.

Isso elimina os "buracos" que apareciam quando cada transição tinha seu próprio pin
(duas cópias do mesmo mundo, com o espaçamento interno visível na emenda do scroll).

**Constantes da timeline** (`TransitionStage.tsx`):

| Constante | Valor | Papel |
|-----------|-------|-------|
| `EFFECT_DURATION` | `1` | duração normalizada de cada efeito |
| `HOLD_AFTER_EFFECT` | `0.85` | respiro (mundo parado) após cada efeito |
| `LEAD_IN` | `0.3` | respiro antes do primeiro efeito |
| `TRAILING_HOLD` | `0.7` | respiro final antes de soltar o pin |
| `PX_PER_UNIT` | `900` | quanto de scroll (px) cada unidade representa |

O mapeamento é **scroll = tempo × `PX_PER_UNIT`**.

### Contexts — `src/lib/useTransitionTimeline.ts`

| Hook | Função |
|------|--------|
| `useTransitionTimeline(builder)` | registra a timeline do **efeito** de uma transição |
| `useDwellTimeline(builder)` | registra animação que roda na **pausa** (dwell) do mundo |
| `useScrollToDwell()` | retorna `(progress) => void` para rolar até um ponto da dwell |

O índice de cada camada vem do `TransitionIndexContext`, garantindo a ordem correta.

### Store do livro — `src/lib/bookStore.ts`

O `Sobre` (livro) é montado **duas vezes** (camada revelada do rasgo + camada superior
do glitch). Para as duas cópias ficarem na mesma página, o estado atual vive em um store
externo (`useSyncExternalStore`) — tanto os botões quanto a virada automática por scroll
escrevem nele.

O store guarda **duas páginas independentes** (`left`/`right`, lidas via `useBookSpread`).
Esse descompasso é o que torna a virada limpa: a `right` (recto) troca no **início** da
virada — escondida atrás da folha que se levanta — e a `left` (verso) troca no **fim** —
escondida atrás da folha que acabou de pousar. Assim nenhum conteúdo "pisca" no meio.

### Smooth scroll — `src/lib/useLenis.ts`

- Instância única de `Lenis` (`duration: 1.2`), ligada ao ticker do GSAP
  (`gsap.ticker.add` + `lagSmoothing(0)`).
- `lenis.on("scroll", ScrollTrigger.update)` mantém o ScrollTrigger em sincronia.
- `scrollToScrollY(y)` faz rolagem programática suave (usado pelos botões do livro).

### Fluxo do scroll (resumo)

```
scroll do usuário
   → ScrollTrigger (scrub) → timeline master
        → [efeito da transição i]  (duration = EFFECT_DURATION)
        → [dwell do mundo i+1]     (mundo parado, animações contextuais)
        → [efeito da transição i+1]
        → ...            → [TRAILING_HOLD] → solta o pin
```

---

## 4. Mapa dos 6 mundos × 5 transições

Orquestrado em `src/app/page.tsx`.

| # | Mundo | Seção | Transição → próximo | Arquivo da transição | Efeito |
|---|-------|-------|---------------------|----------------------|--------|
| 1 | Hero (neutro) | `sections/Hero.tsx` | Rasgo de papel | `transitions/RasgoPapel.tsx` | Papel rasga no meio e se abre em duas metades |
| 2 | Sobre (livro) | `sections/Sobre.tsx` | Glitch de tela | `transitions/Glitch.tsx` | Trincas + 4 cacos voando revelam o próximo mundo |
| 3 | Projetos (cyberpunk) | `sections/Projetos.tsx` | Level Up | `transitions/LevelUp.tsx` | Barra de XP enche e explosão dourada abre a ficha |
| 4 | Skills (RPG) | `sections/Skills.tsx` | Painel de HQ | `transitions/PainelHQ.tsx` | Painéis diagonais se abrem + onomatopeia "ドン!" |
| 5 | Estante (mangá/HQ) | `sections/Estante.tsx` | CRT ligando | `transitions/CRT.tsx` | Feixe de elétrons verde abre a tela do arcade |
| 6 | Contato (arcade) | `sections/Contato.tsx` | — (fim) | — | Fim da jornada |

### Destaques de interação por seção

- **Hero** — gradiente radial que segue o mouse (`mousemove`).
- **Sobre** — livro aberto em duas páginas; vira **2 capítulos** conforme o scroll
  (`useDwellTimeline`) e tem navegação por botões ("Folhear Capítulos") que usa
  `useScrollToDwell`. A virada é uma **folha 3D de duas faces** (fora do `overflow-hidden`
  do card): a frente mostra o recto atual e o **verso** traz o próximo conteúdo, girando
  180° em torno da lombada. Conteúdo do verso/frente é sincronizado pelo store para não
  haver "pop". No mobile (páginas empilhadas) a virada vira um crossfade simples.
- **Projetos** — terminal com filtro por categoria (ALL / FULL-STACK / CREATIVE WEB /
  AI & ENGINE) e painel de detalhe.
- **Skills** — ficha de personagem RPG com barras HP/MP, atributos e árvore de skills em
  abas ("Grimórios").
- **Estante** — prateleira de mangás/HQs clicável, abre painel de leitura.
- **Contato** — gabinete arcade com "ficha" (créditos) e formulário de transmissão.

---

## 5. Convenções do projeto

- **Numeração visual:** headers usam `0X //` e footers usam `0X / 06`.
- **Uma identidade por universo:**
  - Hero: neutro (preto `#050505`, branco).
  - Sobre: papel off-white (`#D6D3CD` / `#EAE6DF`), serif Playfair.
  - Projetos: cyberpunk (`#0D041A`, fúcsia/ciano), mono.
  - Skills: RPG (`#1C120B`, âmbar), serif + mono.
  - Estante: HQ (papel `#F4F0EA`, preto/branco, halftone).
  - Contato: arcade (`#050508`, verde fósforo, scanlines CRT).
- **Idioma:** pt-BR (`<html lang="pt-BR">` no `layout.tsx`).
- **Classes utilitárias custom** em `globals.css`: `.crt-scanlines` e `.manga-halftone`.

---

## 6. Mapa de pastas

```
portfolio/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx        # fontes, metadata, SmoothScroll
│  │  ├─ page.tsx          # compõe os 6 mundos + 5 transições
│  │  └─ globals.css       # Tailwind v4 + utilidades CRT/halftone
│  ├─ components/
│  │  ├─ TransitionStage.tsx   # palco único (pin + timeline master)
│  │  ├─ SmoothScroll.tsx      # habilita Lenis
│  │  ├─ sections/             # os 6 mundos
│  │  │  ├─ Hero.tsx  Sobre.tsx  Projetos.tsx
│  │  │  ├─ Skills.tsx  Estante.tsx  Contato.tsx
│  │  └─ transitions/          # os 5 efeitos
│  │     ├─ RasgoPapel.tsx  Glitch.tsx  LevelUp.tsx
│  │     ├─ PainelHQ.tsx  CRT.tsx
│  └─ lib/
│     ├─ useTransitionTimeline.ts  # contexts dos builders
│     ├─ useLenis.ts               # instância do Lenis + scroll programático
│     └─ bookStore.ts              # store compartilhado do livro
├─ public/                 # SVGs de template (a limpar)
├─ next.config.ts          # cacheComponents, partialPrefetching, turbopack
├─ tsconfig.json           # strict + alias @/*
└─ AGENTS.md               # blocos gerados pelo Next
```

---

## 7. Estado atual — O que está feito ✅

- [x] **Palco único** com timeline master e um único ScrollTrigger (arquitetura-base).
- [x] **Lenis** integrado ao ticker do GSAP.
- [x] **6 mundos** completos, cada um com layout próprio e responsivo (grid `lg:`).
- [x] **5 transições** temáticas (`RasgoPapel`, `Glitch`, `LevelUp`, `PainelHQ`, `CRT`).
- [x] **Livro interativo** (Sobre): virada automática por scroll + navegação por botões.
- [x] **Filtro de projetos** e **painel de detalhe** (Projetos).
- [x] **Árvore de skills** com abas e barras (Skills).
- [x] **Prateleira de mangás** clicável (Estante).
- [x] **Formulário de contato** (visual/estado de UI apenas).
- [x] `tsc --noEmit` **limpo** e `eslint` **limpo**.

---

## 8. Roadmap priorizado

### P0 — Correções reais (conteúdo/bugs visíveis)

- [ ] **Mobile quebrado:** o palco é `h-screen` + `overflow-hidden` pinado
      (`TransitionStage.tsx:166`, pin em `133-142`). Em telas pequenas, seções densas
      (Projetos/Skills viram coluna única) **estouram 100vh e ficam cortadas sem poder
      rolar**. Definir fallback sem pin abaixo de `md` (scroll normal).
- [ ] **Formulário não envia nada:** `Contato.tsx:12-16` só faz `setSentMessage(true)`.
      Falta API route / serviço de e-mail (Resend, Formspree, etc.).
- [ ] **Versões mentindo na UI** — o projeto usa Next **16** / React **19**, mas:
      `Hero.tsx:69` ("Next.js 14"), `Skills.tsx:16` e `:175` ("Next.js 14 & React 18"),
      `Projetos.tsx:25` ("Next.js 14") e `:64` ("React 18").
- [ ] **Typo:** `Sobre.tsx:33` — `"Alemão do Código: Mundos"` → **"Além do Código"**.

### P1 — Bugs e qualidade

- [ ] **`border-3` inválido no Tailwind** (`Estante.tsx:128`, `:140`) — a classe não
      existe no core; usar `border-[3px]`.
- [ ] **`scrollToDwell` ignora o `LEAD_IN`** (`TransitionStage.tsx:63-71`, mapeamento em
      `:70`): como a timeline começa em `position = LEAD_IN (0.3)`, o salto `tempo ×
      PX_PER_UNIT` erra ~270px. Somar o offset de `LEAD_IN`.
- [ ] **`mouseMove` sem throttle no Hero** (`Hero.tsx:9-18`): `setState` a cada evento
      re-renderiza o Hero inteiro (que ainda é renderizado **2×** no rasgo). Usar
      ref/CSS var + `requestAnimationFrame` ou debounce.
- [ ] **Sem `prefers-reduced-motion`:** o scroll-jacking pesado não tem fallback
      (acessibilidade + conforto).
- [ ] **Código morto:** `getLenis` (`useLenis.ts:13`) exportado e nunca usado.

### P2 — SEO, performance e polimento

- [ ] **Metadata mínima** (`layout.tsx:11-14`): só `title`/`description`. Adicionar
      OpenGraph, Twitter card, ícones e `metadataBase`.
- [ ] Sem **`robots.ts`** / **`sitemap.ts`** e sem favicon real (só SVGs de template em
      `public/`).
- [ ] **`README.md`** ainda é boilerplate do `create-next-app`.
- [ ] **4 famílias de fontes** (`layout.tsx:2,6-9`) — pesado; avaliar enxugar.
- [ ] **DOM duplicado por design:** `Sobre` 2× (`page.tsx:18,21`) e `Hero` 2× dentro do
      `RasgoPapel` (`RasgoPapel.tsx:132,153`).
- [ ] **Dados fictícios:** projetos e links (`Projetos.tsx`, ex.: `:29`) e contato
      (`Contato.tsx:65`, `:75`, `:85`) apontam para `ryanferreira` / `ryanferreira.dev`.

### Notas de arquitetura (não bloqueantes)

- `TransitionStage` usa `useEffect(..., [])` lendo `childrenArray` — só funciona porque
  `page.tsx` é estático; é frágil.
- A ordem de registro (dwells dos filhos antes do efeito do pai) depende da ordem de
  efeitos do React — funciona, mas vale documentar.
- Conteúdo todo inline nos componentes; poderia migrar para arquivos de dados.

---

## 9. Pendências & decisões abertas

- **Formulário:** qual estratégia de envio? (API route + Resend / Formspree / mailto)
- **Mobile:** fallback sem pin ou layout alternativo abaixo de `md`?
- **Dados reais:** trocar placeholders (projetos, links, e-mail) pelos reais?
- **SEO:** domínio final para `metadataBase` / `sitemap`.

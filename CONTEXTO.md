# CONTEXTO.md — Portfólio Cinematográfico (Ryan Ferreira)

> Documento de contexto do projeto: visão geral, arquitetura, mapa de seções e
> roadmap priorizado de melhorias. Atualizado em 2026-10-17.

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
| `HOLD_AFTER_EFFECT` | `0.45` | respiro (mundo parado) após cada efeito |
| `LEAD_IN` | `0.15` | respiro antes do primeiro efeito |
| `TRAILING_HOLD` | `0.4` | respiro final antes de soltar o pin |
| `PX_PER_UNIT` | `600` | quanto de scroll (px) cada unidade representa |

O mapeamento é **scroll = tempo × `PX_PER_UNIT`**.

Constantes do dwell do livro (`Sobre.tsx`): `PAGE_DURATION = 1.0` e `LEAD = 0.2`
(⇒ `DWELL_TOTAL = LEAD + 2 × PAGE_DURATION = 2.2`). O `ScrollTrigger` usa
`scrub: 0.45` e o `Lenis` (`useLenis.ts`) usa `duration: 1.0`.

O `Sobre` também faz o **ajuste de altura do livro** (fit-to-height): mede a altura
natural do card, prende a caixa à maior altura medida naquela largura e escala o palco 3D
(`transform: scale`) para ele caber entre o cabeçalho e o rodapé do palco pinado — assim o
indicador de páginas e o rodapé nunca saem de tela e nenhuma página é cortada.

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
| 5 | Estante (mangá/HQ) | `sections/Estante.tsx` | CRT ligando | `transitions/CRT.tsx` | Papel colapsa em linha de varredura; o raster do arcade se expande a partir dela |
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
- [x] **Pacing do scroll recalibrado** (2026-10-16): scroll total pinado caiu de
      ~10.485px para ~5.460px (`PX_PER_UNIT` 900→600, `HOLD_AFTER_EFFECT` 0.85→0.45,
      `LEAD_IN` 0.3→0.15, `TRAILING_HOLD` 0.7→0.4, `scrub` 0.85→0.45, `Lenis`
      duration 1.2→1.0). O dwell do livro foi encurtado para `DWELL_TOTAL = 2.2`
      (`PAGE_DURATION` 1.4→1.0, `LEAD` 0.3→0.2). A zona morta entre efeitos caiu de
      765px para 270px.
- [x] **Marcador (fita bordô) animado** (2026-10-16): a fita saiu de dentro do
      `overflow-hidden` do card (onde era clipada e ficava sobreposta à folha que gira) e
      agora **levanta e desce** a cada virada — sobe ~26px + leve rotação um instante antes
      de a folha aparecer e assenta de volta na nova página. Funciona no desktop (virada 3D)
      e no mobile (crossfade); no repouso sempre retorna à posição original, então as duas
      cópias de `Sobre` continuam idênticas (`Sobre.tsx`).
- [x] **Transição CRT reescrita** (2026-10-16): o fade preto + retângulo verde deu
      lugar a um power-cycle real. A Estante **colapsa** (`scaleY → 0.004`,
      `brightness(2.4)`, `saturate(0.1)`) até virar uma linha, que faz o handoff para
      um **feixe de fósforo de 2px** (branco → verde). O raster do Contato então
      **expande da linha** (`scaleY 0.004 → 1`), com flash radial, scanlines de
      assentamento e OSD `POWER ON — SIGNAL OK · 60Hz` (abaixo do header no desktop;
      oculto no mobile, onde o header encosta no gabinete). A camada de entrada não faz
      mais fade por cima do feixe nem usa `scale(0.96)`; o efeito continua reversível
      no scrub (`CRT.tsx`).
- [x] **Conteúdo real aplicado (v2)** (2026-10-17): `CONTEUDO.md` com **175 dos 232 campos**
      preenchidos e reaplicado aos 7 arquivos. Identidade final: **Ryan Ferreira — Tecnologia,
      Computação & Projetos** (PUC Minas + COTEMIG; web/mobile/backend, infra Linux, dados,
      IoT e suporte). Sobre reescrito em 3 capítulos (curiosidade & começo → caminhos
      explorados → silício & histórias); Projetos com 4 cases reais (DevStore, Grene IoT,
      Movie Queue, Visualisit) — o filtro `AI & ENGINE` voltou a ter item (Grene); Skills com
      3 grimórios novos (Desenvolvimento, Infra/Linux/Suporte, Dados/IoT/Ciência); Estante
      com One Piece, Omniscient Reader's Viewpoint, Neuromancer e Meditações; Contato com
      textos mais conversacionais. Nome padronizado para **"Ryan Ferreira"** (sem "Barros").
      1ª versão havia sido aplicada em 2026-10-16 (124 campos); esta substitui a anterior.
      `tsc` e `eslint` limpos.
- [x] **Livro sem corte e sem "pulo" de tamanho** (2026-10-17): o card tinha altura fixa
      (`lg:h-[min(660px,calc(100dvh-200px))]` + `overflow-hidden`), então o texto mais longo
      do v2 estourava a caixa e o fim da página direita (Nota de Margem + paginação) ficava
      invisível. Agora (`Sobre.tsx`):
      - a seção é `h-screen overflow-hidden` (era `min-h-screen`), garantindo que o
        indicador de páginas e o rodapé nunca saiam do palco pinado;
      - o card **não** tem altura no CSS: um `useIsomorphicLayoutEffect` mede a altura
        natural do conteúdo e **prende a caixa à maior altura já medida naquela largura**
        (métrica invalidada só quando a largura muda ou as fontes assentam). Isso é o que
        impede o livro de mudar de tamanho quando a virada começa — a página direita troca
        de capítulo no primeiro frame da virada (`Sobre.tsx:392`), e cada capítulo tem texto
        de comprimento diferente (Cap. I 681/153 chars, II 601/121, III 648/113);
      - o palco 3D inteiro é escalado (`transform: scale`, `transform-origin: top center`)
        só o suficiente para caber entre o cabeçalho e o rodapé, com `margin-bottom`
        negativo compensando a sobra de layout para o indicador continuar logo abaixo;
      - `ResizeObserver` no slot e no palco + `document.fonts.ready` + `window.resize`
        recalculam; abaixo de `lg` nada é escalado (páginas empilhadas seguem o fluxo).
      O capítulo mais alto é o I, então a caixa nasce no tamanho certo desde o primeiro
      paint; `justify-between` das páginas mantém Nota de Margem/paginação no pé da página.
- [x] **Títulos das capas contidos** (2026-10-17): os títulos longos da Estante
      (`OMNISCIENT READER'S VIEWPOINT`, `NEUROMANCER & TRILOGIA SPRAWL`) vazavam para fora
      dos retângulos das capas — o botão não tinha `overflow` e o `h3` usava
      `font-display text-xl` sem regra de quebra. Agora (`Estante.tsx`): o cover é
      `min-w-0 overflow-hidden` + `@container`; o título usa `font-sans` com
      `text-[clamp(8.5px,12cqw,13px)]` (escala com a largura real da capa, sem quebrar
      palavras), `tracking-tight` e `text-balance`; `jpTitle` e autor têm `truncate`
      como rede de segurança. Verificado de 360 a 1920px: `scrollWidth === clientWidth`
      e nenhum texto cruza a borda.
- [x] **`border-3` inválido substituído** por `border-[3px]` no painel de leitura da
      Estante (`Estante.tsx`, etiqueta de capítulo e balão de fala).
- [x] **`CONTEXTO.md` versionado** (2026-10-17): a regra `/CONTEXTO.md` foi removida do
      `.gitignore` e o arquivo entrou no índice do git. O `CONTEUDO.md` segue versionado
      como fonte oficial dos textos; ambos ficam no repositório.
- [x] **Responsividade Mobile & Despinagem Inteligente** (2026-10-17): o palco pinado (`TransitionStage.tsx`) agora utiliza `gsap.matchMedia("(min-width: 1024px)")`. Em telas menores que 1024px, o pin e o scrub da master timeline são desativados, permitindo que a página flua verticalmente sem cortes. `page.tsx` renderiza no mobile uma sequência direta dos 6 mundos com divisores temáticos (`MobileDivider`), touch scroll suave nativo e sem duplicação de camadas de transição. `Sobre.tsx` foi ajustado para `min-h-screen lg:h-screen lg:overflow-hidden` e `goToChapter` permite alternar os capítulos diretamente no mobile via clique nos botões de folhear.
- [x] **Formulário de Contato com API Route** (2026-10-17): criado endpoint `POST /api/contact` (`src/app/api/contact/route.ts`) com validação de campos (nome, e-mail regex, mensagem) e integração com Resend via `fetch` nativo com variável `RESEND_API_KEY`. Caso a chave não esteja configurada (ambiente de dev local), opera automaticamente em modo simulação com log no servidor. `Contato.tsx` atualizado com estados completos de envio (`idle`, `sending`, `success`, `error`), botão desabilitado com indicador de carregamento e mensagem de erro arcade.
- [x] **Hero Mouse Glow Otimizado (Zero Re-renders)** (2026-10-17): `Hero.tsx` migrado de `useState` para `containerRef` com variáveis CSS `--mouse-x` / `--mouse-y` atualizadas via `requestAnimationFrame`. Elimina re-renderizações completas a cada pixel de movimento do cursor.
- [x] **Acessibilidade Completa & `prefers-reduced-motion`** (2026-10-17): desativação do scroll-jacking no `TransitionStage` quando reduced-motion estiver ativo (`gsap.matchMedia`), chaveamento via Tailwind no `page.tsx` para o fluxo vertical sequencial acessível, desativação de interpolação no `useLenis.ts` com fallback instantâneo no `scrollToScrollY`, e mitigação global de pulso/bounce em `globals.css`.
- [x] **Auditoria de `scrollToDwell` & `LEAD_IN`** (2026-10-17): verificado matematicamente que `LEAD_IN` já está incluído no `start` do dwell window (`position + EFFECT_DURATION`). Destino de rolagem blindado com `triggerRef.current?.start ?? 0`.
- [x] **SEO Completo & OpenGraph Dinâmico** (2026-10-17): `layout.tsx` configurado com `metadataBase` dinâmica (`NEXT_PUBLIC_SITE_URL` com fallback para `https://ryanferreira.dev`), títulos com template (`%s | Ryan Ferreira`), descrição detalhada, keywords, autor, publisher, robots directives (`index, follow, max-image-preview:large`) e `alternates.canonical`. Suporte ao export dedicado de `viewport` para `themeColor: "#050505"` e escala móvel. Criado `opengraph-image.tsx` gerando dinamicamente cartão social 1200×630 via `ImageResponse` com estética dark cinematic, monograma RF, tags dos 6 universos e subtítulos.
- [x] **SEO Estrutural & PWA** (2026-10-17): criados `src/app/robots.ts` (bloqueando `/api/` e apontando para o sitemap) e `src/app/sitemap.ts` (indexação mensal com prioridade 1.0). Criado `src/app/manifest.ts` configurando Web App Manifest para PWA com cores de tema e ícones.
- [x] **Favicon Vetorial, Apple Touch Icon & Limpeza de Assets** (2026-10-17): criado `src/app/icon.svg` com monograma moderno e borda neon esmeralda em alta nitidez para qualquer resolução; criado `src/app/apple-icon.tsx` gerando ícone 180×180 via `ImageResponse` para dispositivos Apple. Removidos da pasta `public/` os 5 SVGs de template do boilerplate (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).
- [x] **Otimização de Fontes & Layout** (2026-10-17): adicionado `display: "swap"` nas definições de fontes do Google (`Inter`, `Syne`, `Playfair Display`, `JetBrains Mono`) em `layout.tsx`, eliminando FOIT e otimizando LCP.
- [x] **Documentação de Engenharia Completa** (2026-10-17): `README.md` totalmente reescrito em português com apresentação do portfólio, arquitetura de scroll com GSAP/Lenis, visão dos 6 mundos e 5 transições, responsividade/acessibilidade, stack técnica, árvore de diretórios, guia de variáveis de ambiente (`RESEND_API_KEY`, etc.) e scripts de verificação.
- [x] **Calibração Fina & Pacing do Scroll (Fase 4)** (2026-10-17):
      - `TransitionStage.tsx`: `HOLD_AFTER_EFFECT` aumentado de `0.45` para `0.60` (~360px de respiro) e `TRAILING_HOLD` aumentado de `0.4` para `0.60`. O tempo de permanência em mundos interativos e de leitura densa (Projetos, Skills, Estante e Contato) agora é confortável e natural antes de engatilhar a transição seguinte.
      - `Skills.tsx`: cabeçalho RPG harmonizado de `"GUILDA DOS ENGENHEIROS • NÍVEL 99"` para `"GUILDA DOS ENGENHEIROS • NV. MULTICLASSE"`, mantendo coerência visual com o badge da ficha de personagem.
      - `Sobre.tsx`: física do marcador (*ribbon*) recalibrada — deslocamento vertical ajustado de `-26px` para `-22px` e rotação `-2.5°` com easing `power2.inOut` tanto no desktop quanto no mobile, evitando que a ponta da fita extrapole o contorno do livro e garantindo assentamento amortecido na nova página.
- [x] **Trilha Cinematográfica de Mundos (Journey HUD) & Melhorias de UX/A11y** (2026-10-17):
      - `journeyStore.ts`: store baseado em `useSyncExternalStore` gerenciando o estado dos 6 mundos (`currentWorld`, `unlockedWorlds`, `justUnlocked`, `scrollProgress`) e função de navegação `navigateToWorld` via rolagem acelerada no Lenis;
      - `WorldJourneyRail.tsx`: trilha vertical ergonômica na lateral direita com 6 nós temáticos (Minimalista, Pergaminho Livro, Cyberpunk Neon, Runa RPG Âmbar, Halftone Mangá e Arcade CRT Verde Fósforo), linha de luz contínua de progresso, estados *Fog of War* (mundos futuros bloqueados com rótulo discreto da categoria), animação de desbloqueio com efeito ping de luz ao cruzar transições, e tooltips laterais ricos em hover/foco de teclado;
      - `MobileJourneyDock.tsx`: dock flutuante compacto touch no centro inferior para mobile com indicador de seção ativa (`0X / 06`) e gaveta de seleção rápida sincronizada via `IntersectionObserver`.
- [x] **Botões Temáticos de Scroll Centralizados & Navegação Cinemática (Fase 6)** (2026-10-17):
      - `SectionScrollPrompt.tsx`: botão arredondado (pílula) com ícone de mouse animado com ponto pulsante, tipografia mono e seta indicativa (`↓` ou `↑`). Posicionado com precisão matemática no centro da tela (`left-1/2 -translate-x-1/2` no desktop e `relative my-4` no mobile);
      - **Tematização Dinâmica da Seção Futura**: a cada seção, o botão antecipa o tema do universo seguinte (Hero → Sobre/Livro; Sobre → Projetos/Cyberpunk Ciano; Projetos → Skills/RPG Âmbar; Skills → Estante/Mangá P&B; Estante → Contato/Arcade CRT Verde; Contato → Início/Minimalista Branco);
      - **Remoção de Textos Descentralizados dos Rodapés**: removidos os textos `"Role para..."` de todos os 5 footers das seções (`Hero.tsx`, `Sobre.tsx`, `Projetos.tsx`, `Skills.tsx`, `Estante.tsx`), eliminando a assimetria visual causada pelo `justify-between`;
      - **Desaceleração da Animação ao Clicar**: duração da rolagem programática aumentada de `1.15s` para `2.2s` em `journeyStore.ts` e `useLenis.ts`, permitindo que o usuário aprecie as transições cinemáticas com ritmo suave e contemplativo;
      - `Sobre.tsx`: `slotRef` com `lg:pb-16` para garantir que o fit-to-height da escala 3D preserve a respiração visual com o botão e o indicador de capítulos.
- [x] `tsc --noEmit` **limpo**, `eslint` **limpo** e `npm run build` **100% aprovado** (rotas estáticas e dinâmicas geradas sem warnings).

---

## 8. Roadmap priorizado

### P0 — Correções reais (conteúdo/bugs visíveis) ✅ CONCLUÍDO

- [x] **Mobile quebrado:** ✅ **resolvido** (2026-10-17). `gsap.matchMedia` no `TransitionStage` + fluxo vertical despinado no mobile em `page.tsx`.
- [x] **Formulário não envia nada:** ✅ **resolvido** (2026-10-17). API Route `/api/contact` + estados de envio arcade em `Contato.tsx`.
- [x] **Versões mentindo na UI:** ✅ **resolvido** (2026-10-17).
- [x] **Typo em Sobre.tsx:** ✅ **resolvido** (2026-10-17).

### P1 — Bugs e qualidade ✅ CONCLUÍDO

- [x] **`scrollToDwell` e offset do gatilho:** ✅ **auditado e blindado** (2026-10-17). `triggerRef.current.start` adicionado ao salto e verificado que `LEAD_IN` já integra a linha do tempo.
- [x] **`mouseMove` sem throttle no Hero:** ✅ **resolvido** (2026-10-17). `containerRef` + CSS variables + `requestAnimationFrame`. Zero re-renderizações.
- [x] **Sem `prefers-reduced-motion`:** ✅ **resolvido** (2026-10-17). Fallback para o layout sequencial sem pin, bypass do Lenis e regras CSS globais.
- [x] **Código morto:** ✅ **resolvido** (2026-10-17). `getLenis` removido de `useLenis.ts`.

### P2 — SEO, performance e polimento ✅ CONCLUÍDO

- [x] **Metadata completa:** ✅ **resolvido** (2026-10-17). `layout.tsx` com `metadataBase`, OpenGraph, Twitter card, robots, canonical e export `viewport`.
- [x] **Card OpenGraph dinâmico:** ✅ **resolvido** (2026-10-17). `opengraph-image.tsx` via `ImageResponse` (1200x630).
- [x] **SEO estrutural & PWA:** ✅ **resolvido** (2026-10-17). `robots.ts`, `sitemap.ts` e `manifest.ts`.
- [x] **Favicon & Apple Icon:** ✅ **resolvido** (2026-10-17). `icon.svg` vetorial + `apple-icon.tsx` (180x180).
- [x] **Limpeza de assets:** ✅ **resolvido** (2026-10-17). SVGs boilerplate de `public/` removidos.
- [x] **Otimização de fontes:** ✅ **resolvido** (2026-10-17). `display: "swap"` em todas as 4 fontes Google.
- [x] **Documentação técnica:** ✅ **resolvido** (2026-10-17). `README.md` completo com arquitetura, stack e setup.

### Fase 4 — Calibração Fina & Pacing Visual ✅ CONCLUÍDO

- [x] **Pacing do scroll no desktop:** ✅ **resolvido** (2026-10-17). `HOLD_AFTER_EFFECT` aumentado para `0.60` e `TRAILING_HOLD` para `0.60` em `TransitionStage.tsx`.
- [x] **Alinhamento RPG:** ✅ **resolvido** (2026-10-17). Header de `Skills.tsx` unificado com `NV. MULTICLASSE`.
- [x] **Marcador do livro:** ✅ **resolvido** (2026-10-17). Deslocamento (`y: -22`) e amortecimento suave em `Sobre.tsx`.

### Fase 5 — Trilha de Mundos (Journey HUD), Acessibilidade & UX ✅ CONCLUÍDO

- [x] **Trilha Vertical Flutuante no Desktop:** ✅ **resolvido** (2026-10-17). `WorldJourneyRail.tsx` com 6 nós temáticos, linha de luz de progresso, tooltips ricos e acessibilidade por teclado.
- [x] **Fog of War & Reveal Animado:** ✅ **resolvido** (2026-10-17). Mundos futuros ocultos com rótulo discreto, desbloqueio dinâmico com flash de luz ao atingir a transição.
- [x] **Mobile Journey Dock:** ✅ **resolvido** (2026-10-17). `MobileJourneyDock.tsx` com gaveta touch compacta e sincronização via `IntersectionObserver`.

### Fase 6 — Botões Temáticos de Scroll Centralizados & Transição Suave ✅ CONCLUÍDO

- [x] **Botão Redondo Centralizado:** ✅ **resolvido** (2026-10-17). `SectionScrollPrompt.tsx` com ícone de mouse animado, texto mono e seta indicativa, posicionado matematicamente em `left-1/2 -translate-x-1/2`.
- [x] **Tematização Dinâmica por Seção:** ✅ **resolvido** (2026-10-17). Cada seção antecipa as cores, bordas e brilhos da seção seguinte, e a seção de Contato permite retornar ao início (`↑`).
- [x] **Eliminação de Assimetria nos Rodapés:** ✅ **resolvido** (2026-10-17). Textos `"Role para..."` removidos dos rodapés de `Hero`, `Sobre`, `Projetos`, `Skills` e `Estante`.
- [x] **Desaceleração da Animação ao Clicar:** ✅ **resolvido** (2026-10-17). Duração de transição aumentada de `1.15s` para `2.2s`, proporcionando rolagem suave e cinematográfica.

---

## 9. Pendências & decisões abertas

- **Fases P0, P1, P2, Fase 4, Fase 5 e Fase 6:** ✅ **100% concluídas** (2026-10-17). Mobile despinado, formulário com API Route, acessibilidade/reduced-motion, Hero glow otimizado, SEO completo, OpenGraph dinâmico, sitemap, robots, manifest, favicon, documentação completa, calibração fina de scroll/fita/textos, Trilha de Mundos (Journey HUD) com Fog of War, botões redondos temáticos de scroll perfeitamente centralizados e transição desacelerada de 2.2s.
- **Próximos Passos Sugeridos:**
  - Testes com usuários finais em diferentes tamanhos de tela para validar a nova experiência de rolagem desacelerada.
  - Eventual expansão de novos projetos no terminal conforme novos cases forem produzidos.

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
- [x] **Limpeza de Código Morto** (2026-10-17): export `getLenis` removido de `useLenis.ts`.
- [x] `tsc --noEmit` **limpo**, `eslint` **limpo** e `npm run build` **100% aprovado**.

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

### P2 — SEO, performance e polimento (PRÓXIMO PASSO)

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

- **Formulário:** ✅ **resolvido** (2026-10-17). Endpoint `POST /api/contact` implementado com validação, integração Resend e modo de simulação em dev.
- **Mobile & Acessibilidade:** ✅ **resolvido** (2026-10-17). `gsap.matchMedia` isola o pin para desktop com movimento permitido (`>= 1024px` + `no-preference`) e o mobile / reduced-motion conta com fluxo sequencial unpinned com divisores de universos.
- **Performance & Qualidade (P1):** ✅ **resolvido** (2026-10-17). Zero re-renders no Hero glow via CSS vars + rAF; código morto `getLenis` removido; `scrollToDwell` blindado.
- **Próximo passo:** Iniciar a Fase P2 — SEO (metadata OpenGraph/Twitter, `robots.ts`, `sitemap.ts`, favicon e ícones), documentação no `README.md` e otimização de fontes.
- **Dados reais:** ✅ **resolvido** (2026-10-17). `projetos.prj_04.liveUrl` agora aponta para
  o repositório do Visualisit e o filtro `AI & ENGINE` voltou a ter item (Grene). Restam
  ~57 campos do `CONTEUDO.md` em branco (rótulos de UI, transições, `footer_*`), mantidos como estão.
- **Skills × header RPG:** `skills.header_right` segue "GUILDA DOS ENGENHEIROS • NÍVEL 99"
  enquanto o nível do personagem virou "NV. MULTICLASSE" — decidir se alinha os dois.
- **Conteúdo:** `CONTEUDO.md` passa a ser a fonte oficial dos textos — altere lá e peça
  para aplicar; evita edição espalhada pelos componentes.
- **SEO:** domínio final para `metadataBase` / `sitemap`.
- **Pacing do scroll:** calibrar no olho o `HOLD_AFTER_EFFECT` (hoje `0.45`). Com esse
  valor, cada mundo não-livro (Projetos/Skills/Estante/Contato) fica visível por só
  ~270px de rolagem — se parecer apressado para ler/interagir, subir para `0.55`–`0.7`
  (uma linha em `TransitionStage.tsx`). Próximo passo: rodar `npm run dev` e validar a
  sensação do Hero até o Contato.
- **Marcador do livro:** validar no olho a intensidade do levante (hoje `y: -26`, `rotate: -3`)
  e o tempo (sobe em 0.16 / desce em 0.22) em `Sobre.tsx`; ajustar se parecer exagerado.
- **Altura do livro (fit-to-height):** a caixa fica presa à **maior altura já medida** na
  largura atual (hoje o Cap. I, o mais longo). Duas decisões abertas: (a) validar no olho em
  alturas de janela diferentes — medido: 100dvh 1300px → escala 1.00; 820px → 0.83 (corpo de
  19px → ~16px); 700px → 0.67 (~13px), e a mitigação seria reduzir padding/tipografia do livro
  por `dvh` para a escala não cair tanto; (b) o caso raro de redimensionar a janela estando num
  capítulo curto e depois virar para um mais alto ainda pode mudar a caixa uma vez — solução
  definitiva seria pré-medir os 3 capítulos num passe oculto (`aria-hidden`) no mount.
- **Títulos das capas (Estante):** validar no olho a escala por container query
  (`clamp(8.5px,12cqw,13px)`) em telas próximas de 1024px, onde a capa fica mais estreita
  e o título cai para ~8.5px. Se parecer pequeno demais, a alternativa é reduzir a
  largura do painel de leitura (shelf 8/12 + painel 4/12) ou abreviar os títulos apenas
  nas capas, mantendo o título completo no painel.
- **Transição CRT:** validar no olho a transição Estante → Contato reescrita — duração do
  colapso do papel (0.20), expansão do raster (0.40) e intensidade do flash (0.6). Se o
  `scaleY` do Contato parecer elástico demais, trocar por `clipPath`
  `inset(50% 0% 50% 0%) → inset(0%)`. Observação: a cópia da Estante renderizada dentro
  do `CRT` tem estado próprio (default Vagabond), então uma edição selecionada antes da
  transição pode "pular" no primeiro frame; mitigado iniciando o colapso em `t=0`.

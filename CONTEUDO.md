# CONTEUDO.md — Textos do Portfólio

> **Para que serve:** este arquivo centraliza **todos os textos visíveis** do site.
> Preencha o que quiser trocar e me avise. Eu leio este arquivo e aplico cada valor
> no componente certo (`src/components/sections/*` e `src/app/layout.tsx`).
>
> **Regras**
> 1. Escreva o texto novo **entre as duas linhas `@@`** de cada bloco.
> 2. **Bloco vazio = mantenho o texto atual.** Não precisa preencher tudo.
> 3. Pode usar parágrafos, acentos e pontuação normalmente. Não use `@@` dentro do texto.
> 4. **Não apague os títulos** (a linha que começa com `###`) nem as chaves — é por elas que eu localizo o campo.
> 5. Ao terminar, é só dizer: *"aplica o CONTEUDO.md"*.
>
> **Partes do arquivo**
> - **Parte A — Conteúdo real:** títulos, parágrafos, projetos, skills, mangás, links. É aqui que você deve focar.
> - **Parte B — Rótulos de interface:** códigos `01 //`, créditos de tecnologia, botões e labels de HUD.
>   Normalmente ficam como estão; edite só se quiser.
> - **Parte C — Mapa de aplicação:** tabela de chave → arquivo (referência para mim).
>
> **Tokens dinâmicos:** alguns textos usam `{playerName}`, `{playerEmail}`, `{n}`, `{coins}` e
> `{manaCost}`. Eles são substituídos em tempo de execução — **mantenha-os** se editar a frase.

---

# PARTE A — Conteúdo real

## 0. Global (SEO / aba do navegador)

### `global.title` — Título da aba
**Onde aparece:** aba do navegador e resultado de busca. `src/app/layout.tsx` → `metadata.title`.
**Texto atual:**
```text
Ryan Ferreira — Portfólio Cinematográfico
```
**Novo:**
@@
Ryan Ferreira — Tecnologia, Computação & Projetos
@@

### `global.description` — Descrição do site
**Onde aparece:** meta description (Google/redes). `src/app/layout.tsx` → `metadata.description`.
**Texto atual:**
```text
Código, histórias e mundos — tudo em um só scroll.
```
**Novo:**
@@
Portfólio de Ryan Ferreira. Estudante de Ciência da Computação (PUC Minas) e Técnico em Informática (COTEMIG), explorando desenvolvimento de software, infraestrutura, dados, IoT, suporte e segurança.
@@

---

## 1. Hero — Mundo neutro (`src/components/sections/Hero.tsx`)

### `hero.header_right` — Assinatura do topo
**Onde aparece:** canto superior direito do Hero (ao lado do ponto verde pulsante).
**Texto atual:**
```text
Ryan Ferreira © 2026
```
**Novo:**
@@
Ryan Ferreira © 2026
@@

### `hero.badge_label` — Selo acima do título (parte 1)
**Onde aparece:** pílula central acima do nome.
**Texto atual:**
```text
Portfólio Cinematográfico
```
**Novo:**
@@
Portfólio & Jornada em TI
@@

### `hero.badge_meta` — Selo acima do título (parte 2)
**Onde aparece:** depois do separador `•` na mesma pílula.
**Texto atual:**
```text
6 Mundos
```
**Novo:**
@@
Múltiplas Áreas
@@

### `hero.h1` — Título principal
**Onde aparece:** texto gigante no centro da tela.
**Texto atual:**
```text
Ryan Ferreira
```
**Novo:**
@@
Ryan Ferreira
@@

### `hero.subtitle` — Frase de apresentação
**Onde aparece:** logo abaixo do nome.
**Observação:** use `**palavra**` para manter o destaque em branco/negrito.
**Texto atual:**
```text
**Código**, **histórias** e **mundos** — tudo em um só scroll.
```
**Novo:**
@@
Movido pela curiosidade de entender como tudo funciona — do **hardware** e da **infraestrutura** ao **código**, aos **dados** e às **interfaces**.
@@

---

## 2. Sobre — Mundo livro (`src/components/sections/Sobre.tsx`)

> O livro tem **3 capítulos**. Cada capítulo ocupa uma página dupla (esquerda = título/citação, direita = corpo).
> O `body` deve ser escrito **completo** (com a primeira letra maiúscula): eu separo a capitular automaticamente.

### `sobre.header_right` — Crédito editorial do topo
**Onde aparece:** canto superior direito, acima do livro.
**Texto atual:**
```text
Edição de Colecionador • Ex-Libris Ryan Ferreira
```
**Novo:**
@@
Caderno de Jornada • Ex-Libris Ryan Ferreira
@@

### `sobre.ch1.number` — Capítulo 1 · número
**Texto atual:**
```text
Capítulo I
```
**Novo:**
@@
Capítulo I
@@

### `sobre.ch1.title` — Capítulo 1 · título
**Onde aparece:** página esquerda, título grande em serif.
**Texto atual:**
```text
O Autor & A Origem
```
**Novo:**
@@
A Curiosidade & O Começo
@@

### `sobre.ch1.quote` — Capítulo 1 · citação
**Onde aparece:** página esquerda, bloco com barra lateral.
**Texto atual:**
```text
“Antes de existir no terminal, cada sistema nasce como uma narrativa.”
```
**Novo:**
@@
“Mais do que decorar ferramentas, sempre quis abrir a caixa-preta e entender como a tecnologia realmente funciona por dentro.”
@@

### `sobre.ch1.body` — Capítulo 1 · corpo
**Onde aparece:** página direita (parágrafo justificado com capitular).
**Texto atual:**
```text
Desenvolvedor Full-Stack apaixonado por transformar interfaces comuns em experiências cinematográficas. Para mim, escrever código limpo e arquitetar sistemas escaláveis tem o mesmo rigor artesanal de escrever um bom livro: cada função tem um propósito e cada transição conduz o leitor pelo próximo capítulo.
```
**Novo:**
@@
Sou estudante de Ciência da Computação na PUC Minas e técnico em Informática pelo COTEMIG. Minha relação com a TI nasceu da vontade genuína de resolver problemas do mundo real usando a computação. Antes mesmo de focar apenas em desenvolvimento, vivi a tecnologia na linha de frente: prestei suporte técnico, cuidei de redes e equipamentos na Prefeitura de Nova Lima — onde também ajudei professores a integrarem ferramentas digitais na rotina escolar — e atuei no suporte a sistemas críticos de alta demanda para magistrados e servidores no TRT da 3ª Região. Lidar diretamente com pessoas e sistemas me ensinou que a boa tecnologia é aquela que não falha quando alguém mais precisa.
@@

### `sobre.ch1.marginNote` — Capítulo 1 · nota de margem
**Onde aparece:** caixa cinza ao final da página direita.
**Texto atual:**
```text
Nota de Margem #01 — Arquitetura limpa, performance 60fps e direção de arte no código.
```
**Novo:**
@@
Nota de Margem #01 — Base técnica no COTEMIG, Ciência da Computação na PUC Minas e vivência real mantendo sistemas no TRT-3 e na Prefeitura de Nova Lima.
@@

### `sobre.ch1.metaLeft` — Capítulo 1 · local
**Onde aparece:** topo da página esquerda, à direita do número do capítulo.
**Texto atual:**
```text
Belo Horizonte • Brasil
```
**Novo:**
@@
Nova Lima • Minas Gerais
@@

### `sobre.ch1.metaRight` — Capítulo 1 · paginação
**Onde aparece:** rodapé da página direita, à esquerda dos botões.
**Texto atual:**
```text
Pág. 14 — 15
```
**Novo:**
@@
Pág. 14 — 15
@@

### `sobre.ch2.number` — Capítulo 2 · número
**Texto atual:**
```text
Capítulo II
```
**Novo:**
@@
Capítulo II
@@

### `sobre.ch2.title` — Capítulo 2 · título
**Texto atual:**
```text
Filosofia de Engenharia
```
**Novo:**
@@
Caminhos que Já Explorei
@@

### `sobre.ch2.quote` — Capítulo 2 · citação
**Texto atual:**
```text
“A melhor tecnologia é aquela que parece magia para quem usa e poesia para quem mantém.”
```
**Novo:**
@@
“Na computação, cada área que você experimenta muda a forma como você enxerga todas as outras.”
@@

### `sobre.ch2.body` — Capítulo 2 · corpo
**Texto atual:**
```text
Combino o ecossistema moderno de React, Next.js e TypeScript com motores de animação como GSAP, ScrollTrigger e WebGL. Do banco de dados e APIs resilientes até o micro-detalhe tipográfico na tela, busco unir engenharia sólida com direção criativa.
```
**Novo:**
@@
Nunca gostei de me prender a uma única gaveta dentro da TI. Gosto de transitar por várias frentes para enxergar o sistema inteiro: já construí APIs e serviços backend com Java (Spring Boot), Node.js (TypeScript) e Python (FastAPI); criei interfaces web com React e aplicativos multiplataforma em tempo real com Flutter e Firebase; estudei administração de bancos de dados SQL e otimização de consultas; e montei meu próprio ambiente no Arch Linux para explorar redes, containers Docker, automação em Bash e segurança da informação. Cada experiência nova vira repertório para resolver o próximo desafio.
@@

### `sobre.ch2.marginNote` — Capítulo 2 · nota de margem
**Texto atual:**
```text
Nota de Margem #02 — Foco em DX (Developer Experience) tanto quanto em UX.
```
**Novo:**
@@
Nota de Margem #02 — Desenvolvimento Web & Mobile, Backend, Bancos de Dados, Infraestrutura Linux, Automação e Segurança.
@@

### `sobre.ch2.metaLeft` — Capítulo 2 · local
**Texto atual:**
```text
Engenharia & Design
```
**Novo:**
@@
Versatilidade em TI
@@

### `sobre.ch2.metaRight` — Capítulo 2 · paginação
**Texto atual:**
```text
Pág. 16 — 17
```
**Novo:**
@@
Pág. 16 — 17
@@

### `sobre.ch3.number` — Capítulo 3 · número
**Texto atual:**
```text
Capítulo III
```
**Novo:**
@@
Capítulo III
@@

### `sobre.ch3.title` — Capítulo 3 · título
**Texto atual:**
```text
Além do Código: Mundos
```
**Novo:**
@@
Do Silício às Histórias
@@

### `sobre.ch3.quote` — Capítulo 3 · citação
**Texto atual:**
```text
“Jogos, mangás e literatura moldaram meu olhar para ritmo, contraste e impacto visual.”
```
**Novo:**
@@
“De um sensor lendo o mundo físico a uma boa história no fim do dia, tudo nasce da vontade de explorar.”
@@

### `sobre.ch3.body` — Capítulo 3 · corpo
**Texto atual:**
```text
Quando não estou projetando aplicações web ou otimizando queries, estou explorando universos de RPG, colecionando edições de mangá ou estudando design de jogos retrô. Este portfólio reúne todas essas referências em uma única jornada contínua.
```
**Novo:**
@@
Essa sede de testar coisas diferentes me levou até a programar microcontroladores ESP32 em C/C++ para capturar dados ambientais na borda, enquanto na faculdade aprofundo a base matemática de cálculo, álgebra linear e estatística que sustenta a ciência de dados e a inteligência artificial. Quando fecho o terminal e a IDE, gosto de mergulhar em universos gigantes como One Piece e Omniscient Reader's Viewpoint, nos clássicos cyberpunk da Trilogia Sprawl e em leituras de filosofia. No fundo, explorar tecnologia e acompanhar boas histórias têm muito em comum: ambos pedem curiosidade, atenção aos detalhes e vontade de descobrir o que vem a seguir.
@@

### `sobre.ch3.marginNote` — Capítulo 3 · nota de margem
**Texto atual:**
```text
Nota de Margem #03 — Role a página para quebrar este livro e invadir o terminal.
```
**Novo:**
@@
Nota de Margem #03 — Role a página para fechar o livro e ver na prática os projetos que nasceram dessa caminhada.
@@

### `sobre.ch3.metaLeft` — Capítulo 3 · local
**Texto atual:**
```text
Cultura & Inspiração
```
**Novo:**
@@
Hardware, Dados & Cultura
@@

### `sobre.ch3.metaRight` — Capítulo 3 · paginação
**Texto atual:**
```text
Pág. 18 — 19
```
**Novo:**
@@
Pág. 18 — 19
@@

---

## 3. Projetos — Mundo cyberpunk (`src/components/sections/Projetos.tsx`)

> São **4 projetos**. `category` precisa ser exatamente um destes valores:
> `FULL-STACK`, `CREATIVE WEB` ou `AI & ENGINE` (senão o filtro não encontra o item).
> `stack` é uma lista: separe os itens por `,` (vírgula).

### `projetos.prj_01.code` — Projeto 1 · código
**Onde aparece:** na lista à esquerda e no cabeçalho do painel de detalhe.
**Texto atual:**
```text
PRJ_01 // NEXUS-CYBERDECK
```
**Novo:**
@@
PRJ_01 // DEVSTORE-FULLSTACK
@@

### `projetos.prj_01.name` — Projeto 1 · nome
**Texto atual:**
```text
Nexus OS — Cloud Dev Environment
```
**Novo:**
@@
DevStore — E-commerce Full Stack
@@

### `projetos.prj_01.category` — Projeto 1 · categoria
**Onde aparece:** filtro por categoria (ALL / FULL-STACK / CREATIVE WEB / AI & ENGINE).
**Texto atual:**
```text
FULL-STACK
```
**Novo:**
@@
FULL-STACK
@@

### `projetos.prj_01.status` — Projeto 1 · status
**Onde aparece:** selo verde no painel de detalhe.
**Texto atual:**
```text
ONLINE [99.98% UPTIME]
```
**Novo:**
@@
PUBLICADO [DOCKER & WEB]
@@

### `projetos.prj_01.stack` — Projeto 1 · stack
**Onde aparece:** tags `#tecnologia` no painel de detalhe.
**Texto atual:**
```text
Next.js 16, TypeScript, WebSockets, Docker, Tailwind
```
**Novo:**
@@
Node.js, TypeScript, React, Docker, JWT, REST API
@@

### `projetos.prj_01.summary` — Projeto 1 · descrição
**Onde aparece:** parágrafo principal do painel de detalhe.
**Texto atual:**
```text
Ambiente de desenvolvimento colaborativo no navegador com terminal em tempo real, execução em containers isolados e telemetria de latência.
```
**Novo:**
@@
Projeto em que conectei várias pontas que gosto de estudar: desenvolvimento web, arquitetura de backend, segurança e infraestrutura. Criei a API em Node.js com TypeScript e autenticação JWT, integrei ao frontend em React e isolei todo o ambiente em containers Docker para manter o deploy limpo e previsível.
@@

### `projetos.prj_01.metrics` — Projeto 1 · telemetria
**Onde aparece:** faixa ciano "TELEMETRIA:" no painel de detalhe.
**Texto atual:**
```text
< 18ms sync latency • 12k+ sessões
```
**Novo:**
@@
Full Stack Ponta a Ponta • Autenticação JWT • Ambiente em Docker
@@

### `projetos.prj_01.repoUrl` — Projeto 1 · link do código
**Onde aparece:** botão `> VER_CÓDIGO (GITHUB)`.
**Texto atual:**
```text
https://github.com/ryanferreira/nexus-os
```
**Novo:**
@@
https://github.com/ferreiraryan
@@

### `projetos.prj_01.liveUrl` — Projeto 1 · link da demo
**Onde aparece:** botão `> EXECUTAR_DEMO ↗`.
**Texto atual:**
```text
https://nexus-os-demo.vercel.app
```
**Novo:**
@@
https://ecomerce-node-git-main-ferreiraryans-projects.vercel.app/
@@

### `projetos.prj_02.code` — Projeto 2 · código
**Texto atual:**
```text
PRJ_02 // CHRONOS-SCROLL
```
**Novo:**
@@
PRJ_02 // GRENE-IOT-DATA
@@

### `projetos.prj_02.name` — Projeto 2 · nome
**Texto atual:**
```text
Chronos — Narrative Scroll Engine
```
**Novo:**
@@
Grene — Monitoramento Ambiental IoT
@@

### `projetos.prj_02.category` — Projeto 2 · categoria
**Texto atual:**
```text
CREATIVE WEB
```
**Novo:**
@@
AI & ENGINE
@@

### `projetos.prj_02.status` — Projeto 2 · status
**Texto atual:**
```text
DEPLOYED [v2.4.0]
```
**Novo:**
@@
EM PRODUÇÃO [IOT & EDGE]
@@

### `projetos.prj_02.stack` — Projeto 2 · stack
**Texto atual:**
```text
GSAP, ScrollTrigger, Lenis, Framer Motion, WebGL
```
**Novo:**
@@
C/C++, ESP32, API REST, Docker, Edge Computing
@@

### `projetos.prj_02.summary` — Projeto 2 · descrição
**Texto atual:**
```text
Motor de storytelling interativo que sincroniza transições de corte de tela, shaders e trilhas de áudio baseadas na velocidade do scroll.
```
**Novo:**
@@
Minha exploração na fronteira entre hardware, redes e dados. Programei o firmware em C/C++ para o microcontrolador ESP32 ler sensores físicos com baixo consumo de energia e transmitir os dados estruturados em tempo real para um backend via API REST orquestrado com Docker.
@@

### `projetos.prj_02.metrics` — Projeto 2 · telemetria
**Texto atual:**
```text
60fps cravados • 0 CLS
```
**Novo:**
@@
IoT & Hardware (ESP32) • Captura de Dados na Borda • API em Tempo Real
@@

### `projetos.prj_02.repoUrl` — Projeto 2 · link do código
**Texto atual:**
```text
https://github.com/ryanferreira/chronos-engine
```
**Novo:**
@@
https://github.com/ferreiraryan/grene
@@

### `projetos.prj_02.liveUrl` — Projeto 2 · link da demo
**Texto atual:**
```text
https://chronos-scroll.vercel.app
```
**Novo:**
@@
https://grene-production.up.railway.app/
@@

### `projetos.prj_03.code` — Projeto 3 · código
**Texto atual:**
```text
PRJ_03 // VALKYRIE-CORE
```
**Novo:**
@@
PRJ_03 // MOVIE-QUEUE-APP
@@

### `projetos.prj_03.name` — Projeto 3 · nome
**Texto atual:**
```text
Valkyrie — Autonomous Code Auditor
```
**Novo:**
@@
Movie Queue — App Social Multiplataforma
@@

### `projetos.prj_03.category` — Projeto 3 · categoria
**Texto atual:**
```text
AI & ENGINE
```
**Novo:**
@@
FULL-STACK
@@

### `projetos.prj_03.status` — Projeto 3 · status
**Texto atual:**
```text
NEURAL LINK ACTIVE
```
**Novo:**
@@
PUBLICADO [ANDROID & PWA]
@@

### `projetos.prj_03.stack` — Projeto 3 · stack
**Texto atual:**
```text
Node.js, TypeScript, AST Parser, PostgreSQL, Redis
```
**Novo:**
@@
Flutter, Dart, Firebase Auth, Cloud Firestore, PWA, Android
@@

### `projetos.prj_03.summary` — Projeto 3 · descrição
**Texto atual:**
```text
Pipeline de análise estática e semântica que inspeciona pull requests, detecta gargalos de concorrência e sugere patches automatizados.
```
**Novo:**
@@
Nasceu daquela indecisão clássica na hora de escolher um filme com os amigos. Desenvolvi o app em Flutter e Dart para rodar tanto no Android quanto no navegador como PWA, usando Firebase Authentication e Cloud Firestore para sincronizar escolhas em tempo real.
@@

### `projetos.prj_03.metrics` — Projeto 3 · telemetria
**Texto atual:**
```text
420+ repos auditados • -64% bug rate
```
**Novo:**
@@
Mobile & Web (PWA) • Sincronização em Tempo Real • Cloud BaaS
@@

### `projetos.prj_03.repoUrl` — Projeto 3 · link do código
**Texto atual:**
```text
https://github.com/ryanferreira/valkyrie-ai
```
**Novo:**
@@
https://github.com/ferreiraryan/movie-queue
@@

### `projetos.prj_03.liveUrl` — Projeto 3 · link da demo
**Texto atual:**
```text
https://valkyrie-auditor.vercel.app
```
**Novo:**
@@
https://movie-queue-c2e96.web.app/
@@

### `projetos.prj_04.code` — Projeto 4 · código
**Texto atual:**
```text
PRJ_04 // AKIRA-DESIGN-SYS
```
**Novo:**
@@
PRJ_04 // VISUALISIT-ALGO
@@

### `projetos.prj_04.name` — Projeto 4 · nome
**Texto atual:**
```text
Akira — Neo-Tokyo UI Kit
```
**Novo:**
@@
Visualisit — Visualizador de Algoritmos
@@

### `projetos.prj_04.category` — Projeto 4 · categoria
**Texto atual:**
```text
CREATIVE WEB
```
**Novo:**
@@
CREATIVE WEB
@@

### `projetos.prj_04.status` — Projeto 4 · status
**Texto atual:**
```text
STABLE RELEASE
```
**Novo:**
@@
MVP PUBLICADO [ALGORITMOS]
@@

### `projetos.prj_04.stack` — Projeto 4 · stack
**Texto atual:**
```text
React 19, Tailwind CSS, Radix UI, SVG Filters
```
**Novo:**
@@
React, TypeScript, Algoritmos, Estruturas de Dados, Vite
@@

### `projetos.prj_04.summary` — Projeto 4 · descrição
**Texto atual:**
```text
Biblioteca de componentes acessíveis com estética cyberpunk, HUDs modulares, efeitos de glitch controlados e suporte completo a teclado.
```
**Novo:**
@@
Um jeito de tirar os conceitos da Ciência da Computação do papel e torná-los visuais. Construí uma aplicação interativa em React e TypeScript que anima passo a passo algoritmos clássicos de ordenação, como Selection Sort e Insertion Sort, facilitando enxergar a lógica acontecendo na tela.
@@

### `projetos.prj_04.metrics` — Projeto 4 · telemetria
**Texto atual:**
```text
38 componentes • 100% A11y score
```
**Novo:**
@@
Ciência da Computação • Lógica Visual Passo a Passo • Interface Reativa
@@

### `projetos.prj_04.repoUrl` — Projeto 4 · link do código
**Texto atual:**
```text
https://github.com/ryanferreira/akira-ui
```
**Novo:**
@@
https://github.com/ferreiraryan/visualisit
@@

### `projetos.prj_04.liveUrl` — Projeto 4 · link da demo
**Texto atual:**
```text
https://akira-ui.vercel.app
```
**Novo:**
@@
https://github.com/ferreiraryan/visualisit
@@

---

## 4. Skills — Mundo RPG (`src/components/sections/Skills.tsx`)

> Estrutura: **3 grimórios** (`g1`, `g2`, `g3`), cada um com **3 habilidades** (`s1`, `s2`, `s3`).
> `level` é um número de **0 a 100** (preenche a barra). `rank` é o selo textual (ex.: `MESTRE [S+]`).

### `skills.name` — Nome do personagem
**Onde aparece:** ficha, título grande.
**Texto atual:**
```text
Ryan Ferreira
```
**Novo:**
@@
Ryan Ferreira
@@

### `skills.class` — Classe
**Onde aparece:** selo acima do nome.
**Texto atual:**
```text
CLASSE: ARQUITETO ARCANO
```
**Novo:**
@@
CLASSE: EXPLORADOR DE TI & COMPUTAÇÃO
@@

### `skills.level` — Nível
**Onde aparece:** canto direito acima do nome.
**Texto atual:**
```text
NV. 99
```
**Novo:**
@@
NV. MULTICLASSE
@@

### `skills.hp_label` — Rótulo da barra de HP
**Texto atual:**
```text
HP (ESTABILIDADE EM PRODUÇÃO)
```
**Novo:**
@@
HP (RESILIÊNCIA & DISPONIBILIDADE)
@@

### `skills.hp_value` — Valor da barra de HP
**Texto atual:**
```text
9999 / 9999
```
**Novo:**
@@
9999 / 9999
@@

### `skills.mp_label` — Rótulo da barra de MP
**Texto atual:**
```text
MP (CRIATIVIDADE & CAFEÍNA)
```
**Novo:**
@@
MP (CURIOSIDADE & VONTADE DE APRENDER)
@@

### `skills.mp_value` — Valor da barra de MP
**Texto atual:**
```text
850 / 850
```
**Novo:**
@@
999 / 999
@@

### `skills.attr.INT.name` — Atributo INT · nome
**Onde aparece:** grade "Atributos Base".
**Texto atual:**
```text
Arquitetura & Lógica
```
**Novo:**
@@
Lógica, Dados & Ciência da Computação
@@

### `skills.attr.INT.val` — Atributo INT · valor (0–100)
**Texto atual:**
```text
96
```
**Novo:**
@@
92
@@

### `skills.attr.DEX.name` — Atributo DEX · nome
**Texto atual:**
```text
UI Motion & Performance
```
**Novo:**
@@
Desenvolvimento Web, Mobile & APIs
@@

### `skills.attr.DEX.val` — Atributo DEX · valor (0–100)
**Texto atual:**
```text
94
```
**Novo:**
@@
94
@@

### `skills.attr.WIS.name` — Atributo WIS · nome
**Texto atual:**
```text
Resolução de Problemas
```
**Novo:**
@@
Infraestrutura, Linux & Segurança
@@

### `skills.attr.WIS.val` — Atributo WIS · valor (0–100)
**Texto atual:**
```text
92
```
**Novo:**
@@
93
@@

### `skills.attr.CHA.name` — Atributo CHA · nome
**Texto atual:**
```text
Storytelling & UX
```
**Novo:**
@@
Suporte, Comunicação & Trabalho em Equipe
@@

### `skills.attr.CHA.val` — Atributo CHA · valor (0–100)
**Texto atual:**
```text
95
```
**Novo:**
@@
95
@@

### `skills.equipment` — Equipamento atual
**Onde aparece:** caixa âmbar no rodapé da coluna esquerda.
**Texto atual:**
```text
Next.js 16 Grimoire + Luvas de TypeScript + Botas de Scroll Suave (Lenis)
```
**Novo:**
@@
Arch Linux + Neovim + Docker + Bagagem da PUC Minas & COTEMIG + Curiosidade para explorar novas áreas
@@

### `skills.g1.label` — Grimório 1 · nome da aba
**Texto atual:**
```text
Grimório Front-End
```
**Novo:**
@@
Desenvolvimento & Apps
@@

### `skills.g1.s1.name` — Grimório 1 · skill 1 · nome
**Texto atual:**
```text
Next.js 16 & React 19
```
**Novo:**
@@
Back-End & APIs (Java, Node & Python)
@@

### `skills.g1.s1.level` — Grimório 1 · skill 1 · nível (0–100)
**Texto atual:**
```text
96
```
**Novo:**
@@
92
@@

### `skills.g1.s1.rank` — Grimório 1 · skill 1 · rank
**Texto atual:**
```text
MESTRE [S+]
```
**Novo:**
@@
VERSÁTIL [S]
@@

### `skills.g1.s1.manaCost` — Grimório 1 · skill 1 · custo
**Texto atual:**
```text
Passiva Contínua
```
**Novo:**
@@
20 MP
@@

### `skills.g1.s1.desc` — Grimório 1 · skill 1 · descrição
**Onde aparece:** caixa "GRIMÓRIO // DETALHE DA HABILIDADE".
**Texto atual:**
```text
Server Components, App Router, Streaming SSR e arquitetura modular de alta performance.
```
**Novo:**
@@
Construção de APIs REST com Spring Boot, Node.js (TypeScript) e FastAPI, aplicando autenticação JWT, TDD e foco em código seguro e organizado.
@@

### `skills.g1.s2.name` — Grimório 1 · skill 2 · nome
**Texto atual:**
```text
TypeScript Estrito
```
**Novo:**
@@
Front-End & Web (React & TypeScript)
@@

### `skills.g1.s2.level` — Grimório 1 · skill 2 · nível (0–100)
**Texto atual:**
```text
94
```
**Novo:**
@@
88
@@

### `skills.g1.s2.rank` — Grimório 1 · skill 2 · rank
**Texto atual:**
```text
MESTRE [S]
```
**Novo:**
@@
AVANÇADO [A+]
@@

### `skills.g1.s2.manaCost` — Grimório 1 · skill 2 · custo
**Texto atual:**
```text
0 MP
```
**Novo:**
@@
15 MP
@@

### `skills.g1.s2.desc` — Grimório 1 · skill 2 · descrição
**Texto atual:**
```text
Tipagem avançada, generics, inferência segura de contratos de API e zero 'any'.
```
**Novo:**
@@
Criação de interfaces web modernas, responsivas e PWAs que conversam de ponta a ponta com o backend mantendo consistência de tipos.
@@

### `skills.g1.s3.name` — Grimório 1 · skill 3 · nome
**Texto atual:**
```text
Tailwind CSS & Design Systems
```
**Novo:**
@@
Mobile & Tempo Real (Flutter & Firebase)
@@

### `skills.g1.s3.level` — Grimório 1 · skill 3 · nível (0–100)
**Texto atual:**
```text
98
```
**Novo:**
@@
85
@@

### `skills.g1.s3.rank` — Grimório 1 · skill 3 · rank
**Texto atual:**
```text
GRÃO-MESTRE [SS]
```
**Novo:**
@@
EXPLORADOR [A]
@@

### `skills.g1.s3.manaCost` — Grimório 1 · skill 3 · custo
**Texto atual:**
```text
10 MP
```
**Novo:**
@@
20 MP
@@

### `skills.g1.s3.desc` — Grimório 1 · skill 3 · descrição
**Texto atual:**
```text
Tokens semânticos, layouts responsivos fluidos e temas customizados multiverso.
```
**Novo:**
@@
Desenvolvimento de aplicativos para Android e Web com sincronização instantânea no Cloud Firestore, autenticação de usuários e boa experiência de uso.
@@

### `skills.g2.label` — Grimório 2 · nome da aba
**Texto atual:**
```text
Artes de Animação
```
**Novo:**
@@
Infra, Linux & Suporte
@@

### `skills.g2.s1.name` — Grimório 2 · skill 1 · nome
**Texto atual:**
```text
GSAP & ScrollTrigger
```
**Novo:**
@@
Linux (Arch), Redes & Segurança
@@

### `skills.g2.s1.level` — Grimório 2 · skill 1 · nível (0–100)
**Texto atual:**
```text
92
```
**Novo:**
@@
94
@@

### `skills.g2.s1.rank` — Grimório 2 · skill 1 · rank
**Texto atual:**
```text
ARCANO [S]
```
**Novo:**
@@
DOMÍNIO PRÁTICO [S+]
@@

### `skills.g2.s1.manaCost` — Grimório 2 · skill 1 · custo
**Texto atual:**
```text
25 MP
```
**Novo:**
@@
Passiva Contínua
@@

### `skills.g2.s1.desc` — Grimório 2 · skill 1 · descrição
**Texto atual:**
```text
Timelines complexas, pin de seções, scrub milimétrico e cortes de tela sincronizados.
```
**Novo:**
@@
Configuração e uso diário de Arch Linux, explorando o sistema operacional a fundo, redes TCP/IP, firewalls, hardening e boas práticas do OWASP Top 10.
@@

### `skills.g2.s2.name` — Grimório 2 · skill 2 · nome
**Texto atual:**
```text
Lenis & Framer Motion
```
**Novo:**
@@
Docker, Ambientes & Automação Bash
@@

### `skills.g2.s2.level` — Grimório 2 · skill 2 · nível (0–100)
**Texto atual:**
```text
90
```
**Novo:**
@@
90
@@

### `skills.g2.s2.rank` — Grimório 2 · skill 2 · rank
**Texto atual:**
```text
ARCANO [A+]
```
**Novo:**
@@
ESPECIALISTA [S]
@@

### `skills.g2.s2.manaCost` — Grimório 2 · skill 2 · custo
**Texto atual:**
```text
15 MP
```
**Novo:**
@@
20 MP
@@

### `skills.g2.s2.desc` — Grimório 2 · skill 2 · descrição
**Texto atual:**
```text
Inércia suave de rolagem sincronizada ao ticker e transições declarativas de layout.
```
**Novo:**
@@
Conteinerização para isolar aplicações e criação de scripts em Shell/Bash que automatizam tarefas repetitivas de infraestrutura e desenvolvimento.
@@

### `skills.g2.s3.name` — Grimório 2 · skill 3 · nome
**Texto atual:**
```text
SVG Clip-Path & Shaders
```
**Novo:**
@@
Suporte Técnico, Hardware & Pessoas
@@

### `skills.g2.s3.level` — Grimório 2 · skill 3 · nível (0–100)
**Texto atual:**
```text
86
```
**Novo:**
@@
95
@@

### `skills.g2.s3.rank` — Grimório 2 · skill 3 · rank
**Texto atual:**
```text
ESPECIALISTA [A]
```
**Novo:**
@@
VIVÊNCIA REAL [S+]
@@

### `skills.g2.s3.manaCost` — Grimório 2 · skill 3 · custo
**Texto atual:**
```text
35 MP
```
**Novo:**
@@
10 MP
@@

### `skills.g2.s3.desc` — Grimório 2 · skill 3 · descrição
**Texto atual:**
```text
Máscaras vetoriais dinâmicas para efeitos de rasgo de papel, estilhaços e CRT.
```
**Novo:**
@@
Experiência prática no TRT-3 e na Prefeitura de Nova Lima resolvendo incidentes críticos, fazendo manutenção de hardware e redes e apoiando usuários e professores.
@@

### `skills.g3.label` — Grimório 3 · nome da aba
**Texto atual:**
```text
Forja Back-End
```
**Novo:**
@@
Dados, IoT & Ciência
@@

### `skills.g3.s1.name` — Grimório 3 · skill 1 · nome
**Texto atual:**
```text
Node.js & APIs REST/GraphQL
```
**Novo:**
@@
Bancos de Dados & SQL
@@

### `skills.g3.s1.level` — Grimório 3 · skill 1 · nível (0–100)
**Texto atual:**
```text
91
```
**Novo:**
@@
89
@@

### `skills.g3.s1.rank` — Grimório 3 · skill 1 · rank
**Texto atual:**
```text
MESTRE [S]
```
**Novo:**
@@
CERTIFICADO [A+]
@@

### `skills.g3.s1.manaCost` — Grimório 3 · skill 1 · custo
**Texto atual:**
```text
20 MP
```
**Novo:**
@@
15 MP
@@

### `skills.g3.s1.desc` — Grimório 3 · skill 1 · descrição
**Texto atual:**
```text
Serviços escaláveis, autenticação segura, caching inteligente e baixa latência.
```
**Novo:**
@@
Modelagem e administração de bancos de dados relacionais, com planejamento de índices, otimização de consultas e estratégias de recuperação.
@@

### `skills.g3.s2.name` — Grimório 3 · skill 2 · nome
**Texto atual:**
```text
PostgreSQL, Prisma & Redis
```
**Novo:**
@@
IoT & Sistemas Embarcados (C/C++ & ESP32)
@@

### `skills.g3.s2.level` — Grimório 3 · skill 2 · nível (0–100)
**Texto atual:**
```text
88
```
**Novo:**
@@
84
@@

### `skills.g3.s2.rank` — Grimório 3 · skill 2 · rank
**Texto atual:**
```text
VETERANO [A+]
```
**Novo:**
@@
INVENTOR [A]
@@

### `skills.g3.s2.manaCost` — Grimório 3 · skill 2 · custo
**Texto atual:**
```text
20 MP
```
**Novo:**
@@
25 MP
@@

### `skills.g3.s2.desc` — Grimório 3 · skill 2 · descrição
**Texto atual:**
```text
Modelagem relacional limpa, índices otimizados e filas assíncronas.
```
**Novo:**
@@
Programação próxima ao hardware para leitura de sensores em microcontroladores, cuidando de eficiência energética, memória e envio de dados na borda.
@@

### `skills.g3.s3.name` — Grimório 3 · skill 3 · nome
**Texto atual:**
```text
Docker, CI/CD & Cloud
```
**Novo:**
@@
Algoritmos, Matemática & Base em IA
@@

### `skills.g3.s3.level` — Grimório 3 · skill 3 · nível (0–100)
**Texto atual:**
```text
85
```
**Novo:**
@@
86
@@

### `skills.g3.s3.rank` — Grimório 3 · skill 3 · rank
**Texto atual:**
```text
VETERANO [A]
```
**Novo:**
@@
ACADÊMICO [A]
@@

### `skills.g3.s3.manaCost` — Grimório 3 · skill 3 · custo
**Texto atual:**
```text
30 MP
```
**Novo:**
@@
30 MP
@@

### `skills.g3.s3.desc` — Grimório 3 · skill 3 · descrição
**Texto atual:**
```text
Containers reprodutíveis, pipelines automatizados e deploy edge.
```
**Novo:**
@@
Base em Ciência da Computação na PUC Minas unindo Estruturas de Dados, Cálculo, Álgebra Linear e Estatística para análise de dados e modelos de IA.
@@

---

## 5. Estante — Mundo mangá/HQ (`src/components/sections/Estante.tsx`)

> São **4 volumes**. `accent` é a dupla de classes Tailwind de cor da capa (fundo + texto),
> ex.: `bg-red-700 text-white`. Se não quiser mexer em cor, deixe o bloco vazio.

### `estante.vol1.vol` — Volume 1 · etiqueta
**Texto atual:**
```text
VOL. 01
```
**Novo:**
@@
VOL. 01
@@

### `estante.vol1.title` — Volume 1 · título
**Texto atual:**
```text
Vagabond
```
**Novo:**
@@
One Piece
@@

### `estante.vol1.jpTitle` — Volume 1 · título japonês
**Texto atual:**
```text
バガボンド
```
**Novo:**
@@
ワンピース
@@

### `estante.vol1.author` — Volume 1 · autor
**Texto atual:**
```text
Takehiko Inoue
```
**Novo:**
@@
Eiichiro Oda
@@

### `estante.vol1.accent` — Volume 1 · cores da capa
**Texto atual:**
```text
bg-red-700 text-white
```
**Novo:**
@@
bg-red-700 text-amber-300
@@

### `estante.vol1.quote` — Volume 1 · citação
**Onde aparece:** balão de fala no painel de leitura.
**Texto atual:**
```text
“Preocupado com uma única folha, você não verá a árvore.”
```
**Novo:**
@@
“Enquanto eu estiver vivo, existem infinitas possibilidades!”
@@

### `estante.vol1.review` — Volume 1 · resenha
**Onde aparece:** parágrafo do painel de leitura.
**Texto atual:**
```text
Referência absoluta de traço, disciplina e foco. Me ensinou que maestria técnica exige paciência e atenção ao espaço vazio.
```
**Novo:**
@@
A maior aula sobre curiosidade, parceria e construção de mundo. Me lembra todos os dias que explorar o desconhecido — seja uma ilha nova ou uma área da TI que nunca testei antes — é muito melhor quando a gente mantém a mente aberta e valoriza quem caminha junto.
@@

### `estante.vol2.vol` — Volume 2 · etiqueta
**Texto atual:**
```text
VOL. 02
```
**Novo:**
@@
VOL. 02
@@

### `estante.vol2.title` — Volume 2 · título
**Texto atual:**
```text
Berserk
```
**Novo:**
@@
Omniscient Reader's Viewpoint
@@

### `estante.vol2.jpTitle` — Volume 2 · título japonês
**Texto atual:**
```text
ベルセルク
```
**Novo:**
@@
전지적 독자 시점
@@

### `estante.vol2.author` — Volume 2 · autor
**Texto atual:**
```text
Kentaro Miura
```
**Novo:**
@@
sing N song
@@

### `estante.vol2.accent` — Volume 2 · cores da capa
**Texto atual:**
```text
bg-neutral-900 text-amber-400
```
**Novo:**
@@
bg-slate-900 text-cyan-400
@@

### `estante.vol2.quote` — Volume 2 · citação
**Texto atual:**
```text
“Mesmo que você force de volta o que foi perdido, ainda não será como era antes.”
```
**Novo:**
@@
“Havia três maneiras de sobreviver em um mundo em ruínas.”
@@

### `estante.vol2.review` — Volume 2 · resenha
**Texto atual:**
```text
Construção de mundo monumental e hachuras inigualáveis. Inspiração direta para a seção de RPG e para resiliência em projetos difíceis.
```
**Novo:**
@@
Uma das minhas histórias favoritas: metalinguagem pura, estratégia e um protagonista que vence porque observa os detalhes e entende as regras do sistema melhor do que qualquer um. Tem tudo a ver com a forma como gosto de estudar e destrinchar problemas na computação.
@@

### `estante.vol3.vol` — Volume 3 · etiqueta
**Texto atual:**
```text
VOL. 03
```
**Novo:**
@@
VOL. 03
@@

### `estante.vol3.title` — Volume 3 · título
**Texto atual:**
```text
Akira
```
**Novo:**
@@
Neuromancer & Trilogia Sprawl
@@

### `estante.vol3.jpTitle` — Volume 3 · título japonês
**Texto atual:**
```text
アキラ
```
**Novo:**
@@
ニューロマンサー
@@

### `estante.vol3.author` — Volume 3 · autor
**Texto atual:**
```text
Katsuhiro Otomo
```
**Novo:**
@@
William Gibson
@@

### `estante.vol3.accent` — Volume 3 · cores da capa
**Texto atual:**
```text
bg-rose-600 text-white
```
**Novo:**
@@
bg-zinc-900 text-emerald-400
@@

### `estante.vol3.quote` — Volume 3 · citação
**Texto atual:**
```text
“O futuro não é uma linha reta; é um circuito em sobrecarga.”
```
**Novo:**
@@
“O céu sobre o porto tinha a cor de uma TV sintonizada em um canal fora do ar.”
@@

### `estante.vol3.review` — Volume 3 · resenha
**Texto atual:**
```text
A bíblia visual do Cyberpunk. A direção de iluminação neon e a escala arquitetônica de Neo-Tokyo guiam toda a minha estética de terminal.
```
**Novo:**
@@
O ponto de partida do cyberpunk e do próprio conceito de ciberespaço. A Trilogia Sprawl alimenta direto meu fascínio por redes, segurança, sistemas operacionais, inteligência artificial e essa fronteira onde o hardware, os dados e as pessoas se cruzam.
@@

### `estante.vol4.vol` — Volume 4 · etiqueta
**Texto atual:**
```text
VOL. 04
```
**Novo:**
@@
VOL. 04
@@

### `estante.vol4.title` — Volume 4 · título
**Texto atual:**
```text
Spider-Verse Artbook
```
**Novo:**
@@
Meditações
@@

### `estante.vol4.jpTitle` — Volume 4 · título japonês
**Texto atual:**
```text
スパイダーバース
```
**Novo:**
@@
Τὰ εἰς ἑαυτόν
@@

### `estante.vol4.author` — Volume 4 · autor
**Texto atual:**
```text
Alberto Mielgo & Equipe
```
**Novo:**
@@
Marco Aurélio
@@

### `estante.vol4.accent` — Volume 4 · cores da capa
**Texto atual:**
```text
bg-indigo-700 text-yellow-300
```
**Novo:**
@@
bg-stone-800 text-amber-200
@@

### `estante.vol4.quote` — Volume 4 · citação
**Texto atual:**
```text
“Cada universo merece sua própria linguagem visual e taxa de quadros.”
```
**Novo:**
@@
“A qualidade dos seus pensamentos determina a qualidade da sua mente.”
@@

### `estante.vol4.review` — Volume 4 · resenha
**Texto atual:**
```text
A faísca central deste portfólio: misturar retículas de quadrinhos, glitch cromático e múltiplos mundos dentro de uma única narrativa.
```
**Novo:**
@@
Escrito como um caderno pessoal de reflexões, traz uma visão pé-no-chão sobre clareza mental, foco no que está ao nosso alcance e busca pela causa real das coisas. Na TI, quando tudo parece urgente, essa calma analítica faz toda a diferença para resolver problemas de verdade.
@@

---

## 6. Contato — Mundo arcade (`src/components/sections/Contato.tsx`)

> ⚠ **Links fictícios:** os três canais abaixo ainda apontam para `ryanferreira`.
> Troque por seus links reais.

### `contato.link_github_url` — GitHub · URL
**Texto atual:**
```text
https://github.com/ryanferreira
```
**Novo:**
@@
https://github.com/ferreiraryan
@@

### `contato.link_github_handle` — GitHub · handle exibido
**Onde aparece:** lado direito do botão `[1P] GITHUB`.
**Texto atual:**
```text
/ryanferreira ↗
```
**Novo:**
@@
/ferreiraryan ↗
@@

### `contato.link_linkedin_url` — LinkedIn · URL
**Texto atual:**
```text
https://linkedin.com/in/ryanferreira
```
**Novo:**
@@
https://linkedin.com/in/ferryan
@@

### `contato.link_linkedin_handle` — LinkedIn · handle exibido
**Texto atual:**
```text
/in/ryanferreira ↗
```
**Novo:**
@@
/in/ferryan ↗
@@

### `contato.email` — E-mail direto
**Onde aparece:** botão `[3P] E-MAIL DIRETO` (link `mailto:`) e o texto exibido.
**Texto atual:**
```text
contato@ryanferreira.dev
```
**Novo:**
@@
ryanferreira4883@gmail.com
@@

### `contato.headline` — Manchete do gabinete
**Onde aparece:** título grande abaixo de "INSERT COIN".
**Texto atual:**
```text
PLAYER 1 — INICIAR CONTATO
```
**Novo:**
@@
PLAYER 1 — VAMOS CONVERSAR?
@@

### `contato.credit_btn` — Botão de ficha
**Texto atual:**
```text
🪙 INSERIR FICHA (+1 CRÉDITO)
```
**Novo:**
@@
🪙 INSERIR FICHA (+1 CRÉDITO)
@@

### `contato.form_name_label` — Formulário · label do nome
**Texto atual:**
```text
NICKNAME / NOME:
```
**Novo:**
@@
NICKNAME / SEU NOME:
@@

### `contato.form_name_placeholder` — Formulário · placeholder do nome
**Texto atual:**
```text
Ex.: Player One
```
**Novo:**
@@
Ex.: Como posso te chamar?
@@

### `contato.form_email_label` — Formulário · label do e-mail
**Texto atual:**
```text
E-MAIL DE RESPOSTA:
```
**Novo:**
@@
E-MAIL PARA RESPOSTA:
@@

### `contato.form_email_placeholder` — Formulário · placeholder do e-mail
**Texto atual:**
```text
player@dominio.com
```
**Novo:**
@@
seuemail@dominio.com
@@

### `contato.form_quest_label` — Formulário · label da mensagem
**Texto atual:**
```text
BRIEFING DA MISSÃO / PROJETO:
```
**Novo:**
@@
SOBRE O QUE VAMOS CONVERSAR?
@@

### `contato.form_quest_placeholder` — Formulário · placeholder da mensagem
**Texto atual:**
```text
Conte sobre o projeto, ideia ou oportunidade...
```
**Novo:**
@@
Me conta sobre uma oportunidade na área de TI, uma ideia de projeto ou manda um oi pra trocarmos ideia sobre tecnologia...
@@

### `contato.form_submit` — Formulário · botão de envio
**Texto atual:**
```text
▶ PRESS START — ENVIAR MENSAGEM
```
**Novo:**
@@
▶ PRESS START — ENVIAR MENSAGEM
@@

### `contato.success_kicker` — Confirmação · tarja superior
**Onde aparece:** tela exibida após o envio.
**Texto atual:**
```text
STAGE CLEAR! // MENSAGEM ENVIADA
```
**Novo:**
@@
STAGE CLEAR! // MENSAGEM ENVIADA
@@

### `contato.success_title` — Confirmação · título
**Observação:** `{playerName}` é substituído pelo nome digitado.
**Texto atual:**
```text
GG, {playerName}! Missão registrada no servidor.
```
**Novo:**
@@
GG, {playerName}! Mensagem registrada por aqui.
@@

### `contato.success_body` — Confirmação · texto
**Observação:** `{playerEmail}` é substituído pelo e-mail digitado.
**Texto atual:**
```text
Ryan Ferreira responderá em breve para {playerEmail}.
```
**Novo:**
@@
Valeu demais pelo contato! Vou ler tudo com calma e te respondo em breve pelo {playerEmail}.
@@

### `contato.success_btn` — Confirmação · botão
**Texto atual:**
```text
ENVIAR NOVA TRANSMISSÃO
```
**Novo:**
@@
ENVIAR NOVA MENSAGEM
@@

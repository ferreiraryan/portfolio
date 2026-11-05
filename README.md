# Ryan Ferreira — Portfólio Cinemático

> Portfólio interativo single-scroll desenvolvido com Next.js (App Router), React 19, Tailwind CSS v4, GSAP ScrollTrigger e Lenis Smooth Scroll. Uma jornada imersiva através de 6 universos temáticos e 5 transições cinemáticas seamlessly orquestradas.

---

## 🌌 Visão Geral & Filosofia

O projeto explora a interseção entre engenharia de software de alta performance, design generativo e narrativa visual imersiva. Em vez de uma navegação tradicional baseada em páginas estáticas ou âncoras comuns, o visitante é conduzido através de uma **master timeline de scroll contínuo**:

1. **Hero (Neutro / Abstrato)**: Apresentação inicial com iluminação dinâmica por radial glow seguindo o cursor (otimizado via CSS custom properties e `requestAnimationFrame`).
2. **Sobre (O Livro de Dois Capítulos)**: Livro tridimensional aberto com páginas que viram fisicamente em 180° no espaço 3D conforme o scroll ou via botões interativos ("Folhear Capítulos"). Inclui algoritmo responsivo de ajuste dinâmico à altura da tela (*fit-to-height*).
3. **Projetos (Cyberpunk Terminal)**: Showcase dos principais projetos de software com filtragem dinâmica por categoria (*Full-Stack*, *Creative Web*, *AI & Engine*), painel de telemetria e visualização de stack.
4. **Skills (RPG Character Sheet)**: Ficha de personagem clássica de RPG com barras de HP/MP, atributos de status e grimórios de habilidades organizados por abas.
5. **Estante (Mangá & HQ)**: Prateleira gráfica de obras selecionadas com painel interativo de leitura, estética de retícula (*halftone*) e balões de diálogo.
6. **Contato (Arcade Cabinet)**: Gabinete retrô com sistema de créditos ("Insert Coin"), canais de comunicação direta e formulário de transmissão integrado a API Route com suporte a envio via Resend.

---

## 🎬 Arquitetura de Transições Cinemáticas

A navegação em desktop é orquestrada pelo componente central [`TransitionStage`](src/components/TransitionStage.tsx), que ancora a viewport (*pinning*) e sincroniza uma timeline mestre do GSAP com a barra de rolagem do usuário através de *scrubbing*:

```
Scroll do Usuário
   │
   ▼
Lenis Smooth Scroll (1.2s lagSmoothing: 0)
   │
   ▼
GSAP ScrollTrigger (pin: true, scrub: 0.8)
   │
   ├── [01] Hero → Rasgo de Papel (duas metades revelando o livro)
   ├── [02] Sobre → Glitch de Vidro (trincas e 4 cacos em rotação 3D)
   ├── [03] Projetos → Level Up (barra de XP enchendo + explosão de partículas)
   ├── [04] Skills → Painel de HQ (cortes diagonais com onomatopeia "ドン!")
   ├── [05] Estante → CRT Power-Cycle (linha de fósforo colapsando e raster do arcade ligando)
   └── [06] Contato (Fim da jornada com formulário e links)
```

### 📱 Responsividade & Acessibilidade (`prefers-reduced-motion`)
- **Desktop (>= 1024px)**: Experiência pinada cinematográfica completa.
- **Mobile (< 1024px)**: Despinagem automática com fluxo vertical contínuo nativo e divisores temáticos (`MobileDivider`), eliminando clipes de viewport e sobrecarga de GPU.
- **Movimento Reduzido**: Respeita rigorosamente a preferência do sistema operacional (`prefers-reduced-motion: reduce`), desativando o pin do GSAP, suprimindo interpolações de rolagem e aplicando transições imediatas para prevenir desconforto vestibular.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Propósito |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) | Server Components, SEO dinâmico, rotas de API e otimização de imagens/fontes |
| **Biblioteca UI** | [React 19](https://react.dev/) | Componentização declarativa e hooks modernos |
| **Estilização** | [Tailwind CSS v4](https://tailwindcss.com/) | Design tokens inline (`@theme inline`), variáveis fluidas e classes utilitárias |
| **Animações** | [GSAP 3.15](https://greensock.com/gsap/) + ScrollTrigger | Master timeline, pinagem de tela, interpolações e 3D transforms |
| **Scroll Suave** | [Lenis 1.3](https://lenis.darkroom.engineering/) | Rolagem inercial cinemática sincronizada ao ticker do GSAP |
| **E-mail / API** | [Resend](https://resend.com/) | Disparo transacional de mensagens do formulário de contato via API Route |
| **Tipografia** | `next/font/google` (`display: swap`) | Inter, Syne, Playfair Display e JetBrains Mono auto-hospedadas |

---

## 📁 Estrutura do Projeto

```
portfolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts          # Endpoint POST /api/contact (Resend + modo dev)
│   │   ├── apple-icon.tsx            # Apple Touch Icon dinâmico (180x180)
│   │   ├── globals.css               # Regras base, scanlines, halftone e reduced-motion
│   │   ├── icon.svg                  # Favicon vetorial estilizado
│   │   ├── layout.tsx                # Metadados SEO, Viewport e carregamento de fontes
│   │   ├── manifest.ts               # Web App Manifest (PWA)
│   │   ├── opengraph-image.tsx       # Card social dinâmico (1200x630 ImageResponse)
│   │   ├── page.tsx                  # Orquestração dos 6 mundos (Desktop pin vs Mobile stream)
│   │   ├── robots.ts                 # Configuração de robôs de busca (robots.txt)
│   │   └── sitemap.ts                # Mapa do site XML (sitemap.xml)
│   ├── components/
│   │   ├── sections/                 # Os 6 mundos interativos
│   │   │   ├── Hero.tsx              # Universo 01: Hero neutro com mouse glow
│   │   │   ├── Sobre.tsx             # Universo 02: Livro 3D com virada de páginas
│   │   │   ├── Projetos.tsx          # Universo 03: Terminal cyberpunk de projetos
│   │   │   ├── Skills.tsx            # Universo 04: Ficha de personagem RPG
│   │   │   ├── Estante.tsx           # Universo 05: Prateleira de mangás / leitura
│   │   │   └── Contato.tsx           # Universo 06: Gabinete arcade & formulário
│   │   ├── transitions/              # Os 5 efeitos de transição visual
│   │   │   ├── RasgoPapel.tsx        # Transição 1: Rasgo de papel
│   │   │   ├── Glitch.tsx            # Transição 2: Cacos de vidro 3D
│   │   │   ├── LevelUp.tsx           # Transição 3: Barra de XP & partículas
│   │   │   ├── PainelHQ.tsx          # Transição 4: Cortes de mangá
│   │   │   └── CRT.tsx               # Transição 5: Power-cycle CRT
│   │   ├── SmoothScroll.tsx          # Provedor do Lenis
│   │   └── TransitionStage.tsx       # Core da pinagem e timeline mestre GSAP
│   └── lib/
│       └── useLenis.ts               # Hook de controle de scroll e integração GSAP
├── public/                           # Assets estáticos públicos
├── CONTEXTO.md                       # Documento vivo de estado, arquitetura e pendências
├── CONTEUDO.md                       # Fonte da verdade do conteúdo textual
└── README.md                         # Esta documentação
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 20+ ou 22+
- npm ou pnpm

### 1. Clonar o repositório e instalar dependências
```bash
git clone https://github.com/ferreiraryan/portfolio.git
cd portfolio
npm install
```

### 2. Configurar variáveis de ambiente (opcional)
Crie um arquivo `.env.local` na raiz:
```env
# URL base do site para SEO e sitemaps (padrão de fallback: https://ryanferreira.dev)
NEXT_PUBLIC_SITE_URL=https://ryanferreira.dev

# Chave de API do Resend para envio real de e-mails (se não informada, opera em modo simulação com log)
RESEND_API_KEY=re_123456789

# E-mail de destino das mensagens recebidas
CONTACT_EMAIL=ryanferreira4883@gmail.com
```

> **Nota sobre o modo de simulação:** Se `RESEND_API_KEY` não for definida, o endpoint `/api/contact` aceita a requisição, simula um delay de rede de 600ms e grava os dados no console do servidor, permitindo testar o fluxo de envio completo sem necessidade de credenciais.

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🔍 Comandos de Verificação & Qualidade

```bash
# Verificação de tipos TypeScript
npx tsc --noEmit

# Análise estática de código (ESLint)
npm run lint

# Compilação de produção (Next.js / Turbopack)
npm run build
```

---

## 👤 Autor

**Ryan Ferreira**  
- GitHub: [@ferreiraryan](https://github.com/ferreiraryan)  
- LinkedIn: [/in/ferryan](https://linkedin.com/in/ferryan)  
- E-mail: [ryanferreira4883@gmail.com](mailto:ryanferreira4883@gmail.com)

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).

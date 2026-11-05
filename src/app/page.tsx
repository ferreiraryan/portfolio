import TransitionStage from "@/components/TransitionStage";
import Hero from "@/components/sections/Hero";
import Sobre from "@/components/sections/Sobre";
import Projetos from "@/components/sections/Projetos";
import Skills from "@/components/sections/Skills";
import Estante from "@/components/sections/Estante";
import Contato from "@/components/sections/Contato";
import RasgoPapel from "@/components/transitions/RasgoPapel";
import Glitch from "@/components/transitions/Glitch";
import LevelUp from "@/components/transitions/LevelUp";
import PainelHQ from "@/components/transitions/PainelHQ";
import CRT from "@/components/transitions/CRT";
import WorldJourneyRail from "@/components/navigation/WorldJourneyRail";
import MobileJourneyDock from "@/components/navigation/MobileJourneyDock";

function MobileDivider({
  from,
  to,
  accent,
}: {
  from: string;
  to: string;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-y border-white/10 bg-[#08080A] text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 select-none">
      <span>{from}</span>
      <span className={accent}>↓ {to}</span>
    </div>
  );
}

export default function Page() {
  return (
    <>
      {/* Experiência Desktop: Palco Único Pinado com 5 Transições Cinemáticas */}
      <div className="hidden lg:block motion-reduce:lg:hidden">
        <WorldJourneyRail />
        <TransitionStage>
          {/* 1. Hero (Neutro) --[Papel Rasgando]--> 2. Sobre (Livro) */}
          <RasgoPapel topLayer={<Hero />} bottomLayer={<Sobre scrollPages />} />

          {/* 2. Sobre (Livro) --[Tela Quebrando com Glitch]--> 3. Projetos (Cyberpunk) */}
          <Glitch topLayer={<Sobre />} bottomLayer={<Projetos />} />

          {/* 3. Projetos (Cyberpunk) --[Level Up / Barra Enchendo]--> 4. Skills (RPG) */}
          <LevelUp topLayer={<Projetos />} bottomLayer={<Skills />} />

          {/* 4. Skills (RPG) --[Painel de Quadrinho se Abrindo]--> 5. Estante (Mangá/HQ) */}
          <PainelHQ topLayer={<Skills />} bottomLayer={<Estante />} />

          {/* 5. Estante (Mangá/HQ) --[Tela CRT Ligando]--> 6. Contato (Arcade) */}
          <CRT topLayer={<Estante />} bottomLayer={<Contato />} />
        </TransitionStage>
      </div>

      {/* Experiência Mobile, Tablet & Reduced Motion: Fluxo Vertical Despinado com Touch Scroll Fluido */}
      <div className="block lg:hidden motion-reduce:lg:block w-full overflow-x-hidden">
        <MobileJourneyDock />
        <section id="hero">
          <Hero />
        </section>
        <MobileDivider from="01 // Neutro" to="02 // Livro" accent="text-stone-300" />
        <section id="sobre">
          <Sobre />
        </section>
        <MobileDivider from="02 // Livro" to="03 // Cyberpunk" accent="text-fuchsia-400" />
        <section id="projetos">
          <Projetos />
        </section>
        <MobileDivider from="03 // Cyberpunk" to="04 // RPG" accent="text-amber-400" />
        <section id="skills">
          <Skills />
        </section>
        <MobileDivider from="04 // RPG" to="05 // Mangá & HQ" accent="text-yellow-400" />
        <section id="estante">
          <Estante />
        </section>
        <MobileDivider from="05 // Mangá & HQ" to="06 // Arcade CRT" accent="text-emerald-400" />
        <section id="contato">
          <Contato />
        </section>
      </div>
    </>
  );
}

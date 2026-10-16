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

export default function Page() {
  return (
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
  );
}

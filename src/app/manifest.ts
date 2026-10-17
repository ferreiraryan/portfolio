import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ryan Ferreira — Tecnologia, Computação & Projetos",
    short_name: "Ryan Ferreira",
    description:
      "Portfólio cinematográfico em 6 mundos interativos. Ciência da Computação, engenharia de software e projetos.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

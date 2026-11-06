import type { Metadata } from "next";
import livrosData from "@/data/livros.json";
import type { ReadingBook } from "@/types/books";
import LivrosClient from "./LivrosClient";

export const metadata: Metadata = {
  title: "Biblioteca & Leituras | Ryan Ferreira",
  description:
    "Livros, ficção científica, mangás e engenharia de software lidos e anotados por Ryan Ferreira através do e-reader CrossPoint.",
  openGraph: {
    title: "Biblioteca & Leituras | Ryan Ferreira",
    description:
      "Exploração literária e técnica: de sistemas distribuídos e ciberespaço a clássicos da filosofia e mangás.",
    type: "website",
  },
};

export default function LivrosPage() {
  const allBooks = (Array.isArray(livrosData) ? livrosData : []) as ReadingBook[];
  const visibleBooks = allBooks.filter((b) => b.visible !== false);

  return <LivrosClient initialBooks={visibleBooks} />;
}

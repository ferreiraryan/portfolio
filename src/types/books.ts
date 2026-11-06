export interface ReadingBook {
  id: string;               // Document hash, slug ou UUID
  title: string;            // Título da obra
  author: string;           // Nome do autor ou autores
  coverUrl?: string;        // URL da capa (do crosspoint-sync, Google Books ou manual)
  status: "LIDO" | "LENDO" | "QUERO_LER";
  progressPercent: number;  // 0 a 100
  totalPages?: number;
  currentPage?: number;
  completedAt?: string;     // Data de término (YYYY-MM-DD)
  startedAt?: string;       // Data de início (YYYY-MM-DD)
  rating?: number;          // 1 a 5 estrelas
  review?: string;          // Análise / Resenha pessoal do Ryan
  quote?: string;           // Citação marcante
  tags: string[];           // Categorias (ex: ["Ficção Científica", "TI", "Filosofia"])
  source: "crosspoint" | "manual";
  visible: boolean;         // Controlado no /admin (ocultar ou exibir na página pública)
  featured: boolean;        // Destaque na estante/topo
  filename?: string;        // Nome do arquivo no leitor (se aplicável)
  lastReadAt?: string;      // Última sessão de leitura (timestamp ISO)
}

export interface CrosspointSyncConfig {
  url: string;
  user: string;
  key: string;
}

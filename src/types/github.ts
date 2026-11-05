export interface ProjectItem {
  id: string;
  code: string;
  name: string;
  category: "FULL-STACK" | "AI & ENGINE" | "CREATIVE WEB" | "EXPERIMENTS";
  status: string;
  stack: string[];
  summary: string;
  metrics: string;
  repoUrl: string;
  liveUrl?: string;
  commitCount: number;
  stars: number;
  pushedAt: string;
  featured?: boolean;
  isManual?: boolean;
}

export interface SkillNode {
  name: string;
  level: number;
  rank: string;
  manaCost: string;
  desc: string;
  commitsCount?: number;
  bytesCount?: number;
}

export type SkillTrees = Record<string, SkillNode[]>;

export interface AttributeNode {
  code: string;
  name: string;
  val: number;
}

export interface MangaVolume {
  id: string;
  vol: string;
  title: string;
  jpTitle: string;
  author: string;
  accent: string;
  quote: string;
  review: string;
}

export interface ChapterItem {
  number: string;
  title: string;
  quote: string;
  dropCap: string;
  body: string;
  marginNote: string;
  metaLeft: string;
  metaRight: string;
}

export interface OverridesConfig {
  excludedRepos: string[];
  overrides: Record<
    string,
    {
      name?: string;
      category?: "FULL-STACK" | "AI & ENGINE" | "CREATIVE WEB" | "EXPERIMENTS";
      summary?: string;
      status?: string;
      stack?: string[];
      liveUrl?: string;
      featured?: boolean;
    }
  >;
  manualProjects?: ProjectItem[];
}

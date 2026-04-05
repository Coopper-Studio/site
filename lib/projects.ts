import { BookOpen, MessageSquare, Rainbow, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProjectCategory = "product" | "experiment";
export type ProjectStatus = "live" | "development" | "prototype";

export interface Project {
  slug: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  techStack: string[];
  icon: LucideIcon;
  actionLabel: string;
  actionHref?: string;
  actionDisabled?: boolean;
}

export const projects: Project[] = [
  {
    slug: "rainbow-paths",
    title: "Rainbow Paths",
    description:
      "A global LGBTQ+ rights map tracking decriminalization, depathologization, and marriage equality.",
    category: "experiment",
    status: "live",
    techStack: ["Next.js", "TypeScript", "ECharts", "Tailwind CSS"],
    icon: Rainbow,
    actionLabel: "Visit Site",
    actionHref: "https://rainbow-paths.cooper-ai.org/",
  },
  {
    slug: "echo-agents",
    title: "Echo Agents",
    description:
      "A trauma-informed AI storytelling prototype centered on consent, trigger warnings, and survivor-safe conversation design.",
    category: "experiment",
    status: "live",
    techStack: ["Next.js", "TypeScript", "Kimi API", "Cloudflare"],
    icon: MessageSquare,
    actionLabel: "Visit Site",
    actionHref: "https://echo-agents.cooper-ai.org/",
  },
  {
    slug: "forum-theatre",
    title: "Forum Theatre",
    description:
      "An AI-powered digital forum theatre experience for social reflection, role-play, and dialogue strategy practice.",
    category: "experiment",
    status: "live",
    techStack: ["Next.js", "React", "Zustand", "Moonshot API"],
    icon: BookOpen,
    actionLabel: "Visit Site",
    actionHref: "https://forum-theatre.cooper-ai.org/",
  },
  {
    slug: "thai-rainbow",
    title: "Thai Rainbow",
    description:
      "A multilingual service site for LGBTQ+ couples seeking legal marriage registration support in Thailand under the 2025 marriage equality framework.",
    category: "experiment",
    status: "live",
    techStack: ["Next.js", "TypeScript", "next-intl", "Cloudflare D1"],
    icon: Sparkles,
    actionLabel: "Visit Site",
    actionHref: "https://thairainbowknot.com/",
  },
];

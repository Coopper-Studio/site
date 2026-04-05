import { Heart, Rainbow, Sparkles } from "lucide-react";
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
    category: "product",
    status: "live",
    techStack: ["Next.js", "TypeScript", "ECharts", "Tailwind CSS"],
    icon: Rainbow,
    actionLabel: "Visit Site",
    actionHref: "https://rainbow-paths.cooper-ai.org/",
  },
  {
    slug: "emotion-cards",
    title: "Emotion Cards",
    description:
      "A quiet emotional check-in product designed for a 30-second daily reflection.",
    category: "product",
    status: "development",
    techStack: ["SwiftUI", "iOS", "Core Data"],
    icon: Heart,
    actionLabel: "In Development",
    actionDisabled: true,
  },
  {
    slug: "ai-color-palette",
    title: "AI Color Palette",
    description:
      "A color experiment for design workflows, focused on producing usable palettes quickly.",
    category: "experiment",
    status: "live",
    techStack: ["AI", "Design", "Web"],
    icon: Sparkles,
    actionLabel: "View Experiment",
    actionHref: "/blogs",
  },
  {
    slug: "micro-analytics",
    title: "Micro Analytics",
    description:
      "A privacy-first analytics prototype aiming for a lighter, cookie-free, lower-noise footprint.",
    category: "experiment",
    status: "prototype",
    techStack: ["JavaScript", "Privacy", "Analytics"],
    icon: Sparkles,
    actionLabel: "Prototype",
    actionDisabled: true,
  },
  {
    slug: "cli-boilerplate",
    title: "CLI Boilerplate",
    description:
      "A starter template experiment for building modern Node.js CLI tools faster.",
    category: "experiment",
    status: "live",
    techStack: ["Node.js", "CLI", "Template"],
    icon: Sparkles,
    actionLabel: "Read More",
    actionHref: "/blogs/idea-to-product-sop",
  },
];

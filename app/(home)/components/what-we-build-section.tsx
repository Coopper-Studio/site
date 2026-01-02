import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Wrench, Heart } from "lucide-react";
import { FeatureCard } from "./feature-card";

export function WhatWeBuildSection() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">What We Build</h2>
        <p className="text-muted-foreground">Three ways we create value</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products */}
        <FeatureCard
          icon={Package}
          title="Products"
          description="Small, focused tools for real problems."
          items={[
            {
              title: "TaskFlow",
              description: "Simple task management that actually works",
              badge: "Coming Soon",
              badgeVariant: "secondary",
            },
            {
              title: "QuickNote",
              description: "Capture thoughts without the friction",
              badge: "Coming Soon",
              badgeVariant: "secondary",
            },
            {
              title: "TimeBox",
              description: "Focus timer for deep work sessions",
              badge: "Beta",
              badgeVariant: "outline",
            },
          ]}
        />

        {/* Tools for Builders */}
        <FeatureCard
          icon={Wrench}
          title="Tools for Builders"
          description="Tools I built for myself, now shared."
          items={[
            {
              title: "UI Component Kit",
              description: "Copy-paste React components",
              badge: "Open",
              badgeVariant: "outline",
            },
            {
              title: "Dev Boilerplates",
              description: "Starter templates that skip the setup",
              badge: "Open",
              badgeVariant: "outline",
            },
            {
              title: "CLI Helpers",
              description: "Command-line tools for common tasks",
              badge: "Coming Soon",
              badgeVariant: "secondary",
            },
          ]}
        />

        {/* Mission-Driven Support */}
        <FeatureCard
          icon={Heart}
          title="Mission-Driven Support"
          description="Selective technical support for nonprofit & community projects."
        >
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              We dedicate a portion of our time to projects that:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Serve underrepresented communities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Promote education & accessibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Build open-source infrastructure</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/docs">Learn More</Link>
            </Button>
          </div>
        </FeatureCard>
      </div>
    </div>
  );
}


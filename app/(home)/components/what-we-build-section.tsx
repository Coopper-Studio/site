import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Wrench, Heart } from "lucide-react";
import { FeatureCard } from "./feature-card";

export function WhatWeBuildSection() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">What We Build</h2>
        <p className="text-muted-foreground">
          Three tracks of work moving in parallel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={Package}
          title="Products"
          description="Small, focused products built around real problems."
          items={[]}
        />

        <FeatureCard
          icon={Wrench}
          title="Tools for Builders"
          description="Tools first built for internal use, then shared more widely."
          items={[]}
        />

        <FeatureCard
          icon={Heart}
          title="Mission-Driven Support"
          description="Selective technical support for community work, public-interest efforts, and nonprofit projects."
        >
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Priority goes to projects that:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Serve overlooked or underserved communities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Advance education, accessibility, and public knowledge
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Build open and sustainable public infrastructure</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/blogs">Read More</Link>
            </Button>
          </div>
        </FeatureCard>
      </div>
    </div>
  );
}

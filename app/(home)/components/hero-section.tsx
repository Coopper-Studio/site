import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-6 mb-16 md:mb-24">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
        Building small, thoughtful{" "}
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          digital products
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
        UI-driven tools, built with clarity and care.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
        <Button asChild>
          <Link href="/docs">
            View Products
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/docs">Explore Experiments</Link>
        </Button>
      </div>
    </div>
  );
}


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="max-w-3xl mx-auto text-center space-y-6 mb-16 md:mb-24">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
        Building thoughtful, long-horizon{" "}
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          digital products and experiments
        </span>
      </h1>

      <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
        A place for products, tools, experiments, and writing, built with clarity and care.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
        <Button asChild>
          <Link href="#products">
            View Projects
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/blogs">Read Writing</Link>
        </Button>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Package, Wrench, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 px-4 py-8 md:py-16">
      {/* Hero Section */}
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

      {/* What We Build Section */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">What We Build</h2>
          <p className="text-muted-foreground">Three ways we create value</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Products */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Package className="size-5 text-primary" />
                <CardTitle>Products</CardTitle>
              </div>
              <CardDescription>
                Small, focused tools for real problems.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">TaskFlow</h4>
                    <p className="text-xs text-muted-foreground">
                      Simple task management that actually works
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    Coming Soon
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">QuickNote</h4>
                    <p className="text-xs text-muted-foreground">
                      Capture thoughts without the friction
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    Coming Soon
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">TimeBox</h4>
                    <p className="text-xs text-muted-foreground">
                      Focus timer for deep work sessions
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    Beta
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools for Builders */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="size-5 text-primary" />
                <CardTitle>Tools for Builders</CardTitle>
              </div>
              <CardDescription>
                Tools I built for myself, now shared.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">
                      UI Component Kit
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Copy-paste React components
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    Open
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">
                      Dev Boilerplates
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Starter templates that skip the setup
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    Open
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">CLI Helpers</h4>
                    <p className="text-xs text-muted-foreground">
                      Command-line tools for common tasks
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    Coming Soon
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission-Driven Support */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="size-5 text-primary" />
                <CardTitle>Mission-Driven Support</CardTitle>
              </div>
              <CardDescription>
                Selective technical support for nonprofit & community projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Why Cooper Studio Section */}
      <div className="max-w-3xl mx-auto w-full mt-24 md:mt-32">
        <div className="text-center space-y-6 px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <Heart className="size-6 text-primary" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">Why Cooper Studio</h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              Cooper Studio is run by an independent developer who values{" "}
              <span className="font-medium text-primary">clarity</span>,{" "}
              <span className="font-medium text-primary">restraint</span>, and{" "}
              <span className="font-medium text-primary">
                long-term thinking
              </span>
              .
            </p>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              This studio exists to support long-term independent
              creation—building tools that matter, at a sustainable pace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, Package } from "lucide-react";
import { ProjectCard } from "./project-card";

export function ProductsExperimentsSection() {
  return (
    <div className="max-w-6xl mx-auto w-full mt-24 md:mt-32">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Sparkles className="size-6 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Products & Experiments
        </h2>
        <p className="text-muted-foreground">
          Building in public, one project at a time
        </p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
          </TabsList>
        </div>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              icon={Package}
              title="TaskFlow"
              description="A minimalist task manager that focuses on what matters—your next action."
              badge="Coming Soon"
              badgeVariant="secondary"
              techStack={["React", "Next.js", "TypeScript"]}
              actionLabel="Coming Soon"
              actionDisabled
            />

            <ProjectCard
              icon={Package}
              title="QuickNote"
              description="Capture thoughts instantly without friction. No folders, no complexity."
              badge="Beta"
              badgeVariant="outline"
              techStack={["React", "Markdown", "PWA"]}
              actionLabel="View Details"
              actionHref="/docs"
            />

            <ProjectCard
              placeholder
              title="More Coming Soon"
              description="New products are in development. Stay tuned for updates."
              badge=""
              techStack={[]}
              placeholderIcon={
                <Sparkles className="size-12 text-muted-foreground/20" />
              }
            />
          </div>
        </TabsContent>

        {/* Experiments Tab */}
        <TabsContent value="experiments" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              icon={Sparkles}
              title="AI Color Palette"
              description="Generate beautiful color palettes using AI, tailored for your design needs."
              badge="Live"
              badgeVariant="default"
              techStack={["AI", "Design", "Web"]}
              actionLabel="Try It Out"
              actionHref="/docs"
            />

            <ProjectCard
              icon={Sparkles}
              title="Micro Analytics"
              description="Privacy-first analytics in under 1KB. No cookies, no tracking."
              badge="Prototype"
              badgeVariant="secondary"
              techStack={["JavaScript", "Privacy", "Analytics"]}
              actionLabel="In Development"
              actionDisabled
            />

            <ProjectCard
              icon={Sparkles}
              title="CLI Boilerplate"
              description="Fast-start templates for building modern CLI tools in Node.js."
              badge="Live"
              badgeVariant="default"
              techStack={["Node.js", "CLI", "Template"]}
              actionLabel="View on GitHub"
              actionHref="/docs"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


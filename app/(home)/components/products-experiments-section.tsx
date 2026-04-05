import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { ProjectCard } from "./project-card";
import { projects, type Project, type ProjectStatus } from "@/lib/projects";

const statusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  development: "In Development",
  prototype: "Prototype",
};

const statusVariant: Record<ProjectStatus, "default" | "secondary" | "outline"> = {
  live: "default",
  development: "secondary",
  prototype: "outline",
};

function renderProjectCard(project: Project) {
  return (
    <ProjectCard
      key={project.slug}
      icon={project.icon}
      title={project.title}
      description={project.description}
      badge={statusLabel[project.status]}
      badgeVariant={statusVariant[project.status]}
      techStack={project.techStack}
      actionLabel={project.actionLabel}
      actionHref={project.actionHref}
      actionDisabled={project.actionDisabled}
    />
  );
}

export function ProductsExperimentsSection() {
  const productItems = projects.filter((item) => item.category === "product");
  const experimentItems = projects.filter((item) => item.category === "experiment");

  return (
    <div className="max-w-6xl mx-auto w-full mt-24 md:mt-32">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          <Sparkles className="size-6 text-primary" />
        </div>
        <h2 id="products" className="text-2xl md:text-3xl font-bold mb-3">
          Products & Experiments
        </h2>
        <p className="text-muted-foreground">
          A public view of what is being built and tested
        </p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products" className="mt-0">
          {productItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productItems.map(renderProjectCard)}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <ProjectCard
                placeholder
                title="Products in Preparation"
                description="No public product is available yet. New products will appear here once they move beyond exploration and into a clearer release path."
                badge=""
                techStack={[]}
                placeholderIcon={
                  <Sparkles className="size-12 text-muted-foreground/20" />
                }
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="experiments" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experimentItems.map(renderProjectCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

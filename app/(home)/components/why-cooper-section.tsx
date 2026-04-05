import { Heart } from "lucide-react";

export function WhyCooperSection() {
  return (
    <div className="max-w-3xl mx-auto w-full mt-24 md:mt-32">
      <div className="text-center space-y-6 px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
          <Heart className="size-6 text-primary" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold">Why Cooper Studio</h2>

        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-base md:text-lg text-foreground leading-relaxed">
            An independent studio run with a bias toward
            <span className="font-medium text-primary"> clarity</span>,
            <span className="font-medium text-primary"> restraint</span>, and
            <span className="font-medium text-primary"> long-term thinking</span>.
          </p>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The goal is not to ship as many things as possible, but to build tools, experiments, and writing that hold up over time.
          </p>
        </div>
      </div>
    </div>
  );
}

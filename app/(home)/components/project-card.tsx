import Link from "next/link";
import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  techStack: string[];
  actionLabel?: string;
  actionHref?: string;
  actionDisabled?: boolean;
  placeholder?: boolean;
  placeholderIcon?: ReactNode;
}

export function ProjectCard({
  icon: Icon,
  title,
  description,
  badge,
  badgeVariant = "secondary",
  techStack,
  actionLabel,
  actionHref,
  actionDisabled = false,
  placeholder = false,
  placeholderIcon,
}: ProjectCardProps) {
  if (placeholder) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg text-muted-foreground">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          {placeholderIcon}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="size-5 text-primary" />
            </div>
          </div>
          <Badge variant={badgeVariant}>{badge}</Badge>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {actionDisabled ? (
          <Button variant="ghost" size="sm" className="w-full" disabled>
            {actionLabel}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            asChild
          >
            <Link href={actionHref || "/blogs"}>
              {actionLabel}
              <ExternalLink className="ml-2 size-3" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}


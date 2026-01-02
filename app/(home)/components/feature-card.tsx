import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
  badge: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  items?: FeatureItem[];
  children?: ReactNode;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  items,
  children,
}: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Icon className="size-5 text-primary" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items?.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Badge
                variant={item.badgeVariant || "secondary"}
                className="shrink-0"
              >
                {item.badge}
              </Badge>
            </div>
          </div>
        ))}
        {children}
      </CardContent>
    </Card>
  );
}


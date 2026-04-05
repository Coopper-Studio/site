import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookIcon, Bird } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <Bird className="size-5" />
          <span>Cooper Studio</span>
        </div>
      ),
    },
    links: [
      {
        icon: <BookIcon />,
        text: "Writing",
        url: "/blogs",
        secondary: false,
      },
    ],
  };
}

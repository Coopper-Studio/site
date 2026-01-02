import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookIcon } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Cooper Studio",
    },
    links: [
      {
        icon: <BookIcon />,
        text: "Blogs",
        url: "/blogs",
        // secondary items will be displayed differently on navbar
        secondary: false,
      },
    ],
  };
}

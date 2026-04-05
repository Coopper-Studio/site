import { Provider } from "./provider";
import "./global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Cooper Studio",
    template: "%s | Cooper Studio",
  },
  description: "An independent studio for products, experiments, and long-form writing.",
  keywords: [
    "Cooper Studio",
    "indie development",
    "product experiments",
    "technical writing",
    "studio",
  ],
  authors: [{ name: "Cooper Studio" }],
  creator: "Cooper Studio",
  metadataBase: new URL("https://site.cooper-studio.org"),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Cooper Studio",
    title: "Cooper Studio",
    description: "An independent studio for products, experiments, and long-form writing.",
    images: [
      {
        url: "/opengraph-image.svg",
        width: 1200,
        height: 630,
        alt: "Cooper Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cooper Studio",
    description: "An independent studio for products, experiments, and long-form writing.",
    images: ["/opengraph-image.svg"],
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

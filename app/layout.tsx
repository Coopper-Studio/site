import { Provider } from "./provider";
import "./global.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cooper Studio",
    template: "%s | Cooper Studio",
  },
  description: "Cooper Studio - Building innovative products and experiments",
  keywords: [
    "Cooper Studio",
    "software development",
    "products",
    "experiments",
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
    description: "Building innovative products and experiments",
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
    description: "Building innovative products and experiments",
    images: ["/opengraph-image.svg"],
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

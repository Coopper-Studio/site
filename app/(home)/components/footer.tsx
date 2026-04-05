import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 md:mt-32 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">© Cooper Studio</p>
            <p className="text-sm text-muted-foreground">
              Independent studio for products and writing
            </p>
            <p className="text-xs text-muted-foreground">Maintained by Suxiong</p>
          </div>

          <div className="pt-4">
            <p className="text-xs text-muted-foreground italic">
              Supporting products, experiments, and public-interest work with long-term value.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <Link
              href="/blogs"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Writing
            </Link>
            <Link
              href="mailto:email@cooper-ai.org"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

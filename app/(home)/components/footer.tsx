import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 md:mt-32 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Main Footer Content */}
          <div className="space-y-2">
            <p className="text-sm font-medium">© Cooper Studio</p>
            <p className="text-sm text-muted-foreground">
              Independent Software Studio
            </p>
            <p className="text-xs text-muted-foreground">Built by Su Xiong</p>
          </div>

          {/* Mission Statement */}
          <div className="pt-4">
            <p className="text-xs text-muted-foreground italic">
              Supporting mission-driven projects.
            </p>
          </div>

          {/* Optional Links */}
          <div className="flex items-center gap-6 pt-2">
            <Link
              href="/docs"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/docs"
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


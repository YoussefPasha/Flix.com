export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 Flix.
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            About
          </a>
          <a
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}


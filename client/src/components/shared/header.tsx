import Link from 'next/link';
import { SearchBar } from './search-bar';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">Flix</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Browse
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-sm">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}


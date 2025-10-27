'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  initialQuery?: string;
}

export function SearchInput({ initialQuery = '' }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    
    params.delete('page'); // Reset to first page on new search
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('page');
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-11 text-base"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="lg" className="px-6">
          Search
        </Button>
      </div>
    </form>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAutocomplete } from '@/features/search/api/use-search';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: suggestions } = useAutocomplete(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (contentId: string) => {
    router.push(`/content/${contentId}`);
    setShowSuggestions(false);
    setQuery('');
  };

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSuggestions]);

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search content..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="pl-8"
        />
      </form>
      
      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded-md border bg-popover p-2 shadow-md z-50">
          {suggestions.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSuggestionClick(item.id)}
              className="w-full text-left px-2 py-2 hover:bg-accent rounded-sm"
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.type}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


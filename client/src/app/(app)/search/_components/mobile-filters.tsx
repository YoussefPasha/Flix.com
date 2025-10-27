'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchFilters } from './search-filters';
import { SearchQueryParams, Genre } from '@/types/api';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MobileFiltersProps {
  filters: SearchQueryParams;
  genres: Genre[];
}

export function MobileFilters({ filters, genres }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeFilterCount = [filters.type, filters.genre, filters.year].filter(Boolean).length;

  return (
    <>
      {/* Filter Toggle Button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="w-full justify-between h-11"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <Badge 
                variant="default" 
                className="h-5 px-2 text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Accordion Content */}
      {open && (
        <div className="lg:hidden animate-in slide-in-from-top-2 duration-200">
          <SearchFilters filters={filters} genres={genres} />
        </div>
      )}
    </>
  );
}


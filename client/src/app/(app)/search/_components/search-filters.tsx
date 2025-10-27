'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContentType, SearchQueryParams, Genre } from '@/types/api';
import { X, Film, Tv, Calendar, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchFiltersProps {
  filters: SearchQueryParams;
  genres: Genre[];
}

export function SearchFilters({ filters, genres }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (updates: Partial<SearchQueryParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to page 1 when filters change (unless it's a page change)
    if (!('page' in updates)) {
      params.delete('page');
    }

    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (filters.q) {
      params.set('q', filters.q);
    }
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters =
    filters.type || filters.genre || filters.year || (filters.sort && filters.sort !== 'releaseDate');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <Card className="border-primary/10">
      <CardContent className="space-y-5">
        {/* Content Type */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Film className="w-4 h-4 text-primary" />
            Content Type
          </Label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) =>
              updateFilters({ type: value === 'all' ? undefined : (value as ContentType) })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={ContentType.MOVIE}>
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Movies
                </div>
              </SelectItem>
              <SelectItem value={ContentType.SHOW}>
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4" />
                  TV Shows
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Genre */}
        {genres.length > 0 && (
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold">Genre</Label>
            <Select
              value={filters.genre || 'all'}
              onValueChange={(value) =>
                updateFilters({ genre: value === 'all' ? undefined : value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Year */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Release Year
          </Label>
          <Select
            value={filters.year?.toString() || 'all'}
            onValueChange={(value) =>
              updateFilters({ year: value === 'all' ? undefined : parseInt(value) })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-primary" />
            Sort By
          </Label>
          <Select
            value={filters.sort || 'releaseDate'}
            onValueChange={(value) => updateFilters({ sort: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="releaseDate">Release Date (Newest)</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="rating">Rating (Highest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Filters
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-xs"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.type && (
                <Badge
                  variant="secondary"
                  className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => updateFilters({ type: undefined })}
                >
                  {filters.type === ContentType.MOVIE ? (
                    <><Film className="w-3 h-3" /> Movies</>
                  ) : (
                    <><Tv className="w-3 h-3" /> TV Shows</>
                  )}
                  <X className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
                </Badge>
              )}
              {filters.genre && (
                <Badge
                  variant="secondary"
                  className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => updateFilters({ genre: undefined })}
                >
                  {genres.find((g) => g.id === filters.genre)?.name || filters.genre}
                  <X className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
                </Badge>
              )}
              {filters.year && (
                <Badge
                  variant="secondary"
                  className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => updateFilters({ year: undefined })}
                >
                  <Calendar className="w-3 h-3" />
                  {filters.year}
                  <X className="w-3 h-3 ml-1 opacity-70 hover:opacity-100" />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


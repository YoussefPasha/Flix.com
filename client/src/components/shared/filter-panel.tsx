'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ContentType } from '@/types/api';

interface FilterPanelProps {
  filters: {
    type?: ContentType;
    genre?: string;
    year?: number;
    sort?: string;
  };
  onFilterChange: (filters: Partial<FilterPanelProps['filters']>) => void;
  genres?: Array<{ id: string; name: string }>;
}

export function FilterPanel({ filters, onFilterChange, genres = [] }: FilterPanelProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="grid gap-4 p-4 border rounded-lg bg-card">
      <div className="grid gap-2">
        <Label>Content Type</Label>
        <Select
          value={filters.type || 'all'}
          onValueChange={(value) =>
            onFilterChange({ type: value === 'all' ? undefined : value as ContentType })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value={ContentType.MOVIE}>Movies</SelectItem>
            <SelectItem value={ContentType.SHOW}>TV Shows</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {genres.length > 0 && (
        <div className="grid gap-2">
          <Label>Genre</Label>
          <Select
            value={filters.genre || 'all'}
            onValueChange={(value) =>
              onFilterChange({ genre: value === 'all' ? undefined : value })
            }
          >
            <SelectTrigger>
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

      <div className="grid gap-2">
        <Label>Year</Label>
        <Select
          value={filters.year?.toString() || 'all'}
          onValueChange={(value) =>
            onFilterChange({ year: value === 'all' ? undefined : parseInt(value) })
          }
        >
          <SelectTrigger>
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

      <div className="grid gap-2">
        <Label>Sort By</Label>
        <Select
          value={filters.sort || 'releaseDate'}
          onValueChange={(value) => onFilterChange({ sort: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="releaseDate">Release Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        onClick={() => onFilterChange({ type: undefined, genre: undefined, year: undefined, sort: undefined })}
      >
        Clear Filters
      </Button>
    </div>
  );
}


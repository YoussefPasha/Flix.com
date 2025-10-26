'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ContentCard } from '@/components/shared/content-card';
import { FilterPanel } from '@/components/shared/filter-panel';
import { Pagination } from '@/components/shared/pagination';
import { useSearch } from '@/features/search/api/use-search';
import { useGenres } from '@/features/genres/api/use-genres';
import { SearchQueryParams } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [filters, setFilters] = useState<SearchQueryParams>({
    q: initialQuery,
    page: 1,
    limit: 20,
  });

  const { data: searchResults, isLoading } = useSearch(filters);
  const { data: genres } = useGenres();

  const handleFilterChange = (newFilters: Partial<SearchQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const totalPages = searchResults
    ? Math.ceil(searchResults.total / (filters.limit || 20))
    : 0;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">
        {filters.q ? `Search Results for "${filters.q}"` : 'Browse Content'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            genres={genres || []}
          />
        </aside>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full" />
              ))}
            </div>
          ) : searchResults && searchResults.data.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Found {searchResults.total} results
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {searchResults.data.map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={filters.page || 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-8"><Skeleton className="h-[600px] w-full" /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}


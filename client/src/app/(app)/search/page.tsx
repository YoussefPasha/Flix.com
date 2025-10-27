import { Suspense } from "react";
import { ContentCard } from "@/components/shared/content-card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchQueryParams, ContentType } from "@/types/api";
import { searchContent } from "@/features/search/api/search-api";
import { fetchGenres } from "@/features/genres/api/genres-api";
import { SearchFilters } from "./_components/search-filters";
import { SearchPagination } from "./_components/search-pagination";
import { SearchInput } from "./_components/search-input";
import { MobileFilters } from "./_components/mobile-filters";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    genre?: string;
    year?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Search className="w-10 h-10 text-primary/60" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
          <span className="text-xl">🔍</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3">No results found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {query
          ? `We couldn't find any content matching &quot;${query}&quot;.`
          : "No content matches your current filters."}
      </p>
      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
        <p className="font-medium">Try:</p>
        <ul className="list-disc list-inside space-y-1 text-left">
          <li>Using different keywords</li>
          <li>Checking your spelling</li>
          <li>Removing some filters</li>
          <li>Broadening your search</li>
        </ul>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <Search className="w-10 h-10 text-destructive/60" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-destructive/20 border-2 border-background flex items-center justify-center">
          <span className="text-xl">⚠️</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-3">Oops! Something went wrong</h3>
      <p className="text-muted-foreground text-center max-w-md mb-4">
        We encountered an error while searching. This might be temporary.
      </p>
      <p className="text-sm text-muted-foreground">
        Please try refreshing the page or adjusting your search.
      </p>
    </div>
  );
}

async function SearchResults({ params }: { params: SearchQueryParams }) {
  const results = await searchContent(params).catch(() => null);

  if (!results) {
    return <ErrorState />;
  }

  if (!results.data || results.data.length === 0) {
    return <EmptyState query={params.q} />;
  }

  const totalPages = Math.ceil(results.total / (params.limit || 20));

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">Found</span>
            <span className="text-lg font-bold text-foreground">
              {results.total.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              {results.total === 1 ? "result" : "results"}
            </span>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="text-sm text-muted-foreground">
            Page {params.page || 1} of {totalPages}
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {results.data.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <SearchPagination
            currentPage={params.page || 1}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="aspect-2/3 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  // Parse search params
  const filters: SearchQueryParams = {
    q: params.q || "",
    type: params.type as ContentType | undefined,
    genre: params.genre,
    year: params.year ? parseInt(params.year) : undefined,
    sort: params.sort || "releaseDate",
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 20,
  };

  // Fetch genres for filter panel
  const genres = await fetchGenres().catch(() => []);

  const hasActiveFilters =
    filters.type ||
    filters.genre ||
    filters.year ||
    (filters.sort && filters.sort !== "releaseDate");

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {filters.q ? "Search Results" : "Browse Content"}
              </h1>
              {filters.q && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  Searching for &quot;{filters.q}&quot;
                </p>
              )}
            </div>
          </div>

          {/* Search Input */}
          <SearchInput initialQuery={filters.q} />

          {/* Mobile Filter Accordion */}
          <MobileFilters filters={filters} genres={genres} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6 space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <span className="ml-auto text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {
                      [filters.type, filters.genre, filters.year].filter(
                        Boolean
                      ).length
                    }
                  </span>
                )}
              </div>
              <SearchFilters filters={filters} genres={genres} />
            </div>
          </aside>

          {/* Results */}
          <main className="lg:col-span-9">
            <Suspense fallback={<SearchResultsSkeleton />}>
              <SearchResults params={filters} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function SearchPagination({ currentPage, totalPages }: SearchPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/search?${params.toString()}`, { scroll: true });
  };

  const pages = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Previous</span>
      </Button>

      {startPage > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            className="hidden sm:inline-flex"
          >
            1
          </Button>
          {startPage > 2 && <span className="px-2 text-muted-foreground hidden sm:inline">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-muted-foreground hidden sm:inline">...</span>}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            className="hidden sm:inline-flex"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}


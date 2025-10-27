'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { Plus, Pencil } from 'lucide-react';
import { useTags } from '@/features/tags/api/use-tags';
import { Tag } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TagsListPage() {
  const { data: tags, isLoading, error } = useTags();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  // Client-side pagination
  const paginatedTags = tags
    ? tags.slice((page - 1) * pageSize, page * pageSize)
    : [];

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'slug', title: 'Slug', sortable: true },
    { key: 'description', title: 'Description' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: unknown, item: Tag) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/tags/${item.id}`}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tags</h1>
        <Link href="/dashboard/tags/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>Failed to load tags</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : tags && tags.length > 0 ? (
        <DataTable
          columns={columns}
          data={paginatedTags}
          pagination={{
            page,
            pageSize,
            total: tags.length,
            onPageChange: setPage,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No tags found</p>
        </div>
      )}
    </div>
  );
}


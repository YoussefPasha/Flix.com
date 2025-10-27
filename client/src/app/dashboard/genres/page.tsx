'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useGenres, useDeleteGenre } from '@/features/genres/api/use-genres';
import { Genre } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert';

export default function GenresListPage() {
  const { data: genres, isLoading, error } = useGenres();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const deleteMutation = useDeleteGenre();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  // Client-side pagination
  const paginatedGenres = genres
    ? genres.slice((page - 1) * pageSize, page * pageSize)
    : [];

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'slug', title: 'Slug', sortable: true },
    { key: 'description', title: 'Description' },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: unknown, item: Genre) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/genres/${item.id}`}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(item.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Genres</h1>
        <Link href="/dashboard/genres/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Genre
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>Failed to load genres</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : genres && genres.length > 0 ? (
        <DataTable
          columns={columns}
          data={paginatedGenres}
          pagination={{
            page,
            pageSize,
            total: genres.length,
            onPageChange: setPage,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No genres found</p>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the genre.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


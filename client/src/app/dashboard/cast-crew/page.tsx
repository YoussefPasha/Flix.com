'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCastCrewList, useDeleteCastCrew } from '@/features/cast-crew/api/use-cast-crew';
import { CastCrew } from '@/types/api';
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

export default function CastCrewListPage() {
  const { data: castCrew, isLoading, error } = useCastCrewList();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const deleteMutation = useDeleteCastCrew();

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
  const paginatedCastCrew = castCrew
    ? castCrew.slice((page - 1) * pageSize, page * pageSize)
    : [];

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    {
      key: 'role',
      title: 'Role',
      render: (value: unknown) => (
        <Badge variant="secondary" className="capitalize">
          {String(value)}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'bio',
      title: 'Bio',
      render: (value: unknown) => {
        const bio = value as string | undefined;
        return bio ? (
          <span className="line-clamp-1">{bio}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: unknown, item: CastCrew) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/cast-crew/${item.id}`}>
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
        <h1 className="text-3xl font-bold">Cast & Crew</h1>
        <Link href="/dashboard/cast-crew/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Cast/Crew
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>Failed to load cast & crew</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : castCrew && castCrew.length > 0 ? (
        <DataTable
          columns={columns}
          data={paginatedCastCrew}
          pagination={{
            page,
            pageSize,
            total: castCrew.length,
            onPageChange: setPage,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No cast & crew found</p>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this cast/crew member.
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


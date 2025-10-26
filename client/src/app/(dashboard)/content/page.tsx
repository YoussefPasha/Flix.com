'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useContents } from '@/features/content/api/use-contents';
import { useDeleteContent } from '@/features/content/api/use-delete-content';
import { Content, ContentQueryParams } from '@/types/api';
import {
  formatReleaseDate,
  formatRating,
  getContentTypeLabel,
} from '@/features/content/utils';
import { Skeleton } from '@/components/ui/skeleton';
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

export default function ContentListPage() {
  const [params] = useState<ContentQueryParams>({
    page: 1,
    limit: 10,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useContents(params);
  const deleteMutation = useDeleteContent();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns: Array<{
    key: string;
    title: string;
    sortable?: boolean;
    render?: (value: unknown, item: Content) => React.ReactNode;
  }> = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
    },
    {
      key: 'type',
      title: 'Type',
      render: (_: unknown, item: Content) => (
        <Badge variant="secondary">{getContentTypeLabel(item.type)}</Badge>
      ),
    },
    {
      key: 'releaseDate',
      title: 'Release Date',
      render: (value: unknown) => formatReleaseDate(value as string),
      sortable: true,
    },
    {
      key: 'rating',
      title: 'Rating',
      render: (value: unknown) => formatRating(value as number),
      sortable: true,
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: unknown) => (
        <Badge variant="outline">{String(value)}</Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: unknown, item: Content) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/content/${item.id}`}>
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
        <h1 className="text-3xl font-bold">Content</h1>
        <Link href="/dashboard/content/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : data && data.data ? (
        <DataTable<Content> columns={columns} data={data.data} />
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No content found</p>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the content.
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


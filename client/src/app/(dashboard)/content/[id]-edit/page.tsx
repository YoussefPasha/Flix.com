'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContent } from '@/features/content/api/use-content';
import { useCreateContent } from '@/features/content/api/use-create-content';
import { useUpdateContent } from '@/features/content/api/use-update-content';
import { contentSchema, ContentFormData } from '@/features/content/types';
import { ContentType, ContentStatus } from '@/types/api';

export default function ContentFormPage({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const isEditing = !!params?.id;

  const { data: content } = useContent(params?.id || '');
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent(params?.id || '');

  const form = useForm({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: '',
      description: '',
      releaseDate: '',
      duration: 0,
      type: ContentType.MOVIE,
      rating: 0,
      thumbnailUrl: '',
      trailerUrl: '',
      status: ContentStatus.DRAFT,
    },
  });

  useEffect(() => {
    if (content) {
      form.reset({
        title: content.title,
        description: content.description,
        releaseDate: content.releaseDate,
        duration: content.duration,
        type: content.type,
        rating: content.rating,
        thumbnailUrl: content.thumbnailUrl || '',
        trailerUrl: content.trailerUrl || '',
        status: content.status,
      });
    }
  }, [content, form]);

  const onSubmit = async (data: ContentFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      router.push('/dashboard/content');
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Content' : 'Add New Content'}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Enter title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Enter description"
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={form.watch('type')}
                  onValueChange={(value) => form.setValue('type', value as ContentType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ContentType.MOVIE}>Movie</SelectItem>
                    <SelectItem value={ContentType.SHOW}>TV Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) => form.setValue('status', value as ContentStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ContentStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={ContentStatus.PUBLISHED}>Published</SelectItem>
                    <SelectItem value={ContentStatus.ARCHIVED}>Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="releaseDate">Release Date *</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  {...form.register('releaseDate')}
                />
                {form.formState.errors.releaseDate && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.releaseDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  {...form.register('duration', { valueAsNumber: true })}
                  placeholder="90"
                />
                {form.formState.errors.duration && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.duration.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  {...form.register('thumbnailUrl')}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="trailerUrl">Trailer URL</Label>
                <Input
                  id="trailerUrl"
                  {...form.register('trailerUrl')}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


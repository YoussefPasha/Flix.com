import { z } from 'zod';
import { Genre } from '@/types/api';

export type { Genre };

export const genreSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

export type GenreFormData = z.infer<typeof genreSchema>;


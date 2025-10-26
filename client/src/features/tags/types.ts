import { z } from 'zod';
import { Tag } from '@/types/api';

export type { Tag };

export const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
});

export type TagFormData = z.infer<typeof tagSchema>;


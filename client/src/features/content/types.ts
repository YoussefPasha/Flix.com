import { z } from 'zod';
import { Content, ContentType, ContentStatus } from '@/types/api';

export type { Content, ContentType, ContentStatus };

// Zod schemas for validation
export const contentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  releaseDate: z.string().min(1, 'Release date is required'),
  duration: z.number().min(1, 'Duration must be positive'),
  type: z.nativeEnum(ContentType),
  rating: z.number().min(0).max(10).default(0),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  trailerUrl: z.string().url().optional().or(z.literal('')),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  castCrewIds: z.array(z.string()).optional(),
});

export type ContentFormData = z.infer<typeof contentSchema>;

export const seasonSchema = z.object({
  seasonNumber: z.number().min(1, 'Season number must be positive'),
  releaseDate: z.string().min(1, 'Release date is required'),
});

export type SeasonFormData = z.infer<typeof seasonSchema>;

export const episodeSchema = z.object({
  episodeNumber: z.number().min(1, 'Episode number must be positive'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.number().min(1, 'Duration must be positive'),
  videoUrl: z.string().url().optional().or(z.literal('')),
});

export type EpisodeFormData = z.infer<typeof episodeSchema>;


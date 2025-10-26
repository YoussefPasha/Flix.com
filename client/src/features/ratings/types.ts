import { z } from 'zod';
import { Rating, AggregateRating } from '@/types/api';

export type { Rating, AggregateRating };

export const ratingSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  score: z.number().min(1).max(5),
});

export type RatingFormData = z.infer<typeof ratingSchema>;


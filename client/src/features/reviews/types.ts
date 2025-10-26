import { z } from 'zod';
import { Review, ReviewStatus } from '@/types/api';

export type { Review, ReviewStatus };

export const reviewSchema = z.object({
  reviewText: z.string().min(10, 'Review must be at least 10 characters').max(2000),
  userId: z.string().min(1, 'User ID is required'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const moderateReviewSchema = z.object({
  status: z.nativeEnum(ReviewStatus),
  isModerated: z.boolean().default(true),
});

export type ModerateReviewData = z.infer<typeof moderateReviewSchema>;


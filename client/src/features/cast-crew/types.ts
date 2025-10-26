import { z } from 'zod';
import { CastCrew, CastCrewRole } from '@/types/api';

export type { CastCrew, CastCrewRole };

export const castCrewSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  role: z.nativeEnum(CastCrewRole),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type CastCrewFormData = z.infer<typeof castCrewSchema>;


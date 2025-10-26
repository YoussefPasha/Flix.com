import { api } from '@/lib/api-client';
import { Rating, AggregateRating } from '@/types/api';
import { RatingFormData } from '../types';

export async function fetchAggregateRating(contentId: string) {
  return api.get<AggregateRating>(`/v1/content/${contentId}/ratings`);
}

export async function fetchUserRating(contentId: string) {
  return api.get<Rating>(`/v1/content/${contentId}/ratings/user`);
}

export async function createRating(contentId: string, data: RatingFormData) {
  return api.post<Rating>(`/v1/content/${contentId}/ratings`, data);
}

export async function updateRating(id: string, data: Partial<RatingFormData>) {
  return api.patch<Rating>(`/v1/ratings/${id}`, data);
}

export async function deleteRating(id: string) {
  return api.delete<void>(`/v1/ratings/${id}`);
}


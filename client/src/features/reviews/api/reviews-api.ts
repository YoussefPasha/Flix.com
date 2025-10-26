import { api } from '@/lib/api-client';
import { Review, ReviewStatus } from '@/types/api';
import { ReviewFormData, ModerateReviewData } from '../types';

export async function fetchReviewsByContent(
  contentId: string,
  status?: ReviewStatus
) {
  return api.get<Review[]>(`/v1/content/${contentId}/reviews`, {
    params: { status },
  });
}

export async function fetchReview(id: string) {
  return api.get<Review>(`/v1/reviews/${id}`);
}

export async function createReview(contentId: string, data: ReviewFormData) {
  return api.post<Review>(`/v1/content/${contentId}/reviews`, data);
}

export async function updateReview(id: string, data: Partial<ReviewFormData> & { userId: string }) {
  return api.patch<Review>(`/v1/reviews/${id}`, data);
}

export async function deleteReview(id: string, userId: string) {
  return api.delete<void>(`/v1/reviews/${id}`, {
    body: JSON.stringify({ userId }),
  });
}

export async function likeReview(id: string) {
  return api.post<Review>(`/v1/reviews/${id}/like`, {});
}

export async function dislikeReview(id: string) {
  return api.post<Review>(`/v1/reviews/${id}/dislike`, {});
}

// Admin endpoints
export async function fetchPendingReviews() {
  return api.get<Review[]>('/v1/admin/reviews/pending');
}

export async function moderateReview(id: string, data: ModerateReviewData) {
  return api.post<Review>(`/v1/admin/reviews/${id}/moderate`, data);
}


'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchReviewsByContent,
  fetchReview,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  dislikeReview,
  fetchPendingReviews,
  moderateReview,
} from './reviews-api';
import { ReviewFormData, ReviewStatus, ModerateReviewData } from '../types';

export function useReviewsByContent(contentId: string, status?: ReviewStatus) {
  return useQuery({
    queryKey: ['reviews', contentId, status],
    queryFn: () => fetchReviewsByContent(contentId, status),
    enabled: !!contentId,
  });
}

export function useReview(id: string) {
  return useQuery({
    queryKey: ['review', id],
    queryFn: () => fetchReview(id),
    enabled: !!id,
  });
}

export function useCreateReview(contentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReviewFormData) => createReview(contentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', contentId] });
    },
  });
}

export function useUpdateReview(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ReviewFormData> & { userId: string }) =>
      updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review', id] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId, contentId }: { id: string; userId: string; contentId?: string }) =>
      deleteReview(id, userId, contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useLikeReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => likeReview(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['review', id] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDislikeReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dislikeReview(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['review', id] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

// Admin hooks
export function usePendingReviews() {
  return useQuery({
    queryKey: ['reviews', 'pending'],
    queryFn: fetchPendingReviews,
  });
}

export function useModerateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ModerateReviewData }) =>
      moderateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}


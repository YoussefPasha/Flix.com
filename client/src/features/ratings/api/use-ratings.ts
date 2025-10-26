'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAggregateRating,
  fetchUserRating,
  createRating,
  updateRating,
  deleteRating,
} from './ratings-api';
import { RatingFormData } from '../types';

export function useAggregateRating(contentId: string) {
  return useQuery({
    queryKey: ['rating', 'aggregate', contentId],
    queryFn: () => fetchAggregateRating(contentId),
    enabled: !!contentId,
  });
}

export function useUserRating(contentId: string) {
  return useQuery({
    queryKey: ['rating', 'user', contentId],
    queryFn: () => fetchUserRating(contentId),
    enabled: !!contentId,
  });
}

export function useCreateRating(contentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RatingFormData) => createRating(contentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating', 'aggregate', contentId] });
      queryClient.invalidateQueries({ queryKey: ['rating', 'user', contentId] });
    },
  });
}

export function useUpdateRating(id: string, contentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RatingFormData>) => updateRating(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating', 'aggregate', contentId] });
      queryClient.invalidateQueries({ queryKey: ['rating', 'user', contentId] });
    },
  });
}

export function useDeleteRating(contentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRating(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating', 'aggregate', contentId] });
      queryClient.invalidateQueries({ queryKey: ['rating', 'user', contentId] });
    },
  });
}


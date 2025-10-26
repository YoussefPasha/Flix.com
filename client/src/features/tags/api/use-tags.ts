'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTags, fetchTag, createTag, updateTag, deleteTag } from './tags-api';
import { TagFormData } from '../types';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });
}

export function useTag(id: string) {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: () => fetchTag(id),
    enabled: !!id,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagFormData) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useUpdateTag(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TagFormData>) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tag', id] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}


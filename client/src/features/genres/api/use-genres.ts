'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchGenres,
  fetchGenreTree,
  fetchGenre,
  createGenre,
  updateGenre,
  deleteGenre,
} from './genres-api';
import { GenreFormData } from '../types';

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
  });
}

export function useGenreTree() {
  return useQuery({
    queryKey: ['genres', 'tree'],
    queryFn: fetchGenreTree,
  });
}

export function useGenre(id: string) {
  return useQuery({
    queryKey: ['genre', id],
    queryFn: () => fetchGenre(id),
    enabled: !!id,
  });
}

export function useCreateGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenreFormData) => createGenre(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });
}

export function useUpdateGenre(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<GenreFormData>) => updateGenre(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genre', id] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });
}

export function useDeleteGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGenre(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });
}


'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCastCrewList,
  fetchCastCrew,
  createCastCrew,
  updateCastCrew,
  deleteCastCrew,
} from './cast-crew-api';
import { CastCrewFormData } from '../types';

export function useCastCrewList() {
  return useQuery({
    queryKey: ['cast-crew'],
    queryFn: fetchCastCrewList,
  });
}

export function useCastCrew(id: string) {
  return useQuery({
    queryKey: ['cast-crew', id],
    queryFn: () => fetchCastCrew(id),
    enabled: !!id,
  });
}

export function useCreateCastCrew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CastCrewFormData) => createCastCrew(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cast-crew'] });
    },
  });
}

export function useUpdateCastCrew(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CastCrewFormData>) => updateCastCrew(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cast-crew', id] });
      queryClient.invalidateQueries({ queryKey: ['cast-crew'] });
    },
  });
}

export function useDeleteCastCrew() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCastCrew(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cast-crew'] });
    },
  });
}


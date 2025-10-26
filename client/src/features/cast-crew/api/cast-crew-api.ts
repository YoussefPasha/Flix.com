import { api } from '@/lib/api-client';
import { CastCrew } from '@/types/api';
import { CastCrewFormData } from '../types';

export async function fetchCastCrewList() {
  return api.get<CastCrew[]>('/v1/admin/cast-crew');
}

export function fetchCastCrew(id: string) {
  return api.get<CastCrew>(`/v1/admin/cast-crew/${id}`);
}

export async function createCastCrew(data: CastCrewFormData) {
  return api.post<CastCrew>('/v1/admin/cast-crew', data);
}

export async function updateCastCrew(id: string, data: Partial<CastCrewFormData>) {
  return api.patch<CastCrew>(`/v1/admin/cast-crew/${id}`, data);
}

export async function deleteCastCrew(id: string) {
  return api.delete<void>(`/v1/admin/cast-crew/${id}`);
}


import { api } from '@/lib/api-client';
import { Tag } from '@/types/api';
import { TagFormData } from '../types';

export async function fetchTags() {
  return api.get<Tag[]>('/v1/admin/tags');
}

export async function fetchTag(id: string) {
  return api.get<Tag>(`/v1/admin/tags/${id}`);
}

export async function createTag(data: TagFormData) {
  return api.post<Tag>('/v1/admin/tags', data);
}

export async function updateTag(id: string, data: Partial<TagFormData>) {
  return api.patch<Tag>(`/v1/admin/tags/${id}`, data);
}

export async function deleteTag(id: string) {
  return api.delete<void>(`/v1/admin/tags/${id}`);
}


import { api } from '@/lib/api-client';
import { Content, PaginatedResponse, ContentQueryParams } from '@/types/api';
import { ContentFormData, SeasonFormData, EpisodeFormData } from '../types';

// Fetch all content with pagination and filters
export async function fetchContents(params: ContentQueryParams = {}) {
  return api.get<PaginatedResponse<Content>>('/v1/admin/content', { params: params as Record<string, string | number | boolean | undefined> });
}

// Fetch single content by ID
export async function fetchContent(id: string) {
  return api.get<Content>(`/v1/admin/content/${id}`);
}

// Create new content
export async function createContent(data: ContentFormData) {
  return api.post<Content>('/v1/admin/content', data);
}

// Update existing content
export async function updateContent(id: string, data: Partial<ContentFormData>) {
  return api.patch<Content>(`/v1/admin/content/${id}`, data);
}

// Delete content
export async function deleteContent(id: string) {
  return api.delete<void>(`/v1/admin/content/${id}`);
}

// Season management
export async function fetchSeasons(contentId: string) {
  return api.get(`/v1/admin/content/${contentId}/seasons`);
}

export async function addSeason(contentId: string, data: SeasonFormData) {
  return api.post(`/v1/admin/content/${contentId}/seasons`, data);
}

// Episode management
export async function fetchEpisodes(contentId: string, seasonId: string) {
  return api.get(`/v1/admin/content/${contentId}/seasons/${seasonId}/episodes`);
}

export async function addEpisode(
  contentId: string,
  seasonId: string,
  data: EpisodeFormData
) {
  return api.post(
    `/v1/admin/content/${contentId}/seasons/${seasonId}/episodes`,
    data
  );
}


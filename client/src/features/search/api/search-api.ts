import { api } from '@/lib/api-client';
import { Content, SearchQueryParams } from '@/types/api';

export async function searchContent(params: SearchQueryParams) {
  return api.get<{ data: Content[]; total: number }>('/v1/search', { params: params as Record<string, string | number | boolean | undefined> });
}

export async function autocomplete(query: string) {
  return api.get<Content[]>('/v1/search/autocomplete', { params: { q: query } });
}

export async function fetchPopular() {
  return api.get<Content[]>('/v1/search/popular');
}

export async function fetchTrending() {
  return api.get<Content[]>('/v1/search/trending');
}


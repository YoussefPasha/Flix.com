import { fetchDynamic, fetchCached } from '@/lib/fetch-helpers';
import { Content, SearchQueryParams } from '@/types/api';

export async function searchContent(params: SearchQueryParams) {
  return fetchDynamic<{ data: Content[]; total: number }>('/v1/search', { 
    params: params as Record<string, string | number | boolean | undefined> 
  });
}

export async function autocomplete(query: string) {
  return fetchDynamic<Content[]>('/v1/search/autocomplete', { params: { q: query } });
}

export async function fetchPopular() {
  return fetchCached<Content[]>('/v1/search/popular', { revalidate: 3600 });
}

export async function fetchTrending() {
  return fetchCached<Content[]>('/v1/search/trending', { revalidate: 1800 });
}


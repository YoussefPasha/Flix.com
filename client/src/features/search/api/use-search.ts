'use client';

import { useQuery } from '@tanstack/react-query';
import { searchContent, autocomplete, fetchPopular, fetchTrending } from './search-api';
import { SearchQueryParams } from '../types';

export function useSearch(params: SearchQueryParams) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchContent(params),
    enabled: !!params.q || !!params.genre || !!params.type,
  });
}

export function useAutocomplete(query: string) {
  return useQuery({
    queryKey: ['autocomplete', query],
    queryFn: () => autocomplete(query),
    enabled: query.length >= 2,
  });
}

export function usePopular() {
  return useQuery({
    queryKey: ['popular'],
    queryFn: fetchPopular,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrending,
  });
}


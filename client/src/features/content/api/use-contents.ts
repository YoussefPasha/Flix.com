'use client';

import { useQuery } from '@tanstack/react-query';
import { ContentQueryParams } from '@/types/api';
import { fetchContents } from './content-api';

export function useContents(params: ContentQueryParams = {}) {
  return useQuery({
    queryKey: ['contents', params],
    queryFn: () => fetchContents(params),
  });
}


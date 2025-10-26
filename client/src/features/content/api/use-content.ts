'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchContent } from './content-api';

export function useContent(id: string) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => fetchContent(id),
    enabled: !!id,
  });
}


'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContent } from './content-api';
import { ContentFormData } from '../types';

export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContentFormData) => createContent(data),
    onSuccess: () => {
      // Invalidate and refetch contents list
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}


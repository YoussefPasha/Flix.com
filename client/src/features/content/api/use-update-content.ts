'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateContent } from './content-api';
import { ContentFormData } from '../types';

export function useUpdateContent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ContentFormData>) => updateContent(id, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['content', id] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}


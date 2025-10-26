'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteContent } from './content-api';

export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteContent(id),
    onSuccess: () => {
      // Invalidate and refetch contents list
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}


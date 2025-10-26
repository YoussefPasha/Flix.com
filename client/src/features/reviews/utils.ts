import { ReviewStatus } from '@/types/api';
import { format } from 'date-fns';

export function getStatusLabel(status: ReviewStatus): string {
  const labels: Record<ReviewStatus, string> = {
    [ReviewStatus.PENDING]: 'Pending',
    [ReviewStatus.APPROVED]: 'Approved',
    [ReviewStatus.REJECTED]: 'Rejected',
  };
  return labels[status];
}

export function getStatusColor(status: ReviewStatus): string {
  const colors: Record<ReviewStatus, string> = {
    [ReviewStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ReviewStatus.APPROVED]: 'bg-green-100 text-green-800',
    [ReviewStatus.REJECTED]: 'bg-red-100 text-red-800',
  };
  return colors[status];
}

export function formatReviewDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}


'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePendingReviews, useModerateReview } from '@/features/reviews/api/use-reviews';
import { ReviewStatus } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { formatReviewDate, getStatusColor } from '@/features/reviews/utils';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReviewsModerationPage() {
  const { data: reviews, isLoading } = usePendingReviews();
  const moderateMutation = useModerateReview();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const handleModerate = async (id: string, status: ReviewStatus) => {
    await moderateMutation.mutateAsync({
      id,
      data: { status, isModerated: true },
    });
  };

  // Client-side pagination
  const paginatedReviews = reviews
    ? reviews.slice((page - 1) * pageSize, page * pageSize)
    : [];
  const totalPages = reviews ? Math.ceil(reviews.length / pageSize) : 1;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Review Moderation</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">User {review.userId}</span>
                        <Badge className={getStatusColor(review.status)}>
                          {review.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                  </div>

                  <p className="mb-4">{review.reviewText}</p>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleModerate(review.id, ReviewStatus.APPROVED)}
                      disabled={moderateMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleModerate(review.id, ReviewStatus.REJECTED)}
                      disabled={moderateMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {reviews.length > pageSize && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to{' '}
                {Math.min(page * pageSize, reviews.length)} of{' '}
                {reviews.length} reviews
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No pending reviews</p>
        </div>
      )}
    </div>
  );
}


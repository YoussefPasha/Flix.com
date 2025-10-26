'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePendingReviews, useModerateReview } from '@/features/reviews/api/use-reviews';
import { ReviewStatus } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { formatReviewDate, getStatusColor } from '@/features/reviews/utils';
import { Check, X } from 'lucide-react';

export default function ReviewsModerationPage() {
  const { data: reviews, isLoading } = usePendingReviews();
  const moderateMutation = useModerateReview();

  const handleModerate = async (id: string, status: ReviewStatus) => {
    await moderateMutation.mutateAsync({
      id,
      data: { status, isModerated: true },
    });
  };

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
        <div className="space-y-4">
          {reviews.map((review) => (
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
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No pending reviews</p>
        </div>
      )}
    </div>
  );
}


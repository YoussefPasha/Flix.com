"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useLikeReview,
  useDislikeReview,
} from "@/features/reviews/api/use-reviews";
import { Review } from "@/types/api";
import {
  AlertCircle,
  CheckCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  XCircle,
  Pencil,
  Trash2,
  Send,
  X,
} from "lucide-react";
import { formatReleaseDate } from "@/features/content/utils";

interface ReviewsSectionProps {
  contentId: string;
  initialReviews: Review[];
}

export function ReviewsSection({
  contentId,
  initialReviews,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewText, setReviewText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [errors, setErrors] = useState<{ reviewText?: string }>({});

  const createReviewMutation = useCreateReview(contentId);
  const updateReviewMutation = useUpdateReview(editingReviewId || "");
  const deleteReviewMutation = useDeleteReview();
  const likeReviewMutation = useLikeReview();
  const dislikeReviewMutation = useDislikeReview();

  const getReviewStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const generateUserId = () => {
    return crypto.randomUUID();
  };

  const validateForm = () => {
    if (reviewText.length < 10) {
      setErrors({ reviewText: "Review must be at least 10 characters" });
      return false;
    }
    if (reviewText.length > 2000) {
      setErrors({ reviewText: "Review must be no more than 2000 characters" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userId = generateUserId();
      const newReview = await createReviewMutation.mutateAsync({
        reviewText,
        userId,
      });

      setReviews([newReview, ...reviews]);
      setReviewText("");
      setErrors({});
    } catch (error) {
      console.error("Failed to create review:", error);
    }
  };

  const handleStartEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setEditText(review.reviewText);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditText("");
  };

  const handleUpdateReview = async (review: Review) => {
    if (editText.length < 10) {
      return;
    }

    try {
      const updatedReview = await updateReviewMutation.mutateAsync({
        reviewText: editText,
        userId: review.userId,
        contentId,
      });

      setReviews(reviews.map((r) => (r.id === review.id ? updatedReview : r)));
      setEditingReviewId(null);
      setEditText("");
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  const handleDeleteReview = async (review: Review) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync({
        id: review.id,
        userId: review.userId,
        contentId,
      });

      setReviews(reviews.filter((r) => r.id !== review.id));
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      const updatedReview = await likeReviewMutation.mutateAsync(reviewId);
      setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));
    } catch (error) {
      console.error("Failed to like review:", error);
    }
  };

  const handleDislike = async (reviewId: string) => {
    try {
      const updatedReview = await dislikeReviewMutation.mutateAsync(reviewId);
      setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));
    } catch (error) {
      console.error("Failed to dislike review:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Reviews ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Review Form */}
        <form
          onSubmit={handleSubmitReview}
          className="space-y-4 p-4 border rounded-lg bg-muted/30"
        >
          <h3 className="font-semibold text-lg">Write a Review</h3>

          <div className="space-y-2">
            <Label htmlFor="reviewText">Your Review</Label>
            <Textarea
              id="reviewText"
              placeholder="Share your thoughts... (minimum 10 characters)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className={errors.reviewText ? "border-red-500" : ""}
            />
            {errors.reviewText && (
              <p className="text-sm text-red-500">{errors.reviewText}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {reviewText.length} / 2000 characters
            </p>
          </div>

          <Button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="w-full sm:w-auto"
          >
            {createReviewMutation.isPending ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </form>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">
                      User {review.userId.slice(0, 8)}...
                    </span>
                    {getReviewStatusIcon(review.status)}
                    <Badge variant="outline" className="text-xs capitalize">
                      {review.status}
                    </Badge>
                    {review.isModerated && (
                      <Badge variant="secondary" className="text-xs">
                        Moderated
                      </Badge>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground space-y-1">
                    <div>Posted: {formatReleaseDate(review.createdAt)}</div>
                    {review.updatedAt !== review.createdAt && (
                      <div>Updated: {formatReleaseDate(review.updatedAt)}</div>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                {editingReviewId === review.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={4}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateReview(review)}
                        disabled={
                          updateReviewMutation.isPending || editText.length < 10
                        }
                      >
                        {updateReviewMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={updateReviewMutation.isPending}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{review.reviewText}</p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(review.id)}
                      disabled={likeReviewMutation.isPending}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-green-600 transition-colors disabled:opacity-50"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.likes}</span>
                    </button>
                    <button
                      onClick={() => handleDislike(review.id)}
                      disabled={dislikeReviewMutation.isPending}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>{review.dislikes}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingReviewId !== review.id && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(review)}
                          className="h-8 px-2"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteReview(review)}
                          disabled={deleteReviewMutation.isPending}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Review Metadata */}
                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
                  <span>ID: {review.id.slice(0, 8)}...</span>
                  {review.ratingId && (
                    <span>| Rating ID: {review.ratingId.slice(0, 8)}...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No reviews yet. Be the first to review this content!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

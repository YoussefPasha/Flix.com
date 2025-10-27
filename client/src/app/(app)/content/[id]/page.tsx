import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatDuration,
  formatRating,
  formatReleaseDate,
  getContentTypeLabel,
} from "@/features/content/utils";
import { fetchCached } from "@/lib/fetch-helpers";
import { Content, ContentStatus, Review } from "@/types/api";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Film,
  MessageSquare,
  Star,
  ThumbsDown,
  ThumbsUp,
  Tv,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getContent(id: string) {
  try {
    return await fetchCached<Content>(`/v1/admin/content/${id}`, {
      revalidate: 3600,
    });
  } catch {
    return null;
  }
}

async function getReviews(contentId: string) {
  try {
    return await fetchCached<Review[]>(`/v1/content/${contentId}/reviews`, {
      revalidate: 600,
    });
  } catch {
    return [];
  }
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getContent(id);

  if (!content) {
    notFound();
  }

  const reviews = await getReviews(id);

  const getStatusBadge = (status: ContentStatus) => {
    const variants = {
      published: {
        variant: "default" as const,
        icon: CheckCircle,
        label: "Published",
      },
      draft: {
        variant: "secondary" as const,
        icon: AlertCircle,
        label: "Draft",
      },
      archived: {
        variant: "destructive" as const,
        icon: XCircle,
        label: "Archived",
      },
    };
    const config = variants[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

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

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Status */}
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-4xl font-bold flex-1">{content.title}</h1>
              {getStatusBadge(content.status)}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="gap-1">
                {content.type === "movie" ? (
                  <Film className="h-3 w-3" />
                ) : (
                  <Tv className="h-3 w-3" />
                )}
                {getContentTypeLabel(content.type)}
              </Badge>

              {content.rating && parseFloat(content.rating) > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {formatRating(parseFloat(content.rating))}
                  </span>
                  {content.ratingCount !== undefined && (
                    <span className="text-muted-foreground">
                      ({content.ratingCount.toLocaleString()} ratings)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatReleaseDate(content.releaseDate)}</span>
            </div>

            {content.duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatDuration(content.duration)}</span>
              </div>
            )}

            {content.viewCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>{content.viewCount.toLocaleString()} views</span>
              </div>
            )}

            {reviews.length > 0 && (
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{reviews.length} reviews</span>
              </div>
            )}
          </div>

          {/* Description */}
          {content.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground leading-relaxed">
                {content.description}
              </p>
            </div>
          )}

          {/* Genres */}
          {content.genres && content.genres.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {content.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Content ID:</span>
              <p className="font-mono text-xs mt-1">{content.id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>
              <p className="mt-1">{formatReleaseDate(content.createdAt)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <p className="mt-1">{formatReleaseDate(content.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cast & Crew Section */}
      {content.castCrew && content.castCrew.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cast & Crew
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {content.castCrew.map((person) => (
                <div key={person.id} className="space-y-2">
                  {person.imageUrl ? (
                    <div className="relative aspect-square w-full rounded-md overflow-hidden mb-2 shadow-md">
                      <Image
                        src={person.imageUrl}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square w-full rounded-md overflow-hidden mb-2 bg-muted flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="font-medium text-sm">{person.name}</div>
                  <div className="text-xs text-muted-foreground capitalize bg-secondary/50 px-2 py-1 rounded-full inline-block">
                    {person.role}
                  </div>
                  {person.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                      {person.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seasons & Episodes (for TV Shows) */}
      {content.type === "show" &&
        content.seasons &&
        content.seasons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tv className="h-5 w-5" />
                Seasons & Episodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.seasons.map((season) => (
                <div key={season.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      Season {season.seasonNumber}
                    </h3>
                    <Badge variant="outline">
                      {formatReleaseDate(season.releaseDate)}
                    </Badge>
                    {season.episodes && (
                      <span className="text-sm text-muted-foreground">
                        {season.episodes.length} episodes
                      </span>
                    )}
                  </div>

                  {season.episodes && season.episodes.length > 0 && (
                    <div className="space-y-2">
                      {season.episodes.map((episode) => (
                        <div
                          key={episode.id}
                          className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                        >
                          <div className="shrink-0 w-12 h-12 rounded bg-muted flex items-center justify-center font-semibold">
                            {episode.episodeNumber}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{episode.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {episode.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(episode.duration)}
                              </span>
                              {episode.videoUrl && (
                                <Badge variant="outline" className="text-xs">
                                  Available
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      <Separator />

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
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
                        <div>
                          Updated: {formatReleaseDate(review.updatedAt)}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed">{review.reviewText}</p>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ThumbsDown className="h-4 w-4" />
                        <span>{review.dislikes}</span>
                      </button>
                    </div>

                    <div className="text-xs text-muted-foreground space-x-2">
                      <span>ID: {review.id.slice(0, 8)}...</span>
                      {review.ratingId && (
                        <span>
                          | Rating ID: {review.ratingId.slice(0, 8)}...
                        </span>
                      )}
                    </div>
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
    </div>
  );
}

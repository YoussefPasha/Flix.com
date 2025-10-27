import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  formatDuration,
  formatRating,
  formatReleaseDate,
  getContentThumbnail,
  getContentTypeLabel,
} from "@/features/content/utils";
import { fetchCached } from "@/lib/fetch-helpers";
import { Content, Review } from "@/types/api";
import { Calendar, Clock, Star } from "lucide-react";
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
  params: { id: string };
}) {
  const content = await getContent(params.id);

  if (!content) {
    notFound();
  }

  const reviews = await getReviews(params.id);

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="lg:col-span-1">
          <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden">
            <Image
              src={getContentThumbnail(content)}
              alt={content.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Badge>{getContentTypeLabel(content.type)}</Badge>
                {content.rating && parseFloat(content.rating) > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {formatRating(parseFloat(content.rating))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatReleaseDate(content.releaseDate)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(content.duration)}
            </div>
          </div>

          <p className="text-lg mb-6">{content.description}</p>

          {content.genres && content.genres.length > 0 && (
            <div className="mb-6">
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

          {content.tags && content.tags.length > 0 && (
            <div className="mb-6">
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

          {content.castCrew && content.castCrew.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Cast & Crew</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {content.castCrew.slice(0, 6).map((person) => (
                  <div key={person.id} className="text-sm">
                    <div className="font-medium">{person.name}</div>
                    <div className="text-muted-foreground capitalize">
                      {person.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Reviews Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">User {review.userId}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatReleaseDate(review.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{review.reviewText}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>👍 {review.likes}</span>
                  <span>👎 {review.dislikes}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet</p>
        )}
      </section>
    </div>
  );
}

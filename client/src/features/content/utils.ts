import { Content, ContentType } from "@/types/api";
import { format } from "date-fns";

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function formatReleaseDate(dateString: string): string {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
}

export function getContentTypeLabel(type: ContentType): string {
  return type === ContentType.MOVIE ? "Movie" : "TV Show";
}

export function getContentThumbnail(content: Content): string {
  return content.thumbnailUrl || "/placeholder-content.jpg";
}

export function formatRating(rating: number): string {
  return rating.toString();
}

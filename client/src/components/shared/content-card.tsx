import Link from 'next/link';
import { Star, Calendar, Clock, Film, Tv } from 'lucide-react';
import { Content, ContentType } from '@/types/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRating, formatReleaseDate, formatDuration } from '@/features/content/utils';

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  const rating = content.rating ? parseFloat(content.rating) : 0;
  const isMovie = content.type === ContentType.MOVIE;
  
  return (
    <Link href={`/content/${content.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 hover:border-primary/50">
        <CardHeader className="p-4 pb-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {isMovie ? (
                <Film className="h-5 w-5 text-primary shrink-0" />
              ) : (
                <Tv className="h-5 w-5 text-primary shrink-0" />
              )}
              <Badge variant="outline" className="shrink-0">
                {isMovie ? 'Movie' : 'TV Show'}
              </Badge>
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md shrink-0">
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                  {formatRating(rating)}
                </span>
              </div>
            )}
          </div>
          
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors min-h-14">
            {content.title}
          </h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed min-h-15">
            {content.description || 'No description available'}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {content.genres && content.genres.length > 0 && (
              <>
                {content.genres.slice(0, 3).map((genre) => (
                  <Badge key={genre.id} variant="secondary" className="text-xs">
                    {genre.name}
                  </Badge>
                ))}
                {content.genres.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{content.genres.length - 3}
                  </Badge>
                )}
              </>
            )}
          </div>
          
          <div className="flex flex-col gap-2 pt-2 border-t text-xs text-muted-foreground">
            {content.releaseDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatReleaseDate(content.releaseDate)}</span>
              </div>
            )}
            {content.duration > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDuration(content.duration)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}


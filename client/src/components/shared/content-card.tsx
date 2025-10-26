import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Content } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRating, getContentThumbnail, getContentTypeLabel } from '@/features/content/utils';

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link href={`/content/${content.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={getContentThumbnail(content)}
            alt={content.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">{getContentTypeLabel(content.type)}</Badge>
          </div>
          {content.rating > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-white font-medium">
                {formatRating(content.rating)}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{content.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {content.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}


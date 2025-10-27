import { fetchCached } from '@/lib/fetch-helpers';
import { Content } from '@/types/api';
import { ContentCard } from '@/components/shared/content-card';
import { Film, TrendingUp, Sparkles } from 'lucide-react';

async function getPopularContent() {
  try {
    return await fetchCached<Content[]>('/v1/search/popular', {
      revalidate: 3600, // 1 hour
    });
  } catch {
    console.error('Failed to fetch popular content');
    return [];
  }
}

async function getTrendingContent() {
  try {
    return await fetchCached<Content[]>('/v1/search/trending', {
      revalidate: 1800, // 30 minutes
    });
  } catch {
    console.error('Failed to fetch trending content');
    return [];
  }
}

export default async function HomePage() {
  const [popular, trending] = await Promise.all([
    getPopularContent(),
    getTrendingContent(),
  ]);
  
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8 md:py-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Flix
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing movies and TV shows
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Your ultimate entertainment destination</span>
          </div>
        </section>

        {/* Popular Content */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Popular Now</h2>
          </div>
          
          {popular.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popular.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-secondary/30 rounded-lg border-2 border-dashed">
              <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No popular content available at the moment
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later for updates
              </p>
            </div>
          )}
        </section>

        {/* Trending Content */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Trending</h2>
          </div>
          
          {trending.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trending.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-secondary/30 rounded-lg border-2 border-dashed">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No trending content available at the moment
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later for updates
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


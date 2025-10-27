import { fetchCached } from '@/lib/fetch-helpers';
import { Content } from '@/types/api';
import { ContentCard } from '@/components/shared/content-card';

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
    <div className="container py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to FlixCMS
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover amazing movies and TV shows
        </p>
      </section>

      {/* Popular Content */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {popular.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
        {popular.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No popular content available
          </p>
        )}
      </section>

      {/* Trending Content */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Trending</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {trending.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
        {trending.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No trending content available
          </p>
        )}
      </section>
    </div>
  );
}


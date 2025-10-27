'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Film, Tag, Layers, Users } from 'lucide-react';
import { useContents } from '@/features/content/api/use-contents';
import { useTags } from '@/features/tags/api/use-tags';
import { useGenres } from '@/features/genres/api/use-genres';
import { useCastCrewList } from '@/features/cast-crew/api/use-cast-crew';
import { Skeleton } from '@/components/ui/skeleton';

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: contents, isLoading: contentsLoading } = useContents();
  const { data: tags, isLoading: tagsLoading } = useTags();
  const { data: genres, isLoading: genresLoading } = useGenres();
  const { data: castCrew, isLoading: castCrewLoading } = useCastCrewList();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Content"
          value={contents?.data?.length || 0}
          icon={Film}
          isLoading={contentsLoading}
        />
        <StatCard
          title="Genres"
          value={genres?.length || 0}
          icon={Layers}
          isLoading={genresLoading}
        />
        <StatCard
          title="Tags"
          value={tags?.length || 0}
          icon={Tag}
          isLoading={tagsLoading}
        />
        <StatCard
          title="Cast & Crew"
          value={castCrew?.length || 0}
          icon={Users}
          isLoading={castCrewLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity tracking coming soon...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/dashboard/content/new"
              className="block text-sm text-blue-600 hover:underline"
            >
              + Add New Content
            </a>
            <a
              href="/dashboard/tags/new"
              className="block text-sm text-blue-600 hover:underline"
            >
              + Add New Tag
            </a>
            <a
              href="/dashboard/genres/new"
              className="block text-sm text-blue-600 hover:underline"
            >
              + Add New Genre
            </a>
            <a
              href="/dashboard/cast-crew/new"
              className="block text-sm text-blue-600 hover:underline"
            >
              + Add Cast/Crew Member
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCastCrew, useUpdateCastCrew } from '@/features/cast-crew/api/use-cast-crew';
import { castCrewSchema, CastCrewFormData } from '@/features/cast-crew/types';
import { CastCrewRole } from '@/types/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

export default function EditCastCrewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: castCrew, isLoading } = useCastCrew(id);
  const updateMutation = useUpdateCastCrew(id);

  const form = useForm<CastCrewFormData>({
    resolver: zodResolver(castCrewSchema),
    defaultValues: {
      name: '',
      role: CastCrewRole.ACTOR,
      bio: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (castCrew) {
      form.reset({
        name: castCrew.name,
        role: castCrew.role,
        bio: castCrew.bio || '',
        imageUrl: castCrew.imageUrl || '',
      });
    }
  }, [castCrew, form]);

  const onSubmit = async (data: CastCrewFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      router.push('/dashboard/cast-crew');
    } catch (error) {
      console.error('Failed to update cast/crew member:', error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/cast-crew">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Cast/Crew Member</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cast/Crew Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={CastCrewRole.ACTOR}>Actor</SelectItem>
                        <SelectItem value={CastCrewRole.DIRECTOR}>Director</SelectItem>
                        <SelectItem value={CastCrewRole.PRODUCER}>Producer</SelectItem>
                        <SelectItem value={CastCrewRole.WRITER}>Writer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Biography..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/dashboard/cast-crew">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


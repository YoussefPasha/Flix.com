import { CastCrewRole } from '@/types/api';

export function getRoleLabel(role: CastCrewRole): string {
  const labels: Record<CastCrewRole, string> = {
    [CastCrewRole.ACTOR]: 'Actor',
    [CastCrewRole.DIRECTOR]: 'Director',
    [CastCrewRole.PRODUCER]: 'Producer',
    [CastCrewRole.WRITER]: 'Writer',
  };
  return labels[role];
}

export function getCastCrewImage(imageUrl?: string): string {
  return imageUrl || '/placeholder-person.jpg';
}


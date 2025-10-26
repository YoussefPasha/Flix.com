import { DataSource } from 'typeorm';
import {
  CastCrew,
  CastCrewRole,
} from '../../cast-crew/entities/cast-crew.entity';

export class CastCrewSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const castCrewRepository = dataSource.getRepository(CastCrew);

    const castCrewData = [
      // Actors
      {
        name: 'Robert Downey Jr.',
        role: CastCrewRole.ACTOR,
        bio: 'American actor and producer',
        nationality: 'American',
      },
      {
        name: 'Scarlett Johansson',
        role: CastCrewRole.ACTOR,
        bio: 'American actress and singer',
        nationality: 'American',
      },
      {
        name: 'Leonardo DiCaprio',
        role: CastCrewRole.ACTOR,
        bio: 'American actor and film producer',
        nationality: 'American',
      },
      {
        name: 'Meryl Streep',
        role: CastCrewRole.ACTOR,
        bio: 'American actress',
        nationality: 'American',
      },
      {
        name: 'Tom Hanks',
        role: CastCrewRole.ACTOR,
        bio: 'American actor and filmmaker',
        nationality: 'American',
      },
      {
        name: 'Jennifer Lawrence',
        role: CastCrewRole.ACTOR,
        bio: 'American actress',
        nationality: 'American',
      },
      {
        name: 'Denzel Washington',
        role: CastCrewRole.ACTOR,
        bio: 'American actor, director, and producer',
        nationality: 'American',
      },
      {
        name: 'Emma Stone',
        role: CastCrewRole.ACTOR,
        bio: 'American actress',
        nationality: 'American',
      },
      // Directors
      {
        name: 'Christopher Nolan',
        role: CastCrewRole.DIRECTOR,
        bio: 'British-American film director, producer, and screenwriter',
        nationality: 'British',
      },
      {
        name: 'Steven Spielberg',
        role: CastCrewRole.DIRECTOR,
        bio: 'American film director, producer, and screenwriter',
        nationality: 'American',
      },
      {
        name: 'Quentin Tarantino',
        role: CastCrewRole.DIRECTOR,
        bio: 'American film director and screenwriter',
        nationality: 'American',
      },
      {
        name: 'Greta Gerwig',
        role: CastCrewRole.DIRECTOR,
        bio: 'American actress and filmmaker',
        nationality: 'American',
      },
      {
        name: 'Denis Villeneuve',
        role: CastCrewRole.DIRECTOR,
        bio: 'Canadian film director and screenwriter',
        nationality: 'Canadian',
      },
      // Producers
      {
        name: 'Kevin Feige',
        role: CastCrewRole.PRODUCER,
        bio: 'American film and television producer',
        nationality: 'American',
      },
      {
        name: 'Kathleen Kennedy',
        role: CastCrewRole.PRODUCER,
        bio: 'American film producer',
        nationality: 'American',
      },
      // Writers
      {
        name: 'Aaron Sorkin',
        role: CastCrewRole.WRITER,
        bio: 'American screenwriter, director, and producer',
        nationality: 'American',
      },
      {
        name: 'Charlie Kaufman',
        role: CastCrewRole.WRITER,
        bio: 'American screenwriter, producer, and film director',
        nationality: 'American',
      },
    ];

    for (const data of castCrewData) {
      const exists = await castCrewRepository.findOne({
        where: { name: data.name, role: data.role },
      });

      if (!exists) {
        const castCrew = castCrewRepository.create(data);
        await castCrewRepository.save(castCrew);
        console.log(`  ✓ Created ${data.role}: ${data.name}`);
      }
    }
  }
}

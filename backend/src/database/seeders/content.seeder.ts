import { DataSource } from 'typeorm';
import {
  Content,
  ContentType,
  ContentStatus,
} from '../../content/entities/content.entity';
import { Season } from '../../content/entities/season.entity';
import { Episode } from '../../content/entities/episode.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { CastCrew } from '../../cast-crew/entities/cast-crew.entity';

export class ContentSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const contentRepository = dataSource.getRepository(Content);
    const seasonRepository = dataSource.getRepository(Season);
    const episodeRepository = dataSource.getRepository(Episode);
    const genreRepository = dataSource.getRepository(Genre);
    const tagRepository = dataSource.getRepository(Tag);
    const castCrewRepository = dataSource.getRepository(CastCrew);

    // Get genres, tags, and cast/crew for associations
    const actionGenre = await genreRepository.findOne({
      where: { slug: 'action' },
    });
    const sciFiGenre = await genreRepository.findOne({
      where: { slug: 'science-fiction' },
    });
    const dramaGenre = await genreRepository.findOne({
      where: { slug: 'drama' },
    });
    const comedyGenre = await genreRepository.findOne({
      where: { slug: 'comedy' },
    });
    const thrillerGenre = await genreRepository.findOne({
      where: { slug: 'thriller' },
    });

    const blockbusterTag = await tagRepository.findOne({
      where: { slug: 'blockbuster' },
    });
    const criticallyAcclaimedTag = await tagRepository.findOne({
      where: { slug: 'critically-acclaimed' },
    });
    const newReleaseTag = await tagRepository.findOne({
      where: { slug: 'new-release' },
    });

    const leonardoDiCaprio = await castCrewRepository.findOne({
      where: { name: 'Leonardo DiCaprio' },
    });
    const christopherNolan = await castCrewRepository.findOne({
      where: { name: 'Christopher Nolan' },
    });
    const scarlettJohansson = await castCrewRepository.findOne({
      where: { name: 'Scarlett Johansson' },
    });

    // Movie 1: Inception-like
    const movie1Data = {
      title: 'Dream Heist',
      description:
        'A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
      releaseDate: new Date('2023-07-15'),
      duration: 148,
      type: ContentType.MOVIE,
      rating: 4.8,
      ratingCount: 25000,
      status: ContentStatus.PUBLISHED,
      viewCount: 150000,
      thumbnailUrl:
        'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    };
    const movie1 = contentRepository.create(movie1Data);
    movie1.genres = [sciFiGenre, thrillerGenre, actionGenre].filter(
      (x): x is Genre => x !== null,
    );
    movie1.tags = [blockbusterTag, criticallyAcclaimedTag].filter(
      (x): x is Tag => x !== null,
    );
    movie1.castCrew = [leonardoDiCaprio, christopherNolan].filter(
      (x): x is CastCrew => x !== null,
    );
    await contentRepository.save(movie1);
    console.log(`  ✓ Created movie: ${movie1.title}`);

    // Movie 2: Action thriller
    const movie2Data = {
      title: 'Shadow Protocol',
      description: 'A secret agent must go rogue to stop a global conspiracy.',
      releaseDate: new Date('2024-03-22'),
      duration: 125,
      type: ContentType.MOVIE,
      rating: 4.3,
      ratingCount: 18000,
      status: ContentStatus.PUBLISHED,
      viewCount: 95000,
      thumbnailUrl:
        'https://m.media-amazon.com/images/M/MV5BMTY4NzQ2NDUzM15BMl5BanBnXkFtZTgwOTc5OTExMTE@._V1_FMjpg_UX1000_.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=gYbW1F_c9eM',
    };
    const movie2 = contentRepository.create(movie2Data);
    movie2.genres = [actionGenre, thrillerGenre].filter(
      (x): x is Genre => x !== null,
    );
    movie2.tags = [newReleaseTag, blockbusterTag].filter(
      (x): x is Tag => x !== null,
    );
    movie2.castCrew = [scarlettJohansson].filter(
      (x): x is CastCrew => x !== null,
    );
    await contentRepository.save(movie2);
    console.log(`  ✓ Created movie: ${movie2.title}`);

    // Movie 3: Drama
    const movie3Data = {
      title: 'The Last Summer',
      description:
        'A touching story about friendship and growing up during one unforgettable summer.',
      releaseDate: new Date('2023-11-10'),
      duration: 118,
      type: ContentType.MOVIE,
      rating: 4.6,
      ratingCount: 12000,
      status: ContentStatus.PUBLISHED,
      viewCount: 72000,
      thumbnailUrl:
        'https://m.media-amazon.com/images/M/MV5BMTk3ODA4Mjc0NF5BMl5BanBnXkFtZTgwNDc1MzQ2OTE@._V1_FMjpg_UX1000_.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=w7yqv-usTkI',
    };
    const movie3 = contentRepository.create(movie3Data);
    movie3.genres = [dramaGenre, comedyGenre].filter(
      (x): x is Genre => x !== null,
    );
    movie3.tags = [criticallyAcclaimedTag].filter((x): x is Tag => x !== null);
    movie3.castCrew = [];
    await contentRepository.save(movie3);
    console.log(`  ✓ Created movie: ${movie3.title}`);

    // TV Show 1: Sci-Fi Series
    const show1Data = {
      title: 'Quantum Leap: New Horizons',
      description:
        'A scientist travels through time, leaping into the bodies of different people to fix historical mistakes.',
      releaseDate: new Date('2023-09-01'),
      type: ContentType.SHOW,
      rating: 4.5,
      ratingCount: 30000,
      status: ContentStatus.PUBLISHED,
      viewCount: 200000,
      thumbnailUrl:
        'https://m.media-amazon.com/images/M/MV5BMjQwODQwNTg4OV5BMl5BanBnXkFtZTgwMzExMjE3NzE@._V1_FMjpg_UX1000_.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    };
    const show1 = contentRepository.create(show1Data);
    show1.genres = [sciFiGenre, dramaGenre].filter(
      (x): x is Genre => x !== null,
    );
    show1.tags = [criticallyAcclaimedTag, newReleaseTag].filter(
      (x): x is Tag => x !== null,
    );
    show1.castCrew = [];
    await contentRepository.save(show1);
    console.log(`  ✓ Created show: ${show1.title}`);

    // Add seasons and episodes for show1
    const season1Data = {
      seasonNumber: 1,
      title: 'The Beginning',
      description: 'The journey begins',
      releaseDate: new Date('2023-09-01'),
      contentId: show1.id,
    };
    const season1 = seasonRepository.create(season1Data);
    await seasonRepository.save(season1);

    for (let i = 1; i <= 10; i++) {
      const episode = episodeRepository.create({
        episodeNumber: i,
        title: `Episode ${i}: The ${i === 1 ? 'Pilot' : 'Adventure Continues'}`,
        description: `Episode ${i} of season 1`,
        duration: 45,
        releaseDate: new Date(`2023-09-${i < 10 ? '0' : ''}${i}`),
        season: season1,
      });
      await episodeRepository.save(episode);
    }
    console.log(`  ✓ Created season 1 with 10 episodes for: ${show1.title}`);

    const season2Data = {
      seasonNumber: 2,
      title: 'New Challenges',
      description: 'The story deepens',
      releaseDate: new Date('2024-02-01'),
      contentId: show1.id,
    };
    const season2 = seasonRepository.create(season2Data);
    await seasonRepository.save(season2);

    for (let i = 1; i <= 8; i++) {
      const episode = episodeRepository.create({
        episodeNumber: i,
        title: `Episode ${i}: The Plot Thickens`,
        description: `Episode ${i} of season 2`,
        duration: 48,
        releaseDate: new Date(`2024-02-${i < 10 ? '0' : ''}${i}`),
        season: season2,
      });
      await episodeRepository.save(episode);
    }
    console.log(`  ✓ Created season 2 with 8 episodes for: ${show1.title}`);

    // TV Show 2: Crime Drama
    const show2Data = {
      title: 'City of Shadows',
      description:
        'A detective navigates the dark underworld of a sprawling metropolis.',
      releaseDate: new Date('2023-10-15'),
      type: ContentType.SHOW,
      rating: 4.7,
      ratingCount: 22000,
      status: ContentStatus.PUBLISHED,
      viewCount: 180000,
      thumbnailUrl:
        'https://m.media-amazon.com/images/M/MV5BMjM5MjkwNTc4MV5BMl5BanBnXkFtZTgwNjA3MDk3OTE@._V1_FMjpg_UX1000_.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=H5v3kku4y6Q',
    };
    const show2 = contentRepository.create(show2Data);
    show2.genres = [dramaGenre, thrillerGenre].filter(
      (x): x is Genre => x !== null,
    );
    show2.tags = [criticallyAcclaimedTag].filter((x): x is Tag => x !== null);
    show2.castCrew = [];
    await contentRepository.save(show2);
    console.log(`  ✓ Created show: ${show2.title}`);

    // Add one season for show2
    const show2Season1Data = {
      seasonNumber: 1,
      title: 'The Investigation Begins',
      description: 'Follow the clues',
      releaseDate: new Date('2023-10-15'),
      contentId: show2.id,
    };
    const show2Season1 = seasonRepository.create(show2Season1Data);
    await seasonRepository.save(show2Season1);

    for (let i = 1; i <= 12; i++) {
      const episode = episodeRepository.create({
        episodeNumber: i,
        title: `Episode ${i}: Piece by Piece`,
        description: `Episode ${i} of season 1`,
        duration: 50,
        releaseDate: new Date(`2023-10-${15 + i - 1}`),
        season: show2Season1,
      });
      await episodeRepository.save(episode);
    }
    console.log(`  ✓ Created season 1 with 12 episodes for: ${show2.title}`);
  }
}

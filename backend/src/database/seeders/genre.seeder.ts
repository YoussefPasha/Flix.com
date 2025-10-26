import { DataSource } from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';

export class GenreSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const genreRepository = dataSource.getRepository(Genre);

    const genres = [
      {
        name: 'Action',
        slug: 'action',
        description: 'High-energy films with physical stunts and chases',
      },
      {
        name: 'Comedy',
        slug: 'comedy',
        description: 'Humorous content designed to make you laugh',
      },
      {
        name: 'Drama',
        slug: 'drama',
        description: 'Serious, plot-driven presentations',
      },
      {
        name: 'Horror',
        slug: 'horror',
        description: 'Scary and suspenseful content',
      },
      {
        name: 'Science Fiction',
        slug: 'science-fiction',
        description: 'Futuristic and speculative content',
      },
      {
        name: 'Thriller',
        slug: 'thriller',
        description: 'Suspenseful and exciting content',
      },
      {
        name: 'Romance',
        slug: 'romance',
        description: 'Love and relationship-focused content',
      },
      {
        name: 'Documentary',
        slug: 'documentary',
        description: 'Non-fiction content about real events',
      },
      {
        name: 'Animation',
        slug: 'animation',
        description: 'Animated films and series',
      },
      {
        name: 'Crime',
        slug: 'crime',
        description: 'Crime and mystery-focused content',
      },
      {
        name: 'Fantasy',
        slug: 'fantasy',
        description: 'Magical and fantastical content',
      },
      {
        name: 'Adventure',
        slug: 'adventure',
        description: 'Exciting journeys and expeditions',
      },
    ];

    for (const genreData of genres) {
      const exists = await genreRepository.findOne({
        where: { slug: genreData.slug },
      });

      if (!exists) {
        const genre = genreRepository.create(genreData);
        await genreRepository.save(genre);
        console.log(`  ✓ Created genre: ${genreData.name}`);
      }
    }
  }
}

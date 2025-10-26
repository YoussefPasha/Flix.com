import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../config/database.config';
import { GenreSeeder } from './genre.seeder';
import { TagSeeder } from './tag.seeder';
import { CastCrewSeeder } from './cast-crew.seeder';
import { ContentSeeder } from './content.seeder';
import { RatingSeeder } from './rating.seeder';
import { ReviewSeeder } from './review.seeder';

// Load environment variables
config();

async function runSeeders() {
  const dataSource = new DataSource(dataSourceOptions);

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    // Run seeders in order
    console.log('🌱 Running Genre Seeder...');
    await new GenreSeeder().run(dataSource);

    console.log('🌱 Running Tag Seeder...');
    await new TagSeeder().run(dataSource);

    console.log('🌱 Running Cast & Crew Seeder...');
    await new CastCrewSeeder().run(dataSource);

    console.log('🌱 Running Content Seeder...');
    await new ContentSeeder().run(dataSource);

    console.log('🌱 Running Rating Seeder...');
    await new RatingSeeder().run(dataSource);

    console.log('🌱 Running Review Seeder...');
    await new ReviewSeeder().run(dataSource);

    console.log('✅ All seeders completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

void runSeeders();

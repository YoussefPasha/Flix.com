import { DataSource } from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';
import { Content } from '../../content/entities/content.entity';

export class RatingSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const ratingRepository = dataSource.getRepository(Rating);
    const contentRepository = dataSource.getRepository(Content);

    const contents = await contentRepository.find({ take: 5 });

    // Generate some fake user IDs
    const fakeUserIds = [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440005',
    ];

    for (const content of contents) {
      for (const userId of fakeUserIds) {
        const exists = await ratingRepository.findOne({
          where: { userId, contentId: content.id },
        });

        if (!exists) {
          const score = Math.floor(Math.random() * 2) + 3 + Math.random(); // Random score between 3.0 and 5.0
          const rating = ratingRepository.create({
            userId,
            contentId: content.id,
            score: Math.round(score * 10) / 10,
          });
          await ratingRepository.save(rating);
        }
      }
      console.log(`  ✓ Created ratings for: ${content.title}`);
    }
  }
}

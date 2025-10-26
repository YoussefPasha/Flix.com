import { DataSource } from 'typeorm';
import { Review, ReviewStatus } from '../../reviews/entities/review.entity';
import { Content } from '../../content/entities/content.entity';
import { Rating } from '../../ratings/entities/rating.entity';

export class ReviewSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const reviewRepository = dataSource.getRepository(Review);
    const contentRepository = dataSource.getRepository(Content);
    const ratingRepository = dataSource.getRepository(Rating);

    const contents = await contentRepository.find({ take: 3 });

    const reviewTexts = [
      "Absolutely brilliant! One of the best I've seen in years.",
      'Great storyline and excellent character development.',
      'Visually stunning and emotionally engaging.',
      'Good, but could have been better with tighter editing.',
      'Entertaining throughout. Highly recommended!',
      'A masterpiece of modern cinema.',
      'The performances were outstanding.',
      'Not what I expected, but pleasantly surprised.',
    ];

    for (const content of contents) {
      const ratings = await ratingRepository.find({
        where: { contentId: content.id },
        take: 3,
      });

      for (let i = 0; i < ratings.length; i++) {
        const rating = ratings[i];
        const exists = await reviewRepository.findOne({
          where: { userId: rating.userId, contentId: content.id },
        });

        if (!exists) {
          const review = reviewRepository.create({
            userId: rating.userId,
            contentId: content.id,
            ratingId: rating.id,
            reviewText:
              reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
            likes: Math.floor(Math.random() * 100),
            dislikes: Math.floor(Math.random() * 20),
            isModerated: true,
            status: ReviewStatus.APPROVED,
          });
          await reviewRepository.save(review);
        }
      }
      console.log(`  ✓ Created reviews for: ${content.title}`);
    }
  }
}

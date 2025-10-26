import { DataSource } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

export class TagSeeder {
  async run(dataSource: DataSource): Promise<void> {
    const tagRepository = dataSource.getRepository(Tag);

    const tags = [
      {
        name: 'Award Winner',
        slug: 'award-winner',
        description: 'Content that has won major awards',
      },
      {
        name: 'Blockbuster',
        slug: 'blockbuster',
        description: 'High-grossing content',
      },
      {
        name: 'Critically Acclaimed',
        slug: 'critically-acclaimed',
        description: 'Highly rated by critics',
      },
      {
        name: 'Hidden Gem',
        slug: 'hidden-gem',
        description: 'Underrated content worth watching',
      },
      {
        name: 'Cult Classic',
        slug: 'cult-classic',
        description: 'Content with a dedicated fanbase',
      },
      {
        name: 'Based on True Story',
        slug: 'based-on-true-story',
        description: 'Inspired by real events',
      },
      {
        name: 'Book Adaptation',
        slug: 'book-adaptation',
        description: 'Adapted from literature',
      },
      {
        name: 'Original Series',
        slug: 'original-series',
        description: 'Exclusive original content',
      },
      {
        name: 'Family Friendly',
        slug: 'family-friendly',
        description: 'Suitable for all ages',
      },
      {
        name: 'Mind Bending',
        slug: 'mind-bending',
        description: 'Complex and thought-provoking',
      },
      {
        name: 'Feel Good',
        slug: 'feel-good',
        description: 'Uplifting and positive content',
      },
      { name: 'Dark', slug: 'dark', description: 'Dark and mature themes' },
      { name: 'Indie', slug: 'indie', description: 'Independent productions' },
      { name: 'Classic', slug: 'classic', description: 'Timeless content' },
      {
        name: 'New Release',
        slug: 'new-release',
        description: 'Recently released content',
      },
    ];

    for (const tagData of tags) {
      const exists = await tagRepository.findOne({
        where: { slug: tagData.slug },
      });

      if (!exists) {
        const tag = tagRepository.create(tagData);
        await tagRepository.save(tag);
        console.log(`  ✓ Created tag: ${tagData.name}`);
      }
    }
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1730000000000 implements MigrationInterface {
  name = 'InitialSchema1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "content" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "releaseDate" date,
        "duration" integer,
        "type" character varying NOT NULL DEFAULT 'movie',
        "rating" decimal(3,2) DEFAULT 0,
        "ratingCount" integer DEFAULT 0,
        "thumbnailUrl" character varying(500),
        "trailerUrl" character varying(500),
        "status" character varying NOT NULL DEFAULT 'draft',
        "viewCount" integer DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_content_type" CHECK ("type" IN ('movie', 'show')),
        CONSTRAINT "CHK_content_status" CHECK ("status" IN ('draft', 'published', 'archived'))
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_content_title" ON "content" ("title")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_content_type" ON "content" ("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_content_status" ON "content" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_content_rating" ON "content" ("rating")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_content_releaseDate" ON "content" ("releaseDate")`,
    );

    await queryRunner.query(`
      CREATE TABLE "genres" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL UNIQUE,
        "slug" character varying(100) NOT NULL UNIQUE,
        "description" text,
        "parentId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_genres_parent" FOREIGN KEY ("parentId") 
          REFERENCES "genres"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_genres_slug" ON "genres" ("slug")`,
    );

    await queryRunner.query(`
      CREATE TABLE "tags" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL UNIQUE,
        "slug" character varying(100) NOT NULL UNIQUE,
        "description" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_tags_slug" ON "tags" ("slug")`);

    await queryRunner.query(`
      CREATE TABLE "cast_crew" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "role" character varying NOT NULL DEFAULT 'actor',
        "bio" text,
        "imageUrl" character varying(500),
        "birthDate" date,
        "nationality" character varying(100),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_cast_crew_role" CHECK ("role" IN ('actor', 'director', 'producer', 'writer', 'cinematographer'))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "seasons" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "seasonNumber" integer NOT NULL,
        "releaseDate" date,
        "title" character varying(255),
        "description" text,
        "contentId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_seasons_content" FOREIGN KEY ("contentId") 
          REFERENCES "content"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "episodes" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "episodeNumber" integer NOT NULL,
        "title" character varying(255) NOT NULL,
        "description" text,
        "duration" integer,
        "seasonId" uuid NOT NULL,
        "videoUrl" character varying(500),
        "thumbnailUrl" character varying(500),
        "releaseDate" date,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_episodes_season" FOREIGN KEY ("seasonId") 
          REFERENCES "seasons"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "ratings" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "contentId" uuid NOT NULL,
        "score" decimal(3,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_ratings_user_content" UNIQUE ("userId", "contentId"),
        CONSTRAINT "FK_ratings_content" FOREIGN KEY ("contentId") 
          REFERENCES "content"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_ratings_contentId" ON "ratings" ("contentId")`,
    );

    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "contentId" uuid NOT NULL,
        "ratingId" uuid,
        "reviewText" text NOT NULL,
        "likes" integer DEFAULT 0,
        "dislikes" integer DEFAULT 0,
        "isModerated" boolean DEFAULT false,
        "status" character varying NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_reviews_status" CHECK ("status" IN ('pending', 'approved', 'rejected')),
        CONSTRAINT "FK_reviews_content" FOREIGN KEY ("contentId") 
          REFERENCES "content"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_reviews_rating" FOREIGN KEY ("ratingId") 
          REFERENCES "ratings"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_reviews_contentId" ON "reviews" ("contentId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_reviews_userId" ON "reviews" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_reviews_status" ON "reviews" ("status")`,
    );

    await queryRunner.query(`
      CREATE TABLE "content_genres" (
        "contentId" uuid NOT NULL,
        "genreId" uuid NOT NULL,
        CONSTRAINT "PK_content_genres" PRIMARY KEY ("contentId", "genreId"),
        CONSTRAINT "FK_content_genres_content" FOREIGN KEY ("contentId") 
          REFERENCES "content"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_content_genres_genre" FOREIGN KEY ("genreId") 
          REFERENCES "genres"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "content_tags" (
        "contentId" uuid NOT NULL,
        "tagId" uuid NOT NULL,
        CONSTRAINT "PK_content_tags" PRIMARY KEY ("contentId", "tagId"),
        CONSTRAINT "FK_content_tags_content" FOREIGN KEY ("contentId") 
          REFERENCES "content"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_content_tags_tag" FOREIGN KEY ("tagId") 
          REFERENCES "tags"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "content_cast_crew" (
        "contentId" uuid NOT NULL,
        "castCrewId" uuid NOT NULL,
        CONSTRAINT "PK_content_cast_crew" PRIMARY KEY ("contentId", "castCrewId"),
        CONSTRAINT "FK_content_cast_crew_content" FOREIGN KEY ("contentId") 
          REFERENCES "content"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_content_cast_crew_cast_crew" FOREIGN KEY ("castCrewId") 
          REFERENCES "cast_crew"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "content_cast_crew"`);
    await queryRunner.query(`DROP TABLE "content_tags"`);
    await queryRunner.query(`DROP TABLE "content_genres"`);

    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "ratings"`);
    await queryRunner.query(`DROP TABLE "episodes"`);
    await queryRunner.query(`DROP TABLE "seasons"`);
    await queryRunner.query(`DROP TABLE "cast_crew"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "genres"`);
    await queryRunner.query(`DROP TABLE "content"`);
  }
}

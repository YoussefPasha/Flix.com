/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  ContentType,
  ContentStatus,
} from '../src/content/entities/content.entity';

describe('ContentController (e2e)', () => {
  let app: INestApplication;
  let contentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/admin/content (POST)', () => {
    it('should create new content', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/content')
        .send({
          title: 'Test Movie',
          description: 'A test movie',
          type: ContentType.MOVIE,
          releaseDate: '2024-01-01',
          duration: 120,
          status: ContentStatus.DRAFT,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Movie');
          contentId = res.body.id;
        });
    });

    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/content')
        .send({
          title: '', // Invalid: empty title
          type: 'invalid-type', // Invalid enum
        })
        .expect(400);
    });
  });

  describe('/api/v1/admin/content (GET)', () => {
    it('should return paginated content list', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/content')
        .query({ page: 1, limit: 10 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('pagination');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should filter by type', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/content')
        .query({ type: ContentType.MOVIE })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.every((c) => c.type === ContentType.MOVIE)).toBe(
            true,
          );
        });
    });
  });

  describe('/api/v1/admin/content/:id (GET)', () => {
    it('should return content by id', () => {
      if (!contentId) return;

      return request(app.getHttpServer())
        .get(`/api/v1/admin/content/${contentId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(contentId);
          expect(res.body).toHaveProperty('title');
        });
    });

    it('should return 404 for non-existent content', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/content/550e8400-e29b-41d4-a716-446655440000')
        .expect(404);
    });

    it('should return 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/content/invalid-uuid')
        .expect(400);
    });
  });

  describe('/api/v1/admin/content/:id (PATCH)', () => {
    it('should update content', () => {
      if (!contentId) return;

      return request(app.getHttpServer())
        .patch(`/api/v1/admin/content/${contentId}`)
        .send({
          title: 'Updated Test Movie',
          status: ContentStatus.PUBLISHED,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Test Movie');
          expect(res.body.status).toBe(ContentStatus.PUBLISHED);
        });
    });
  });

  describe('/api/v1/admin/content/:id (DELETE)', () => {
    it('should delete content', () => {
      if (!contentId) return;

      return request(app.getHttpServer())
        .delete(`/api/v1/admin/content/${contentId}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent content', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/admin/content/550e8400-e29b-41d4-a716-446655440000')
        .expect(404);
    });
  });
});

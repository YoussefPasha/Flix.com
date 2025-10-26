/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GenresController (e2e)', () => {
  let app: INestApplication;
  let genreId: string;

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

  describe('/api/v1/admin/genres (POST)', () => {
    it('should create new genre', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/genres')
        .send({
          name: 'Test Genre',
          slug: 'test-genre-e2e',
          description: 'A test genre',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Genre');
          expect(res.body.slug).toBe('test-genre-e2e');
          genreId = res.body.id;
        });
    });

    it('should return 409 for duplicate slug', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/genres')
        .send({
          name: 'Another Genre',
          slug: 'test-genre-e2e', // Same slug
          description: 'Another test genre',
        })
        .expect(409);
    });

    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/genres')
        .send({
          name: '', // Invalid: empty name
        })
        .expect(400);
    });
  });

  describe('/api/v1/admin/genres (GET)', () => {
    it('should return all genres', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/genres')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('/api/v1/admin/genres/tree (GET)', () => {
    it('should return genre tree', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/genres/tree')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/api/v1/admin/genres/:id (GET)', () => {
    it('should return genre by id', () => {
      if (!genreId) return;

      return request(app.getHttpServer())
        .get(`/api/v1/admin/genres/${genreId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(genreId);
          expect(res.body.name).toBe('Test Genre');
        });
    });

    it('should return 404 for non-existent genre', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/genres/550e8400-e29b-41d4-a716-446655440000')
        .expect(404);
    });
  });

  describe('/api/v1/admin/genres/slug/:slug (GET)', () => {
    it('should return genre by slug', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/genres/slug/test-genre-e2e')
        .expect(200)
        .expect((res) => {
          expect(res.body.slug).toBe('test-genre-e2e');
        });
    });

    it('should return 404 for non-existent slug', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/genres/slug/nonexistent-slug')
        .expect(404);
    });
  });

  describe('/api/v1/admin/genres/:id (PATCH)', () => {
    it('should update genre', () => {
      if (!genreId) return;

      return request(app.getHttpServer())
        .patch(`/api/v1/admin/genres/${genreId}`)
        .send({
          name: 'Updated Test Genre',
          description: 'Updated description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Test Genre');
          expect(res.body.description).toBe('Updated description');
        });
    });
  });

  describe('/api/v1/admin/genres/:id (DELETE)', () => {
    it('should delete genre', () => {
      if (!genreId) return;

      return request(app.getHttpServer())
        .delete(`/api/v1/admin/genres/${genreId}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent genre', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/admin/genres/550e8400-e29b-41d4-a716-446655440000')
        .expect(404);
    });
  });
});

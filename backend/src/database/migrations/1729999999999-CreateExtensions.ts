import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExtensions1729999999999 implements MigrationInterface {
  name = 'CreateExtensions1729999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}


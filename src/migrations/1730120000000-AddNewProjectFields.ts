// src/migrations/1730120000000-AddNewProjectFields.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewProjectFields1730120000000 implements MigrationInterface {
  name = 'AddNewProjectFields1730120000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Додаємо нові колонки
    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "longDescription" text`);
    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "features" text[] NOT NULL DEFAULT '{}'`);
    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "services" text[] NOT NULL DEFAULT '{}'`);
    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "industry" text`);
    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "location" text`);
    await queryRunner.query(`ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "gallery" text[] NOT NULL DEFAULT '{}'`);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Видаляємо індекси (safe)
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_orderIndex"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_category"`);

    // Видаляємо додані колонки (у зворотному порядку)
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "gallery"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "location"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "industry"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "services"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "features"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "longDescription"`);
  }
}

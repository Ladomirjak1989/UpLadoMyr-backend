// src/migrations/1727140000000-AddOauthColumnsToUsers.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOauthColumnsToUsers1727140000000 implements MigrationInterface {
    name = 'AddOauthColumnsToUsers1727140000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1) Дозволяємо NULL у username/email/password_hash
        await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "username" DROP NOT NULL
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "email" DROP NOT NULL
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "password_hash" DROP NOT NULL
    `);

        // 2) Додаємо OAuth-колонки
        await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "provider" varchar(32) NULL
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "provider_id" varchar(191) NULL
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "display_name" varchar(120) NULL
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "avatar_url" varchar(512) NULL
    `);

        // 3) Partial unique index на (provider, provider_id) якщо обидва не NULL
        await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_users_provider_providerId_notnull"
      ON "users" ("provider", "provider_id")
      WHERE "provider" IS NOT NULL AND "provider_id" IS NOT NULL
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // ⚠️ DOWN може впасти, якщо в таблиці є NULL у username/email/password_hash.
        // Переконайся, що дані очищені перед даунгрейдом.

        // 1) Прибираємо індекс
        await queryRunner.query(`
      DROP INDEX IF EXISTS "uq_users_provider_providerId_notnull"
    `);

        // 2) Дропаємо додані колонки
        await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "avatar_url"
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "display_name"
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "provider_id"
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "provider"
    `);

        // 3) Повертаємо NOT NULL (за наявності даних з NULL — виправ перед даунгрейдом)
        await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "password_hash" SET NOT NULL
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "email" SET NOT NULL
    `);

        await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "username" SET NOT NULL
    `);
    }
}

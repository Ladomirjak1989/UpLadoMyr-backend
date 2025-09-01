// src/migrations/1724760000000-RenamePasswordToPasswordHash.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePasswordToPasswordHash1724760000000 implements MigrationInterface {
  name = 'RenamePasswordToPasswordHash1724760000000';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
    DO $$
    BEGIN
      -- якщо є password і немає password_hash → просто перейменувати
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='password'
      ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='password_hash'
      ) THEN
        ALTER TABLE "users" RENAME COLUMN "password" TO "password_hash";
      END IF;

      -- якщо чомусь обидві є → скопіювати дані і прибрати стару
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='password'
      ) AND EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='password_hash'
      ) THEN
        UPDATE "users" SET "password_hash" = "password" WHERE "password_hash" IS NULL;
        ALTER TABLE "users" DROP COLUMN "password";
      END IF;
    END $$;
    `);

    // -- тепер уже безпечно
    await q.query(`ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL`);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='password_hash'
      ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='password'
      ) THEN
        ALTER TABLE "users" RENAME COLUMN "password_hash" TO "password";
      END IF;
    END $$;
    `);
  }
}

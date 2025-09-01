// src/migrations/1724760000001-TimestampsToTimestamptz.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class TimestampsToTimestamptz1724760000001 implements MigrationInterface {
    name = 'TimestampsToTimestamptz1724760000001';

    public async up(q: QueryRunner): Promise<void> {
        await q.query(`
    DO $$
    BEGIN
      -- created_at → timestamptz
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='created_at'
          AND data_type='timestamp without time zone'
      ) THEN
        ALTER TABLE "users"
          ALTER COLUMN "created_at" TYPE timestamptz
          USING "created_at" AT TIME ZONE 'UTC';
      END IF;

      -- updated_at → timestamptz
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='updated_at'
          AND data_type='timestamp without time zone'
      ) THEN
        ALTER TABLE "users"
          ALTER COLUMN "updated_at" TYPE timestamptz
          USING "updated_at" AT TIME ZONE 'UTC';
      END IF;

      -- підчистити можливі null-и
      UPDATE "users" SET "created_at" = NOW() WHERE "created_at" IS NULL;
      UPDATE "users" SET "updated_at" = NOW() WHERE "updated_at" IS NULL;

      -- дефолти на майбутнє
      ALTER TABLE "users"
        ALTER COLUMN "created_at" SET DEFAULT NOW(),
        ALTER COLUMN "updated_at" SET DEFAULT NOW();
    END $$;
    `);
    }

    public async down(): Promise<void> {
        // -- зворотня міграція не потрібна
    }
}

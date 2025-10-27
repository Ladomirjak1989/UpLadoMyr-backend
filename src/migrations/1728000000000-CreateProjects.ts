import { MigrationInterface, QueryRunner } from 'typeorm';


export class CreateProjects1728000000000 implements MigrationInterface {
    name = 'CreateProjects1728000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1) Enum для категорій (створюємо, якщо ще не існує)
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'project_category_enum'
        ) THEN
          CREATE TYPE project_category_enum AS ENUM (
            'Hospitality',
            'Bio Tech',
            'Construction',
            'Consulting',
            'Financial Services',
            'IT',
            'Legal',
            'Medical',
            'Nonprofit',
            'Product',
            'Professional Services',
            'Real Estate',
            'Technology',
            'Tourism Agency'
          );
        END IF;
      END
      $$;
    `);

        // 2) Таблиця projects
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "projects" (
        "id" SERIAL PRIMARY KEY,
        "slug" VARCHAR NOT NULL UNIQUE,
        "title" VARCHAR NOT NULL,
        "description" TEXT NOT NULL,
        "imageUrl" VARCHAR,
        "websiteUrl" VARCHAR,
        "category" project_category_enum NOT NULL,
        "isFeatured" BOOLEAN NOT NULL DEFAULT false,
        "status" VARCHAR NOT NULL DEFAULT 'published',
        "techStack" TEXT[] NOT NULL DEFAULT '{}',
        "orderIndex" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

        // 3) Індекси (на випадок, якщо не створювались)
        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'IDX_projects_category'
        ) THEN
          CREATE INDEX "IDX_projects_category" ON "projects" ("category");
        END IF;
      END$$;
    `);

        await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'IDX_projects_orderIndex'
        ) THEN
          CREATE INDEX "IDX_projects_orderIndex" ON "projects" ("orderIndex");
        END IF;
      END$$;
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1) Прибрати індекси (якщо існують)
        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'IDX_projects_orderIndex'
        ) THEN
          DROP INDEX "IDX_projects_orderIndex";
        END IF;
      END$$;
    `);

        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_indexes WHERE indexname = 'IDX_projects_category'
        ) THEN
          DROP INDEX "IDX_projects_category";
        END IF;
      END$$;
    `);

        // 2) Прибрати таблицю
        await queryRunner.query(`DROP TABLE IF EXISTS "projects";`);

        // 3) Прибрати enum (тільки якщо ніхто більше не використовує)
        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_category_enum') THEN
          DROP TYPE project_category_enum;
        END IF;
      END
      $$;
    `);
    }
}

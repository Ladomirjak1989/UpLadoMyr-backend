import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogCategoryCheck1731010000000 implements MigrationInterface {
    name = 'AddBlogCategoryCheck1731010000000';

    public async up(q: QueryRunner): Promise<void> {
        // На випадок повторного застосування/зміни — прибираємо попередній констрейнт, якщо існує
        await q.query(`
      ALTER TABLE "blog_posts"
      DROP CONSTRAINT IF EXISTS "CHK_blog_category";
    `);

        // Додаємо CHECK (список категорій синхронізуй із константою в коді)
        await q.query(`
      ALTER TABLE "blog_posts"
      ADD CONSTRAINT "CHK_blog_category"
      CHECK (
        category IN (
          'All Category',
          'Growth Tactics',
          'How to',
          'Insights',
          'Management',
          'Starting Your Business'
        )
      ) NOT VALID;
    `);

        // Валідація на наявних рядках (щоб ловити помилки сьогоднішніх даних)
        await q.query(`
      ALTER TABLE "blog_posts"
      VALIDATE CONSTRAINT "CHK_blog_category";
    `);
    }

    public async down(q: QueryRunner): Promise<void> {
        await q.query(`
      ALTER TABLE "blog_posts"
      DROP CONSTRAINT IF EXISTS "CHK_blog_category";
    `);
    }
}

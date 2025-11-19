import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlogPosts1731000000000 implements MigrationInterface {
    name = 'CreateBlogPosts1731000000000'
    public async up(q: QueryRunner): Promise<void> {
        await q.query(`
      CREATE TYPE "public"."blog_posts_status_enum" AS ENUM('draft','published');
      CREATE TABLE "blog_posts" (
        "id" SERIAL NOT NULL,
        "slug" character varying NOT NULL,
        "title" character varying NOT NULL,
        "excerpt" text,
        "content" text,
        "longDescription" text,
        "coverImage" character varying(120),
        "category" character varying(80) NOT NULL,
        "tags" text[] DEFAULT '{}',
        "authorName" character varying(120),
        "authorAvatar" character varying(180),
        "sourceUrl" character varying(300),
        "canonicalUrl" character varying(300),
        "status" "public"."blog_posts_status_enum" NOT NULL DEFAULT 'draft',
        "isFeatured" boolean NOT NULL DEFAULT false,
        "readingTime" integer NOT NULL DEFAULT 0,
        "views" integer NOT NULL DEFAULT 0,
        "seoTitle" character varying(120),
        "seoDescription" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "publishedAt" TIMESTAMP,
        CONSTRAINT "UQ_blog_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_blog_posts_id" PRIMARY KEY ("id")
      );
      CREATE INDEX "IDX_blog_category" ON "blog_posts" ("category");
      CREATE INDEX "IDX_blog_publishedAt" ON "blog_posts" ("publishedAt");
    `);
    }
    public async down(q: QueryRunner): Promise<void> {
        await q.query(`DROP TABLE "blog_posts"; DROP TYPE "public"."blog_posts_status_enum";`);
    }
}

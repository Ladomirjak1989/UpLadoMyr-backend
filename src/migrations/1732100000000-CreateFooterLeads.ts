import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFooterLeads1732100000000 implements MigrationInterface {
    name = 'CreateFooterLeads1732100000000';

    public async up(q: QueryRunner): Promise<void> {
        await q.query(`
      CREATE TABLE IF NOT EXISTS "footer_leads" (
        "id" SERIAL NOT NULL,
        "ref" character varying(120) NOT NULL,
        "email" character varying(150) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_footer_leads_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_footer_leads_ref" UNIQUE ("ref")
      );
    `);

        await q.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_footer_leads_ref"
      ON "footer_leads" ("ref");
    `);

        await q.query(`
      CREATE INDEX IF NOT EXISTS "IDX_footer_leads_created_at"
      ON "footer_leads" ("created_at");
    `);
    }

    public async down(q: QueryRunner): Promise<void> {
        await q.query(`DROP INDEX IF EXISTS "IDX_footer_leads_created_at";`);
        await q.query(`DROP INDEX IF EXISTS "IDX_footer_leads_ref";`);
        await q.query(`DROP TABLE IF EXISTS "footer_leads";`);
    }
}
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContacts1732000000000 implements MigrationInterface {
    name = 'CreateContacts1732000000000';

    public async up(q: QueryRunner): Promise<void> {
        await q.query(`
      CREATE TABLE IF NOT EXISTS "contacts" (
        "id" SERIAL NOT NULL,
        "ref" character varying(120) NOT NULL,
        "first_name" character varying(100) NOT NULL,
        "last_name" character varying(100) NOT NULL,
        "email" character varying(150) NOT NULL,
        "message" text NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_contacts_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_contacts_ref" UNIQUE ("ref")
      );
    `);

        await q.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_contacts_ref"
      ON "contacts" ("ref");
    `);

        await q.query(`
      CREATE INDEX IF NOT EXISTS "IDX_contacts_created_at"
      ON "contacts" ("created_at");
    `);
    }

    public async down(q: QueryRunner): Promise<void> {
        await q.query(`DROP INDEX IF EXISTS "IDX_contacts_created_at";`);
        await q.query(`DROP INDEX IF EXISTS "IDX_contacts_ref";`);
        await q.query(`DROP TABLE IF EXISTS "contacts";`);
    }
}
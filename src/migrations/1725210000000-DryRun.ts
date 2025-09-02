// src/migrations/1725210000000-DryRun.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class DryRun1725210000000 implements MigrationInterface {
    name = 'DryRun1725210000000';

    public async up(q: QueryRunner): Promise<void> {
        // Нічого не змінюємо в схемі — просто "пінг", щоб міграція вважалась виконаною
        await q.query(`SELECT 1;`);
    }

    public async down(): Promise<void> {
        // Нічого відкочувати
    }
}

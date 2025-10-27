// src/cli/seed-admin.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../user/user.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

    try {
        const cfg = app.get(ConfigService);
        const ds = app.get(DataSource);
        const repo = ds.getRepository(User);

        const email = cfg.get<string>('SEED_ADMIN_EMAIL');
        const password = cfg.get<string>('SEED_ADMIN_PASSWORD');
        const username = cfg.get<string>('SEED_ADMIN_USERNAME') ?? 'Bettina';

        if (!email || !password) throw new Error('SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD відсутні');

        const passwordHash = await bcrypt.hash(password, 10);

        // 1) upsert за email (ідемпотентно)
        await repo.upsert(
            { email, username, passwordHash, role: UserRole.ADMIN },
            { conflictPaths: ['email'] } // для pg достатньо ['email']
        );

        // 2) на випадок, якщо існував із role=user — дотискаємо роль
        await repo
            .createQueryBuilder()
            .update(User)
            .set({ role: UserRole.ADMIN })
            .where('email = :email', { email })
            .execute();

        console.log(`[seed-admin] ensured ${email} has role=admin`);
    } catch (e) {
        console.error('❌ Seed failed:', e);
        process.exitCode = 1;
    } finally {
        await app.close();
    }
}
bootstrap();

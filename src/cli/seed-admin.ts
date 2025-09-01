import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/user.service';
import { UserRole } from '../user/user.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: ['log', 'warn', 'error'],
    });

    try {
        const cfg = app.get(ConfigService);
        const users = app.get(UsersService);

        const email = cfg.get<string>('SEED_ADMIN_EMAIL');
        const password = cfg.get<string>('SEED_ADMIN_PASSWORD');
        const username = cfg.get<string>('SEED_ADMIN_USERNAME') ?? 'Bettina';

        if (!email || !password) throw new Error('SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD відсутні');

        const existing = await users.findByEmail(email);

        if (existing) {
            if (existing.role !== UserRole.ADMIN) {
                await users.updateRole(existing.id, UserRole.ADMIN); // 👈 без save()
                console.log(`✅ Promoted existing user to ADMIN: ${email}`);
            } else {
                console.log(`ℹ️ Admin already exists: ${email}`);
            }
        } else {
            await users.create({ username, email, password, role: UserRole.ADMIN });
            console.log(`✅ Admin created: ${email}`);
        }
    } catch (e) {
        console.error('❌ Seed failed:', e);
        process.exitCode = 1;
    } finally {
        await app.close();
    }
}
bootstrap();


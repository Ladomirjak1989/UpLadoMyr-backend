// // src/data-source.ts
// import 'dotenv/config';
// import { DataSource, DataSourceOptions } from 'typeorm';
// import { join } from 'path';

// const entities = [join(__dirname, '**/*.entity.{ts,js}')];
// const migrations = [join(__dirname, 'migrations/*.{ts,js}')];

// const url = process.env.DATABASE_URL ?? '';

// const prod: DataSourceOptions = {
//     type: 'postgres',
//     url,
//     ssl:
//         url &&
//             (url.includes('render.com') ||
//                 url.includes('neon.tech') ||
//                 url.includes('amazonaws.com'))
//             ? { rejectUnauthorized: false }
//             : false,
//     entities,
//     migrations,
// };

// const host = process.env.DB_HOST ?? 'localhost';

// const dev: DataSourceOptions = {
//     type: 'postgres',
//     host,
//     port: parseInt(process.env.DB_PORT ?? '5433', 10),
//     username: process.env.DB_USERNAME ?? 'postgres',
//     password: process.env.DB_PASSWORD ?? '',
//     database: process.env.DB_NAME ?? 'app',
//     ssl:
//         (process.env.DB_SSL ?? '').toString().toLowerCase() === 'true' ||
//             host.includes('render.com') ||
//             host.includes('neon.tech') ||
//             host.includes('amazonaws.com')
//             ? { rejectUnauthorized: false }
//             : false,
//     entities,
//     migrations,
// };

// export default new DataSource(url ? prod : dev);




// src/data-source.ts
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

// Універсальні патерни: у prod підхопить dist/*.js, локально — src/*.ts
const entities = [join(__dirname, '**/*.entity.{js,ts}')];
const migrations = [join(__dirname, 'migrations/*.{js,ts}')];

// Корисно бачити у логах, що саме підхоплюється
console.log('[TypeORM] Entities glob:', entities);
console.log('[TypeORM] Migrations glob:', migrations);

const url = process.env.DATABASE_URL ?? '';

// Спільні опції для обох середовищ
const common: Pick<DataSourceOptions, 'entities' | 'migrations' | 'migrationsRun' | 'logging'> = {
    entities,
    migrations,
    // Автовиконання міграцій на старті
    migrationsRun: true,
    // Увімкни логування запитів/операцій — зручно для Render логів
    logging: true,
};

// --- Production (DATABASE_URL) ---
const prod: DataSourceOptions = {
    type: 'postgres',
    url,
    // Авто SSL для керованих провайдерів (Render/Neon/AWS)
    ssl:
        url &&
            (url.includes('render.com') ||
                url.includes('neon.tech') ||
                url.includes('amazonaws.com'))
            ? { rejectUnauthorized: false }
            : false,
    ...common,
};

// --- Development (локальна БД або вручну задані хости) ---
const host = process.env.DB_HOST ?? 'localhost';

const dev: DataSourceOptions = {
    type: 'postgres',
    host,
    port: parseInt(process.env.DB_PORT ?? '5433', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'app',
    ssl:
        ((process.env.DB_SSL ?? '').toString().toLowerCase() === 'true' ||
            host.includes('render.com') ||
            host.includes('neon.tech') ||
            host.includes('amazonaws.com'))
            ? { rejectUnauthorized: false }
            : false,
    ...common,
};

// Якщо є DATABASE_URL — вважаємо, що це prod
const dataSource = new DataSource(url ? prod : dev);

// Для скриптів типу `typeorm-ts-node-esm -d src/data-source.ts ...`
export default dataSource;


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

// ===== ЯВНІ МІГРАЦІЇ (класи) =====
import { RenamePasswordToPasswordHash1724760000000 } from './migrations/1724760000000-RenamePasswordToPasswordHash';
import { TimestampsToTimestamptz1724760000001 } from './migrations/1724760000001-TimestampsToTimestamptz';
import { DryRun1725210000000 } from './migrations/1725210000000-DryRun';

// Патерн для ентіті працює і в TS, і в зібраному dist (JS)
const entities = [join(__dirname, '**/*.entity.{js,ts}')];

// Передаємо класи міграцій напряму
const MIGRATIONS = [
    RenamePasswordToPasswordHash1724760000000,
    TimestampsToTimestamptz1724760000001,
    DryRun1725210000000,
];

// Спільні опції
const common: Pick<
    DataSourceOptions,
    'entities' | 'migrations' | 'migrationsRun' | 'logging' | 'synchronize'
> = {
    entities,
    migrations: MIGRATIONS,
    migrationsRun: true,   // авто-запуск міграцій на старті
    logging: true,         // видно SQL у логах (зручно на Render)
    synchronize: false,    // НІКОЛИ не вмикати на проді
};

// ===== PROD через DATABASE_URL =====
const url = process.env.DATABASE_URL ?? '';

const prod: DataSourceOptions = {
    type: 'postgres',
    url,
    ssl:
        url &&
            (url.includes('render.com') ||
                url.includes('neon.tech') ||
                url.includes('amazonaws.com'))
            ? { rejectUnauthorized: false }
            : false,
    ...common,
};

// ===== DEV (локально по хост/порту) =====
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

// Єдиний DataSource для імпорту з будь-яких скриптів
const ds = new DataSource(url ? prod : dev);

export default ds;
// alias-и (іноді зручні для скриптів)
export const appDataSource = ds;
export const dataSource = ds;

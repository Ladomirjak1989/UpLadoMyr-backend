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

// ====== ЯВНІ МІГРАЦІЇ (без glob) ======
import { RenamePasswordToPasswordHash1724760000000 } from './migrations/1724760000000-RenamePasswordToPasswordHash';
import { TimestampsToTimestamptz1724760000001 } from './migrations/1724760000001-TimestampsToTimestamptz';
import { DryRun1725210000000 } from './migrations/1725210000000-DryRun';

const entities = [join(__dirname, '**/*.entity.{js,ts}')];
// важливо: передаємо класи, а не шлях
const migrations = [
    RenamePasswordToPasswordHash1724760000000,
    TimestampsToTimestamptz1724760000001,
    DryRun1725210000000,
];

const url = process.env.DATABASE_URL ?? '';

const common: Pick<
    DataSourceOptions,
    'entities' | 'migrations' | 'migrationsRun' | 'logging'
> = {
    entities,
    migrations,
    migrationsRun: true,   // авто-виконання міграцій на старті
    logging: true,         // видно у логах Render
};

// ===== PROD (DATABASE_URL) =====
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

// ===== DEV (локальний) =====
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

export default new DataSource(url ? prod : dev);


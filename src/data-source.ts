// src/data-source.ts
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

// ===== ЯВНІ МІГРАЦІЇ (класи) =====
import { RenamePasswordToPasswordHash1724760000000 } from './migrations/1724760000000-RenamePasswordToPasswordHash';
import { TimestampsToTimestamptz1724760000001 } from './migrations/1724760000001-TimestampsToTimestamptz';
import { DryRun1725210000000 } from './migrations/1725210000000-DryRun';
import {AddOauthColumnsToUsers1727140000000} from './migrations/1727140000000-AddOauthColumnsToUsers'
import { CreateProjects1728000000000 } from './migrations/1728000000000-CreateProjects';
import { SeedProjectsV21728015000000 } from './migrations/1728015000000-SeedProjectsV2';
import { AddNewProjectFields1730120000000 } from './migrations/1730120000000-AddNewProjectFields';
import { CreateBlogPosts1731000000000 } from './migrations/1731000000000-CreateBlogPosts';
import { AddBlogCategoryCheck1731010000000 } from './migrations/1731010000000-AddBlogCategoryCheck';




// Патерн для ентіті працює і в TS, і в зібраному dist (JS)
const entities = [join(__dirname, '**/*.entity.{js,ts}')];

// Передаємо класи міграцій напряму
const MIGRATIONS = [
    RenamePasswordToPasswordHash1724760000000,
    TimestampsToTimestamptz1724760000001,
    DryRun1725210000000,
    AddOauthColumnsToUsers1727140000000,
    CreateProjects1728000000000,
    SeedProjectsV21728015000000,
    AddNewProjectFields1730120000000,
    CreateBlogPosts1731000000000,
    AddBlogCategoryCheck1731010000000,  
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
console.log('DS loaded. NODE_ENV=', process.env.NODE_ENV);
console.log('Migrations from DS:', ds.options?.migrations);

export default ds;
// alias-и (іноді зручні для скриптів)
export const appDataSource = ds;
export const dataSource = ds;

// src/data-source.ts
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

const entities = [join(__dirname, '**/*.entity.{ts,js}')];
const migrations = [join(__dirname, 'migrations/*.{ts,js}')];

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
    entities,
    migrations,
};

const host = process.env.DB_HOST ?? 'localhost';

const dev: DataSourceOptions = {
    type: 'postgres',
    host,
    port: parseInt(process.env.DB_PORT ?? '5433', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'app',
    ssl:
        (process.env.DB_SSL ?? '').toString().toLowerCase() === 'true' ||
            host.includes('render.com') ||
            host.includes('neon.tech') ||
            host.includes('amazonaws.com')
            ? { rejectUnauthorized: false }
            : false,
    entities,
    migrations,
};

export default new DataSource(url ? prod : dev);

// scripts/revert-migration.js
/* Відкочує останню застосовану міграцію (undoLastMigration).
 * Також очікує, що код вже зібраний у dist.
 */

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function loadDataSource() {
    const candidates = [
        path.resolve(process.cwd(), 'dist', 'data-source.js'),
        path.resolve(process.cwd(), 'dist', 'src', 'data-source.js'),
    ];

    for (const p of candidates) {
        if (!fs.existsSync(p)) continue;

        const mod = await import(pathToFileURL(p).href);

        const ds =
            (mod && mod.default && typeof mod.default.initialize === 'function' && mod.default) ||
            (mod && mod.appDataSource && typeof mod.appDataSource.initialize === 'function' && mod.appDataSource) ||
            (mod && mod.dataSource && typeof mod.dataSource.initialize === 'function' && mod.dataSource) ||
            null;

        if (ds) return ds;
    }

    throw new Error(
        '❌ Не можу завантажити DataSource. Переконайся, що є default-експорт інстанса і що виконано `npm run build`.'
    );
}

(async () => {
    console.log('ℹ️  Migrations: revert last');
    const ds = await loadDataSource();

    await ds.initialize();
    const res = await ds.undoLastMigration(); // повертає інфо про відкочену
    await ds.destroy();

    if (!res) {
        console.log('ℹ️  Немає що відкочувати (таблиця migrations порожня).');
    } else {
        console.log('✅ Відкотили:', res.name ?? res.constructor?.name ?? '(unknown)');
    }

    process.exit(0);
})().catch((err) => {
    console.error('❌ Помилка під час відкату міграції:', err);
    process.exit(1);
});

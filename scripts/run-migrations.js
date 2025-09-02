// scripts/run-migrations.js
/* Запускає всі нові міграції з already-built JS (dist).
 * Працює на Render/проді та локально після `npm run build`.
 */

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function loadDataSource() {
    // кандидати, звідки імпортуємо DataSource зібраного коду
    const candidates = [
        path.resolve(process.cwd(), 'dist', 'data-source.js'),
        // інколи build може покласти файл в інше місце — лишаємо як запасний варіант:
        path.resolve(process.cwd(), 'dist', 'src', 'data-source.js'),
    ];

    for (const p of candidates) {
        if (!fs.existsSync(p)) continue;

        const mod = await import(pathToFileURL(p).href);

        // шукаємо інстанс DataSource кількома іменами (щоб перекрити ESM/CJS нюанси)
        const ds =
            (mod && mod.default && typeof mod.default.initialize === 'function' && mod.default) ||
            (mod && mod.appDataSource && typeof mod.appDataSource.initialize === 'function' && mod.appDataSource) ||
            (mod && mod.dataSource && typeof mod.dataSource.initialize === 'function' && mod.dataSource) ||
            null;

        if (ds) return ds;
    }

    throw new Error(
        '❌ Не можу завантажити DataSource. Переконайся, що `src/data-source.ts` експортує інстанс за замовчуванням (export default new DataSource(...)) і що ти виконав `npm run build`.'
    );
}

(async () => {
    console.log('ℹ️  Migrations: start');
    const ds = await loadDataSource();

    await ds.initialize();
    const res = await ds.runMigrations(); // масив виконаних міграцій
    await ds.destroy();

    if (res.length === 0) {
        console.log('✅ Немає нових міграцій (up-to-date).');
    } else {
        console.log(`✅ Виконано міграцій: ${res.length}`);
        for (const m of res) console.log(`   - ${m.name ?? m.constructor?.name ?? '(unknown)'}`);
    }

    process.exit(0);
})().catch((err) => {
    console.error('❌ Помилка під час запуску міграцій:', err);
    process.exit(1);
});

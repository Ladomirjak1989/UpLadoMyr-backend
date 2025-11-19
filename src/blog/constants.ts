// blog.constants.ts

/** UI-варіанти (включно з "All Category" тільки для селекту/фільтра) */
const BLOG_CATEGORY_UI_VALUES = [
    'All Category',
    'Growth Tactics',
    'How to',
    'Insights',
    'Management',
    'Starting Your Business',
] as const;

/** Те, що реально зберігаємо в БД (без "All Category") */
const BLOG_CATEGORY_STORAGE_VALUES = BLOG_CATEGORY_UI_VALUES.filter(
    (v) => v !== 'All Category'
) as unknown as readonly string[];

/** Готовий список для SQL CHECK ( 'A','B','C' ) */
const BLOG_CATEGORY_SQL_LIST = BLOG_CATEGORY_STORAGE_VALUES
    .map((c) => `'${c.replace(/'/g, "''")}'`)
    .join(',');

/** Статуси публікацій */
const BLOG_STATUS_VALUES = ['draft', 'published'] as const;

// ──────────────────────────────────────────────────────────────
// ЄДИНА ПАРАСОЛЬКОВА КОНСТАНТА
// ──────────────────────────────────────────────────────────────
export const BLOG = {
    CATEGORY: {
        UI_VALUES: BLOG_CATEGORY_UI_VALUES,            // для селектів у UI
        STORAGE_VALUES: BLOG_CATEGORY_STORAGE_VALUES,  // для DTO/валидації/БД
        SQL_LIST: BLOG_CATEGORY_SQL_LIST,              // для @Check у entity
    },
    STATUS: {
        VALUES: BLOG_STATUS_VALUES,                    // для селектів/валідації
    },
    DEFAULTS: {
        STATUS: 'draft' as (typeof BLOG_STATUS_VALUES)[number],
    },
} as const;

// Типи
export type BlogCategory = (typeof BLOG.CATEGORY.STORAGE_VALUES)[number];
export type BlogStatus = (typeof BLOG.STATUS.VALUES)[number];

// type guards (зручно у runtime-перевірках)
export const isBlogCategory = (v: unknown): v is BlogCategory =>
    typeof v === 'string' && BLOG.CATEGORY.STORAGE_VALUES.includes(v);

export const isBlogStatus = (v: unknown): v is BlogStatus =>
    typeof v === 'string' && (BLOG.STATUS.VALUES as readonly string[]).includes(v as string);

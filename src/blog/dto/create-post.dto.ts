import {
    IsArray, IsBoolean, IsIn, IsInt, IsISO8601, IsOptional,
    IsString, IsUrl, Matches, MaxLength, Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BLOG } from '@/blog/constants';

/** Дозволяємо http(s) URL або root-relative шлях (/img/...) */
const URL_OR_PATH_RE = /^(https?:\/\/[^\s]+|\/[^\s]+)$/i;

/** "" -> undefined; trim */
const toClean = ({ value }: { value: any }) =>
    typeof value === 'string' ? (value.trim() === '' ? undefined : value.trim()) : value;

/** "" -> undefined; "null"/null -> null; trim рядків */
const toCleanOrNull = ({ value }: { value: any }) => {
    if (value === null || String(value).toLowerCase().trim() === 'null') return null;
    return toClean({ value });
};

/** "true"/"false"/1/0/yes/no -> boolean; інакше undefined */
const toBool = ({ value }: { value: any }) => {
    if (value === '' || value == null) return undefined;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    const s = String(value).toLowerCase().trim();
    if (['true', '1', 'yes'].includes(s)) return true;
    if (['false', '0', 'no'].includes(s)) return false;
    return undefined;
};

/** до цілих >= 0 або undefined */
const toInt = ({ value }: { value: any }) => {
    if (value === '' || value == null) return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : undefined;
};

/** Масив тегів або "a,b,c" -> ['a','b','c']; порожнє -> undefined (щоб спрацював default у БД) */
const toTags = ({ value }: { value: any }) => {
    if (value == null || value === '') return undefined;
    if (Array.isArray(value)) return value.map(String).map(s => s.trim()).filter(Boolean);
    return String(value).split(',').map(s => s.trim()).filter(Boolean);
};

export class CreatePostDto {
    // ── основні ─────────────────────────────────────────────
    @IsString()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug may contain only lowercase letters, numbers and dashes',
    })
    slug!: string;

    @IsString()
    title!: string;

    // ── тексти ──────────────────────────────────────────────
    @IsOptional() @Transform(toClean) @IsString()
    excerpt?: string | null;

    @IsOptional() @Transform(toClean) @IsString()
    content?: string | null; // markdown/HTML

    @IsOptional() @Transform(toClean) @IsString()
    longDescription?: string | null; // markdown/HTML

    // ── медіа ───────────────────────────────────────────────
    @IsOptional()
    @Transform(toCleanOrNull)
    @IsString()
    @MaxLength(120)
    @Matches(URL_OR_PATH_RE, {
        message: 'coverImage must be a valid http(s) URL or root-relative path (e.g. /img/...)',
    })
    coverImage?: string | null;

    // ── класифікація ────────────────────────────────────────
    @IsString()
    @IsIn(BLOG.CATEGORY.STORAGE_VALUES as readonly string[], { message: 'Invalid category' })
    category!: (typeof BLOG.CATEGORY.STORAGE_VALUES)[number];

    @IsOptional()
    @Transform(toTags)
    @IsArray()
    @IsString({ each: true })
    tags?: string[]; // порожнє -> undefined (БД поставить default '{}')

    // ── автор ───────────────────────────────────────────────
    @IsOptional() @Transform(toClean) @IsString()
    authorName?: string | null;

    @IsOptional()
    @Transform(toCleanOrNull)
    @IsString()
    @MaxLength(180)
    @Matches(URL_OR_PATH_RE, {
        message: 'authorAvatar must be a valid http(s) URL or root-relative path',
    })
    authorAvatar?: string | null;

    // ── посилання ───────────────────────────────────────────
    @IsOptional() @Transform(toCleanOrNull) @IsUrl()
    sourceUrl?: string | null;

    @IsOptional() @Transform(toCleanOrNull) @IsUrl()
    canonicalUrl?: string | null;

    // ── статус/фічери ──────────────────────────────────────
    @IsOptional()
    @IsIn(BLOG.STATUS.VALUES as readonly string[])
    status?: (typeof BLOG.STATUS.VALUES)[number];

    @IsOptional() @Transform(toBool) @IsBoolean()
    isFeatured?: boolean;

    // ── метрики ────────────────────────────────────────────
    @IsOptional() @Transform(toInt) @IsInt() @Min(0)
    readingTime?: number;

    @IsOptional() @Transform(toInt) @IsInt() @Min(0)
    views?: number;

    // ── SEO ────────────────────────────────────────────────
    @IsOptional() @Transform(toClean) @IsString() @MaxLength(300)
    seoTitle?: string | null;

    @IsOptional() @Transform(toClean) @IsString()
    seoDescription?: string | null;

    // ── дати ───────────────────────────────────────────────
    @IsOptional() @Transform(toCleanOrNull) @IsISO8601()
    publishedAt?: string | null; // ISO-рядок або null (очистити)
}

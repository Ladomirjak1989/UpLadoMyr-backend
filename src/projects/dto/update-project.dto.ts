// src/projects/dto/update-project.dto.ts
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ProjectCategory } from '../project.entity';

/**
 * Хелпери:
 * - toUndef: '' -> undefined, інакше trimmed string або як є
 * - toUndefArray: якщо нічого не прийшло — undefined (НЕ чіпати поле).
 *   Якщо прийшло (рядок/масив) — перетворити на масив рядків; якщо після чистки пусто — undefined.
 */
const toUndef = ({ value }: { value: any }) =>
    typeof value === 'string' ? (value.trim() === '' ? undefined : value.trim()) : value;

const toUndefArray = ({ value }: { value: any }) => {
    if (value === undefined || value === null) return undefined;
    const arr = Array.isArray(value)
        ? value
        : typeof value === 'string'
            ? value.split(/[\n,;]+/g)
            : [];
    const cleaned = arr.map(String).map(s => s.trim()).filter(Boolean);
    return cleaned.length ? cleaned : undefined;
};

/**
 * ВАЖЛИВО:
 * Не наслідуємось від CreateProjectDto через PartialType,
 * щоб не підхопити дефолти, які перетворюють undefined -> [] та стирають дані.
 */
export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    @Length(2, 100)
    slug?: string;

    @IsOptional()
    @IsString()
    @Length(2, 200)
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    // текстові поля, які мають ігноруватись, якщо прийшов порожній рядок
    @IsOptional()
    @IsString()
    @Transform(toUndef)
    longDescription?: string;

    @IsOptional()
    @IsString()
    @Transform(toUndef)
    industry?: string;

    @IsOptional()
    @IsString()
    @Transform(toUndef)
    location?: string;

    @IsOptional()
    @IsUrl()
    @Transform(toUndef)
    imageUrl?: string;

    @IsOptional()
    @IsUrl()
    @Transform(toUndef)
    websiteUrl?: string;

    @IsOptional()
    @IsEnum(ProjectCategory)
    category?: ProjectCategory;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsOptional()
    @IsString()
    @IsIn(['draft', 'published'])
    status?: 'draft' | 'published';

    @IsOptional()
    @IsInt()
    orderIndex?: number;

    // масиви: перетворюємо лише якщо поле присутнє; інакше — undefined (не чіпати)
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(toUndefArray)
    features?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(toUndefArray)
    services?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(toUndefArray)
    gallery?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(toUndefArray)
    techStack?: string[];
}

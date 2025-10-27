// src/projects/dto/create-project.dto.ts
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

// хелпер: '' -> undefined
const toUndef = (v: any) =>
  typeof v === 'string' ? (v.trim() === '' ? undefined : v.trim()) : v;

// хелпер: масив із рядків, фільтрує порожні
// розбиває за комами, крапками з комою, переноси рядків/табами
const toStringArray = (v: any) => {
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof v === 'string') {
    return v
      .split(/[\n,;]+/g)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
};


export class CreateProjectDto {
  @IsString()
  @Length(2, 100)
  slug!: string;

  @IsString()
  @Length(2, 200)
  title!: string;

  @IsString()
  description!: string;

  // 🆕 Довгий опис
  @IsOptional()
  @IsString()
  @Transform(({ value }) => toUndef(value))
  longDescription?: string;

  // 🆕 Масиви
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => toStringArray(value))
  features: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => toStringArray(value))
  services: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => toStringArray(value))
  gallery: string[] = [];

  // 🆕 Індустрія/локація
  @IsOptional()
  @IsString()
  @Transform(({ value }) => toUndef(value))
  industry?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => toUndef(value))
  location?: string;

  @IsOptional()
  @IsUrl()
  @Transform(({ value }) => toUndef(value))
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  @Transform(({ value }) => toUndef(value))
  websiteUrl?: string;

  @IsEnum(ProjectCategory)
  category!: ProjectCategory;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['draft', 'published'])
  status?: 'draft' | 'published';

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => toStringArray(value))
  techStack: string[] = [];

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

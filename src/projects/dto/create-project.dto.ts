import { IsArray, ArrayMaxSize, IsBoolean, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { ProjectCategory } from '../project.entity';

export class CreateProjectDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsEnum(ProjectCategory) category!: ProjectCategory;

  @IsOptional() @IsUrl() imageUrl?: string;
  @IsOptional() @IsUrl() websiteUrl?: string;

  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() status?: 'draft' | 'published';
  @IsOptional() orderIndex?: number;

  @IsOptional() @IsArray() @ArrayMaxSize(30)
  techStack?: string[];
}

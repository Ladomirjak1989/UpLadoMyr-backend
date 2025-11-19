// // import { PartialType } from '@nestjs/mapped-types';
// // import { CreatePostDto } from './create-post.dto';

// // export class UpdatePostDto extends PartialType(CreatePostDto) { }


// // update-post.dto.ts
// import { PartialType } from '@nestjs/mapped-types';
// import { CreatePostDto } from './create-post.dto';
// import { IsISO8601, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
// import { Transform } from 'class-transformer';

// const URL_OR_PATH_RE = /^(https?:\/\/[^\s]+|\/[^\s]+)$/i;

// // "" -> undefined  (щоб "пропустити" поле)
// // "null" або спеціально надісланий null -> null  (щоб очистити в БД)
// const toCleanOrNull = ({ value }: { value: any }) => {
//     if (value === '') return undefined;     // не оновлюємо
//     if (value === null || value === 'null') return null; // обнуляємо
//     if (typeof value === 'string') return value.trim();
//     return value;
// };

// export class UpdatePostDto extends PartialType(CreatePostDto) {
//     @IsOptional()
//     @Transform(toCleanOrNull)
//     @IsString()
//     @MaxLength(120)
//     @Matches(URL_OR_PATH_RE, {
//         message: 'coverImage must be a valid http(s) URL or root-relative path (e.g. /img/...)',
//     })
//     coverImage?: string | null;

//     @IsOptional()
//     @Transform(toCleanOrNull)
//     @IsString()
//     @MaxLength(180)
//     @Matches(URL_OR_PATH_RE, {
//         message: 'authorAvatar must be a valid http(s) URL or root-relative path',
//     })
//     authorAvatar?: string | null;

//     @IsOptional()
//     @Transform(({ value }) => {
//         if (value === '') return undefined;    // пропустити
//         if (value === null || value === 'null') return null; // очистити
//         return value;
//     })
//     @IsISO8601()
//     publishedAt?: string | null;
// }


import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BlogPost } from './blog.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogStatus } from './constants';

type FindAllParams = {
    page?: number;
    limit?: number;
    q?: string;
    category?: string;
    tag?: string;
    status?: BlogStatus | 'all';
    featured?: boolean; // ← в контролері перетворюй 'true'/'false' у boolean
};

@Injectable()
export class BlogService {
    constructor(@InjectRepository(BlogPost) private repo: Repository<BlogPost>) { }

    async create(dto: CreatePostDto) {
        const entity = this.repo.create({
            ...dto,
            publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
        });
        return this.repo.save(entity);
    }


    async findOneOrFail(id: number) {
        const post = await this.repo.findOne({ where: { id } });
        if (!post) throw new NotFoundException('Post not found');
        return post;
    }


    async findOneById(id: number) {
        return this.findOneOrFail(id);
    }

    async update(id: number, dto: UpdatePostDto) {
        const incoming = Object.fromEntries(
            Object.entries(dto).filter(([, v]) => v !== undefined)
        ) as UpdatePostDto;

        if ('publishedAt' in incoming) {
            (incoming as any).publishedAt = incoming.publishedAt
                ? new Date(incoming.publishedAt as string)
                : null;
        }

        const existing = await this.findOneOrFail(id);

        const entity = this.repo.merge(existing, incoming);
        return this.repo.save(entity);
    }


    async findOneBySlug(slug: string) {
        // публічний перегляд — тільки опубліковані
        const post = await this.repo.findOne({ where: { slug, status: 'published' } });
        if (!post) throw new NotFoundException('Post not found');
        // інкремент переглядів
        await this.repo.update(post.id, { views: (post.views || 0) + 1 });
        return post;
    }

    // async findAll(params: FindAllParams) {
    //     const page = Math.max(1, Number(params.page) || 1);
    //     const take = Math.min(50, Math.max(1, Number(params.limit) || 12));
    //     const skip = (page - 1) * take;

    //     const qb = this.repo.createQueryBuilder('post');

    //     // ----- статус -----
    //     if (params.status === 'all') {
    //         // нічого не ставимо – показати всі
    //     } else if (params.status) {
    //         qb.andWhere('post.status = :status', { status: params.status });
    //     } else {
    //         qb.andWhere('post.status = :status', { status: 'published' });
    //     }

    //     // ----- категорія -----
    //     if (params.category) {
    //         qb.andWhere('post.category = :category', { category: params.category });
    //     }

    //     // ----- featured -----
    //     if (params.featured === true) {
    //         qb.andWhere('post.isFeatured = true');
    //     } else if (params.featured === false) {
    //         qb.andWhere('post.isFeatured = false');
    //     }

    //     // ----- filter по конкретному тегу (?tag=seo) -----
    //     if (params.tag) {
    //         // перевірка, що значення міститься в масиві text[]
    //         qb.andWhere(':tag = ANY(post.tags)', { tag: params.tag });
    //     }

    //     // ----- Пошук q: title + excerpt + content + tags -----
    //     if (params.q) {
    //         const qLike = `%${params.q}%`;

    //         qb.andWhere(
    //             `
    //     (
    //       post.title ILIKE :qLike
    //       OR post.excerpt ILIKE :qLike
    //       OR post.content ILIKE :qLike
    //       OR EXISTS (
    //         SELECT 1
    //         FROM unnest(post.tags) AS t(tag)
    //         WHERE t.tag ILIKE :qLike
    //       )
    //     )
    //   `,
    //             { qLike }
    //         );
    //     }

    //     // ----- сорт і пагінація -----
    //     qb
    //         .orderBy('post.publishedAt', 'DESC')
    //         .addOrderBy('post.createdAt', 'DESC')
    //         .skip(skip)
    //         .take(take);

    //     const [items, total] = await qb.getManyAndCount();

    //     return { items, total, page, pages: Math.ceil(total / take) };
    // }

    async findAll(params: FindAllParams) {
        const page = Math.max(1, Number(params.page) || 1);
        const take = Math.min(50, Math.max(1, Number(params.limit) || 12));
        const skip = (page - 1) * take;

        const qb = this.repo.createQueryBuilder('post');

        // ----- статус -----
        if (params.status === 'all') {
            // нічого не додаємо – показати всі
        } else if (params.status) {
            qb.andWhere('post.status = :status', { status: params.status });
        } else {
            qb.andWhere('post.status = :status', { status: 'published' });
        }

        // ----- категорія -----
        if (params.category) {
            qb.andWhere('post.category = :category', { category: params.category });
        }

        // ----- featured -----
        if (params.featured === true) {
            qb.andWhere('post.isFeatured = true');
        } else if (params.featured === false) {
            qb.andWhere('post.isFeatured = false');
        }

        // ----- filter по конкретному тегу (?tag=seo) -----
        if (params.tag) {
            // перевірка, що значення є в масиві text[]
            qb.andWhere(':tag = ANY(post.tags)', { tag: params.tag });
        }

        // ----- Пошук q: title + excerpt + content + tags -----
        if (params.q) {
            const qLike = `%${params.q}%`;

            qb.andWhere(
                `
      (
        post.title ILIKE :qLike
        OR post.excerpt ILIKE :qLike
        OR post.content ILIKE :qLike
        OR array_to_string(post.tags, ' ') ILIKE :qLike
      )
      `,
                { qLike }
            );
        }

        qb
            .orderBy('post.publishedAt', 'DESC')
            .addOrderBy('post.createdAt', 'DESC')
            .skip(skip)
            .take(take);

        const [items, total] = await qb.getManyAndCount();

        return { items, total, page, pages: Math.ceil(total / take) };
    }


    async remove(id: number) {
        await this.repo.delete(id);
        return { success: true };
    }
}

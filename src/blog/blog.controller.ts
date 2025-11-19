import {
    Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query,
    UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BLOG } from './constants';

// ті ж самі guard’и/декоратор, що й у ProjectsController
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/auth/roles.decorator';

type StatusQuery = (typeof BLOG.STATUS.VALUES)[number] | 'all' | undefined;

@Controller('blog')
export class BlogController {
    constructor(private readonly svc: BlogService) { }

    // ── Публічні ─────────────────────────────────────────────
    @Get()
    list(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('q') q?: string,
        @Query('category') category?: string,
        @Query('tag') tag?: string,
        @Query('status') status?: StatusQuery,
        @Query('featured') featured?: string, // 'true' | '1' | 'false' | '0'
    ) {
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(100, Math.max(1, Number(limit) || 12));
        const statusSafe: StatusQuery =
            status && status !== 'all' && BLOG.STATUS.VALUES.includes(status as any)
                ? (status as StatusQuery)
                : status === 'all'
                    ? 'all'
                    : undefined;

        const featuredBool =
            featured?.toLowerCase() === 'true' || featured === '1'
                ? true
                : featured?.toLowerCase() === 'false' || featured === '0'
                    ? false
                    : undefined;

        return this.svc.findAll({
            page: pageNum,
            limit: limitNum,
            q,
            category,
            tag,
            status: statusSafe,
            featured: featuredBool,
        });
    }

    @Get('slug/:slug')
    one(@Param('slug') slug: string) {
        return this.svc.findOneBySlug(slug);
    }

    // ── Тільки для admin ─────────────────────────────────────

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get(':id')
    adminOne(@Param('id', ParseIntPipe) id: number) {
        return this.svc.findOneById(id);
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    create(@Body() dto: CreatePostDto) {
        return this.svc.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
        return this.svc.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.svc.remove(id);
    }



}

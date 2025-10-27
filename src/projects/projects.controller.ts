import {
  Controller, Get, Post, Patch, Delete, Param, Query, Body,
  ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';        // підстав свої шляхи
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/auth/roles.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  // Публічний список (фільтри за бажанням)
  @Get()
  async list(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('status') status?: 'draft'|'published',
    @Query('featured') featured?: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ) {
    return this.service.findAll({
      q,
      category: category as any,
      status,
      featured,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get('slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.service.findOneBySlug(slug);
  }

  @Get(':id')
  async byId(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneById(id);
  }

  // CRUD тільки для адміна
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

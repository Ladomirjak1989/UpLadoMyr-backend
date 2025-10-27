import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) { }

  // ───────────────────────────────────────────────────────────────────────────
  // Helpers: уніфікація вхідних даних
  // ───────────────────────────────────────────────────────────────────────────
  /** '' -> undefined; інакше trimmed string або як є */
  private toUndef(v: any) {
    return typeof v === 'string' ? (v.trim() === '' ? undefined : v.trim()) : v;
  }

  /** Приймає масив/рядок з комами, крапками з комою або переносами рядків → string[] */
  private toArray(v: any): string[] {
    if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
    if (typeof v === 'string') {
      return v
        .split(/[\n,;]+/g)
        .map(s => s.trim())
        .filter(Boolean);
    }
    return [];
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Queries
  // ───────────────────────────────────────────────────────────────────────────
  async findAll(params?: {
    q?: string;
    category?: Project['category'];
    status?: Project['status'];
    featured?: string | boolean;
    take?: number;
    skip?: number;
  }) {
    const { q, category, status, featured, take = 50, skip = 0 } = params ?? {};

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (typeof featured !== 'undefined') where.isFeatured = featured === true || featured === 'true';

    // простий пошук по title/description/slug
    const whereArr = q
      ? [
        { ...where, title: ILike(`%${q}%`) },
        { ...where, description: ILike(`%${q}%`) },
        { ...where, slug: ILike(`%${q}%`) },
      ]
      : where;

    const [items, total] = await this.repo.findAndCount({
      where: whereArr,
      order: { orderIndex: 'ASC', createdAt: 'DESC' },
      take,
      skip,
    });

    return { items, total };
  }

  async findOneById(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Project not found');
    return p;
  }

  async findOneBySlug(slug: string) {
    const p = await this.repo.findOne({ where: { slug } });
    if (!p) throw new NotFoundException('Project not found');
    return p;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Mutations
  // ───────────────────────────────────────────────────────────────────────────
  async create(dto: CreateProjectDto) {
    // Додаткова нормалізація на випадок, якщо глобальна transform/validation не спрацює
    const entity = this.repo.create({
      ...dto,
      longDescription: this.toUndef(dto.longDescription),
      industry: this.toUndef(dto.industry),
      location: this.toUndef(dto.location),
      imageUrl: this.toUndef(dto.imageUrl),
      websiteUrl: this.toUndef(dto.websiteUrl),
      features: this.toArray(dto.features),
      services: this.toArray(dto.services),
      gallery: this.toArray(dto.gallery),
      techStack: this.toArray(dto.techStack),

      orderIndex: dto.orderIndex ?? 0,
      isFeatured: !!dto.isFeatured,
      status: dto.status ?? 'published',
    });

    try {
      return await this.repo.save(entity);
    } catch (e: any) {
      // у Postgres дубль по unique(slug) -> 23505
      if (e?.code === '23505') {
        e.message = 'Slug must be unique';
      }
      throw e;
    }
  }

  async update(id: number, dto: UpdateProjectDto) {
    const p = await this.findOneById(id);

    // Нормалізуємо лише ті ключі, що прийшли в DTO
    if ('longDescription' in dto) p.longDescription = this.toUndef(dto.longDescription);
    if ('industry' in dto) p.industry = this.toUndef(dto.industry);
    if ('location' in dto) p.location = this.toUndef(dto.location);
    if ('imageUrl' in dto) p.imageUrl = this.toUndef(dto.imageUrl);
    if ('websiteUrl' in dto) p.websiteUrl = this.toUndef(dto.websiteUrl);

    if ('features' in dto) p.features = this.toArray((dto as any).features);
    if ('services' in dto) p.services = this.toArray((dto as any).services);
    if ('gallery' in dto) p.gallery = this.toArray((dto as any).gallery);
    if ('techStack' in dto) p.techStack = this.toArray((dto as any).techStack);

    // Інші прості поля (category/status/isFeatured/orderIndex/title/description/slug)
    Object.assign(p, dto);

    try {
      return await this.repo.save(p);
    } catch (e: any) {
      if (e?.code === '23505') e.message = 'Slug must be unique';
      throw e;
    }
  }

  async remove(id: number) {
    const p = await this.findOneById(id);
    await this.repo.remove(p);
    return { success: true };
  }
}

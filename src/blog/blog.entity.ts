import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { BLOG } from './constants';

@Entity('blog_posts')
@Index(['slug'], { unique: true })
@Index(['category', 'status', 'publishedAt'])
@Index(['publishedAt'])
@Check(`category IN (${BLOG.CATEGORY.SQL_LIST})`)
export class BlogPost {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  excerpt!: string | null;

  @Column({ type: 'text', nullable: true })
  content!: string | null; // markdown/HTML

  @Column({ type: 'text', nullable: true })
  longDescription!: string | null; // markdown/HTML

  @Column({ type: 'varchar', length: 120, nullable: true })
  coverImage!: string | null;

  // зводимо тип до переліку дозволених значень зі спільної константи
  @Column({ type: 'varchar', length: 80 })
  category!: (typeof BLOG.CATEGORY.STORAGE_VALUES)[number];

  @Column({ type: 'text', array: true, default: '{}' })
  tags!: string[];

  @Column({ type: 'varchar', length: 120, nullable: true })
  authorName!: string | null;

  @Column({ type: 'varchar', length: 180, nullable: true })
  authorAvatar!: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  sourceUrl!: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  canonicalUrl!: string | null;

  // статус теж беремо з BLOG.STATUS.VALUES; дефолт — BLOG.DEFAULTS.STATUS
  @Column({ type: 'enum', enum: BLOG.STATUS.VALUES, default: BLOG.DEFAULTS.STATUS })
  status!: (typeof BLOG.STATUS.VALUES)[number];

  @Column({ type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ type: 'int', default: 0 })
  readingTime!: number;

  @Column({ type: 'int', default: 0 })
  views!: number;

  @Column({ type: 'varchar', length: 120, nullable: true })
  seoTitle!: string | null;

  @Column({ type: 'text', nullable: true })
  seoDescription!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  publishedAt!: Date | null;
}

// src/projects/project.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, } from 'typeorm';

export enum ProjectCategory {
  HOSPITALITY = 'Hospitality',
  BIOTECH = 'Bio Tech',
  CONSTRUCTION = 'Construction',
  CONSULTING = 'Consulting',
  FINANCIAL_SERVICES = 'Financial Services',
  IT = 'IT',
  LEGAL = 'Legal',
  MEDICAL = 'Medical',
  NONPROFIT = 'Nonprofit',
  PRODUCT = 'Product',
  PROFESSIONAL_SERVICES = 'Professional Services',
  REAL_ESTATE = 'Real Estate',
  TECHNOLOGY = 'Technology',
  TOURISM_AGENCY = 'Tourism Agency',
}

@Entity('projects')
@Index(['category'])
@Index(['orderIndex'])
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  // базові поля
  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', nullable: true })
  longDescription!: string | null;           // 🆕 NEW

  @Column({ type: 'text', array: true, default: '{}' })
  features!: string[];           // 🆕 NEW

  @Column({ type: 'text', array: true, default: '{}' })
  services!: string[];               // перелік сервісів     // 🆕 NEW

  @Column({ type: 'text', nullable: true })
  industry!: string | null;          // галузь     // 🆕 NEW

  @Column({ type: 'text', nullable: true })
  location!: string | null;          // локація (країна/місто) // 🆕 NEW

  @Column({ type: 'text', array: true, default: '{}' })
  gallery!: string[];        // 🆕 NEW

  @Column({ type: 'text', nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  websiteUrl!: string | null;

  @Column({ type: 'enum', enum: ProjectCategory })
  category!: ProjectCategory;

  @Column({ default: false })
  isFeatured!: boolean;

  @Column({ type: 'text', default: 'published' })
  status!: 'draft' | 'published';

  @Column({ type: 'text', array: true, default: '{}' })
  techStack!: string[];

  @Column({ type: 'int', default: 0 })
  orderIndex!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

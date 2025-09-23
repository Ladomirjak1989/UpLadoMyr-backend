import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

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

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  websiteUrl?: string;

  @Column({ type: 'enum', enum: ProjectCategory })
  category!: ProjectCategory;

  @Column({ default: false })
  isFeatured!: boolean;

  @Column({ default: 'published' })
  status!: 'draft' | 'published';

  @Column('text', { array: true, default: '{}' })
  techStack!: string[];

  @Column({ default: 0 })
  orderIndex!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

// src/user/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'users' })
@Index('uq_users_provider_providerId_notnull', ['provider', 'providerId'], {
  unique: true,
  where: '"provider" IS NOT NULL AND "provider_id" IS NOT NULL',
})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  // 👇 ЯВНІ типи varchar
  @Column({ type: 'varchar', length: 64, nullable: true })
  username!: string | null;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
    nullable: true,
    transformer: {
      to: (v?: string | null) => v?.trim().toLowerCase() ?? null,
      from: (v: string | null) => v,
    },
  })
  email!: string | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false, nullable: true })
  passwordHash!: string | null;

  // --- OAuth (Google) ---
  @Column({ type: 'varchar', length: 32, nullable: true })
  provider!: 'google' | null;

  @Column({ name: 'provider_id', type: 'varchar', length: 191, nullable: true })
  providerId!: string | null;

  @Column({ name: 'display_name', type: 'varchar', length: 120, nullable: true })
  displayName!: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', length: 512, nullable: true })
  avatarUrl!: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'users_role_enum',
    default: UserRole.USER,
  })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}

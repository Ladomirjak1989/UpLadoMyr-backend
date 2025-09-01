// src/user/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  username!: string;

  // одна унікальність — тільки тут
  @Column({
    length: 150,
    unique: true,
    transformer: {
      to: (v?: string) => v?.trim().toLowerCase(),
      from: (v: string) => v,
    },
  })
  email!: string;

  // зберігаємо лише хеш, не витягуємо за замовчуванням
  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'users_role_enum', // 👈 збіг із БД
    default: UserRole.USER,
  })
  role!: UserRole;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}

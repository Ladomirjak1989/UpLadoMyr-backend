import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';


export type UserRole = 'user' | 'admin';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  username!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

}

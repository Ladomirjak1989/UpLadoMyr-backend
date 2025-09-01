// src/user/user.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  /** Використовується логіном; підтягуємо passwordHash (select:false в ентіті) */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('u')
      .addSelect('u.passwordHash') // важливо, якщо в ентіті select:false
      .where('u.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
  }

  /** Потрібно для JwtStrategy.validate(payload.sub) */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto & { role?: UserRole }) {
    const email = dto.email.trim().toLowerCase();

    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = this.userRepository.create({
      email,
      username: dto.username.trim(),
      passwordHash,             // зберігаємо саме hash
      role: dto.role ?? UserRole.USER,      // дефолтна роль
    });

    const saved = await this.userRepository.save(user);
    const { passwordHash: _hide, ...safe } = saved as any;
    return safe;
  }

  async findAll() {
    return this.userRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const u = await this.userRepository.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async update(id: number, dto: UpdateUserDto) {
    const patch: Partial<User> = {};
    if (dto.email) patch.email = dto.email.trim().toLowerCase();
    if (dto.username) patch.username = dto.username.trim();

    await this.userRepository.update(id, patch);
    return this.findOne(id);
  }

  async remove(id: number) {
    const u = await this.findOne(id);
    await this.userRepository.remove(u);
    return { ok: true };
  }

  async updateRole(id: number, role: UserRole) {
    await this.userRepository.update(id, { role });
    return this.findOne(id);
  }
}



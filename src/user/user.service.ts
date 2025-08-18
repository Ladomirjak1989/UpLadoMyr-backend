import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  
  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   const { username, email, password } = createUserDto;
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const user = this.userRepository.create({
  //     username,
  //     email,
  //     password: hashedPassword,
  //     role: 'user', // ✅ встановлюється вручну
  //   });

  //   return this.userRepository.save(user);
  // }

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email,
      username: dto.username,
      password: hashedPassword,
      role: dto.role || 'user', // ❗️дефолт до 'user'
    });
    return this.userRepository.save(user);
  }
  

  
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({where:{email}});
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }


  async updateRole(id: number, role: UserRole): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
  
    user.role = role;
    return this.userRepository.save(user);
  }
}


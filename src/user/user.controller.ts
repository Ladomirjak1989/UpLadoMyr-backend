// src/user/user.controller.ts
import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
    HttpCode,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';   // ← додано
import { UpdateRoleDto } from './dto/update-role.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')                     // ← весь контролер тільки для адміна
@Controller('users')                // → /api/users
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.create(dto);
    }

    // ✅ оновлення email/username
    @Patch(':id')
    @HttpCode(200)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(id, dto);
    }

    // ✅ зміна ролі
    @Patch(':id/role')
    @HttpCode(200)
    updateUserRole(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRoleDto,
    ): Promise<User> {
        return this.userService.updateRole(id, dto.role);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}

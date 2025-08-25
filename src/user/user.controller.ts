import {
    Controller,
    
    Param,
    Post,
    Body,
    Patch,
    UseGuards,
    Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';



import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<User | null> {
        return this.userService.findOne(Number(id));
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    // ✅ PATCH /users/:id/role (admin only)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/role')
    updateUserRole(
        @Param('id') id: string,
        @Body() dto: UpdateRoleDto,
    ): Promise<User> {
        return this.userService.updateRole(Number(id), dto.role);
    }
}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './blog.entity';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BlogPost])],
    providers: [BlogService],
    controllers: [BlogController],
    exports: [TypeOrmModule],
})
export class BlogModule { }

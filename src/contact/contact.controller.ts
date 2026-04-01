import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    async create(@Body() dto: CreateContactDto) {
        return this.contactService.create(dto);
    }

    @Get('ref/:ref')
    async findPublicByRef(@Param('ref') ref: string) {
        return this.contactService.findPublicByRef(ref);
    }
}
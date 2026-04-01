import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FooterLeadService } from './footer-lead.service';
import { CreateFooterLeadDto } from './dto/create-footer-lead.dto';

@Controller('footer-leads')
export class FooterLeadController {
    constructor(private readonly footerLeadService: FooterLeadService) { }

    @Post()
    async create(@Body() dto: CreateFooterLeadDto) {
        return this.footerLeadService.create(dto);
    }

    @Get('ref/:ref')
    async findPublicByRef(@Param('ref') ref: string) {
        return this.footerLeadService.findPublicByRef(ref);
    }
}
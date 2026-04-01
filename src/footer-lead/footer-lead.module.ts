import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FooterLead } from './footer-lead.entity';
import { FooterLeadService } from './footer-lead.service';
import { FooterLeadController } from './footer-lead.controller';

@Module({
    imports: [TypeOrmModule.forFeature([FooterLead])],
    controllers: [FooterLeadController],
    providers: [FooterLeadService],
    exports: [FooterLeadService, TypeOrmModule],
})
export class FooterLeadModule { }
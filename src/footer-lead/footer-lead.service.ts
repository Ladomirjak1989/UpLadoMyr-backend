import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { FooterLead } from './footer-lead.entity';
import { CreateFooterLeadDto } from './dto/create-footer-lead.dto';

@Injectable()
export class FooterLeadService {
    constructor(
        @InjectRepository(FooterLead)
        private readonly footerLeadRepository: Repository<FooterLead>,
    ) { }

    async create(dto: CreateFooterLeadDto) {
        const ref = randomUUID();

        const lead = this.footerLeadRepository.create({
            ref,
            email: dto.email.trim().toLowerCase(),
        });

        await this.footerLeadRepository.save(lead);

        return {
            success: true,
            ref,
        };
    }

    async findPublicByRef(ref: string) {
        const lead = await this.footerLeadRepository.findOne({
            where: { ref },
        });

        if (!lead) {
            throw new NotFoundException('Footer lead not found');
        }

        return {
            name: null,
            email: lead.email,
        };
    }
}
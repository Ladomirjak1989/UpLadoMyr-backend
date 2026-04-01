import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
    ) { }

    async create(dto: CreateContactDto) {
        const ref = randomUUID();

        const contact = this.contactRepository.create({
            ref,
            firstName: dto.name.trim(),
            lastName: dto.lastName.trim(),
            email: dto.email.trim().toLowerCase(),
            message: dto.message.trim(),
        });

        await this.contactRepository.save(contact);

        return {
            success: true,
            ref,
        };
    }

    async findPublicByRef(ref: string) {
        const contact = await this.contactRepository.findOne({
            where: { ref },
        });

        if (!contact) {
            throw new NotFoundException('Contact request not found');
        }

        return {
            name: `${contact.firstName} ${contact.lastName}`.trim(),
            email: contact.email,
        };
    }
}
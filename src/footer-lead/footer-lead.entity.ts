import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity({ name: 'footer_leads' })
export class FooterLead {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 120 })
    ref!: string;

    @Column({
        type: 'varchar',
        length: 150,
        transformer: {
            to: (v?: string | null) => v?.trim().toLowerCase() ?? null,
            from: (v: string | null) => v,
        },
    })
    email!: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;
}
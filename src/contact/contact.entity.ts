import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity({ name: 'contacts' })
export class Contact {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 120 })
    ref!: string;

    @Column({ name: 'first_name', type: 'varchar', length: 100 })
    firstName!: string;

    @Column({ name: 'last_name', type: 'varchar', length: 100 })
    lastName!: string;

    @Column({
        type: 'varchar',
        length: 150,
        transformer: {
            to: (v?: string | null) => v?.trim().toLowerCase() ?? null,
            from: (v: string | null) => v,
        },
    })
    email!: string;

    @Column({ type: 'text' })
    message!: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;
}
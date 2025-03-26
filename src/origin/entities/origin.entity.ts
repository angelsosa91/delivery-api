import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('origin')
export class Origin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 450, nullable: true })
    name: string;

    @Column({ length: 45, nullable: true })
    phone: string;

    @Column({ length: 250, nullable: true })
    address: string;

    @Column({ length: 100, nullable: true })
    email: string;

    @Column({ length: 45, nullable: true })
    latitude: string;

    @Column({ length: 45, nullable: true })
    longitude: string;

    @Column({ nullable: true, name: 'user_id' })
    userId: number;

    @Column({ default: 1 })
    status: number;

    @Column({ length: 255, nullable: true })
    references: string;

    @Column({ default: 0 })
    default: number;

    @Column({ default: 0, name: 'sync_id' })
    syncId: number;
}
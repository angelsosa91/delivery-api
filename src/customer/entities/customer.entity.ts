import { Order } from 'src/order/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('customer')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'full_name', length: 450, nullable: true })
    fullName: string;

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

    @Column({ default: 0, name: 'sync_id' })
    syncId: number;

    // Relación con Order
    //@OneToMany(() => Order, order => order.customer) // Un cliente puede tener muchas órdenes
    //orders: Order[]; // Propiedad para acceder a las órdenes desde el cliente
}
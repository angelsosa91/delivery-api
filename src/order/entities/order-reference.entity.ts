import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('orders_references')
export class OrderReference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'order_id' })
    orderId: string;

    @Column({ length: 45, nullable: true, name: 'document_number' })
    documentNumber: string;

    @Column({ type: 'enum', enum: ['ENTREGADO', 'NO ENTREGADO', 'RECHAZADO', 'PENDIENTE'], nullable: true })
    status: string;

    @Column({ name: 'scheduledDate', type: 'timestamp', nullable: true })
    scheduledDate: Date;

    @Column({ length: 100, nullable: true })
    observation: string;

    @Column({ length: 100, nullable: true })
    image: string;

    // Relaciones
    @ManyToOne(() => Order, order => order.orderReferences)
    @JoinColumn({ name: 'order_id' })
    order: Order;
}
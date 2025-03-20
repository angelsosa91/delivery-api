import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('orders_points')
export class OrderPoint {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'order_id' })
    orderId: string;

    @Column({ type: 'uuid', nullable: true, name: 'customer_id' })
    customerId: string;

    @Column({ type: 'uuid', nullable: true, name: 'origin_id' })
    originId: string;

    @Column({ length: 450, nullable: true })
    name: string;

    @Column({ length: 400, nullable: true })
    address: string;

    @Column({ length: 45, nullable: true })
    phone: string;

    @Column({ length: 45, nullable: true })
    latitude: string;

    @Column({ length: 45, nullable: true })
    longitude: string;

    @Column({ length: 45, nullable: true })
    status: string;

    @Column({ type: 'timestamp', nullable: true, name: 'scheduled_date' })
    scheduledDate: Date;

    @Column({ length: 450, default: 'Ninguno' })
    comments: string;

    @Column({ default: 0 })
    amount: number;

    @Column({ default: 0 })
    distance: number;

    @Column({ length: 100, nullable: true, name: 'delivery_time' })
    deliveryTime: string;

    @Column({ length: 200, default: 'DELIVERY' })
    service: string;

    // Relación con Customer
    @ManyToOne(() => Order, order => order.points) // Un cliente puede tener muchas órdenes
    @JoinColumn({ name: 'order_id' }) // Columna en la tabla `orders` que referencia al cliente
    order: Order; // Propiedad para acceder al cliente desde la orden
}
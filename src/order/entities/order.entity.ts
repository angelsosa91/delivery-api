import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Index, UpdateDateColumn } from 'typeorm';
import { OrderReference } from './order-reference.entity';
import { OrderPoint } from './order-points.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true, name: 'auth_id' })
  authId: string;

  @Column({ length: 45, name: 'receiver_name' })
  receiverName: string;

  @Column({ length: 45, name: 'receiver_phone' })
  receiverPhone: string;

  @Column({ length: 450, name: 'description' })
  description: string;

  @Column({ length: 45, name: 'payment_method' })
  paymentMethod: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 45, name: 'sender_phone' })
  senderPhone: string;

  @Column({ type: 'uuid', nullable: true, name: 'origin_id' })
  originId: string;

  @Column({ length: 45, name: 'latitude_from' })
  latitudeFrom: string;

  @Column({ length: 45, name: 'longitude_from' })
  longitudeFrom: string;

  @Column({ type: 'uuid', nullable: true, name: 'customer_id' })
  customerId: string;

  @Column({ length: 45, name: 'latitude_to' })
  latitudeTo: string;

  @Column({ length: 45, name: 'longitude_to' })
  longitudeTo: string;

  @Column({ length: 20, default: 'Pendiente', name: 'status' })
  status: string;

  @Column({ type: 'float' })
  distance: number;

  @Column({ type: 'float' })
  amount: number;

  @Column({ default: 0 })
  rating: number;

  @Column({ name: 'delivery_time', length: 45, nullable: true })
  deliveryTime: string;

  @Column({ length: 4500, default: 'NINGUNO' })
  comments: string;

  @Column({ name: 'discount', default: 0 })
  discount: number;

  @Column({ name: 'with_return', default: 0 })
  withReturn: number;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'scheduled' })
  scheduled: string;

  @Column({ type: 'timestamp', nullable: true, name: 'scheduled_date' })
  scheduledDate: Date;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'invoice' })
  invoice: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'invoice_exempt' })
  invoiceExempt: string;

  @Column({ length: 45, nullable: true, name: 'invoice_doc' })
  invoiceDoc: string;

  @Column({ length: 255, nullable: true, name: 'invoice_name' })
  invoiceName: string;

  @Column({ length: 45, name: 'service_type' })
  serviceType: string;

  @Column({ type: 'enum', enum: ['S', 'M'], default: 'S', name: 'order_type' })
  orderType: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'wallet' })
  wallet: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'bank' })
  bank: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'direct_event' })
  directEvent: string;

  @Column({ default: 0, name: 'sender_vip' })
  senderVip: number;

  @Column({ default: 0, name: 'sender_company' })
  senderCompany: number;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'processed' })
  processed: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderReference, orderReference => orderReference.order)
  orderReferences: OrderReference[];

  // Relación con Points
  @OneToMany(() => OrderPoint, orderPoint => orderPoint.order) // Una orden puede tener muchos puntos
  points: OrderPoint[]; // Propiedad para acceder a las puntos desde la Orden

  // Relación con Customer
  //@ManyToOne(() => Customer, customer => customer.orders, { onDelete: 'CASCADE' }) // Un cliente puede tener muchas órdenes
  //@JoinColumn({ name: 'customer_id' }) // Columna en la tabla `orders` que referencia al cliente
  //customer: Customer; // Propiedad para acceder al cliente desde la orden
}
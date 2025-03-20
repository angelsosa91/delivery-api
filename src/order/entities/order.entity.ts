import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { OrderReference } from './order-reference.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 45, name: 'receiver_name' })
  receiverName: string;

  @Column({ length: 45, name: 'receiver_phone' })
  receiverPhone: string;

  @Column({ length: 450, name: 'description' })
  description: string;

  @Column({ length: 45, name: 'payment_method' })
  paymentMethod: string;

  @Column({ length: 45, name: 'sender_phone' })
  senderPhone: string;

  @Column({ length: 45, name: 'latitude_from' })
  latitudeFrom: string;

  @Column({ length: 45, name: 'longitude_from' })
  longitudeFrom: string;

  @Column({ length: 45, name: 'latitude_to' })
  latitudeTo: string;

  @Column({ length: 45, name: 'longitude_to' })
  longitudeTo: string;

  @Column({ length: 20, default: 'Pendiente', name: 'status' })
  status: string;

  @CreateDateColumn({ name: 'register_date' })
  registerDate: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column()
  distance: number;

  @Column()
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

  @Column({ type: 'enum', enum: ['S', 'M'], default: 'S', name: 'order_type' })
  orderType: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'wallet' })
  wallet: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'bank' })
  bank: string;

  @Column({ default: 0, name: 'sender_vip' })
  senderVip: number;

  @Column({ default: 0, name: 'sender_company' })
  senderCompany: number;

  @OneToMany(() => OrderReference, orderReference => orderReference.order)
  orderReferences: OrderReference[];

  // Relación con Customer
  @ManyToOne(() => Customer, customer => customer.orders) // Un cliente puede tener muchas órdenes
  @JoinColumn({ name: 'customer_id' }) // Columna en la tabla `orders` que referencia al cliente
  customer: Customer; // Propiedad para acceder al cliente desde la orden
}
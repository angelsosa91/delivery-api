import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('pedidos_referencias')
export class OrderReference {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'id_pedidos' })
  idPedidos: number;

  @Column({ length: 45, nullable: true, name: 'nro_doc' })
  nroDoc: string;

  @Column({ type: 'enum', enum: ['ENTREGADO', 'NO ENTREGADO', 'RECHAZADO', 'PENDIENTE'], nullable: true })
  estado: string;

  @Column({ length: 45, nullable: true })
  fecha: string;

  @Column({ length: 45, nullable: true })
  observacion: string;

  @Column({ length: 100, nullable: true })
  imagen: string;

  // Relaciones
  @ManyToOne(() => Order, order => order.orderReference)
  @JoinColumn({ name: 'id_pedidos' })
  order: Order;
}
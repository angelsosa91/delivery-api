import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Order } from './order.entity';

@Entity('pedidos_movimiento')
export class OrderMovement {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'id_users' })
  idUsers: number;

  @Column({ type: 'bigint', name: 'id_pedidos' })
  idPedidos: number;

  @CreateDateColumn({ name: 'fecha_asignado' })
  fechaAsignado: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'fecha_entregado' })
  fechaEntregado: Date;

  @Column({ length: 45, default: 'Pendiente' })
  estado: string;

  @Column({ default: 0 })
  deuda: number;

  @Column({ default: 0 })
  pagado: number;

  @Column({ default: 0, name: 'electronico_deuda' })
  electronicoDeuda: number;

  @Column({ default: 0, name: 'retencion_iva' })
  retencionIva: number;

  @Column({ default: 0, name: 'iva_pagado' })
  ivaPagado: number;

  @Column({ default: 0, name: 'monto_factura' })
  montoFactura: number;

  @Column({ default: 0, name: 'monto_factura_pagado' })
  montoFacturaPagado: number;

  @Column({ default: 0, name: 'electronico_deuda_pagado' })
  electronicoDeudaPagado: number;

  @Column({ length: 45, nullable: true, name: 'medio_pago_deuda_moto' })
  medioPagoDeudaMoto: string;

  // Relaciones
  @ManyToOne(() => User, user => user.orderMovement)
  @JoinColumn({ name: 'id_users' })
  user: User;

  @ManyToOne(() => Order, order => order.orderMovement)
  @JoinColumn({ name: 'id_pedidos' })
  order: Order;
}
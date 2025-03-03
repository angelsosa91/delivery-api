import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderMovement } from './order-movement.entity';
import { OrderReference } from './order-reference.entity';

@Entity('pedidos')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 45, name: 'nombreReceptor' })
  nombreReceptor: string;

  @Column({ length: 45, name: 'telefonoReceptor' })
  telefonoReceptor: string;

  @Column({ length: 450, name: 'descripcionEnvio' })
  descripcionEnvio: string;

  @Column({ length: 45, name: 'formaPago' })
  formaPago: string;

  @Column({ length: 45, name: 'emisorTelefono' })
  emisorTelefono: string;

  @Column({ length: 45, name: 'latitudDesde' })
  latitudDesde: string;

  @Column({ length: 45, name: 'longitudDesde' })
  longitudDesde: string;

  @Column({ length: 20, default: 'Pendiente', name: 'estadoPedido' })
  estadoPedido: string;

  @CreateDateColumn({ name: 'fechaRegistro' })
  fechaRegistro: Date;

  @Column({ name: 'idUser' })
  idUser: number;

  @Column({ length: 20 })
  distancia: string;

  @Column()
  monto: number;

  @Column({ length: 45, name: 'latitudHasta' })
  latitudHasta: string;

  @Column({ length: 45, name: 'longitudHasta' })
  longitudHasta: string;

  @Column({ default: 0 })
  calificacion: number;

  @Column({ length: 45, nullable: true })
  tiempo: string;

  @Column({ length: 4500, default: 'NINGUNO' })
  comentario: string;

  @Column({ default: 0 })
  descuento: number;

  @Column({ default: 0, name: 'idaYvuelta' })
  idaYvuelta: number;

  @Column({ length: 45, default: '0', name: 'latitudHasta2' })
  latitudHasta2: string;

  @Column({ length: 45, default: '0', name: 'longitudHasta2' })
  longitudHasta2: string;

  @Column({ length: 200, default: 'DELIVERY', name: 'tipoServicio' })
  tipoServicio: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO' })
  factura: string;

  @Column({ type: 'timestamp', nullable: true, name: 'fechaProgramada' })
  fechaProgramada: Date;

  @Column({ type: 'enum', enum: ['APP', 'WEB', 'IOS'], default: 'APP' })
  medio: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO' })
  exenta: string;

  @Column({ length: 45, nullable: true, name: 'factura_ruc' })
  facturaRuc: string;

  @Column({ length: 255, nullable: true, name: 'factura_razonsocial' })
  facturaRazonSocial: string;

  @Column({ type: 'enum', enum: ['S', 'M'], default: 'S', name: 'tipo_pedido' })
  tipoPedido: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'depositoBilletera' })
  depositoBilletera: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'depositoBancario' })
  depositoBancario: string;

  @Column({ length: 200, default: 'NINGUNO', name: 'motivo_cancelacion' })
  motivoCancelacion: string;

  @Column({ length: 45, default: 'inicio', name: 'zoneFrom' })
  zoneFrom: string;

  @Column({ length: 45, default: 'fin', name: 'zoneTo' })
  zoneTo: string;

  @Column({ length: 45, default: '0' })
  propina: string;

  @Column({ default: 0, name: 'estado_pago' })
  estadoPago: number;

  @Column({ length: 200, nullable: true, name: 'hash_pedido' })
  hashPedido: string;

  @Column({ type: 'enum', enum: ['NINGUNO', 'PAGOPAR', 'TIGO_MONEY'], nullable: true, name: 'hash_servicio' })
  hashServicio: string;

  @Column({ length: 45, default: 'MOTOCICLETA', name: 'categoria_vehiculo' })
  categoriaVehiculo: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'gestion_personal' })
  gestionPersonal: string;

  @Column({ length: 225, nullable: true, name: 'ciudad_origen' })
  ciudadOrigen: string;

  @Column({ type: 'longtext', nullable: true, name: 'foto_entregado' })
  fotoEntregado: string;

  @Column({ default: 0 })
  membresia: number;

  @Column({ type: 'longtext', nullable: true, name: 'ticket_pago' })
  ticketPago: string;

  @Column({ default: 0, name: 'envio_pro' })
  envioPro: number;

  @Column({ default: 0, name: 'envio_empresa' })
  envioEmpresa: number;

  // Relaciones
  @ManyToOne(() => User, user => user.order)
  @JoinColumn({ name: 'idUser' })
  user: User;

  @OneToMany(() => OrderMovement, orderMovement => orderMovement.order)
  orderMovement: OrderMovement[];

  @OneToMany(() => OrderReference, orderReference => orderReference.order)
  orderReference: OrderReference[];
}
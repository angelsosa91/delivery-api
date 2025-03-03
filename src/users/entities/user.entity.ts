import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderMovement } from '../../orders/entities/order-movement.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 45 })
  name: string;

  @Column({ length: 45, unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ length: 45, default: '0', name: 'telefono' })
  telefono: string;

  @Column({ default: 1 })
  estado: number;

  @Column({ length: 45, default: '0' })
  documento: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column({ type: 'longtext', nullable: true, name: 'tokenFirebase' })
  tokenFirebase: string;

  @Column({ default: 1, name: 'categoria_usuario' })
  categoriaUsuario: number;

  @Column({ type: 'longtext', nullable: true })
  photo: string;

  @Column({ length: 200, nullable: true, name: 'facebookID' })
  facebookID: string;

  @Column({ type: 'longtext', nullable: true, name: 'tokenSession' })
  tokenSession: string;

  @Column({ type: 'smallint', default: 0 })
  rol: number;

  @Column({ length: 45, default: 'offline', name: 'estado_moto' })
  estadoMoto: string;

  @Column({ length: 45, default: '0' })
  latitud: string;

  @Column({ length: 45, default: '0' })
  longitud: string;

  @Column({ type: 'longtext', nullable: true, name: 'tokenFirebaseWeb' })
  tokenFirebaseWeb: string;

  @Column({ length: 45, nullable: true })
  ciudad: string;

  @Column({ length: 100, nullable: true })
  direccion: string;

  @Column({ type: 'smallint', default: 0 })
  solicita: number;

  @Column({ length: 45, nullable: true })
  chapa: string;

  @Column({ type: 'datetime', nullable: true, name: 'register_date' })
  registerDate: Date;

  @Column({ type: 'datetime', nullable: true, name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'enum', enum: ['moto', 'bici'], default: 'moto' })
  car: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'enum', enum: ['male', 'female'], default: 'male' })
  gender: string;

  @Column({ default: 0 })
  bkpin: number;

  @Column({ length: 450, default: 'ninguno', name: 'observacion_baja' })
  observacionBaja: string;

  @Column({ type: 'datetime', nullable: true, name: 'enable_date' })
  enableDate: Date;

  @Column({ length: 450, default: 'ninguno', name: 'observacion_alta' })
  observacionAlta: string;

  @Column({ type: 'smallint', default: 0 })
  notifica: number;

  @Column({ type: 'datetime', nullable: true, name: 'notifica_date' })
  notificaDate: Date;

  @Column({ length: 45, nullable: true })
  mime: string;

  @Column({ length: 45, default: 'Paraguay' })
  pais: string;

  @Column({ length: 45, default: 'MOTOCICLETA', name: 'categoria_vehiculo' })
  categoriaVehiculo: string;

  @Column({ length: 45, default: 'CEDULA', name: 'tipo_documento' })
  tipoDocumento: string;

  @Column({ length: 45, default: 'DELIVERY' })
  origen: string;

  @Column({ length: 45, default: '0', name: 'codigo_promocional' })
  codigoPromocional: string;

  @Column({ default: 0, name: 'factura_mensual' })
  facturaMensual: number;

  @Column({ default: 0, name: 'conductor_empresa' })
  conductorEmpresa: number;

  @Column({ default: 0, name: 'cliente_empresa' })
  clienteEmpresa: number;

  @Column({ type: 'timestamp', nullable: true, name: 'conductor_last_time_update' })
  conductorLastTimeUpdate: Date;

  // Relaciones
  @OneToMany(() => Order, order => order.user)
  order: Order[];

  @OneToMany(() => OrderMovement, orderMovement => orderMovement.user)
  orderMovement: OrderMovement[];
}
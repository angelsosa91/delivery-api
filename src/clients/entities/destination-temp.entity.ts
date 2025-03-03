import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity('mp_detalle_puntos_temp')
export class DestinationTemp {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true, name: 'id_mp_cliente' })
  idMpCliente: number;

  @Column({ nullable: true, name: 'id_pedido' })
  idPedido: number;

  @Column({ length: 200, nullable: true })
  nombre: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ length: 45, nullable: true })
  telefono: string;

  @Column({ length: 45, nullable: true })
  latitud: string;

  @Column({ length: 45, nullable: true })
  longitud: string;

  @Column({ type: 'double', default: 0 })
  distancia: number;

  @Column({ type: 'double', default: 0 })
  monto: number;

  @Column({ length: 45, nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true, name: 'hora_entrega' })
  horaEntrega: Date;

  @Column({ length: 450, nullable: true })
  descripcion: string;

  @Column({ length: 45, nullable: true })
  token: string;

  @CreateDateColumn({ name: 'register' })
  register: Date;

  @Column({ length: 100, nullable: true })
  tiempo: string;

  @Column({ length: 200, default: 'DELIVERY' })
  servicio: string;

  @Column({ length: 450, nullable: true })
  zone: string;

  @Column({ length: 255, nullable: true })
  referencia: string;

  @Column({ default: 0 })
  marcador: number;

  @Column({ default: 0, name: 'tiempo_minutos' })
  tiempoMinutos: number;

  // Relaciones
  @ManyToOne(() => Client, client => client.destinationTemp)
  @JoinColumn({ name: 'id_mp_cliente' })
  client: Client;
}
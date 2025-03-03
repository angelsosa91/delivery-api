import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity('mp_detalle_puntos')
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'id_mp_cliente' })
  idClient: number;

  @Column({nullable: true, name: 'id_pedido' })
  idOrder: number;

  @Column({ length: 450, nullable: true })
  nombre: string;

  @Column({ length: 400, nullable: true })
  direccion: string;

  @Column({ length: 45, nullable: true })
  telefono: string;

  @Column({ length: 45, nullable: true })
  latitud: string;

  @Column({ length: 45, nullable: true })
  longitud: string;

  @Column({ length: 45, nullable: true })
  estado: string;

  @Column({ type: 'timestamp', nullable: true, name: 'hora_entrega' })
  horaEntrega: Date;

  @Column({ length: 450, nullable: true })
  descripcion: string;

  @Column({ length: 450, default: 'ninguno', name: 'comentario_moto' })
  comentarioMoto: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'hora_entrega_moto' })
  horaEntregaMoto: Date;

  @Column({ default: 0 })
  monto: number;

  @Column({ default: 0 })
  distancia: number;

  @Column({ default: 0, name: 'id_emisor' })
  idEmisor: number;

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
  @ManyToOne(() => Client, client => client.destination)
  @JoinColumn({ name: 'id_mp_cliente' })
  client: Client;
}
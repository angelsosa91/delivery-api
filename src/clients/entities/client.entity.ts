import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Destination } from './destination.entity';
import { DestinationTemp } from './destination-temp.entity';

@Entity('mp_clientes')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 450, nullable: true })
  nombre: string;

  @Column({ length: 45, nullable: true })
  telefono: string;

  @Column({ length: 250, nullable: true })
  direccion: string;

  @Column({ length: 100, nullable: true })
  correo: string;

  @Column({ length: 45, nullable: true })
  latitud: string;

  @Column({ length: 45, nullable: true })
  longitud: string;

  @Column({ nullable: true, name: 'id_users' })
  idUsers: number;

  @Column({ default: 1 })
  estado: number;

  @Column({ length: 255, nullable: true })
  referencia: string;

  // Relaciones
  @OneToMany(() => Destination, destination => destination.client)
  destination: Destination[];

  @OneToMany(() => DestinationTemp, destinationTemp => destinationTemp.client)
  destinationTemp: DestinationTemp[];
}
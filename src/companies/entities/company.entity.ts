import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('empresa')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45, nullable: true })
  nombre: string;

  @Column({ length: 45, nullable: true })
  ruc: string;

  @Column({ length: 45, nullable: true })
  email: string;

  @Column({ length: 45, nullable: true })
  representante: string;

  @Column({ type: 'tinyint', nullable: true })
  estado: number;
}
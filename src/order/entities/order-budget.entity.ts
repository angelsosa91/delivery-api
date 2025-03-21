import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('orders_budget')
export class OrderBudget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 45, name: 'latitude_from' })
  latitudeFrom: string;

  @Column({ length: 45, name: 'longitude_from' })
  longitudeFrom: string;

  @Column({ length: 45, name: 'latitude_to' })
  latitudeTo: string;

  @Column({ length: 45, name: 'longitude_to' })
  longitudeTo: string;

  @Column()
  distance: string;

  @Column()
  amount: number;

  @Column({ name: 'with_return', default: 0 })
  withReturn: number;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'wallet' })
  wallet: string;

  @Column({ type: 'enum', enum: ['SI', 'NO'], default: 'NO', name: 'bank' })
  bank: string;

  @Column({ length: 20, default: 'CONSULTADO', name: 'status' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación con Customer
  @ManyToOne(() => User, user => user.budgets) // Un usuario puede tener muchas consultas de presupuestos
  @JoinColumn({ name: 'user_id' }) // Columna en la tabla `orders_budget` que referencia al usuario
  user: User; // Propiedad para acceder al usuario desde la orders_budgets
}
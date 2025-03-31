import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tariff_distance')
export class TariffDistance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', name: 'distance_min' })
  distanceMin: number;

  @Column({ type: 'float', name: 'distance_max' })
  distanceMax: number;

  @Column({ type: 'float', name: 'base_amount' })
  baseAmount: number;

  @Column({ type: 'enum', enum: ['MOTOCICLETA', 'VEHICULOS_LIGEROS'], default: 'MOTOCICLETA', name: 'delivery_type' })
  deliveryType: string;
}
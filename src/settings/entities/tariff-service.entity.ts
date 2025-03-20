import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tariff_service')
export class TariffService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  service: string;

  @Column({ type: 'float', name: 'amount_add' })
  amountAdd: number;
}
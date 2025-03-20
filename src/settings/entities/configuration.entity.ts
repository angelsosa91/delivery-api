import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('configurations')
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  key: string;

  @Column({ type: 'float' })
  value: number;
}
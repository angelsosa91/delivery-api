import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OriginService } from './services/origin.service';
import { OriginController } from './controllers/origin.controller';
import { Origin } from './entities/origin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Origin])],
  controllers: [OriginController],
  providers: [OriginService],
  exports: [OriginService],
})
export class OriginModule {}
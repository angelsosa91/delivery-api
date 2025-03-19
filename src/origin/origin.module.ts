import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OriginService } from './services/origin.service';
import { OriginController } from './controllers/origin.controller';
import { Origin } from './entities/origin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Origin]),
    AuthModule
  ],
  controllers: [OriginController],
  providers: [OriginService],
  exports: [OriginService],
})
export class OriginModule {}
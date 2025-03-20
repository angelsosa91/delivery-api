import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { Order } from './entities/order.entity';
import { OrderReference } from './entities/order-reference.entity';
import { OrderPoint } from './entities/order-points.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerModule } from 'src/customer/customer.module';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderReference, OrderPoint]), 
    AuthModule, CustomerModule, SettingsModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
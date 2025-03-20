import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { Order } from './entities/order.entity';
import { OrderReference } from './entities/order-reference.entity';
import { OrderPoints } from './entities/order-points.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UtilsModule } from 'src/utils/utils.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderReference, OrderPoints]), 
    AuthModule, CustomerModule, UtilsModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
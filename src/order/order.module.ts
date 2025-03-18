import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { Order } from './entities/order.entity';
import { OrderReference } from './entities/order-reference.entity';
import { OrderPoints } from './entities/order-points.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderReference, OrderPoints])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderMovement } from './entities/order-movement.entity';
import { OrderReference } from './entities/order-reference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderMovement, OrderReference])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
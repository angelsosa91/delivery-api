import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { Order } from './entities/order.entity';
import { OrderReference } from './entities/order-reference.entity';
import { OrderPoint } from './entities/order-points.entity';
import { OrderBudget } from './entities/order-budget.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerModule } from 'src/customer/customer.module';
import { SettingsModule } from 'src/settings/settings.module';
import { UtilsModule } from 'src/utils/utils.module';
import { OriginModule } from 'src/origin/origin.module';
import { QeueModule } from 'src/qeue/qeue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderReference, OrderPoint, OrderBudget]), 
    AuthModule, CustomerModule, OriginModule, SettingsModule, UtilsModule, QeueModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
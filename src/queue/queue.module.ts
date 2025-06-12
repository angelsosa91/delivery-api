import { Module } from '@nestjs/common';
import { RabbitMQService } from './producer/rabbitmq.service';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService]
})
export class QueueModule {}

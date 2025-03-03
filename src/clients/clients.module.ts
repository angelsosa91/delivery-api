import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { Destination } from './entities/destination.entity';
import { DestinationTemp } from './entities/destination-temp.entity';
import { Origin } from './entities/origin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Destination, DestinationTemp, Origin])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
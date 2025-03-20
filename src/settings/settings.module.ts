import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculationService } from './services/calculation.service';
import { TariffDistance } from './entities/tariff-distance.entity';
import { TariffService } from './entities/tariff-service.entity';
import { Configuration } from './entities/configuration.entity';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TariffDistance, TariffService, Configuration]),
    UtilsModule
  ],
  providers: [CalculationService],
  exports: [CalculationService],
})
export class SettingsModule {}
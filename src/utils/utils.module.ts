import { Module } from '@nestjs/common';
import { GoogleMapsService } from './services/google-maps.service';
import { ValidationService } from './services/validation.service';
import { ConfigService } from './services/config.service';

@Module({
  providers: [GoogleMapsService, ValidationService, ConfigService],
  exports: [GoogleMapsService, ValidationService, ConfigService],
})
export class UtilsModule {}
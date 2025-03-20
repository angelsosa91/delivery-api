import { Module } from '@nestjs/common';
import { GoogleMapsService } from './services/google-maps.service';
import { ValidationService } from './services/validation.service';

@Module({
  providers: [GoogleMapsService, ValidationService],
  exports: [GoogleMapsService, ValidationService],
})
export class UtilsModule {}
import { Module } from '@nestjs/common';
import { GoogleMapsService } from './services/google-maps.service';

@Module({
  providers: [GoogleMapsService],
  exports: [GoogleMapsService], // Exporta el servicio para que otros módulos puedan usarlo
})
export class UtilsModule {}
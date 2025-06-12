import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleMapsService {
  // Reads the API key from the `GOOGLE_MAPS_API_KEY` environment variable
  private readonly apiKey = process.env.GOOGLE_MAPS_API_KEY;
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api/distancematrix/json';

  async getDistanceMatrix(origins: string, destinations: string) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          origins,
          destinations,
          key: this.apiKey,
        },
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Error en la API de Google Maps: ${response.data.status}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error al llamar a la API de Google Maps: ${error.message}`);
    }
  }
}

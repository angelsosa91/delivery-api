import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { OrderTrackingDto } from '../dto/order-tracking.dto';

@Injectable()
export class OrderExternalService {
  constructor(private readonly httpService: HttpService) {}

  async getExternalOrderById(id: number): Promise<OrderTrackingDto> {
    try {
        const url = process.env.AHORAITE_EXTERNAL_API + `/order/${id}`;
        const response = await lastValueFrom(this.httpService.get(url));
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error al consultar el pedido externo:', axiosError?.message);
        throw new HttpException('No se pudo obtener el pedido del API external', 502);
    }
  }
}

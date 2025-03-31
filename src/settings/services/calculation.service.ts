import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TariffDistance } from '../entities/tariff-distance.entity';
import { TariffService } from '../entities/tariff-service.entity';
import { Configuration } from '../entities/configuration.entity';
import { GoogleMapsService } from '../../utils/services/google-maps.service';

@Injectable()
export class CalculationService {
  constructor(
    @InjectRepository(TariffDistance)
    private readonly tariffDistanceRepository: Repository<TariffDistance>,
    @InjectRepository(TariffService)
    private readonly tariffServiceRepository: Repository<TariffService>,
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,

    private readonly googleMapsService: GoogleMapsService
  ) {}

  async calculateAmount(distance: number, service: string, delivery: string, wreturn: string, wallet: string, bank: string): Promise<number> {
    //console.log(distance + ' ' + service + ' ' + wreturn + ' ' + wallet + ' ' + bank);
    // Obtener tarifa por distancia
    const tariffDistance = await this.tariffDistanceRepository.findOne({
      where: {
        distanceMin: LessThanOrEqual(distance), // distanceMin <= distance Between(0, distance),
        distanceMax: MoreThanOrEqual(distance), // distanceMax >= distance
        deliveryType: delivery
      },
    });

    let amount = tariffDistance ? tariffDistance.baseAmount : 0;

    // Aplicar tarifa adicional por distancia si es mayor a 14 km
    if (distance > 15) {
      let additional_key = (delivery == 'VEHICULOS_LIGEROS' ? 'additional_km_car': 'additional_km_cycle');
      const tariffAdd = await this.configurationRepository.findOne({
        where: { key: additional_key },
      });

      if (tariffAdd) {
        amount += (distance - 15) * tariffAdd.value;
      }
    }

    // Aplicar tarifa por servicio
    const tariffService = await this.tariffServiceRepository.findOne({
      where: { service: service },
    });

    if (tariffService) {
      amount += tariffService.amountAdd;
    }

    // Aplicar multiplicador si tiene retorno
    if (wreturn === 'SI') {
      const multiplicator_return = await this.configurationRepository.findOne({
        where: { key: 'multiplicator_return' },
      });
      if (multiplicator_return) {
        amount *= multiplicator_return.value;
      }
    }

    // Aplicar adicional por billetera
    if (wallet === 'SI') {
      const plus_wallet = await this.configurationRepository.findOne({
        where: { key: 'plus_wallet' },
      });
      if (plus_wallet) {
        amount += plus_wallet.value;
      }
    }

    // Aplicar adicional por banco
    if (bank === 'SI') {
      const plus_bank = await this.configurationRepository.findOne({
        where: { key: 'plus_bank' },
      });
      if (plus_bank) {
        amount += plus_bank.value;
      }
    }

    return amount;
  }

  async calculateDistance(origins: string, destinations: string) {
    const distanceMatrix = await this.googleMapsService.getDistanceMatrix(
      origins,
      destinations,
    );
    return distanceMatrix;
  }
}
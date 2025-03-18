import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Origin } from '../entities/origin.entity';
import { OriginDto } from '../dto/origin.dto';

@Injectable()
export class OriginService {
  constructor(
    @InjectRepository(Origin)
    private originRepository: Repository<Origin>,
  ) {}

  // Métodos para Cliente
  async createOrigin(originDto: OriginDto): Promise<Origin> {
    const origin = this.mapToOrigin(originDto);
    return this.originRepository.save(origin);
  }

  async findAllOrigins(): Promise<Origin[]> {
    return this.originRepository.find();
  }

  async findOriginsByUser(userId: number): Promise<Origin[]> {
    return this.originRepository.find({
      where: { userId: userId },
    });
  }

  async findOneOrigin(id: string): Promise<Origin> {
    const origin = await this.originRepository.findOne({
      where: { id },
    });
    
    if (!origin) {
      throw new NotFoundException(`Origen con ID ${id} no encontrado`);
    }
    
    return origin;
  }

  async updateOrigin(id: string, originDto: OriginDto): Promise<Origin> {
    const origin = await this.findOneOrigin(id);
    this.originRepository.merge(origin, this.mapToOrigin(originDto));
    return this.originRepository.save(origin);
  }

  async removeOrigin(id: string): Promise<void> {
    const origin = await this.findOneOrigin(id);
    await this.originRepository.remove(origin);
  }

  mapToOrigin(originDto: OriginDto): Origin {
      const origin = new Origin();
  
      // Mapear los valores del DTO a la entidad
      origin.name = originDto.name;
      origin.phone = originDto.phone;
      origin.address = originDto.address;
      origin.email = originDto.email;
      origin.latitude = originDto.latitude;
      origin.longitude = originDto.longitude;
      origin.references = originDto.references;
      origin.default = (originDto.default == 'SI' ? 1 : 0);
  
      // Aquí puedes rellenar los demás campos que no vienen del DTO
      origin.userId = 1; //modificar
      origin.status = 1;
  
      return origin;
    }
}
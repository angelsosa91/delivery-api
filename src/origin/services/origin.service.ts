import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Origin } from '../entities/origin.entity';
import { OriginDto } from '../dto/origin.dto';
import { UsersService } from 'src/auth/services/users.service';

@Injectable()
export class OriginService {
  constructor(
    @InjectRepository(Origin)
    private originRepository: Repository<Origin>,
    private readonly userService: UsersService
  ) {}

  // Métodos para Cliente
  async createOrigin(originDto: OriginDto, authId: string): Promise<Origin> {
    const userId = await this.getUserId(authId);
    const origin = this.mapToEntity(originDto, userId);
    return this.originRepository.save(origin);
  }

  async findAllOrigins(): Promise<Origin[]> {
    return this.originRepository.find();
  }

  async findOriginsByUser(authId: string): Promise<Origin[]> {
    const userId = await this.getUserId(authId);
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

  async updateOrigin(id: string, originDto: OriginDto, authId: string): Promise<Origin> {
    const userId = await this.getUserId(authId);
    const origin = await this.findOneOrigin(id);
    this.originRepository.merge(origin, this.mapToEntity(originDto, userId));
    return this.originRepository.save(origin);
  }

  async removeOrigin(id: string): Promise<void> {
    const origin = await this.findOneOrigin(id);
    await this.originRepository.remove(origin);
  }

  mapToEntity(originDto: OriginDto, userId: number): Origin {
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
      origin.userId = userId; //modificar
      origin.status = 1;
  
      return origin;
  }

  async getUserId(userId: string): Promise<number> {
    try {
      const user = await this.userService.findOne(userId);
  
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
  
      return user.userId;
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      throw error; // Re-lanzamos el error para que lo maneje el llamador
    }
  }
}
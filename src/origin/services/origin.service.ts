import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Origin } from '../entities/origin.entity';
import { OriginDto } from '../dto/origin.dto';
import { OriginResponseDto } from '../dto/origin-response.dto';
import { UsersService } from 'src/auth/services/users.service';
import { RabbitMQService } from 'src/queue/producer/rabbitmq.service';
import { ConfigService } from 'src/utils/services/config.service';

@Injectable()
export class OriginService {
  //constantes
  private readonly MQ_QUEUE: string = 'origin_queue';

  constructor(
    @InjectRepository(Origin)
    private originRepository: Repository<Origin>,
    private readonly userService: UsersService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly configService: ConfigService,
  ) {}

  // Métodos para Cliente
  async createOrigin(originDto: OriginDto, authId: string): Promise<void> {
    const userId = await this.getUserId(authId);
    const origin = this.mapToEntity(originDto, userId);
    const savedOrigin = await this.originRepository.save(origin);
    //to rabbitmq
    if (this.configService.isProduction()) {
      this.rabbitMQService.sendMessage(this.MQ_QUEUE, { id: savedOrigin.id });
    }
  }

  async updateOrigin(id: string, originDto: OriginDto, authId: string): Promise<void> {
    const userId = await this.getUserId(authId);
    const origin = await this.findOneOrigin(id);
    this.originRepository.merge(origin, this.mapToEntity(originDto, userId));
    this.originRepository.save(origin);
    //to rabbitmq
    if (this.configService.isProduction()) {
      this.rabbitMQService.sendMessage(this.MQ_QUEUE, { id: origin.id });
    }
  }

  async removeOrigin(id: string): Promise<void> {
    const origin = await this.findOneOrigin(id);
    //set status disable
    origin.status = 0
    this.originRepository.save(origin);
    //await this.originRepository.remove(origin);
    //to rabbitmq
    if (this.configService.isProduction()) {
      this.rabbitMQService.sendMessage(this.MQ_QUEUE, { id: origin.id });
    }
  }

  //retorna dto
  async getAllOrigins(): Promise<OriginResponseDto[]> {
    const origins = await this.originRepository.find({
      where: { status: 1 },
    });

    return origins.map(this.mapToDTO);
  }

  async getOriginsByUser(authId: string): Promise<OriginResponseDto[]> {
    const userId = await this.getUserId(authId);
    const origins = await this.originRepository.find({
      where: { userId: userId, status: 1 },
    });

    return origins.map(this.mapToDTO);
  }

  async getOriginById(id: string): Promise<OriginResponseDto> {
    const origin = await this.originRepository.findOne({
      where: { id: id, status: 1 },
    });
    
    if (!origin) {
      throw new NotFoundException(`Origen con ID ${id} no encontrado`);
    }
    
    return this.mapToDTO(origin);
  }

  //retorna entidades
  async findAllOrigins(): Promise<Origin[]> {
    return this.originRepository.find({
      where: { status: 1 },
    });
  }

  async findOriginsByUser(authId: string): Promise<Origin[]> {
    const userId = await this.getUserId(authId);
    return this.originRepository.find({
      where: { userId: userId, status: 1 },
    });
  }

  async findOneOrigin(id: string): Promise<Origin> {
    const origin = await this.originRepository.findOne({
      where: { id: id, status: 1 },
    });
    
    if (!origin) {
      throw new NotFoundException(`Origen con ID ${id} no encontrado`);
    }
    
    return origin;
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

  mapToDTO(entity: Origin): OriginResponseDto {
    const dto = new OriginResponseDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.phone = entity.phone;
    dto.address = entity.address;
    dto.email = entity.email;
    dto.latitude = entity.latitude;
    dto.longitude = entity.longitude;
    dto.references = entity.references;
    dto.default = entity.default === 1 ? 'SI' : 'NO'; // 👈 conversión lógica

    return dto;
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
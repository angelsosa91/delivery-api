import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Destination } from './entities/destination.entity';
import { DestinationTemp } from './entities/destination-temp.entity';
import { Origin } from './entities/origin.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { CreateDestinationTempDto } from './dto/create-destination-temp.dto';
import { CreateOriginDto } from './dto/create-origin.dto';
import { UpdateOriginDto } from './dto/update-origin.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
    
    @InjectRepository(DestinationTemp)
    private destinationTempRepository: Repository<DestinationTemp>,
    
    @InjectRepository(Origin)
    private originRepository: Repository<Origin>,
  ) {}

  // Métodos para Client
  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const cliente = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(cliente);
  }

  async findAllClients(): Promise<Client[]> {
    return this.clientRepository.find({
      relations: ['destination', 'destinationTemp'],
    });
  }

  async findClientsByUser(userId: number): Promise<Client[]> {
    return this.clientRepository.find({
      where: { idUsers: userId },
      relations: ['destination', 'destinationTemp'],
    });
  }

  async findOneClient(id: number): Promise<Client> {
    const cliente = await this.clientRepository.findOne({
      where: { id },
      relations: ['destination', 'destinationTemp'],
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return cliente;
  }

  async updateClient(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const cliente = await this.findOneClient(id);
    this.clientRepository.merge(cliente, updateClientDto);
    return this.clientRepository.save(cliente);
  }

  async removeClient(id: number): Promise<void> {
    const cliente = await this.findOneClient(id);
    await this.clientRepository.remove(cliente);
  }

  // Métodos para Destination
  async createDestination(createDestinationDto: CreateDestinationDto): Promise<Destination> {
    const detallePunto = this.destinationRepository.create(createDestinationDto);
    return this.destinationRepository.save(detallePunto);
  }

  async findAllDestinations(): Promise<Destination[]> {
    return this.destinationRepository.find({
      relations: ['client'],
    });
  }

  async findDestinationsByClient(clienteId: number): Promise<Destination[]> {
    return this.destinationRepository.find({
      where: { idClient: clienteId },
      relations: ['client'],
    });
  }

  async findOneDestination(id: number): Promise<Destination> {
    const detallePunto = await this.destinationRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    
    if (!detallePunto) {
      throw new NotFoundException(`Detalle de punto con ID ${id} no encontrado`);
    }
    
    return detallePunto;
  }

  async updateDestination(id: number, updateDestinationDto: UpdateDestinationDto): Promise<Destination> {
    const detallePunto = await this.findOneDestination(id);
    this.destinationRepository.merge(detallePunto, updateDestinationDto);
    return this.destinationRepository.save(detallePunto);
  }

  // Métodos para DestinationTemp
  async createDestinationTemp(createDestinationTempDto: CreateDestinationTempDto): Promise<DestinationTemp> {
    const detallePuntoTemp = this.destinationTempRepository.create(createDestinationTempDto);
    return this.destinationTempRepository.save(detallePuntoTemp);
  }

  async findDestinationsTempByToken(token: string): Promise<DestinationTemp[]> {
    return this.destinationTempRepository.find({
      where: { token },
      relations: ['cliente'],
    });
  }

  async removeDestinationTemp(id: number): Promise<void> {
    const detallePuntoTemp = await this.destinationTempRepository.findOne({
      where: { id },
    });
    
    if (!detallePuntoTemp) {
      throw new NotFoundException(`Detalle de punto temporal con ID ${id} no encontrado`);
    }
    
    await this.destinationTempRepository.remove(detallePuntoTemp);
  }

  // Métodos para Origin
  async createOrigin(createOriginDto: CreateOriginDto): Promise<Origin> {
    const origen = this.originRepository.create(createOriginDto);
    return this.originRepository.save(origen);
  }

  async findAllOrigins(): Promise<Origin[]> {
    return this.originRepository.find();
  }

  async findOriginsByUser(userId: number): Promise<Origin[]> {
    return this.originRepository.find({
      where: { idUsers: userId },
    });
  }

  async findOneOrigin(id: number): Promise<Origin> {
    const origen = await this.originRepository.findOne({
      where: { id },
    });
    
    if (!origen) {
      throw new NotFoundException(`Origen con ID ${id} no encontrado`);
    }
    
    return origen;
  }

  async updateOrigin(id: number, updateOriginDto: UpdateOriginDto): Promise<Origin> {
    const origen = await this.findOneOrigin(id);
    this.originRepository.merge(origen, updateOriginDto);
    return this.originRepository.save(origen);
  }

  async removeOrigin(id: number): Promise<void> {
    const origen = await this.findOneOrigin(id);
    await this.originRepository.remove(origen);
  }
}
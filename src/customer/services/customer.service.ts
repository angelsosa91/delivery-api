import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CustomerDto } from '../dto/customer.dto';
import { UsersService } from 'src/auth/services/users.service';
import { RabbitMQService } from 'src/queue/producer/rabbitmq.service';
import { ConfigService } from 'src/utils/services/config.service';

@Injectable()
export class CustomerService {
  //constantes
  private readonly MQ_QUEUE: string = 'customer_queue';

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly userService: UsersService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly configService: ConfigService
  ) {}

  // Métodos para Cliente
  async createCustomer(customerDto: CustomerDto, authId: string): Promise<void> {
    const userId = await this.getUserId(authId);
    const customer = this.mapToEntity(customerDto, userId);
    const savedCustomer = await this.customerRepository.save(customer);
    //to rabbitmq
    if (this.configService.isProduction()) {
      this.rabbitMQService.sendMessage(this.MQ_QUEUE, { id: savedCustomer.id });
    }
  }

  async updateCustomer(id: string, customerDto: CustomerDto, authId: string): Promise<void> {
    const userId = await this.getUserId(authId);
    const customer = await this.findOneCustomer(id);
    this.customerRepository.merge(customer, this.mapToEntity(customerDto, userId));
    this.customerRepository.save(customer);
    //to rabbitmq
    if (this.configService.isProduction()) {
      this.rabbitMQService.sendMessage(this.MQ_QUEUE, { id: customer.id });
    }
  }

  async removeCustomer(id: string): Promise<void> {
    const customer = await this.findOneCustomer(id);
    //set status disable
    customer.status = 0;
    this.customerRepository.save(customer);
    //await this.customerRepository.remove(customer);
    //to rabbitmq
    if (this.configService.isProduction()) {
      this.rabbitMQService.sendMessage(this.MQ_QUEUE, { id: customer.id });
    }
  }

  async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { status: 1 },
    });
  }

  async findCustomersByUser(authId: string): Promise<Customer[]> {
    const userId = await this.getUserId(authId);
    return this.customerRepository.find({
      where: { userId: userId, status: 1 },
    });
  }

  async findOneCustomer(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });
    
    if (!customer) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return customer;
  }

  mapToEntity(customerDto: CustomerDto, userId: number): Customer {
      const customer = new Customer();
  
      // Mapear los valores del DTO a la entidad
      customer.fullName = customerDto.fullName;
      customer.phone = customerDto.phone;
      customer.address = customerDto.address;
      customer.email = customerDto.email;
      customer.latitude = customerDto.latitude;
      customer.longitude = customerDto.longitude;
      customer.references = customerDto.references;
  
      // Aquí puedes rellenar los demás campos que no vienen del DTO
      customer.userId = userId;
      customer.status = 1;
  
      return customer;
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
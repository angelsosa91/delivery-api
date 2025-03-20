import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CustomerDto } from '../dto/customer.dto';
import { UsersService } from 'src/auth/services/users.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly userService: UsersService
  ) {}

  // Métodos para Cliente
  async createCustomer(customerDto: CustomerDto, authId: string): Promise<void> {
    const userId = await this.getUserId(authId);
    const customer = this.mapToEntity(customerDto, userId);
    this.customerRepository.save(customer);
  }

  async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findCustomersByUser(authId: string): Promise<Customer[]> {
    const userId = await this.getUserId(authId);
    return this.customerRepository.find({
      where: { userId: userId },
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

  async updateCustomer(id: string, customerDto: CustomerDto, authId: string): Promise<void> {
    const userId = await this.getUserId(authId);
    const customer = await this.findOneCustomer(id);
    this.customerRepository.merge(customer, this.mapToEntity(customerDto, userId));
    this.customerRepository.save(customer);
  }

  async removeCustomer(id: string): Promise<void> {
    const customer = await this.findOneCustomer(id);
    await this.customerRepository.remove(customer);
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
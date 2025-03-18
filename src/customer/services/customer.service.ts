import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CustomerDto } from '../dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  // Métodos para Cliente
  async createCustomer(customerDto: CustomerDto): Promise<Customer> {
    const customer = this.mapToCustomer(customerDto);
    return this.customerRepository.save(customer);
  }

  async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findCustomersByUser(userId: number): Promise<Customer[]> {
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

  async updateCustomer(id: string, customerDto: CustomerDto): Promise<Customer> {
    const customer = await this.findOneCustomer(id);
    this.customerRepository.merge(customer, this.mapToCustomer(customerDto));
    return this.customerRepository.save(customer);
  }

  async removeCustomer(id: string): Promise<void> {
    const customer = await this.findOneCustomer(id);
    await this.customerRepository.remove(customer);
  }

  mapToCustomer(customerDto: CustomerDto): Customer {
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
      customer.userId = 1; //modificar
      customer.status = 1;
  
      return customer;
    }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderMovement } from './entities/order-movement.entity';
import { OrderReference } from './entities/order-reference.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderMovementDto } from './dto/create-order-movement.dto';
import { UpdateOrderMovementDto } from './dto/update-order-movement.dto';
import { CreateOrderReferenceDto } from './dto/create-order-reference.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    
    @InjectRepository(OrderMovement)
    private orderMovementRepository: Repository<OrderMovement>,
    
    @InjectRepository(OrderReference)
    private orderReferenceRepository: Repository<OrderReference>,
  ) {}

  // Métodos para Pedidos
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const pedido = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(pedido);
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'orderMovement'],
    });
  }

  async findOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { idUser: userId },
      relations: ['orderMovement'],
    });
  }

  async findOneOrder(id: number): Promise<Order> {
    const pedido = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderMovement', 'orderReference'],
    });
    
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    
    return pedido;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOneOrder(id);
    this.orderRepository.merge(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async removePedido(id: number): Promise<void> {
    const order = await this.findOneOrder(id);
    await this.orderRepository.remove(order);
  }

  // Métodos para PedidosMovimiento
  async createOrderMovement(createOrderMovementDto: CreateOrderMovementDto): Promise<OrderMovement> {
    // Verificar si existe el pedido
    await this.findOneOrder(createOrderMovementDto.idPedidos);
    
    const pedidoMovimiento = this.orderMovementRepository.create(createOrderMovementDto);
    return this.orderMovementRepository.save(pedidoMovimiento);
  }

  async findAllOrderMovements(): Promise<OrderMovement[]> {
    return this.orderMovementRepository.find({
      relations: ['user', 'order'],
    });
  }

  async findOrderMovementsByUser(userId: number): Promise<OrderMovement[]> {
    return this.orderMovementRepository.find({
      where: { idUsers: userId },
      relations: ['pedido'],
    });
  }

  async findOneOrderMovements(id: number): Promise<OrderMovement> {
    const orderMovement = await this.orderMovementRepository.findOne({
      where: { id },
      relations: ['user', 'pedido'],
    });
    
    if (!orderMovement) {
      throw new NotFoundException(`Movimiento de Pedido con ID ${id} no encontrado`);
    }
    
    return orderMovement;
  }

  async updateOrderMovements(id: number, updateOrderMovementDto: UpdateOrderMovementDto): Promise<OrderMovement> {
    const orderMovement = await this.findOneOrderMovements(id);
    this.orderMovementRepository.merge(orderMovement, updateOrderMovementDto);
    return this.orderMovementRepository.save(orderMovement);
  }

  // Métodos para PedidosReferencia
  async createOrderReferences(createOrderReferenceDto: CreateOrderReferenceDto): Promise<OrderReference> {
    // Verificar si existe el pedido
    await this.findOneOrder(createOrderReferenceDto.idPedidos);
    
    const orderReference = this.orderReferenceRepository.create(createOrderReferenceDto);
    return this.orderReferenceRepository.save(orderReference);
  }

  async findOrderReferencesByOrder(pedidoId: number): Promise<OrderReference[]> {
    return this.orderReferenceRepository.find({
      where: { idPedidos: pedidoId },
      relations: ['pedido'],
    });
  }
}
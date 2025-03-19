import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderReference } from '../entities/order-reference.entity';
import { OrderDto } from '../dto/order.dto';
import { OrderReferenceDto } from '../dto/order-reference.dto';
import { UsersService } from '../../auth/services/users.service';
import { GoogleMapsService } from '../../utils/services/google-maps.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderReference)
    private orderReferenceRepository: Repository<OrderReference>,

    private readonly userService: UsersService,
    private readonly googleMapsService: GoogleMapsService
  ) {}

  // Métodos para Pedidos
  async createOrder(orderDto: OrderDto, authId: string): Promise<Order> {
    const userId = await this.getUserId(authId);
    const order = this.mapToEntity(orderDto, userId);
    return this.orderRepository.save(order);
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['orderReferences'],
    });
  }

  async findOrdersByUser(authId: string): Promise<Order[]> {
    const userId = await this.getUserId(authId);
    return this.orderRepository.find({
      where: { userId: userId },
      relations: ['orderReferences'],
    });
  }

  async findOneOrder(id: string): Promise<Order> {
    const pedido = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderReferences'],
    });
    
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    
    return pedido;
  }

  async updateOrder(id: string, orderDto: OrderDto, authId: string): Promise<Order> {
    const userId = await this.getUserId(authId);
    const order = await this.findOneOrder(id);
    this.orderRepository.merge(order, this.mapToEntity(orderDto, userId));
    return this.orderRepository.save(order);
  }

  async removeOrder(id: string): Promise<void> {
    const pedido = await this.findOneOrder(id);
    await this.orderRepository.remove(pedido);
  }

  // Métodos para PedidosReferencia
  async createOrderReference(orderReferenceDto: OrderReferenceDto): Promise<OrderReference> {
    // Verificar si existe el pedido
    await this.findOneOrder(orderReferenceDto.orderId);
    
    const orderReference = this.mapToOrderReference(orderReferenceDto);
    return this.orderReferenceRepository.save(orderReference);
  }

  async findOrderReferenceByOrder(orderId: string): Promise<OrderReference[]> {
    return this.orderReferenceRepository.find({
      where: { orderId: orderId },
      relations: ['order'],
    });
  }

  mapToEntity(orderDto: OrderDto, userId: number): Order {
    const order = new Order();

    // Mapear los valores del DTO a la entidad
    order.receiverName = orderDto.receiverName;
    order.receiverPhone = orderDto.receiverPhone;
    order.description = orderDto.description;
    order.paymentMethod = orderDto.paymentMethod;
    order.senderPhone = orderDto.senderPhone;
    order.latitudeFrom = orderDto.latitudeFrom;
    order.longitudeFrom = orderDto.longitudeFrom;
    order.latitudeTo = orderDto.latitudeTo;
    order.longitudeTo = orderDto.longitudeTo;
    order.comments = orderDto.comments;
    order.withReturn = parseInt(orderDto.withReturn, 10); // Convertir a número si es necesario
    order.scheduled = orderDto.scheduled;
    order.scheduledDate = new Date(orderDto.scheduledDate);
    order.invoice = orderDto.invoice;
    order.invoiceExempt = orderDto.invoiceExempt;
    order.invoiceDoc = orderDto.invoiceDoc;
    order.invoiceName = orderDto.invoiceName;
    order.wallet = orderDto.wallet;
    order.bank = orderDto.bank;

    // Aquí puedes rellenar los demás campos que no vienen del DTO
    order.status = 'Pendiente'; // Por ejemplo, el estado por defecto
    order.registerDate = new Date(); // Fecha de registro actual
    order.distance = '0'; // Distancia por defecto
    order.amount = 0; // Monto por defecto
    order.rating = 0; // Rating por defecto
    order.deliveryTime = '0'; // Tiempo de entrega por defecto
    order.discount = 0; // Descuento por defecto
    order.orderType = 'S'; // Tipo de orden por defecto
    order.senderVip = 0; // Sender VIP por defecto
    order.senderCompany = 0; // Sender Company por defecto
    order.userId = userId;

    return order;
  }

  mapToOrderReference(orderReferenceDto: OrderReferenceDto): OrderReference {
    const orderReference = new OrderReference();

    // Mapear los valores del DTO a la entidad
    orderReference.orderId = orderReferenceDto.orderId;
    orderReference.documentNumber = orderReferenceDto.documentNumber;
    orderReference.scheduledDate = new Date(orderReferenceDto.scheduledDate);
    orderReference.observation = orderReferenceDto.observation;
    orderReference.image = orderReferenceDto.image;

    // Aquí puedes rellenar los demás campos que no vienen del DTO
    orderReference.status = 'PENDIENTE'; // Por ejemplo, el estado por defecto

    return orderReference;
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

  async calcularDistancia(origins: string, destinations: string) {
    const distanceMatrix = await this.googleMapsService.getDistanceMatrix(
      origins,
      destinations,
    );
    return distanceMatrix;
  }
}
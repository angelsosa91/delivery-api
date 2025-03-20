import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderReference } from '../entities/order-reference.entity';
import { OrderDto } from '../dto/order.dto';
import { OrderReferenceDto } from '../dto/order-reference.dto';
import { UsersService } from '../../auth/services/users.service';
import { GoogleMapsService } from '../../utils/services/google-maps.service';
import { CustomerService } from 'src/customer/services/customer.service';
import { OrderPoint } from '../entities/order-points.entity';

@Injectable()
export class OrderService {
  //constantes
  private readonly SERVICE_TYPE: string = 'DELIVERY';

  //constructor
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderReference)
    private orderReferenceRepository: Repository<OrderReference>,
    @InjectRepository(OrderPoint)
    private orderPointRepository: Repository<OrderPoint>,

    private readonly userService: UsersService,
    private readonly customerService: CustomerService,
    private readonly googleMapsService: GoogleMapsService
  ) {}

  // Crear Orden
  async createOrder(orderDto: OrderDto, authId: string): Promise<Order> {
    const { order } = await this.prepareOrderData(orderDto, authId);
    const savedOrder = await this.orderRepository.save(order);
    await this.saveOrderReferences(savedOrder, orderDto.references);
    return savedOrder;
  }

  // Actualizar Orden
  async updateOrder(id: string, orderDto: OrderDto, authId: string): Promise<Order> {
    const { order } = await this.prepareOrderData(orderDto, authId);
    const existingOrder = await this.findOneOrder(id);
    this.orderRepository.merge(existingOrder, order);
    const updatedOrder = await this.orderRepository.save(existingOrder);
    await this.saveOrderReferences(updatedOrder, orderDto.references);
    return updatedOrder;
  }

  // Método auxiliar para preparar datos comunes
  private async prepareOrderData(orderDto: OrderDto, authId: string): Promise<{ order: Order; distance: number; amount: number }> {
    await this.validateCustomerInputs(orderDto);
    const origin = orderDto.latitudeFrom + ',' + orderDto.longitudeFrom;
    const destination = orderDto.latitudeTo + ',' + orderDto.longitudeTo;
    const data = await this.calcularDistancia(origin, destination);
    const distance = Math.round(Math.floor(data.rows[0].elements[0].distance.value / 1000));
    const amount = this.calcularMonto(distance, this.SERVICE_TYPE);
    const userId = await this.getUserId(authId);
    const order = this.mapToEntity(orderDto, userId, distance, amount);
    return { order, distance, amount };
  }

  // Método auxiliar para guardar o actualizar referencias
  private async saveOrderReferences(order: Order, referencesDto: OrderReferenceDto[]): Promise<void> {
    await this.deleteReferencesByOrder(order.id);
    if (referencesDto && referencesDto.length > 0) {
      const orderReferences = referencesDto.map(referenceDto => {
        const orderReference = this.mapToOrderReference(referenceDto);
        orderReference.order = order;
        return orderReference;
      });
      await this.orderReferenceRepository.save(orderReferences);
    }
  }

  async removeOrder(id: string): Promise<void> {
    const pedido = await this.findOneOrder(id);
    await this.orderRepository.remove(pedido);
  }

  async deleteReferencesByOrder(orderId: string): Promise<void> {
    // Buscar todas las referencias asociadas a la orden
    const references = await this.orderReferenceRepository.find({
        where: { orderId: orderId },
    });

    // Si hay referencias, eliminarlas
    if (references.length > 0) {
        await this.orderReferenceRepository.remove(references);
    }
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

  async validateCustomerInputs(orderDto: OrderDto){
    // Validar si el customerId está presente
    if (orderDto.customerId) {
      // Verificar si el customerId es válido y existe en la base de datos
      const customer = await this.customerService.findOneCustomer(orderDto.customerId);
      if (!customer) {
        throw new Error('Cliente no encontrado');
      }
      //rellenar campos
      orderDto.receiverName = !orderDto.receiverName ? customer.fullName : orderDto.receiverName; 
      orderDto.receiverPhone = !orderDto.receiverPhone ? customer.phone : orderDto.receiverPhone;
      orderDto.latitudeFrom = !orderDto.latitudeFrom ? customer.latitude : orderDto.latitudeFrom;
      orderDto.longitudeFrom = !orderDto.longitudeFrom ? customer.longitude : orderDto.longitudeFrom;
    } else {
      // Si no hay customerId, validar que los campos requeridos estén presentes
      if (
        !orderDto.receiverName ||
        !orderDto.receiverPhone ||
        !orderDto.latitudeFrom ||
        !orderDto.longitudeFrom
      ) {
        throw new Error(
          'Si no se proporciona un customerId, los campos receiverName, receiverPhone, latitudeFrom y longitudeFrom son obligatorios',
        );
      }
    }
  }

  mapToEntity(orderDto: OrderDto, userId: number, distance: number, amount: number): Order {
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
    order.withReturn = (orderDto.withReturn == 'SI' ? 1 : 0); // Convertir a número si es necesario
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
    order.distance = distance; // Distancia por defecto
    order.amount = amount; // Monto por defecto
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
    orderReference.documentNumber = orderReferenceDto.documentNumber;
    orderReference.scheduledDate = new Date(orderReferenceDto.scheduledDate);
    orderReference.observation = orderReferenceDto.observation;

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

  calcularMonto(distancia: number, tipoServicio: string): number {
    let monto: number;
    // Convertir a kilómetros (si es necesario)
    // Lógica de cálculo basada en la distancia
    if (distancia <= 2) {
      monto = 10000;
    } else if (distancia > 2 && distancia < 7) {
      monto = 15000;
    } else if (distancia >= 7 && distancia < 11) {
      monto = 20000;
    } else if (distancia >= 11 && distancia < 14) {
      monto = 25000;
    } else if (distancia > 13) {
      const dist1 = distancia - 13;
      monto = dist1 * 2000 + 25000;
    } else {
      monto = 0; // Valor por defecto en caso de distancia no válida
    }

    // Lógica de cálculo basada en el tipo de servicio
    switch (tipoServicio) {
      case 'COBRANZAS':
        monto += 5000;
        break;
      case 'GESTIONES BANCARIAS':
        monto += 10000;
        break;
      case 'GESTIONES ADUANERAS':
        monto += 30000;
        break;
      case 'GESTIONES PUBLICAS':
        monto += 30000;
        break;
      case 'COMPRAS':
        monto += 10000;
        break;
      case 'GESTION PERSONAL':
        monto += 10000;
        break;
      default:
        // No se agrega nada si el tipo de servicio no coincide
        break;
    }

    return monto;
  }
}
import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository, InjectEntityManager  } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderReference } from '../entities/order-reference.entity';
import { OrderDto } from '../dto/order.dto';
import { OrderReferenceDto } from '../dto/order-reference.dto';
import { UsersService } from '../../auth/services/users.service';
import { CustomerService } from 'src/customer/services/customer.service';
import { OrderPoint } from '../entities/order-points.entity';
import { OrderBudgetDto } from '../dto/order-budget.dto';
import { OrderBudgetResponseDto } from '../dto/order-budget-response.dto';
import { OrderBudget } from '../entities/order-budget.entity';
import { Transactional } from '../../utils/decorators/transactional';
import { CalculationService } from '../../settings/services/calculation.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { ValidationService } from 'src/utils/services/validation.service';
import { OriginService } from 'src/origin/services/origin.service';
import { RabbitMQService } from 'src/qeue/producer/rabbitmq.service';
import { MailService } from 'src/mail/services/mail.service';

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  //constantes
  private readonly SERVICE_TYPE: string = 'DELIVERY';
  private readonly SERVICE_STATUS: string = 'Pendiente';
  private readonly REFERENCE_STATUS: string = 'PENDIENTE';
  private readonly BUDGET_STATUS: string = 'CONSULTADO';
  private readonly MQ_QEUE: string = 'orders_qeue';

  //constructor
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderReference)
    private orderReferenceRepository: Repository<OrderReference>,
    @InjectRepository(OrderPoint)
    private orderPointRepository: Repository<OrderPoint>,
    @InjectRepository(OrderBudget)
    private orderBudgetRepository: Repository<OrderBudget>,

    private readonly userService: UsersService,
    private readonly customerService: CustomerService,
    private readonly originService: OriginService,
    private readonly calculationService: CalculationService,
    private readonly validationService: ValidationService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly mailService: MailService,
  ) {}

  // Crear Orden
  @Transactional()
  async createOrder(orderDto: OrderDto, authId: string): Promise<void> {
    //validate env limit
    await this.checkEnvLimitPerOrder(authId);
    //prepare data
    const { order } = await this.prepareOrderData(orderDto, authId);
    //const savedOrder = await this.orderRepository.save(order);
    const savedOrder = await this.entityManager.save(Order, order);
    await this.saveOrderReferences(savedOrder, orderDto.references);
    await this.saveOrderPoints(savedOrder);
    //return savedOrder;
    if(savedOrder.directEvent === 'SI'){
      this.rabbitMQService.sendMessage(this.MQ_QEUE, new Object({ id: savedOrder.id }));
    } else {
      const user = await this.userService.findOne(authId);
      this.mailService.sendMail(user.email, 'NUEVA ORDEN DE API GENERADA', 'email', new Object({ user: user.fullName, subject: 'NUEVA ORDEN GENERADA', text1: 'Tienes una nueva orden de delivery generada desde el servicio de API', text2: 'ID:', text3: savedOrder.id, text4: 'Para continuar con el proceso debes confirmar', text5: 'la orden desde la plataforma Business', text6: 'Muchas Gracias', link: '#', target: '', id: savedOrder.id }));
    }
  }

  // Actualizar Orden
  @Transactional()
  async updateOrder(id: string, orderDto: OrderDto, authId: string): Promise<void> {
    //validate env limit
    await this.checkEnvLimitPerOrder(authId);
    //get data
    const existingOrder = await this.findOneOrder(id);
    if(existingOrder.directEvent === 'SI'){
      throw new Error('No puede actualizar una orden ya enviada. Gestione con ADM del Proveedor');
    }
    //continue
    const { order } = await this.prepareOrderData(orderDto, authId);
    this.orderRepository.merge(existingOrder, order);
    const updatedOrder = await this.orderRepository.save(existingOrder);
    await this.saveOrderReferences(updatedOrder, orderDto.references);
    await this.saveOrderPoints(updatedOrder);
    //return updatedOrder;
  }

  // Método auxiliar para preparar datos comunes
  private async prepareOrderData(orderDto: OrderDto, authId: string): Promise<{ order: Order; distance: number; amount: number }> {
    await this.validateCustomerInputs(orderDto);
    const origin = orderDto.latitudeFrom + ',' + orderDto.longitudeFrom;
    const destination = orderDto.latitudeTo + ',' + orderDto.longitudeTo;
    const data = await this.calculationService.calculateDistance(origin, destination);
    const distance = Math.round(Math.floor(data.rows[0].elements[0].distance.value / 1000));
    const durationText = data.rows[0].elements[0].duration.text;
    const amount = await this.calculationService.calculateAmount(distance, this.SERVICE_TYPE, orderDto.withReturn, orderDto.wallet, orderDto.bank);
    const userId = await this.userService.getUserId(authId);
    const order = this.mapToEntity(orderDto, authId, userId, distance, amount, durationText);
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
      //await this.orderReferenceRepository.save(orderReferences);
      await this.entityManager.save(OrderReference, orderReferences);
    }
  }

  // Método auxiliar para guardar o actualizar puntos
  private async saveOrderPoints(order: Order): Promise<void> {
    let customer = new Customer();
    if (order.customerId) {
      customer = await this.customerService.findOneCustomer(order.customerId);
    } 
    await this.deletePointsByOrder(order.id);
    const orderPoint = this.mapToOrderPoint(order, customer);
    orderPoint.order = order;
    //await this.orderPointRepository.save(orderPoint);
    await this.entityManager.save(OrderPoint, orderPoint);
  }

  @Transactional()
  async removeOrder(id: string): Promise<void> {
    //const pedido = await this.entityManager.findOne(Order, id);
    const pedido = await this.findOneOrder(id);
    //await this.orderRepository.remove(pedido);
    await this.entityManager.remove(Order, pedido);
    //await this.entityManager.delete(Order, { orderId: id });
  }

  async deleteReferencesByOrder(orderId: string): Promise<void> {
    // Buscar todas las referencias asociadas a la orden
    const references = await this.orderReferenceRepository.find({
        where: { orderId: orderId },
    });
    /*
    const references = await this.entityManager.find(OrderReference, {
      where: { orderId },
    });
    */  

    // Si hay referencias, eliminarlas
    if (references.length > 0) {
        //await this.orderReferenceRepository.remove(references);
        await this.entityManager.remove(OrderReference, references);
    }
  }

  async deletePointsByOrder(orderId: string): Promise<void> {
    // Buscar todas las referencias asociadas a la orden
    const points = await this.orderPointRepository.find({
        where: { orderId: orderId },
    });
    /*
    const points = await this.entityManager.find(OrderPoint, {
      where: { orderId },
    });
    */

    // Si hay referencias, eliminarlas
    if (points.length > 0) {
        //await this.orderPointRepository.remove(points);
        await this.entityManager.remove(OrderPoint, points);
    }
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['orderReferences'],
    });
  }

  async findOrdersByUser(authId: string): Promise<Order[]> {
    const userId = await this.userService.getUserId(authId);
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

  async countBudgetByUserId(userId: string): Promise<number> {
    const count = await this.orderBudgetRepository.count({
      where: { userId }, // Filtra por user_id
    });

    return count;
  }

  async countOrderByAuthId(authId: string): Promise<number> {
    const count = await this.orderRepository.count({
      where: { authId }, // Filtra por auth_id
    });

    return count;
  }

  async getBudget(orderBudgetDto: OrderBudgetDto, authId: string): Promise<OrderBudgetResponseDto> {
    //validate env limit
    await this.checkEnvLimitPerBudget(authId);
    //continue
    const origin = orderBudgetDto.latitudeFrom + ',' + orderBudgetDto.longitudeFrom;
    const destination = orderBudgetDto.latitudeTo + ',' + orderBudgetDto.longitudeTo;
    const data = await this.calculationService.calculateDistance(origin, destination);
    const distance = Math.round(Math.floor(data.rows[0].elements[0].distance.value / 1000));
    const distanceText = data.rows[0].elements[0].distance.text;
    const amount = await this.calculationService.calculateAmount(distance, this.SERVICE_TYPE, orderBudgetDto.withReturn, orderBudgetDto.wallet, orderBudgetDto.bank);
    //map to
    const budget = this.mapToOrderBudget(orderBudgetDto, authId, distance, amount);
    //guardar transaccion de consulta
    await this.orderBudgetRepository.save(budget);
    //response
    return new OrderBudgetResponseDto(distanceText, amount);
  }

  async validateCustomerInputs(orderDto: OrderDto){
    // Validar si el customerId está presente
    if (!this.validationService.isObjectEmptyOrNull(orderDto.customerId)) {
      // Verificar si el customerId es válido y existe en la base de datos
      const customer = await this.customerService.findOneCustomer(orderDto.customerId);
      if (!customer) {
        throw new Error('Cliente no encontrado');
      }
      //rellenar campos
      orderDto.receiverName = !orderDto.receiverName ? customer.fullName : orderDto.receiverName; 
      orderDto.receiverPhone = !orderDto.receiverPhone ? customer.phone : orderDto.receiverPhone;
      orderDto.latitudeTo = !orderDto.latitudeTo ? customer.latitude : orderDto.latitudeTo;
      orderDto.longitudeTo = !orderDto.longitudeTo ? customer.longitude : orderDto.longitudeTo;
    } else {
      // Si no hay customerId, validar que los campos requeridos estén presentes
      if (
        !orderDto.receiverName ||
        !orderDto.receiverPhone ||
        !orderDto.latitudeTo ||
        !orderDto.longitudeTo
      ) {
        throw new Error(
          'Si no se proporciona un customerId, los campos receiverName, receiverPhone, latitudeTo y longitudeTo son obligatorios',
        );
      }
    }
    // Validar si el originId está presente
    if (!this.validationService.isObjectEmptyOrNull(orderDto.originId)) {
      // Verificar si el originId es válido y existe en la base de datos
      const origin = await this.originService.findOneOrigin(orderDto.originId);
      if (!origin) {
        throw new Error('Origen no encontrado');
      }
      //rellenar campos
      orderDto.latitudeFrom = !orderDto.latitudeFrom ? origin.latitude : orderDto.latitudeFrom; 
      orderDto.longitudeFrom = !orderDto.longitudeFrom ? origin.longitude : orderDto.longitudeFrom;
    } else {
      // Si no hay originId, validar que los campos requeridos estén presentes
      if (
        !orderDto.latitudeFrom ||
        !orderDto.longitudeFrom
      ) {
        throw new Error(
          'Si no se proporciona un originId, los campos latitudeFrom y longitudeFrom son obligatorios',
        );
      }
    }
  }

  mapToEntity(orderDto: OrderDto, authId: string, userId: number, distance: number, amount: number, durationText: string): Order {
    const order = new Order();

    // Mapear los valores del DTO a la entidad
    order.authId = authId;
    order.customerId = orderDto.customerId;
    order.receiverName = orderDto.receiverName;
    order.receiverPhone = orderDto.receiverPhone;
    order.description = orderDto.description;
    order.paymentMethod = orderDto.paymentMethod;
    order.senderPhone = orderDto.senderPhone;
    order.originId = orderDto.originId;
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
    order.directEvent = orderDto.directEvent;
    order.deliveryTime = durationText;
    order.distance = distance;
    order.amount = amount;
    order.userId = userId;

    // Aquí puedes rellenar los demás campos que no vienen del DTO
    order.status = this.SERVICE_STATUS; // Por ejemplo, el estado por defecto
    order.serviceType = this.SERVICE_TYPE; // Por ejemplo, el servicio por defecto
    order.rating = 0; // Rating por defecto
    order.discount = 0; // Descuento por defecto
    order.orderType = 'S'; // Tipo de orden por defecto
    order.senderVip = 0; // Sender VIP por defecto
    order.senderCompany = 0; // Sender Company por defecto

    return order;
  }

  mapToOrderReference(orderReferenceDto: OrderReferenceDto): OrderReference {
    const orderReference = new OrderReference();

    // Mapear los valores del DTO a la entidad
    orderReference.documentNumber = orderReferenceDto.documentNumber;
    orderReference.scheduledDate = new Date(orderReferenceDto.scheduledDate);
    orderReference.observation = orderReferenceDto.observation;

    // Aquí puedes rellenar los demás campos que no vienen del DTO
    orderReference.status = this.REFERENCE_STATUS; // Por ejemplo, el estado por defecto

    return orderReference;
  }

  mapToOrderPoint(order: Order, customer: Customer): OrderPoint {
    const orderPoint = new OrderPoint();

    // Mapear los valores del DTO a la entidad
    orderPoint.customerId = order.customerId;
    orderPoint.originId = order.originId;
    orderPoint.orderId = order.id;
    orderPoint.name = order.receiverName;
    orderPoint.address = this.validationService.isObjectEmptyOrNull(customer) ? order.description : customer.address;
    orderPoint.phone = order.receiverPhone;
    orderPoint.latitude = order.latitudeTo;
    orderPoint.longitude = order.longitudeTo;
    orderPoint.scheduledDate = order.scheduledDate;
    orderPoint.comments = order.comments;
    orderPoint.amount = order.amount;
    orderPoint.distance = order.distance;
    orderPoint.deliveryTime = order.deliveryTime;

    // Aquí puedes rellenar los demás campos que no vienen del DTO
    orderPoint.service = this.SERVICE_TYPE;
    orderPoint.status = this.SERVICE_STATUS; // Por ejemplo, el estado por defecto

    return orderPoint;
  }

  mapToOrderBudget(orderBudgetDto: OrderBudgetDto, authId, distance, amount): OrderBudget {
    const orderBudget = new OrderBudget();

    // Mapear los valores del DTO a la entidad
    orderBudget.userId = authId;
    orderBudget.latitudeFrom = orderBudgetDto.latitudeFrom;
    orderBudget.longitudeFrom = orderBudgetDto.longitudeFrom;
    orderBudget.latitudeTo = orderBudgetDto.latitudeTo;
    orderBudget.longitudeTo = orderBudgetDto.longitudeTo;
    orderBudget.distance = distance;
    orderBudget.amount = amount;
    orderBudget.withReturn = (orderBudgetDto.withReturn == 'SI' ? 1 : 0);
    orderBudget.wallet = orderBudgetDto.wallet;
    orderBudget.bank = orderBudgetDto.bank;

    // Aquí puedes rellenar los demás campos que no vienen del DTO
    orderBudget.status = this.BUDGET_STATUS;

    return orderBudget;
  }

  async checkEnvLimitPerOrder(authId: string){
    if (process.env.NODE_ENV !== 'production') {
      const qtyOrder = await this.countOrderByAuthId(authId);
      // Límite de 50 transacciones en sandbox
      const limit = 50;
      // Verificar si se ha alcanzado el límite
      if (qtyOrder >= limit) {
        throw new Error(
          `Ha alcanzado el límite de ${limit} transacciones en el entorno de pruebas. ` +
          `Transacciones actuales: Órdenes (${qtyOrder}).`,
        );
      }
    }
  }

  async checkEnvLimitPerBudget(authId: string){
    if (process.env.NODE_ENV !== 'production') {
      const qtyBudget = await this.countBudgetByUserId(authId);
      // Límite de 50 transacciones en sandbox
      const limit = 50;
      // Verificar si se ha alcanzado el límite
      if (qtyBudget >= limit) {
        throw new Error(
          `Ha alcanzado el límite de ${limit} transacciones en el entorno de pruebas. ` +
          `Presupuestos actuales: (${qtyBudget}).`,
        );
      }
    }
  }
}
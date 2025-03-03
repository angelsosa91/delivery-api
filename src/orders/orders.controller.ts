import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards,
    Query
  } from '@nestjs/common';
  import { OrdersService } from './orders.service';
  import { CreateOrderDto } from './dto/create-order.dto';
  import { UpdateOrderDto } from './dto/update-order.dto';
  import { CreateOrderMovementDto } from './dto/create-order-movement.dto';
  import { UpdateOrderMovementDto } from './dto/update-order-movement.dto';
  import { CreateOrderReferenceDto } from './dto/create-order-reference.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('pedidos')
  @UseGuards(JwtAuthGuard)
  export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
  
    // Endpoints para Pedidos
    @Post()
    createPedido(@Body() createOrderDto: CreateOrderDto) {
      return this.ordersService.createOrder(createOrderDto);
    }
  
    @Get()
    findAllPedidos(@Query('userId') userId?: number) {
      if (userId) {
        return this.ordersService.findOrdersByUser(userId);
      }
      return this.ordersService.findAllOrders();
    }
  
    @Get(':id')
    findOnePedido(@Param('id') id: string) {
      return this.ordersService.findOneOrder(+id);
    }
  
    @Patch(':id')
    updatePedido(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
      return this.ordersService.updateOrder(+id, updateOrderDto);
    }
  
    @Delete(':id')
    removePedido(@Param('id') id: string) {
      return this.ordersService.removePedido(+id);
    }
  
    // Endpoints para PedidosMovimiento
    @Post('movimientos')
    createPedidoMovimiento(@Body() createOrderMovementDto: CreateOrderMovementDto) {
      return this.ordersService.createOrderMovement(createOrderMovementDto);
    }
  
    @Get('movimientos')
    findAllPedidosMovimientos(@Query('userId') userId?: number) {
      if (userId) {
        return this.ordersService.findOrderMovementsByUser(userId);
      }
      return this.ordersService.findAllOrderMovements();
    }
  
    @Get('movimientos/:id')
    findOnePedidoMovimiento(@Param('id') id: string) {
      return this.ordersService.findOneOrderMovements(+id);
    }
  
    @Patch('movimientos/:id')
    updatePedidoMovimiento(
      @Param('id') id: string, 
      @Body() updateOrderMovementDto: UpdateOrderMovementDto
    ) {
      return this.ordersService.updateOrderMovements(+id, updateOrderMovementDto);
    }
  
    // Endpoints para PedidosReferencia
    @Post('referencias')
    createPedidoReferencia(@Body() createOrderReferenceDto: CreateOrderReferenceDto) {
      return this.ordersService.createOrderReferences(createOrderReferenceDto);
    }
  
    @Get('referencias/pedido/:pedidoId')
    findPedidosReferenciasByPedido(@Param('pedidoId') pedidoId: string) {
      return this.ordersService.findOrderReferencesByOrder(+pedidoId);
    }
  }
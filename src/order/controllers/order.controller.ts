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
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
  import { OrderService } from '../services/order.service';
  import { OrderDto } from '../dto/order.dto';
  import { OrderReferenceDto } from '../dto/order-reference.dto';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  
  @ApiTags('Pedidos')
  @Controller('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class OrderController {
    constructor(private readonly orderService: OrderService) {}
  
    // Endpoints para Pedidos
    @Post()
    createOrder(@Body() orderDto: OrderDto) {
      return this.orderService.createOrder(orderDto);
    }
  
    @Get()
    findAllOrders(@Query('userId') userId?: number) {
      if (userId) {
        return this.orderService.findOrdersByUser(userId);
      }
      return this.orderService.findAllOrders();
    }
  
    @Get(':id')
    findOneOrder(@Param('id') id: string) {
      return this.orderService.findOneOrder(id);
    }
  
    @Patch(':id')
    updateOrder(@Param('id') id: string, @Body() orderDto: OrderDto) {
      return this.orderService.updateOrder(id, orderDto);
    }
  
    @Delete(':id')
    removeOrder(@Param('id') id: string) {
      return this.orderService.removeOrder(id);
    }
  
    // Endpoints para Referencias
    @Post('references')
    createOrderReference(@Body() orderReferenceDto: OrderReferenceDto) {
      return this.orderService.createOrderReference(orderReferenceDto);
    }
  
    @Get('references/:orderId')
    findOrderReferencesByOrder(@Param('orderId') orderId: string) {
      return this.orderService.findOrderReferenceByOrder(orderId);
    }
  }
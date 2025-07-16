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
  import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiNotFoundResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
  import { OrderService } from '../services/order.service';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { GetUser } from '../../auth/decorators/get-user.decorator';
  import { OrderDto } from '../dto/order.dto';
  import { OrderBudgetDto } from '../dto/order-budget.dto';
  import { OrderTrackingDto } from '../dto/order-tracking.dto';
  import { OrderCreatedDto } from '../dto/order-created.dto';
  import { OrderBudgetResponseDto } from '../dto/order-budget-response.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
  
  @ApiTags('Pedidos')
  @Controller('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class OrderController {
    constructor(private readonly orderService: OrderService) {}
  
    // Endpoints para Pedidos
    @Post()
    @ApiOkResponse({
      description: 'Orden creada exitosamente',
      type: OrderCreatedDto,
    })
    createOrder(
      @GetUser('id') authId: string, 
      @Body() orderDto: OrderDto
    ) {
      return this.orderService.createOrder(orderDto, authId);
    }
  
    @Get()
    @ApiOkResponse({
      description: 'Ordenes encontradas',
      type: OrderResponseDto,
      isArray: true
    })
    //findAllOrders(@Query('userId') userId?: number) {
    findAllOrders(@GetUser('id') authId: string, 
                  @Query('sync') sync: string = 'SI') { 
      if (authId) {
        return this.orderService.getOrdersByUser(authId, sync);
      }
      return this.orderService.getAllOrders(sync);
    }
  
    @Get(':id')
    @ApiOkResponse({
      description: 'Orden encontrada',
      type: OrderResponseDto,
    })
    @ApiNotFoundResponse({ description: 'Orden no encontrada' })
    findOneOrder(@Param('id') id: string) {
      return this.orderService.getOrderById(id);
    }
  
    @Patch(':id')
    updateOrder(
      @Param('id') id: string, 
      @Body() orderDto: OrderDto,
      @GetUser('id') authId: string, 
    ) {
      return this.orderService.updateOrder(id, orderDto, authId);
    }

    // Enpoint para eliminar un pedido
    @Delete(':id')
    removeOrder(@Param('id') id: string, @GetUser('id') authId: string) {
      return this.orderService.removeOrder(id, authId);
    }

    // Endpoints para consulta de presupuesto
    @Post('budget')
    @ApiOkResponse({
      description: 'Presupuesto generado exitosamente',
      type: OrderBudgetResponseDto,
    })
    getBudget(
      @GetUser('id') authId: string,
      @Body() orderBudgetDto: OrderBudgetDto
    ) {
      return this.orderService.getBudget(orderBudgetDto, authId);
    }

    @Get('tracking/:id')
    @ApiOkResponse({
      description: 'Orden Trackeada',
      type: OrderTrackingDto,
    })
    @ApiNotFoundResponse({ description: 'Orden no encontrada' })
    trackingOneOrder(@Param('id') id: string) {
      return this.orderService.trackingOneOrder(id);
    }
  }
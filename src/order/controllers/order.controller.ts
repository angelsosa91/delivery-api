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
  import { GetUser } from '../../auth/decorators/get-user.decorator';
import { OrderBudgetDto } from '../dto/order-budget.dto';
  
  @ApiTags('Pedidos')
  @Controller('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class OrderController {
    constructor(private readonly orderService: OrderService) {}
  
    // Endpoints para Pedidos
    @Post()
    createOrder(
      @GetUser('id') authId: string, 
      @Body() orderDto: OrderDto
    ) {
      return this.orderService.createOrder(orderDto, authId);
    }
  
    @Get()
    //findAllOrders(@Query('userId') userId?: number) {
    findAllOrders(@GetUser('id') authId: string) { 
      if (authId) {
        return this.orderService.findOrdersByUser(authId);
      }
      return this.orderService.findAllOrders();
    }
  
    @Get(':id')
    findOneOrder(@Param('id') id: string) {
      return this.orderService.findOneOrder(id);
    }
  
    @Patch(':id')
    updateOrder(
      @Param('id') id: string, 
      @Body() orderDto: OrderDto,
      @GetUser('id') authId: string, 
    ) {
      return this.orderService.updateOrder(id, orderDto, authId);
    }
  
    @Delete(':id')
    removeOrder(@Param('id') id: string) {
      return this.orderService.removeOrder(id);
    }

    // Endpoints para consulta de presupuesto
    @Post('budget')
    getBudget(
      @GetUser('id') authId: string,
      @Body() orderBudgetDto: OrderBudgetDto
    ) {
      return this.orderService.getBudget(orderBudgetDto, authId);
    }
  }
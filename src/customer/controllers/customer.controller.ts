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
  import { CustomerService } from '../services/customer.service';
  import { CustomerDto } from '../dto/customer.dto';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
  
  @ApiTags('Clientes')
  @Controller('customers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}
  
    // Endpoints para MpCliente
    @Post()
    createCustomer(
      @GetUser('id') authId: string,
      @Body() customerDto: CustomerDto
    ) {
      return this.customerService.createCustomer(customerDto, authId);
    }
  
    @Get()
    //findCustomers(@Query('userId') userId?: number) {
    findCustomers(@GetUser('id') authId: string){
      if (authId) {
        return this.customerService.findCustomersByUser(authId);
      }
      return this.customerService.findAllCustomers();
    }
  
    @Get(':id')
    findOneCustomer(@Param('id') id: string) {
      return this.customerService.findOneCustomer(id);
    }
  
    @Patch(':id')
    updateCustomer(
      @Param('id') id: string, 
      @Body() customerDto: CustomerDto,
      @GetUser('id') authId: string,
    ) {
      return this.customerService.updateCustomer(id, customerDto, authId);
    }
  
    @Delete(':id')
    removeCustomer(@Param('id') id: string) {
      return this.customerService.removeCustomer(id);
    }
  }
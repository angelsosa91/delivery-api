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
  import { OriginService } from '../services/origin.service';
  import { OriginDto } from '../dto/origin.dto';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { GetUser } from '../../auth/decorators/get-user.decorator';
  
  @ApiTags('Puntos de Origen')
  @Controller('origin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class OriginController {
    constructor(private readonly originService: OriginService) {}
  
    // Endpoints para MpCliente
    @Post()
    createCustomer(@GetUser('userId') userId: string, @Body() originDto: OriginDto) {
      console.log(userId);
      return this.originService.createOrigin(originDto);
    }
  
    @Get()
    findCustomers(@Query('userId') userId?: number) {
      if (userId) {
        return this.originService.findOriginsByUser(userId);
      }
      return this.originService.findAllOrigins();
    }
  
    @Get(':id')
    findOneCustomer(@Param('id') id: string) {
      return this.originService.findOneOrigin(id);
    }
  
    @Patch(':id')
    updateCustomer(@Param('id') id: string, @Body() originDto: OriginDto) {
      return this.originService.updateOrigin(id, originDto);
    }
  
    @Delete(':id')
    removeCustomer(@Param('id') id: string) {
      return this.originService.removeOrigin(id);
    }
  }
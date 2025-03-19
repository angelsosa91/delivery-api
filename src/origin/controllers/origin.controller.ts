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
import { UsersService } from 'src/auth/services/users.service';
  
  @ApiTags('Puntos de Origen')
  @Controller('origin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class OriginController {
    constructor(
      private readonly originService: OriginService
    ) {}
  
    // Endpoints para MpCliente
    @Post()
    createOrigin(
      @GetUser('id') authId: string, 
      @Body() originDto: OriginDto
    ) {
      return this.originService.createOrigin(originDto, authId);
    }
  
    @Get()
    //findOrigins(@Query('userId') userId?: number) {
    findOrigins(@GetUser('id') authId: string) {
      if (authId) {
        return this.originService.findOriginsByUser(authId);
      }
      return this.originService.findAllOrigins();
    }
  
    @Get(':id')
    findOneOrigin(@Param('id') id: string) {
      return this.originService.findOneOrigin(id);
    }
  
    @Patch(':id')
    updateOrigin(
      @GetUser('id') authId: string, 
      @Param('id') id: string, 
      @Body() originDto: OriginDto
    ) {
      return this.originService.updateOrigin(id, originDto, authId);
    }
  
    @Delete(':id')
    removeOrigin(@Param('id') id: string) {
      return this.originService.removeOrigin(id);
    }
  }
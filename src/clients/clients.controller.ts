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
  import { ClientsService } from './clients.service';
  import { CreateClientDto } from './dto/create-client.dto';
  import { UpdateClientDto } from './dto/update-client.dto';
  import { CreateDestinationDto } from './dto/create-destination.dto';
  import { UpdateDestinationDto } from './dto/update-destination.dto';
  import { CreateDestinationTempDto } from './dto/create-destination-temp.dto';
  import { CreateOriginDto } from './dto/create-origin.dto';
  import { UpdateOriginDto } from './dto/update-origin.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('clientes')
  @UseGuards(JwtAuthGuard)
  export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}
  
    // Endpoints para MpCliente
    @Post()
    createMpCliente(@Body() createClientDto: CreateClientDto) {
      return this.clientsService.createClient(createClientDto);
    }
  
    @Get()
    findAllMpClientes(@Query('userId') userId?: number) {
      if (userId) {
        return this.clientsService.findClientsByUser(userId);
      }
      return this.clientsService.findAllClients();
    }
  
    @Get(':id')
    findOneMpCliente(@Param('id') id: string) {
      return this.clientsService.findOneClient(+id);
    }
  
    @Patch(':id')
    updateMpCliente(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
      return this.clientsService.updateClient(+id, updateClientDto);
    }
  
    @Delete(':id')
    removeMpCliente(@Param('id') id: string) {
      return this.clientsService.removeClient(+id);
    }
  
    // Endpoints para MpDetallePunto
    @Post('puntos')
    createMpDetallePunto(@Body() createDestinationDto: CreateDestinationDto) {
      return this.clientsService.createDestination(createDestinationDto);
    }
  
    @Get('puntos')
    findAllMpDetallePuntos() {
      return this.clientsService.findAllDestinations();
    }
  
    @Get('puntos/cliente/:clienteId')
    findMpDetallePuntosByCliente(@Param('clienteId') clientId: string) {
      return this.clientsService.findDestinationsByClient(+clientId);
    }
  
    @Get('puntos/:id')
    findOneMpDetallePunto(@Param('id') id: string) {
      return this.clientsService.findOneDestination(+id);
    }
  
    @Patch('puntos/:id')
    updateMpDetallePunto(
      @Param('id') id: string, 
      @Body() updateDestinationDto: UpdateDestinationDto
    ) {
      return this.clientsService.updateDestination(+id, updateDestinationDto);
    }
  
    // Endpoints para MpDetallePuntoTemp
    @Post('puntos-temp')
    createMpDetallePuntoTemp(@Body() createDestinationTempDto: CreateDestinationTempDto) {
      return this.clientsService.createDestinationTemp(createDestinationTempDto);
    }
  
    @Get('puntos-temp/token/:token')
    findMpDetallePuntosTempByToken(@Param('token') token: string) {
      return this.clientsService.findDestinationsTempByToken(token);
    }
  
    @Delete('puntos-temp/:id')
    removeMpDetallePuntoTemp(@Param('id') id: string) {
      return this.clientsService.removeDestinationTemp(+id);
    }
  
    // Endpoints para MpOrigen
    @Post('origenes')
    createMpOrigen(@Body() createOriginDto: CreateOriginDto) {
      return this.clientsService.createOrigin(createOriginDto);
    }
  
    @Get('origenes')
    findAllMpOrigenes(@Query('userId') userId?: number) {
      if (userId) {
        return this.clientsService.findOriginsByUser(userId);
      }
      return this.clientsService.findAllOrigins();
    }
  
    @Get('origenes/:id')
    findOneMpOrigen(@Param('id') id: string) {
      return this.clientsService.findOneOrigin(+id);
    }
  
    @Patch('origenes/:id')
    updateMpOrigen(@Param('id') id: string, @Body() updateOriginDto: UpdateOriginDto) {
      return this.clientsService.updateOrigin(+id, updateOriginDto);
    }
  
    @Delete('origenes/:id')
    removeMpOrigen(@Param('id') id: string) {
      return this.clientsService.removeOrigin(+id);
    }
  }
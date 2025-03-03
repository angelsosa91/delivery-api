import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('empresas')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly comanyService: CompaniesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(1) // Asumiendo que 1 es rol admin
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.comanyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.comanyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comanyService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(1) // Asumiendo que 1 es rol admin
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.comanyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(1) // Asumiendo que 1 es rol admin
  remove(@Param('id') id: string) {
    return this.comanyService.remove(+id);
  }
}
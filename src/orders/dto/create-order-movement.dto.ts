import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateOrderMovementDto {
  @IsNotEmpty()
  @IsNumber()
  idUsers: number;

  @IsNotEmpty()
  @IsNumber()
  idPedidos: number;

  @IsOptional()
  @IsDateString()
  fechaEntregado?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsNumber()
  deuda?: number;

  @IsOptional()
  @IsNumber()
  pagado?: number;

  @IsOptional()
  @IsNumber()
  electronicoDeuda?: number;

  @IsOptional()
  @IsNumber()
  retencionIva?: number;

  @IsOptional()
  @IsNumber()
  ivaPagado?: number;

  @IsOptional()
  @IsNumber()
  montoFactura?: number;

  @IsOptional()
  @IsNumber()
  montoFacturaPagado?: number;

  @IsOptional()
  @IsNumber()
  electronicoDeudaPagado?: number;

  @IsOptional()
  @IsString()
  medioPagoDeudaMoto?: string;
}
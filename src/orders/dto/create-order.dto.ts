import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  nombreReceptor: string;

  @IsNotEmpty()
  @IsString()
  telefonoReceptor: string;

  @IsNotEmpty()
  @IsString()
  descripcionEnvio: string;

  @IsNotEmpty()
  @IsString()
  formaPago: string;

  @IsNotEmpty()
  @IsString()
  emisorTelefono: string;

  @IsNotEmpty()
  @IsString()
  latitudDesde: string;

  @IsNotEmpty()
  @IsString()
  longitudDesde: string;

  @IsOptional()
  @IsString()
  estadoPedido?: string;

  @IsNotEmpty()
  @IsNumber()
  idUser: number;

  @IsNotEmpty()
  @IsString()
  distancia: string;

  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @IsNotEmpty()
  @IsString()
  latitudHasta: string;

  @IsNotEmpty()
  @IsString()
  longitudHasta: string;

  @IsOptional()
  @IsString()
  tiempo?: string;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsOptional()
  @IsNumber()
  descuento?: number;

  @IsOptional()
  @IsNumber()
  idaYvuelta?: number;

  @IsOptional()
  @IsString()
  latitudHasta2?: string;

  @IsOptional()
  @IsString()
  longitudHasta2?: string;

  @IsOptional()
  @IsString()
  tipoServicio?: string;

  @IsOptional()
  @IsEnum(['SI', 'NO'])
  factura?: string;

  @IsOptional()
  @IsDateString()
  fechaProgramada?: string;

  @IsOptional()
  @IsEnum(['APP', 'WEB', 'IOS'])
  medio?: string;

  @IsOptional()
  @IsEnum(['SI', 'NO'])
  exenta?: string;

  @IsOptional()
  @IsString()
  facturaRuc?: string;

  @IsOptional()
  @IsString()
  facturaRazonSocial?: string;

  @IsOptional()
  @IsEnum(['S', 'M'])
  tipoPedido?: string;

  @IsOptional()
  @IsEnum(['SI', 'NO'])
  depositoBilletera?: string;

  @IsOptional()
  @IsEnum(['SI', 'NO'])
  depositoBancario?: string;

  @IsOptional()
  @IsString()
  motivoCancelacion?: string;

  @IsOptional()
  @IsString()
  zoneFrom?: string;

  @IsOptional()
  @IsString()
  zoneTo?: string;

  @IsOptional()
  @IsString()
  propina?: string;

  @IsOptional()
  @IsNumber()
  estadoPago?: number;

  @IsOptional()
  @IsString()
  hashPedido?: string;

  @IsOptional()
  @IsEnum(['NINGUNO', 'PAGOPAR', 'TIGO_MONEY'])
  hashServicio?: string;

  @IsOptional()
  @IsString()
  categoriaVehiculo?: string;

  @IsOptional()
  @IsEnum(['SI', 'NO'])
  gestionPersonal?: string;

  @IsOptional()
  @IsString()
  ciudadOrigen?: string;
}
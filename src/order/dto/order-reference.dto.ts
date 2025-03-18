import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export class OrderReferenceDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  documentNumber: string;

  @IsOptional()
  @IsString()
  scheduledDate: string;

  @IsOptional()
  @IsString()
  observation: string;

  @IsOptional()
  @IsString()
  image: string;
}
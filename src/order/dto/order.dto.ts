import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  @IsString()
  receiverName: string;

  @IsNotEmpty()
  @IsString()
  receiverPhone: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @IsNotEmpty()
  @IsString()
  senderPhone: string;

  @IsNotEmpty()
  @IsString()
  latitudeFrom: string;

  @IsNotEmpty()
  @IsString()
  longitudeFrom: string;

  @IsNotEmpty()
  @IsString()
  latitudeTo: string;

  @IsNotEmpty()
  @IsString()
  longitudeTo: string;

  @IsNotEmpty()
  @IsString()
  comments: string;

  @IsNotEmpty()
  @IsString()
  withReturn: string;

  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  scheduled: string;

  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;

  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  invoice: string;

  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  invoiceExempt: string;

  @IsOptional()
  @IsString()
  invoiceDoc: string;

  @IsOptional()
  @IsString()
  invoiceName: string;

  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  wallet: string;

  @IsNotEmpty()
  @IsEnum(['SI', 'NO'])
  bank: string;
}
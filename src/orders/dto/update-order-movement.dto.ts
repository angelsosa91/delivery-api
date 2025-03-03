import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderMovementDto } from './create-order-movement.dto';

export class UpdateOrderMovementDto extends PartialType(CreateOrderMovementDto) {}
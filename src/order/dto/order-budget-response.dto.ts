import { ApiProperty } from '@nestjs/swagger';

export class OrderBudgetResponseDto {
  @ApiProperty({ 
    description: 'Distancia',
    example: '2 Km'
  })
  distance: string;

  @ApiProperty({ 
    description: 'Monto',
    example: '20000'
  })
  amount: number;

  constructor(distance: string, amount: number) {
    this.distance = distance;
    this.amount = amount;
  }
}
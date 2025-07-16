import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'eb75a3ca-bc5c-4b67-9e58-838a3cbfc721' })
  id: string;

  @ApiProperty({ example: 'email@email.com.py' })
  email: string;

  @ApiProperty({ example: 'user', description: 'Rol del usuario' })
  role: string;

  @ApiProperty({ example: 'active', description: 'Estado del usuario' })
  status: string;
}

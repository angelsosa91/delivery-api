import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ 
    description: 'Access Token',
    example: 'xxxxxxx'
  })
  accessToken: string;

  @ApiProperty({ 
    description: 'Refresh Token',
    example: 'xxxxxxx'
  })
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
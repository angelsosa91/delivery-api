import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la verificación del webhook de WhatsApp
 * Meta envía estos parámetros en la query string del GET
 */
export class WebhookVerificationDto {
  @ApiProperty({
    description: 'Modo de verificación, debe ser "subscribe"',
    example: 'subscribe',
  })
  'hub.mode': string;

  @ApiProperty({
    description: 'Token de verificación configurado en Meta',
    example: 'your_verify_token',
  })
  'hub.verify_token': string;

  @ApiProperty({
    description: 'Challenge que debe ser retornado para verificar el endpoint',
    example: '1234567890',
  })
  'hub.challenge': string;
}

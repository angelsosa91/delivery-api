import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { WhatsappService } from '../services/whatsapp.service';
import { WebhookPayloadDto } from '../dto';

@ApiTags('WhatsApp Webhook')
@Controller('whatsapp/webhook')
export class WhatsappWebhookController {
  private readonly logger = new Logger(WhatsappWebhookController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly whatsappService: WhatsappService,
  ) {}

  /**
   * Endpoint de verificación del webhook (GET)
   * Meta envía este request para verificar que el endpoint es válido
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Verificar webhook de WhatsApp' })
  @ApiQuery({ name: 'hub.mode', description: 'Modo de verificación', required: true })
  @ApiQuery({ name: 'hub.verify_token', description: 'Token de verificación', required: true })
  @ApiQuery({ name: 'hub.challenge', description: 'Challenge a retornar', required: true })
  @ApiResponse({ status: HttpStatus.OK, description: 'Webhook verificado exitosamente' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Token de verificación inválido' })
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ): string {
    this.logger.log(`Verificación de webhook - mode: ${mode}`);

    const verifyToken = this.configService.get<string>('whatsapp.verifyToken');

    // Verificar que el modo sea 'subscribe' y el token coincida
    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('Webhook verificado exitosamente');
      return challenge;
    }

    this.logger.error('Verificación de webhook fallida - token inválido');
    throw new ForbiddenException('Token de verificación inválido');
  }

  /**
   * Endpoint para recibir notificaciones del webhook (POST)
   * Meta envía los mensajes y eventos a este endpoint
   */
  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recibir notificaciones de WhatsApp' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notificación recibida' })
  async handleWebhook(@Body() payload: WebhookPayloadDto): Promise<void> {
    this.logger.log('Webhook POST recibido');
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    try {
      // Procesar el webhook de forma asíncrona
      await this.whatsappService.processWebhook(payload);
    } catch (error) {
      // Loguear el error pero siempre responder 200
      // WhatsApp reintentará si no recibe 200
      this.logger.error(`Error procesando webhook: ${error.message}`, error.stack);
    }

    // Siempre responder con 200 OK para evitar reintentos
    // El procesamiento real puede hacerse de forma asíncrona
  }
}

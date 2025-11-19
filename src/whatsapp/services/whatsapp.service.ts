import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WebhookPayloadDto,
  WhatsAppMessageDto,
  WhatsAppStatusDto,
  WhatsAppEntryDto,
} from '../dto';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Procesa el payload completo del webhook
   */
  async processWebhook(payload: WebhookPayloadDto): Promise<void> {
    this.logger.log(`Webhook recibido: ${payload.object}`);

    if (payload.object !== 'whatsapp_business_account') {
      this.logger.warn(`Objeto no soportado: ${payload.object}`);
      return;
    }

    for (const entry of payload.entry) {
      await this.processEntry(entry);
    }
  }

  /**
   * Procesa cada entry del webhook
   */
  private async processEntry(entry: WhatsAppEntryDto): Promise<void> {
    this.logger.debug(`Procesando entry: ${entry.id}`);

    for (const change of entry.changes) {
      if (change.field === 'messages') {
        const value = change.value;

        // Procesar mensajes entrantes
        if (value.messages && value.messages.length > 0) {
          for (const message of value.messages) {
            await this.processMessage(message, value.metadata.phone_number_id);
          }
        }

        // Procesar estados de mensajes
        if (value.statuses && value.statuses.length > 0) {
          for (const status of value.statuses) {
            await this.processStatus(status);
          }
        }
      }
    }
  }

  /**
   * Procesa un mensaje entrante
   */
  private async processMessage(
    message: WhatsAppMessageDto,
    phoneNumberId: string,
  ): Promise<void> {
    this.logger.log(
      `Mensaje recibido de ${message.from} (tipo: ${message.type})`,
    );

    switch (message.type) {
      case 'text':
        await this.handleTextMessage(message, phoneNumberId);
        break;
      case 'image':
        await this.handleImageMessage(message, phoneNumberId);
        break;
      case 'document':
        await this.handleDocumentMessage(message, phoneNumberId);
        break;
      case 'location':
        await this.handleLocationMessage(message, phoneNumberId);
        break;
      case 'interactive':
        await this.handleInteractiveMessage(message, phoneNumberId);
        break;
      default:
        this.logger.warn(`Tipo de mensaje no manejado: ${message.type}`);
    }
  }

  /**
   * Maneja mensajes de texto
   */
  private async handleTextMessage(
    message: WhatsAppMessageDto,
    phoneNumberId: string,
  ): Promise<void> {
    const text = message.text?.body || '';
    this.logger.log(`Mensaje de texto de ${message.from}: ${text}`);

    // TODO: Implementar lógica de negocio
    // Ejemplo: Responder al mensaje, guardar en BD, etc.
  }

  /**
   * Maneja mensajes con imágenes
   */
  private async handleImageMessage(
    message: WhatsAppMessageDto,
    phoneNumberId: string,
  ): Promise<void> {
    const imageId = message.image?.id;
    const caption = message.image?.caption || '';
    this.logger.log(`Imagen recibida de ${message.from}, ID: ${imageId}`);

    // TODO: Descargar imagen usando la Graph API
    // GET https://graph.facebook.com/v17.0/{imageId}
  }

  /**
   * Maneja mensajes con documentos
   */
  private async handleDocumentMessage(
    message: WhatsAppMessageDto,
    phoneNumberId: string,
  ): Promise<void> {
    const docId = message.document?.id;
    const filename = message.document?.filename;
    this.logger.log(`Documento recibido de ${message.from}: ${filename}`);

    // TODO: Descargar documento usando la Graph API
  }

  /**
   * Maneja mensajes con ubicación
   */
  private async handleLocationMessage(
    message: WhatsAppMessageDto,
    phoneNumberId: string,
  ): Promise<void> {
    const location = message.location;
    if (location) {
      this.logger.log(
        `Ubicación de ${message.from}: ${location.latitude}, ${location.longitude}`,
      );

      // TODO: Procesar ubicación para entregas
    }
  }

  /**
   * Maneja respuestas interactivas (botones, listas)
   */
  private async handleInteractiveMessage(
    message: WhatsAppMessageDto,
    phoneNumberId: string,
  ): Promise<void> {
    const interactive = message.interactive;
    if (interactive?.button_reply) {
      this.logger.log(
        `Botón presionado por ${message.from}: ${interactive.button_reply.id}`,
      );

      // TODO: Procesar respuesta del botón
    }
  }

  /**
   * Procesa actualizaciones de estado de mensajes
   */
  private async processStatus(status: WhatsAppStatusDto): Promise<void> {
    this.logger.debug(
      `Estado de mensaje ${status.id}: ${status.status} para ${status.recipient_id}`,
    );

    // TODO: Actualizar estado en base de datos
    // Estados: sent, delivered, read, failed
  }

  /**
   * Envía un mensaje de texto a través de la API de WhatsApp
   * Este método es un ejemplo de cómo enviar mensajes
   */
  async sendTextMessage(to: string, message: string): Promise<void> {
    const phoneNumberId = this.configService.get<string>('whatsapp.phoneNumberId');
    const accessToken = this.configService.get<string>('whatsapp.accessToken');
    const apiVersion = this.configService.get<string>('whatsapp.apiVersion') || 'v17.0';

    // TODO: Implementar llamada a la API de WhatsApp
    // POST https://graph.facebook.com/{apiVersion}/{phoneNumberId}/messages
    // Headers: Authorization: Bearer {accessToken}
    // Body: {
    //   messaging_product: "whatsapp",
    //   to: to,
    //   type: "text",
    //   text: { body: message }
    // }

    this.logger.log(`Enviando mensaje a ${to}: ${message}`);
  }
}

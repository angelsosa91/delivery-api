import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTOs para el payload del webhook de WhatsApp
 * Estructura completa de los mensajes recibidos
 */

export class WhatsAppProfileDto {
  @ApiProperty({ description: 'Nombre del perfil del remitente' })
  name: string;
}

export class WhatsAppContactDto {
  @ApiProperty({ description: 'ID de WhatsApp del contacto' })
  wa_id: string;

  @ApiProperty({ description: 'Perfil del contacto' })
  profile: WhatsAppProfileDto;
}

export class WhatsAppTextDto {
  @ApiProperty({ description: 'Contenido del mensaje de texto' })
  body: string;
}

export class WhatsAppImageDto {
  @ApiPropertyOptional({ description: 'Caption de la imagen' })
  caption?: string;

  @ApiProperty({ description: 'Tipo MIME de la imagen' })
  mime_type: string;

  @ApiProperty({ description: 'SHA256 de la imagen' })
  sha256: string;

  @ApiProperty({ description: 'ID del media para descargar' })
  id: string;
}

export class WhatsAppDocumentDto {
  @ApiPropertyOptional({ description: 'Caption del documento' })
  caption?: string;

  @ApiProperty({ description: 'Nombre del archivo' })
  filename: string;

  @ApiProperty({ description: 'Tipo MIME del documento' })
  mime_type: string;

  @ApiProperty({ description: 'SHA256 del documento' })
  sha256: string;

  @ApiProperty({ description: 'ID del media para descargar' })
  id: string;
}

export class WhatsAppLocationDto {
  @ApiProperty({ description: 'Latitud de la ubicación' })
  latitude: number;

  @ApiProperty({ description: 'Longitud de la ubicación' })
  longitude: number;

  @ApiPropertyOptional({ description: 'Nombre de la ubicación' })
  name?: string;

  @ApiPropertyOptional({ description: 'Dirección de la ubicación' })
  address?: string;
}

export class WhatsAppButtonReplyDto {
  @ApiProperty({ description: 'ID del botón seleccionado' })
  id: string;

  @ApiProperty({ description: 'Título del botón seleccionado' })
  title: string;
}

export class WhatsAppInteractiveDto {
  @ApiProperty({ description: 'Tipo de interacción' })
  type: string;

  @ApiPropertyOptional({ description: 'Respuesta de botón' })
  button_reply?: WhatsAppButtonReplyDto;
}

export class WhatsAppContextDto {
  @ApiProperty({ description: 'Número desde el que se envió el mensaje original' })
  from: string;

  @ApiProperty({ description: 'ID del mensaje al que se responde' })
  id: string;
}

export class WhatsAppMessageDto {
  @ApiProperty({ description: 'Número de teléfono del remitente' })
  from: string;

  @ApiProperty({ description: 'ID único del mensaje' })
  id: string;

  @ApiProperty({ description: 'Timestamp del mensaje en formato Unix' })
  timestamp: string;

  @ApiProperty({
    description: 'Tipo de mensaje',
    enum: ['text', 'image', 'document', 'audio', 'video', 'sticker', 'location', 'contacts', 'interactive', 'button', 'reaction']
  })
  type: string;

  @ApiPropertyOptional({ description: 'Contenido del mensaje de texto' })
  text?: WhatsAppTextDto;

  @ApiPropertyOptional({ description: 'Imagen adjunta' })
  image?: WhatsAppImageDto;

  @ApiPropertyOptional({ description: 'Documento adjunto' })
  document?: WhatsAppDocumentDto;

  @ApiPropertyOptional({ description: 'Ubicación compartida' })
  location?: WhatsAppLocationDto;

  @ApiPropertyOptional({ description: 'Respuesta interactiva' })
  interactive?: WhatsAppInteractiveDto;

  @ApiPropertyOptional({ description: 'Contexto del mensaje (si es respuesta)' })
  context?: WhatsAppContextDto;
}

export class WhatsAppStatusDto {
  @ApiProperty({ description: 'ID del mensaje' })
  id: string;

  @ApiProperty({
    description: 'Estado del mensaje',
    enum: ['sent', 'delivered', 'read', 'failed']
  })
  status: string;

  @ApiProperty({ description: 'Timestamp del estado' })
  timestamp: string;

  @ApiProperty({ description: 'ID del destinatario' })
  recipient_id: string;
}

export class WhatsAppMetadataDto {
  @ApiProperty({ description: 'Número de teléfono de la cuenta de WhatsApp Business' })
  display_phone_number: string;

  @ApiProperty({ description: 'ID del número de teléfono' })
  phone_number_id: string;
}

export class WhatsAppValueDto {
  @ApiProperty({ description: 'Producto de mensajería' })
  messaging_product: string;

  @ApiProperty({ description: 'Metadata de la cuenta' })
  metadata: WhatsAppMetadataDto;

  @ApiPropertyOptional({ description: 'Lista de contactos', type: [WhatsAppContactDto] })
  contacts?: WhatsAppContactDto[];

  @ApiPropertyOptional({ description: 'Lista de mensajes', type: [WhatsAppMessageDto] })
  messages?: WhatsAppMessageDto[];

  @ApiPropertyOptional({ description: 'Lista de estados', type: [WhatsAppStatusDto] })
  statuses?: WhatsAppStatusDto[];
}

export class WhatsAppChangeDto {
  @ApiProperty({ description: 'Campo que cambió', example: 'messages' })
  field: string;

  @ApiProperty({ description: 'Valor del cambio' })
  value: WhatsAppValueDto;
}

export class WhatsAppEntryDto {
  @ApiProperty({ description: 'ID de la cuenta de WhatsApp Business' })
  id: string;

  @ApiProperty({ description: 'Lista de cambios', type: [WhatsAppChangeDto] })
  changes: WhatsAppChangeDto[];
}

export class WebhookPayloadDto {
  @ApiProperty({ description: 'Objeto que envía el webhook', example: 'whatsapp_business_account' })
  object: string;

  @ApiProperty({ description: 'Lista de entries del webhook', type: [WhatsAppEntryDto] })
  entry: WhatsAppEntryDto[];
}

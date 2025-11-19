import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsappWebhookController } from './controllers/whatsapp-webhook.controller';
import { WhatsappService } from './services/whatsapp.service';

@Module({
  imports: [ConfigModule],
  controllers: [WhatsappWebhookController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs-extra';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async loadTemplate(templateName: string, data: any) {
    const filePath = `src/templates/${templateName}.html`;
    const templateContent = await fs.readFile(filePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateContent);
    return compiledTemplate(data);
  }

  async sendMail(to: string, subject: string, template: string, data: any) {
    const html = await this.loadTemplate(template, data);

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Correo enviado: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Error al enviar el correo:`, error);
      return { success: false, error };
    }
  }
}

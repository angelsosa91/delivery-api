import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
    private readonly mq_host = process.env.RABBIT_MQ_HOST;
    private readonly mq_user = process.env.RABBIT_MQ_USER;
    private readonly mq_pass = process.env.RABBIT_MQ_PASS;
    private readonly mq_port = process.env.RABBIT_MQ_PORT;

    private readonly url = `amqp://${this.mq_user}:${this.mq_pass}@${this.mq_host}:${this.mq_port}`;

    async sendMessage(queue: string, message: object) {
        const connection = await amqp.connect(this.url);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

        console.log(`Mensaje enviado a ${queue}:`, message);

        setTimeout(() => connection.close(), 500);
  }
}

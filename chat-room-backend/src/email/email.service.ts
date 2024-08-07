import { Injectable } from '@nestjs/common';
import { createTransport, Transporter} from 'nodemailer';

@Injectable()
export class EmailService {

    transporter: Transporter
    // 可使用resend免費服務
    constructor() {
      this.transporter = createTransport({
          host: "",
          port: 587,
          secure: false,
          auth: {
              user: '',
              pass: ''
          },
      });
    }

    async sendMail({ to, subject, html }) {
      await this.transporter.sendMail({
        from: {
          name: 'chat room',
          address: ''
        },
        to,
        subject,
        html
      });
    }
}

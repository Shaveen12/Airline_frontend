import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceId = 'service_0a4oe2n';
  private templateId = 'template_d1gvvqb';
  private userId = 'odCazam0ispPbTE6E'; // This is usually the public key from EmailJS

  constructor() { }

  sendEmail(toEmail: string, subject: string, message: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_email: toEmail,
      subject: subject,
      message: message,
    };

    return emailjs.send(this.serviceId, this.templateId, templateParams, this.userId);
  }
}

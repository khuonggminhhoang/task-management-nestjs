import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { config } from "config/system.config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {

    async sendMail(toEmail: string, subject: string, htmlContent: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.smtpUsername,
                pass: config.smtpUserpass
            }
        });

        const mailOptions = {
            from: config.smtpUsername,
            to: toEmail,
            subject: subject,
            html: htmlContent 
        }

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            // do something useful
        } catch (error) {
            console.error("Send mail error:", error);
            throw new InternalServerErrorException('Send mail failed');
        }
    }
}
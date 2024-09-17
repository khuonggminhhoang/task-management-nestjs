import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService) {}

    sendMail(toEmail: string, subject: string, htmlContent: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('SMTP_USERNAME'),
                password: this.configService.get<string>('SMTP_PASSWORD')
            }
        });

        const mailOptions = {
            from: this.configService.get<string>('SMTP_USERNAME'),
            to: toEmail,
            subject: subject,
            html: htmlContent 
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Lỗi gửi mail");
                console.log(error);
    
            } else {
                console.log('Email sent: ' + info.response);    
                // do something useful
            }
        })
    }
}
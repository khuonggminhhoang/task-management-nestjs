import { Injectable } from "@nestjs/common";
import { config } from "config/system.config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {

    sendMail(toEmail: string, subject: string, htmlContent: string) {
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
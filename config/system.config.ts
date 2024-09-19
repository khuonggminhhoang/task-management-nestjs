import * as dotenv from 'dotenv';
dotenv.config();

export class Config {
    // token
    accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
    expiresInAccessToken = '1d';
    expiresInRefreshToken = '7d';

    // mail
    smtpUsername = process.env.SMTP_USERNAME;
    smtpUserpass = process.env.SMTP_PASSWORD;

    //otp
    otpSecretKey = process.env.OTP_SECRET_KEY;

    PORT = +process.env.PORT ?? 3000;
}

export const config = new Config();
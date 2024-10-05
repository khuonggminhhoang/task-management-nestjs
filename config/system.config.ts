import * as dotenv from 'dotenv';
import * as process from "node:process";
// import * as process from "node:process";

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

    // otp
    otpSecretKey = process.env.OTP_SECRET_KEY;

    // redis
    REDIS_HOST = process.env.REDIS_HOST ?? "localhost";
    REDIS_PORT = +process.env.REDIS_PORT ?? 6379;

    // cloudinary
    cloudinaryName = process.env.CLOUDINARY_NAME;
    cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
    cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

    PORT = +process.env.PORT ?? 3000;
}

export const config = new Config();
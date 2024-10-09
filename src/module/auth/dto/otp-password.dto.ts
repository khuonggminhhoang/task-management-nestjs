import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class OtpPasswordDto {
    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
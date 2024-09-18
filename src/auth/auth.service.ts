import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import hashPasswordHelper from "helper/hash-password.helper";
import { totp } from 'otplib';
import { MailService } from "src/common/mail/mail.service";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private mailService: MailService,
        private configService: ConfigService
    ) {}

    private async generateToken(payload: {id: number, email: string}) {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('ACCESS_TOKEN_KEY'),
            expiresIn: '1d'
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('REFRESH_TOKEN_KEY'),
            expiresIn: '7d'
        });

        await this.userService.update(payload.id, {refresh_token: refreshToken});

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    //--------//
    async register(dto: CreateUserDto) {
        const pwd = await hashPasswordHelper(dto.password);
        
        return this.userService.save({...dto, password: pwd});
    }

    async login(dto: LoginUserDto): Promise<any> {
        const user = await this.userService.findOneByEmail(dto.email);
        if(!user) {
            throw new HttpException("Email not existed", HttpStatus.UNAUTHORIZED);
        }

        const checkPassword = await bcrypt.compare(dto.password, user.password);
        if(!checkPassword) {
            throw new HttpException("Password error", HttpStatus.UNAUTHORIZED);
        }

        // tạo accesstoken và refreshtoken
        return await this.generateToken({id: user.id, email: user.email});
    }

    async refreshToken(refresh_token: string): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token, {secret: this.configService.get<string>('REFRESH_TOKEN_KEY')});

            const existed = await this.userService.findOne({email: verify.email, refresh_token: refresh_token});
            if(!existed) {
                throw new HttpException("Refresh token is not valid", HttpStatus.BAD_REQUEST);
            }
            
            const payload = {id: verify.id, email: verify.email};
            // trả về accesstoken và refreshtoken
            return this.generateToken(payload);
        }
        catch(error) {
            throw new HttpException("Refresh token is not valid", HttpStatus.BAD_REQUEST);
        }
    }

    async forgotPassword(email: string): Promise<any> {
        const user = await this.userService.findOne({email: email, deleted: false});
        if(!user) {
            throw new HttpException('email not exist', HttpStatus.UNAUTHORIZED);
        }

        const secret = this.configService.get<string>('OTP_SECRET_KEY') + email;
        totp.options = { digits: 8, step: 60 };
        const otp = totp.generate(secret);
        const subject = '[TASK] OTP đổi mật khẩu'
        const html = `
                    Mã OTP của bạn: 
                    <b>${otp}</b>. 
                    <br>
                    Lưu ý: OTP chỉ có hiệu lực trong 60s
                    <hr>
                    FACEBOOK: <a href='https://www.facebook.com/khuongminhminh.hoang/'> [ADMIN]
            `

        // this.mailService.sendMail(email, subject, html);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Send mail successfully",
            "data": {
                otp: otp
            }
        };
    }

    verifyOtp(otp: string, email: string) {
        const isValid = totp.verify({ token: otp, secret: this.configService.get<string>('OTP_SECRET_KEY') + email});

        if(isValid) {
            return {
                "success": true,
                "statusCode": HttpStatus.OK,
                "message": "OTP is verified",
                "data": {
                    isOtpVerified: true
                }
            }
        };

        throw new HttpException('OTP is invalid or expired', HttpStatus.UNAUTHORIZED);
    }
}
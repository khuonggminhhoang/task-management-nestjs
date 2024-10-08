import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "@/module/user/dto/create-user.dto";
import { LoginUserDto } from "@/module/user/dto/login-user.dto";
import { UserService } from "@/module/user/user.service";
import * as bcrypt from "bcrypt";
import hashPasswordHelper from "helper/hash-password.helper";
import { totp } from 'otplib';
import { MailService } from "@/common/mail/mail.service";
import { ResetPasswordDto } from "@/module/auth/dto/reset-password.dto";
import { ChangePasswordDto } from "@/module/auth/dto/change-password.dto";
import { config } from "config/system.config";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private mailService: MailService,
    ) {}

    // hàm xác thực user
    public async checkUser(payload: {id: number, email: string}): Promise<any> {
        const user = await this.userService.findOneElement({id: payload.id, email: payload.email, deleted: false});
        if(!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    private async generateToken(payload: {id: number, email: string}) {
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: config.accessTokenKey,
            expiresIn: config.expiresInAccessToken
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: config.refreshTokenKey,
            expiresIn: config.expiresInRefreshToken
        });

        return {
            "success": true,
            "statusCode": HttpStatus.CREATED,
            "message": "Token generation successful",
            "data": {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        }
    }

    //--------//
    async register(dto: CreateUserDto) {
        const pwd = await hashPasswordHelper(dto.password);
        return this.userService.save({...dto, password: pwd});
        
    }

    async login(dto: LoginUserDto): Promise<any> {
        const user = await this.userService.findOneElement({email: dto.email});
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
        const verify = await this.jwtService.verifyAsync(refresh_token, {secret: config.refreshTokenKey});

        const existed = await this.userService.findOneElement({email: verify.email, refresh_token: refresh_token});
        if(!existed) {
            throw new HttpException("Refresh token is not valid", HttpStatus.BAD_REQUEST);
        }
        
        const payload = {id: verify.id, email: verify.email};
        // trả về accesstoken và refreshtoken
        return this.generateToken(payload);
        
    }

    async forgotPassword(email: string): Promise<any> {
        const user = await this.userService.findOneElement({email: email, deleted: false});
        if(!user) {
            throw new HttpException('email not exist', HttpStatus.UNAUTHORIZED);
        }

        const secret = config.otpSecretKey + email;
        totp.options = { digits: 8, step: 60 };
        const otp = totp.generate(secret);

        const subject = '[TASK] OTP đổi mật khẩu';
        const html = `
                    Mã OTP của bạn: 
                    <b>${otp}</b>. 
                    <br>
                    Lưu ý: OTP chỉ có hiệu lực trong 60s
                    <hr>
                    FACEBOOK: <a href='https://www.facebook.com/khuongminhminh.hoang/'> [ADMIN]
            `;

        await this.mailService.sendMail(email, subject, html);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Send mail successfully",
            "data": {
                otp: otp,
                email: email
            }
        };
    }

    verifyOtp(otp: string, email: string) {
        const isValid = totp.verify({ token: otp, secret: config.otpSecretKey + email});

        if(isValid) {
            return {
                "success": true,
                "statusCode": HttpStatus.OK,
                "message": "OTP is verified",
                "data": {
                    isOtpVerified: true
                }
            }
        }

        throw new HttpException('OTP is invalid or expired', HttpStatus.UNAUTHORIZED);
    }

    async resetPassword(dto: ResetPasswordDto, isVerifiedOtp: boolean): Promise<any> {
        const email = dto.email;
        const newPassword = dto.newPassword;

        if(!isVerifiedOtp) {
            throw new UnauthorizedException('OTP is unauthorized');
        }

        const user = await this.userService.findOneElement({email: email, deleted: false});
        if(!user) {
            throw new NotFoundException('Email not found');
        }

        const comparePassword = bcrypt.compareSync(newPassword, user.password);
        if(comparePassword) {
            throw new ConflictException('New password cannot be the same as the current password');
        } 

        user.password = await hashPasswordHelper(newPassword);
        await this.userService.save(user);

        return {
            "success": true,
            "statusCode": HttpStatus.OK,
            "message": "Reset password successfully."
        }
    }


    async changePassword(dto: ChangePasswordDto): Promise<any> {
        const email = dto.email;
        const currentPassword = dto.currentPassword;
        const newPassword = dto.newPassword;
        const retryPassword = dto.retryPassword;
        
        const user = await this.userService.findOneElement({email: email, deleted: false});
        if(!user) {
            throw new HttpException('email not exist', HttpStatus.UNAUTHORIZED);
        }

        if(currentPassword == newPassword) {
            throw new HttpException('New password cannot be the same as the current password', HttpStatus.CONFLICT);
        }

        if(newPassword != retryPassword) {
            throw new HttpException('New password must be the same as the retry password', HttpStatus.CONFLICT);
        }

        return await this.forgotPassword(email);

    }
}
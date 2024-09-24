import { Body, Controller, DefaultValuePipe, Header, Headers, ParseBoolPipe, Post, Query } from "@nestjs/common";
import { AuthService } from "@/auth/auth.service";
import { CreateUserDto } from "@/user/dto/create-user.dto";
import { LoginUserDto } from "@/user/dto/login-user.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ForgotPasswordDto } from "@/auth/dto/forgot-password.dto";
import { OtpPasswordDto } from "@/auth/dto/otp-password.dto";
import { ResetPasswordDto } from "@/auth/dto/reset-password.dto";
import { ChangePasswordDto } from "@/auth/dto/change-password.dto";

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: CreateUserDto): any {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginUserDto): Promise<any> {
        return this.authService.login(dto);
    }

    @Post('refresh-token')
    // @ApiBody({})
    refreshToken(@Body() body: {refresh_token: string}): Promise<any> {
        return this.authService.refreshToken(body.refresh_token);
    }

    @Post('password/forgot')
    forgotPassword(@Body() dto: ForgotPasswordDto): Promise<any> {
        return this.authService.forgotPassword(dto.email);
    }

    @Post('password/otp')    
    verifyOtp(@Body() dto: OtpPasswordDto ): any {
        return this.authService.verifyOtp(dto.otp, dto.email);
    }

    @Post('password/reset')
    resetPassword(
        @Body() dto: ResetPasswordDto, 
        @Headers('isOtpVerified') isOtpVerified: string
    ): Promise<any> {
        const isVerifiedOtp = isOtpVerified === 'true' ? true: false;
        return this.authService.resetPassword(dto, isVerifiedOtp);
    }

    @Post('password/change')
    changePassword(@Body() dto: ChangePasswordDto): Promise<any> {
        return this.authService.changePassword(dto);
    }
}
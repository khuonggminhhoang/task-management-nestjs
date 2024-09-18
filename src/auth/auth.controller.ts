import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { OtpPasswordDto } from "./dto/otp-password.dto";

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
}
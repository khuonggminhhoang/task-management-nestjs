import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { LoginUserDto } from "src/user/dto/login-user.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() createUser: CreateUserDto): any {
        return this.authService.register(createUser);
    }

    @Post('login')
    login(@Body() loginUser: LoginUserDto): Promise<any> {
        return this.authService.login(loginUser);
    }

    
    @Post('refresh-token')
    @ApiBody({
        schema: {
            properties: {
                refresh_token: { 
                    type: 'string'
                }
            }
        }
    })
    refreshToken(@Body() body: {refresh_token: string}): Promise<any> {
        return this.authService.refreshToken(body.refresh_token);
    }

    @Post('password/forgot')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

}
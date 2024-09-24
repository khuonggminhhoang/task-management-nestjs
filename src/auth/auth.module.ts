import { Module } from "@nestjs/common";
import { AuthController } from "@/auth/auth.controller";
import { AuthService } from "@/auth/auth.service";
import { UserModule } from "@/user/user.module";
import { MailModule } from "@/common/mail/mail.module";
import { JwtStrategy } from "@/jwt/jwt.strategy";

@Module({
    imports: [UserModule, MailModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})

export class AuthModule {}
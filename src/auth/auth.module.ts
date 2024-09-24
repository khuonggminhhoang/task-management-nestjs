import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { MailModule } from "src/common/mail/mail.module";
import {JwtStrategy} from "./jwt.strategy";

@Module({
    imports: [UserModule, MailModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})

export class AuthModule {}
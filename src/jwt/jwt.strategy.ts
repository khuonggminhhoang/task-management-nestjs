import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {config} from "config/system.config";
import {AuthService} from "@/module/auth/auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.accessTokenKey
        });
    }

    async validate(payload: any) {
        const user = await this.authService.checkUser(payload);
        return {id: user.id, email: user.email};      // return này mặc định gán vào req.user
    }
}


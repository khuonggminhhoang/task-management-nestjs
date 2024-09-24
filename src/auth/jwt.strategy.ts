import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {config} from "../../config/system.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.accessTokenKey
        });
    }

    async validate(payload: any) {
        console.log(payload);
        return {id: payload.id, email: payload.email};      // return này mặc định gán vào req.user
    }
}


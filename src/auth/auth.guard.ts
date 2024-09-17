import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const accessToken = this.getAccesstokenFromHeader(request);
        if(!request) {
            throw new UnauthorizedException();
        }

        try {
            const verify = await this.jwtService.verifyAsync(accessToken, {secret: this.configService.get<string>("ACCESS_TOKEN_KEY")});
                
            request['data-user'] = {id: verify.id, email: verify.email};
        }
        catch(error){
            throw new UnauthorizedException();
        }

        return true;
    }

    private getAccesstokenFromHeader(request: Request): string | undefined {
        const [type, accessToken] = request.headers.authorization ? request.headers.authorization.split(' ') : [];
        
        return type == 'Bearer' ? accessToken : undefined; 
    }
}
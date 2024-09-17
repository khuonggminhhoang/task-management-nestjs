import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserDecorator = createParamDecorator(
    (data: string, cxt: ExecutionContext) => {
        const request = cxt.switchToHttp().getRequest();
        const user = request['data-user'];

        return data ? user?.[data] : user;        
    }
)
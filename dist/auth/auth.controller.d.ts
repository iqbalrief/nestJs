import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
export declare class AuthController {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(body: any): Promise<import("../user/models/user.entity").User>;
    login(email: string, password: string, response: Response): Promise<import("../user/models/user.entity").User>;
    user(request: Request): Promise<import("../user/models/user.entity").User>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}

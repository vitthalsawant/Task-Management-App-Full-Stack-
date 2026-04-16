import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(params: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    login(user: {
        _id: any;
        email: string;
        name: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: any;
            email: string;
            name: string;
        };
    }>;
    private issueTokens;
}

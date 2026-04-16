import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: any;
            email: string;
            name: string;
        };
    }>;
}

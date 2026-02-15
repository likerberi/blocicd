import { JwtUser } from '../../common/auth/strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignUpDto } from './dto/signup.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(dto: SignUpDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
        };
    }>;
    logout(user: JwtUser): Promise<{
        ok: boolean;
    }>;
}

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/db/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
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
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
        };
    }>;
    logout(userId: number): Promise<void>;
    private issueTokens;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../../common/db/prisma.service");
const SALT_ROUNDS = 10;
let AuthService = class AuthService {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async signUp(dto) {
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (exists)
            throw new common_1.ConflictException('Email already exists');
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.prisma.user.create({
            data: {
                role: dto.role,
                email: dto.email,
                passwordHash,
            },
        });
        return await this.issueTokens(user);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return await this.issueTokens(user);
    }
    async refresh(refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_SECRET || 'dev-secret-change-me',
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (payload.tokenType !== 'refresh') {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: BigInt(payload.sub) },
        });
        if (!user || !user.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const matched = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!matched) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return await this.issueTokens({
            id: user.id,
            role: user.role,
            email: user.email,
        });
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: BigInt(userId) },
            data: { refreshTokenHash: null },
        });
    }
    async issueTokens(user) {
        if (!user.email) {
            throw new common_1.UnauthorizedException('Email is required for authentication');
        }
        const accessPayload = {
            sub: Number(user.id),
            role: user.role,
            email: user.email,
            tokenType: 'access',
        };
        const refreshPayload = {
            sub: Number(user.id),
            role: user.role,
            email: user.email,
            tokenType: 'refresh',
        };
        const accessToken = this.jwtService.sign(accessPayload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: '14d' });
        const refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshTokenHash },
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: Number(user.id),
                role: user.role,
                email: user.email,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
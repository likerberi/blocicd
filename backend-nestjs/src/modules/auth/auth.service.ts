import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole as PrismaUserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/db/prisma.service';
import { JwtTokenType } from '../../common/auth/strategies/jwt.strategy';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signUp(dto: SignUpDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        role: dto.role as unknown as PrismaUserRole,
        email: dto.email,
        passwordHash,
      },
    });
    return await this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return await this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    let payload: { sub: number; role: PrismaUserRole; email: string; tokenType: JwtTokenType };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (payload.tokenType !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(payload.sub) },
    });
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const matched = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matched) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return await this.issueTokens({
      id: user.id,
      role: user.role,
      email: user.email,
    });
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: { refreshTokenHash: null },
    });
  }

  private async issueTokens(user: { id: bigint; role: PrismaUserRole; email: string | null }) {
    if (!user.email) {
      throw new UnauthorizedException('Email is required for authentication');
    }
    const accessPayload = {
      sub: Number(user.id),
      role: user.role,
      email: user.email,
      tokenType: 'access' as JwtTokenType,
    };
    const refreshPayload = {
      sub: Number(user.id),
      role: user.role,
      email: user.email,
      tokenType: 'refresh' as JwtTokenType,
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
}

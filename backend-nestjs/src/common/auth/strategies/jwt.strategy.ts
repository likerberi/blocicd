import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../enums/user-role.enum';

export type JwtTokenType = 'access' | 'refresh';

export type JwtUser = {
  sub: number;
  role: UserRole;
  email: string;
  tokenType: JwtTokenType;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-change-me',
    });
  }

  validate(payload: JwtUser): JwtUser {
    if (payload.tokenType !== 'access') {
      throw new UnauthorizedException('Invalid token type for API access');
    }
    return payload;
  }
}

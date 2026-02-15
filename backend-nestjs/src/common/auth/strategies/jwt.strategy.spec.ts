import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../enums/user-role.enum';
import { JwtStrategy, JwtUser } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('accepts access token payload', () => {
    const strategy = new JwtStrategy();
    const payload: JwtUser = {
      sub: 1,
      role: UserRole.ADMIN,
      email: 'admin@example.com',
      tokenType: 'access',
    };
    expect(strategy.validate(payload)).toEqual(payload);
  });

  it('rejects refresh token payload for API access', () => {
    const strategy = new JwtStrategy();
    const payload: JwtUser = {
      sub: 1,
      role: UserRole.ADMIN,
      email: 'admin@example.com',
      tokenType: 'refresh',
    };
    expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
  });
});

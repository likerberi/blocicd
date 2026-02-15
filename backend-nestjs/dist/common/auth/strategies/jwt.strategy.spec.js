"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const user_role_enum_1 = require("../../enums/user-role.enum");
const jwt_strategy_1 = require("./jwt.strategy");
describe('JwtStrategy', () => {
    it('accepts access token payload', () => {
        const strategy = new jwt_strategy_1.JwtStrategy();
        const payload = {
            sub: 1,
            role: user_role_enum_1.UserRole.ADMIN,
            email: 'admin@example.com',
            tokenType: 'access',
        };
        expect(strategy.validate(payload)).toEqual(payload);
    });
    it('rejects refresh token payload for API access', () => {
        const strategy = new jwt_strategy_1.JwtStrategy();
        const payload = {
            sub: 1,
            role: user_role_enum_1.UserRole.ADMIN,
            email: 'admin@example.com',
            tokenType: 'refresh',
        };
        expect(() => strategy.validate(payload)).toThrow(common_1.UnauthorizedException);
    });
});
//# sourceMappingURL=jwt.strategy.spec.js.map
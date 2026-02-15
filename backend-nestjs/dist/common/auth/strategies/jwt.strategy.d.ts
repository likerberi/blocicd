import { Strategy } from 'passport-jwt';
import { UserRole } from '../../enums/user-role.enum';
export type JwtTokenType = 'access' | 'refresh';
export type JwtUser = {
    sub: number;
    role: UserRole;
    email: string;
    tokenType: JwtTokenType;
};
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtUser): JwtUser;
}
export {};

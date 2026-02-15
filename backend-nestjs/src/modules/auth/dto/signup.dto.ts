import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class SignUpDto {
  @IsEnum(UserRole)
  role!: UserRole;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

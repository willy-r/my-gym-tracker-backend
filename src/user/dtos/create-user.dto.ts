import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsStrongPassword()
  password: string;
}

import { UserRole } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  @Exclude()
  hashedRefreshToken?: string;
  @Exclude()
  hashedPassword: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

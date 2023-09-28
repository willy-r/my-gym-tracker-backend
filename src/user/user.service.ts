import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../lib/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async updateHashedRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);
    await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async hashRefreshToken(refreshToken: string): Promise<string> {
    return await argon2.hash(refreshToken);
  }
}

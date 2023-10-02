import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../lib/prisma/prisma.service';
import { CreateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...data } = createUserDto;
    const hashedPassword = await this.hashPassword(password);
    try {
      return await this.prismaService.user.create({
        data: {
          ...data,
          hashedPassword,
        },
      });
    } catch (err) {
      if (err?.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw err;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }

  async findOneByEmailorThrow(email: string): Promise<User | null> {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw err;
    }
  }

  async updateHashedRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);
    await this.prismaService.user.update({
      where: {
        email,
      },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async removeHashedRefreshToken(email: string): Promise<void> {
    await this.prismaService.user.updateMany({
      where: {
        email,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
  }

  async hashRefreshToken(refreshToken: string): Promise<string> {
    return await argon2.hash(refreshToken);
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
}

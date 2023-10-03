import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetCurrentUser, Roles } from '../shared/decorators';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos';
import { RolesGuard } from '../shared/guards';

@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(
    @GetCurrentUser('email') email: string,
  ): Promise<UserResponseDto> {
    return plainToInstance(
      UserResponseDto,
      await this.userService.findOneByEmailOrThrow(email),
    );
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    return plainToInstance(
      UserResponseDto,
      await this.userService.findOneByIdOrThrow(id),
    );
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async getAll(): Promise<UserResponseDto[]> {
    return plainToInstance(UserResponseDto, await this.userService.findAll());
  }
}

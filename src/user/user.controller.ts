import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from '../shared/decorators';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos';
import { plainToInstance } from 'class-transformer';

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

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    return plainToInstance(
      UserResponseDto,
      await this.userService.findOneByIdOrThrow(id),
    );
  }
}

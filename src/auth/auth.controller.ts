import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { TokensInfo } from './types';
import { PublicRoute } from 'src/shared/decorators';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokensInfo> {
    return await this.authService.login(loginDto);
  }

  //   @Post('register')
  //   async register(): Promise<TokensInfo> {}

  @ApiBearerAuth()
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(): Promise<void> {}

  //   @Get('refresh-tokens')
  //   async refreshTokens(): Promise<TokensInfo> {}
}

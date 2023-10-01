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
import { LoginDto, RegisterDto } from './dtos';
import { TokensInfo } from './types';
import { GetCurrentUser, PublicRoute } from '../shared/decorators';

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

  @PublicRoute()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<TokensInfo> {
    return await this.authService.register(registerDto);
  }

  @ApiBearerAuth()
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@GetCurrentUser('email') email: string): Promise<void> {
    return await this.authService.logout(email);
  }

  //   @Get('refresh-tokens')
  //   async refreshTokens(): Promise<TokensInfo> {}
}

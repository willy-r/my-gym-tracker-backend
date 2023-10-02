import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { LoginDto, RegisterDto } from './dtos';
import { JwtPayload, TokensInfo } from './types';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<TokensInfo> {
    const user = await this.userService.findOneByEmail(loginDto.email);
    const passwordMatches = await this.verifyPasswords(
      user?.hashedPassword,
      loginDto.password,
    );
    if (!passwordMatches || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.signTokens({
      email: user.email,
      role: user.role,
    });
    await this.userService.updateHashedRefreshToken(
      user.email,
      tokens.refreshToken,
    );
    return tokens;
  }

  async register(registerDto: RegisterDto): Promise<TokensInfo> {
    const user = await this.userService.create(registerDto);
    const tokens = await this.signTokens({
      email: user.email,
      role: user.role,
    });
    await this.userService.updateHashedRefreshToken(
      user.email,
      tokens.refreshToken,
    );
    return tokens;
  }

  async logout(email: string): Promise<void> {
    await this.userService.removeHashedRefreshToken(email);
  }

  async refreshTokens(
    email: string,
    refreshToken: string,
  ): Promise<TokensInfo> {
    const user = await this.userService.findOneByEmail(email);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }
    const refreshTokenMatches = await this.verifyRefreshTokens(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }
    const updatedTokens = await this.signTokens({
      email: user.email,
      role: user.role,
    });
    await this.userService.updateHashedRefreshToken(
      user.email,
      updatedTokens.refreshToken,
    );
    return updatedTokens;
  }

  async verifyPasswords(
    hashedPassword: string | undefined,
    password: string,
  ): Promise<boolean> {
    return await argon2.verify(
      hashedPassword || (await argon2.hash('dummy-pwd')),
      password,
    );
  }

  async verifyRefreshTokens(
    hashedRefreshToken: string,
    refreshToken: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedRefreshToken, refreshToken);
  }

  async signTokens(jwtPayload: JwtPayload): Promise<TokensInfo> {
    const accessTokenOptions: JwtSignOptions = {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES'),
    };
    const refreshTokenOptions: JwtSignOptions = {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES'),
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, accessTokenOptions),
      this.jwtService.signAsync(jwtPayload, refreshTokenOptions),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}

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
    // Verify if user exists by email.
    const user = await this.userService.findOneByEmail(loginDto.email);
    // Check using argon2 if passwords matches.
    const passwordMatches = await this.verifyPasswords(
      user?.hashedPassword,
      loginDto.password,
    );
    // Makes guard condition. If password didn't matches or user doesn't exists throws unauthorized exception.
    if (!passwordMatches || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Sign tokens (refresh and access).
    const tokens = await this.signTokens({
      email: user.email,
      role: user.role,
    });
    // Updates user refresh token on database with the new one.
    await this.userService.updateHashedRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    // Returns updated tokens to use on frontend.
    return tokens;
  }

  async register(registerDto: RegisterDto): Promise<TokensInfo> {
    // Call user service to create user (should verify if user already exists and throw if exists)
    const user = await this.userService.create(registerDto);
    // Sign tokens (authenticate user)
    const tokens = await this.signTokens({
      email: user.email,
      role: user.role,
    });
    // Update refresh token
    await this.userService.updateHashedRefreshToken(
      user.id,
      tokens.refreshToken,
    );
    // return tokens
    return tokens;
  }

  async logout(email: string): Promise<void> {
    await this.userService.removeHashedRefreshToken(email);
  }

  async verifyPasswords(
    hashedPassword: string | undefined,
    password: string,
  ): Promise<boolean> {
    return await argon2.verify(
      hashedPassword || (await argon2.hash('dummy-pwd')), // This avoid timing attacks.
      password,
    );
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

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
import { LoginDto, RegisterDto } from '../dtos';
import { tokensInfoStub } from './stubs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

jest.mock('src/user/user.service');

describe('AuthService Unit', () => {
  let authService: AuthService;
  let userService: UserService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService, ConfigService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('login()', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'StrongPass123!',
    };

    test('when login is called then it shoul call UserService', async () => {
      jest.spyOn(authService, 'verifyPasswords').mockResolvedValue(true);
      jest
        .spyOn(authService, 'signTokens')
        .mockResolvedValueOnce(tokensInfoStub());
      await authService.login(loginDto);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(userService.updateHashedRefreshToken).toHaveBeenCalledWith(
        'mock-uuid',
        tokensInfoStub().refreshToken,
      );
    });

    test('when login is called then it should return tokens info', async () => {
      jest.spyOn(authService, 'verifyPasswords').mockResolvedValue(true);
      jest
        .spyOn(authService, 'signTokens')
        .mockResolvedValueOnce(tokensInfoStub());
      expect(await authService.login(loginDto)).toEqual(tokensInfoStub());
    });

    test('when login is called then it should throw UnauthorizedException for not existing user', async () => {
      jest.spyOn(authService, 'verifyPasswords').mockResolvedValue(true);
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(null);
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    test('when login is called then it should throw UnauthorizedException for invalid password', async () => {
      jest.spyOn(authService, 'verifyPasswords').mockResolvedValue(false);
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register()', () => {
    const registerDto: RegisterDto = {
      firstName: 'Test',
      lastName: 'Test',
      email: 'test@test.com',
      password: 'StrongPass123!',
    };

    test('when register is called then it should call UserService', async () => {
      jest
        .spyOn(authService, 'signTokens')
        .mockResolvedValueOnce(tokensInfoStub());
      await authService.register(registerDto);
      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(userService.updateHashedRefreshToken).toHaveBeenCalledWith(
        'mock-uuid',
        tokensInfoStub().refreshToken,
      );
    });

    test('when register is called then it should return tokens info', async () => {
      jest
        .spyOn(authService, 'signTokens')
        .mockResolvedValueOnce(tokensInfoStub());
      expect(await authService.register(registerDto)).toEqual(tokensInfoStub());
    });

    test('when register is called then it should throw ConflictException for already created user', async () => {
      jest
        .spyOn(userService, 'create')
        .mockRejectedValueOnce(new ConflictException('Email already exists'));
      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});

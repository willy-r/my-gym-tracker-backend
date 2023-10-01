import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto, RegisterDto } from '../dtos';
import { tokensInfoStub } from './stubs';

jest.mock('../auth.service');

describe('AuthController Unit', () => {
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  describe('login()', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: '123',
    };

    test('when login is called then it should call AuthService', async () => {
      await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    test('when login is called then it should return tokens info', async () => {
      expect(await authController.login(loginDto)).toEqual(tokensInfoStub());
    });
  });

  describe('register()', () => {
    const registerDto: RegisterDto = {
      firstName: 'Test',
      lastName: 'Test',
      email: 'test@test.com',
      password: 'StrongPass123!',
    };

    test('given valid input when register is called then it should call AuthService', async () => {
      await authController.register(registerDto);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    test('given valid input when register is called then it should return tokens info', async () => {
      expect(await authController.register(registerDto)).toEqual(
        tokensInfoStub(),
      );
    });
  });
});

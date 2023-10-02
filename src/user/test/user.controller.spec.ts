import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userStub } from './stubs';
import { UserResponseDto } from '../dtos';

jest.mock('../user.service');

describe('UserController Unit', () => {
  let userService: UserService;
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getMe()', () => {
    const userEmail = userStub().email;

    test('when getMe is called then it should call UserService', async () => {
      await userController.getMe(userEmail);
      expect(userService.findOneByEmailOrThrow).toHaveBeenCalledWith(userEmail);
    });

    test('when getMe is called then it should return UserResponseDto without secrets', async () => {
      const user = await userController.getMe(userEmail);
      expect(user).toBeInstanceOf(UserResponseDto);
      expect(user.hashedPassword).toBeUndefined();
      expect(user.hashedRefreshToken).toBeUndefined();
    });
  });

  describe('getById()', () => {
    const userId = 'mock-uuid';

    test('when getById is called then it should call UserService', async () => {
      await userController.getById(userId);
      expect(userService.findOneByIdOrThrow).toHaveBeenCalledWith(userId);
    });

    test('when getById is called then it should return UserResponseDto without secrets', async () => {
      const user = await userController.getById(userId);
      expect(user).toBeInstanceOf(UserResponseDto);
      expect(user.hashedPassword).toBeUndefined();
      expect(user.hashedRefreshToken).toBeUndefined();
    });
  });

  describe('getAll()', () => {
    test.todo('should pass');
  });

  describe('update()', () => {
    test.todo('should pass');
  });

  describe('delete()', () => {
    test.todo('should pass');
  });
});

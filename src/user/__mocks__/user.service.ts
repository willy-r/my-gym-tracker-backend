import { userStub, usersStub } from '../test/stubs';

export const UserService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub()),
  findOneByEmail: jest.fn().mockResolvedValue(userStub()),
  findOneByEmailOrThrow: jest.fn().mockResolvedValue(userStub()),
  findOneByIdOrThrow: jest.fn().mockResolvedValue(userStub()),
  findAll: jest.fn().mockResolvedValue(usersStub()),
  deleteOneByEmailOrThrow: jest.fn(),
  updateHashedRefreshToken: jest.fn(),
  removeHashedRefreshToken: jest.fn(),
});

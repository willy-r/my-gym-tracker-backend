import { userStub } from '../test/stubs';

export const UserService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub()),
  findOneByEmail: jest.fn().mockResolvedValue(userStub()),
  updateHashedRefreshToken: jest.fn(),
  removeHashedRefreshToken: jest.fn(),
});

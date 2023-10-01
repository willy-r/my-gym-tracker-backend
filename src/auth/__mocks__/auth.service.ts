import { tokensInfoStub } from '../test/stubs';

export const AuthService = jest.fn().mockReturnValue({
  login: jest.fn().mockResolvedValue(tokensInfoStub()),
  register: jest.fn().mockResolvedValue(tokensInfoStub()),
  logout: jest.fn(),
});

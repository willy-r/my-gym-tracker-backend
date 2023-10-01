import { User, UserRole } from '@prisma/client';

const userStub = (): User => {
  return {
    id: 'mock-uuid',
    firstName: 'Test',
    lastName: 'Test',
    email: 'test@test.com',
    role: UserRole.USER,
    hashedPassword: 'mock-hashed-password',
    hashedRefreshToken: 'mock-hashed-refresh-token',
    createdAt: new Date('2023-10-01 00:00:00'),
    updatedAt: new Date('2023-10-01 00:00:00'),
  };
};

export const UserService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub()),
  findOneByEmail: jest.fn().mockResolvedValue(userStub()),
  updateHashedRefreshToken: jest.fn(),
  removeHashedRefreshToken: jest.fn(),
});

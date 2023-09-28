export type JwtPayload = {
  email: string;
  role: string;
  refreshToken?: string;
};

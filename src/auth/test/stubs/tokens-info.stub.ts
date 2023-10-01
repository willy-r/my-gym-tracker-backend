import { TokensInfo } from '../../types';

export const tokensInfoStub = (): TokensInfo => {
  return {
    accessToken: 'access-token-mock',
    refreshToken: 'refresh-token-mock',
  };
};

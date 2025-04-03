import type { AxiosError } from 'axios';
import { Env } from 'env';
import { createMutation } from 'react-query-kit';

import { intraClient } from '../common/intra-client';
import {
  type ExchangeCodeVariables,
  type IntraTokenResponse,
  type IntraUserResponse,
} from './types';

export const INTRA_CLIENT_ID = Env.INTRA_CLIENT_ID;
export const INTRA_CLIENT_SECRET = Env.INTRA_CLIENT_SECRET;
export const INTRA_REDIRECT_URI = Env.INTRA_REDIRECT_URI;

// export const INTRA_CLIENT_ID =
//   'u-s4t2ud-38667c824db9ed907490b4c69994a9ccb2f9a0d151da0a949822b31ea981e285';
// export const INTRA_CLIENT_SECRET =
//   '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';
// export const INTRA_REDIRECT_URI = 'swiftycompanion://oauth';

// console.log('the api variables : ', INTRA_REDIRECT_URI);

export const useExchangeCodeForToken = createMutation<
  IntraTokenResponse,
  ExchangeCodeVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    intraClient({
      url: '/oauth/token',
      method: 'POST',
      data: {
        grant_type: 'authorization_code',
        client_id: INTRA_CLIENT_ID,
        client_secret: INTRA_CLIENT_SECRET,
        code: variables.code,
        redirect_uri: INTRA_REDIRECT_URI,
      },
    }).then((response) => response.data),
});

export const useGetUserInfo = createMutation<
  IntraUserResponse,
  { accessToken: string },
  AxiosError
>({
  mutationFn: async (variables) =>
    intraClient({
      url: '/v2/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${variables.accessToken}`,
      },
    }).then((response) => response.data),
});

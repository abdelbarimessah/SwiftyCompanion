import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { intraClient } from '../common/intra-client';
import {
  type ExchangeCodeVariables,
  type IntraTokenResponse,
  type IntraUserResponse,
} from './types';

export const INTRA_CLIENT_ID = process.env.EXPO_PUBLIC_INTRA_CLIENT_ID;
export const INTRA_CLIENT_SECRET = process.env.EXPO_PUBLIC_INTRA_CLIENT_SECRET;
export const INTRA_REDIRECT_URI = process.env.EXPO_PUBLIC_INTRA_REDIRECT_URI;
export const INTRA_API_URL = process.env.EXPO_PUBLIC_INTRA_API_URL;

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
        redirect_uri: 'swiftycompanion://oauth',
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

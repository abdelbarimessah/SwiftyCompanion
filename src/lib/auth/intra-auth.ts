import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import {
  INTRA_API_URL,
  INTRA_CLIENT_ID,
  INTRA_REDIRECT_URI,
  useExchangeCodeForToken,
  useGetUserInfo,
} from '@/api/intra-auth';
import { showError } from '@/components/ui/utils';

import { useAuth } from './index';

export function useIntraAuth() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();

  console.log('ENV VARS:', {
    INTRA_CLIENT_ID,
    INTRA_REDIRECT_URI,
    INTRA_API_URL,
  });

  const exchangeCodeMutation = useExchangeCodeForToken({
    onSuccess: async (data) => {
      try {
        // Get user info with the token
        const userInfo = await getUserInfo(data.access_token);

        // Store token and user info

        console.log('the user info is : ', userInfo);
        signIn({
          access: data.access_token,
          refresh: data.refresh_token,
        });

        // Navigate to home screen
        router.replace('/');
      } catch (error) {
        showError(error as any);
      }
    },
    onError: (error) => {
      showError(error);
    },
  });

  const userInfoMutation = useGetUserInfo();

  const getUserInfo = useCallback(
    async (accessToken: string) => {
      const result = await userInfoMutation.mutateAsync({ accessToken });
      return result;
    },
    [userInfoMutation]
  );

  const exchangeCodeForToken = useCallback(
    (code: string) => {
      exchangeCodeMutation.mutate({ code });
    },
    [exchangeCodeMutation]
  );

  const getAuthUrl = useCallback(() => {
    const uri = INTRA_REDIRECT_URI || 'swiftycompanion://oauth';
    return `https://api.intra.42.fr/oauth/authorize?client_id=${INTRA_CLIENT_ID}&redirect_uri=${encodeURIComponent(uri)}&response_type=code&scope=public`;
  }, []);

  return {
    exchangeCodeForToken,
    getAuthUrl,
    isLoading: exchangeCodeMutation.isPending || userInfoMutation.isPending,
    isError: exchangeCodeMutation.isError || userInfoMutation.isError,
  };
}

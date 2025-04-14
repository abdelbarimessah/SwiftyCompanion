import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import {
  INTRA_CLIENT_ID,
  INTRA_REDIRECT_URI,
  useExchangeCodeForToken,
  useGetUserInfo,
} from '@/api/intra-auth';
import { showError } from '@/components/ui/utils';

import { useUser } from '../store/user-store';
import { useAuth } from './index';

export function useIntraAuth() {
  const router = useRouter();
  const { setUser } = useUser();
  const signIn = useAuth.use.signIn();

  const exchangeCodeMutation = useExchangeCodeForToken({
    onSuccess: async (data) => {
      try {
        const userInfo = await getUserInfo(data.access_token);
        signIn({
          access: data.access_token,
          refresh: data.refresh_token,
        });
        setUser(userInfo);
        // useUser.getState().setUser(userInfo);

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

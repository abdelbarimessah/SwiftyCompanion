import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import {
  INTRA_CLIENT_ID,
  INTRA_REDIRECT_URI,
  type IntraUserResponse,
  useExchangeCodeForToken,
  useGetUserCoalitions,
  useGetUserInfo,
} from '@/api/intra-auth';
import { showError } from '@/components/ui/utils';
import { type User } from '@/types/user-info';

import { useUser } from '../store/user-store';
import { useAuth } from './index';

const transformToUser = (apiUser: IntraUserResponse): User => {
  return {
    id: apiUser.id,
    displayname: apiUser.displayname,
    login: apiUser.login,
    email: apiUser.email,
    image: {
      link: apiUser.image.link,
      versions: {
        large: apiUser.image.versions.large,
        medium: apiUser.image.versions.medium,
        micro: apiUser.image.versions.micro,
        small: apiUser.image.versions.small,
      },
    },
    level: apiUser.cursus_users?.[1]?.level || 0,
    wallet: apiUser.wallet || 0,
    correction_point: apiUser.correction_point || 0,
    campus: apiUser.campus || [],
    cursus_users: apiUser.cursus_users || [],
    achievements: apiUser.achievements || [],
    projects_users: apiUser.projects_users || [],
    titles: apiUser.titles || [],
    coalitions: [],
    skills: apiUser.skills || [],
  };
};

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

        console.log('the user info before the transform is : ', userInfo);

        const user = transformToUser(userInfo);
        const coalitions = await getUserCoalitions(user.id, data.access_token);
        user.coalitions = coalitions;
        setUser(user);
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
  const userCoalitionsMutation = useGetUserCoalitions();

  const getUserCoalitions = useCallback(
    async (userId: number, accessToken: string) => {
      const result = await userCoalitionsMutation.mutateAsync({
        userId,
        accessToken,
      });
      return result;
    },
    [userCoalitionsMutation]
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

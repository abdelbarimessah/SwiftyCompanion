import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { intraClient } from '../common/intra-client';
import { type Coalition, type GetUserCoalitionsVariables } from './type';

export const useGetUserCoalitions = createMutation<
  Coalition[],
  GetUserCoalitionsVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    intraClient({
      url: `/v2/users/${variables.userId}/coalitions`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${variables.accessToken}`,
      },
    }).then((response) => response.data),
});

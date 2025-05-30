import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { intraClient } from '../common/intra-client';
import {
  type Coalition,
  type GetCampusLocationsVariables,
  type GetUserCoalitionsVariables,
  type Location,
} from './type';

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

export const useGetCampusLocations = createMutation<
  Location[],
  GetCampusLocationsVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    intraClient({
      url: `/v2/campus/${variables.campusId}/locations`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${variables.accessToken}`,
      },
    }).then((response) => response.data),
});

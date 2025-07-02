import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { intraClient } from '../common/intra-client';
import {
  type CampusUser,
  type Coalition,
  type GetCampusLocationsVariables,
  type GetCampusUsersVariables,
  type GetUserCampusUsersVariables,
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

export const useGetAllUserCampusUsers = createMutation<
  CampusUser[],
  GetUserCampusUsersVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    const pageSize = 100;
    let page = 1;
    let allCampusUsers: CampusUser[] = [];
    let hasMoreData = true;

    console.log('variables', variables);

    try {
      while (hasMoreData) {
        const response = await intraClient({
          url: `/v2/users/${variables.userId}/campus_users`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${variables.accessToken}`,
          },
          params: {
            'page[size]': pageSize,
            'page[number]': page,
            ...variables.filters,
          },
        });

        console.log('the response of the user campus users : ', response);

        const data = response.data as CampusUser[];
        allCampusUsers = [...allCampusUsers, ...data];

        if (data.length < pageSize) {
          hasMoreData = false;
        } else {
          page++;
        }
      }

      return allCampusUsers;
    } catch (error) {
      console.error('Error in useGetAllUserCampusUsers:', error);
      return [];
    }
  },
});

async function fetchUsersPage({
  page,
  pageSize,
  variables,
}: {
  page: number;
  pageSize: number;
  variables: GetCampusUsersVariables;
}) {
  console.log('Fetching users, page:', page);

  const params: Record<string, any> = {
    'page[size]': pageSize,
    'page[number]': page,
    sort: variables.filters?.sort || 'login',
  };

  if (variables.campusId) {
    params['filter[primary_campus_id]'] = variables.campusId;
  }

  console.log('Request params:', params);

  const response = await intraClient({
    url: `/v2/users`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${variables.accessToken}`,
    },
    params,
  });

  return response.data as CampusUser[];
}

export const useGetAllCampusUsers = createMutation<
  CampusUser[],
  GetCampusUsersVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    const pageSize = 30;
    let page = 1;
    let allCampusUsers: CampusUser[] = [];
    let hasMoreData = true;
    const maxPages = variables.maxPages || 5;

    try {
      while (hasMoreData && page <= maxPages) {
        try {
          const data = await fetchUsersPage({ page, pageSize, variables });
          console.log(`Fetched ${data.length} users on page ${page}`);

          allCampusUsers = [...allCampusUsers, ...data];

          if (data.length < pageSize) {
            hasMoreData = false;
            console.log('No more data available, stopping pagination');
          } else if (page >= maxPages) {
            console.log(`Reached max pages (${maxPages}), stopping pagination`);
            hasMoreData = false;
          } else {
            page++;
          }
        } catch (pageError) {
          console.error(`Error fetching page ${page}:`, pageError);
          hasMoreData = false;
        }
      }

      console.log(`Total users fetched: ${allCampusUsers.length}`);
      return allCampusUsers;
    } catch (error) {
      console.error('Error in useGetAllCampusUsers:', error);
      return allCampusUsers;
    }
  },
});

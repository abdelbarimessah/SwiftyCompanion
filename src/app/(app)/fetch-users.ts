import { useEffect, useState } from 'react';

import type { CampusUser } from '@/api/user-data/type';
import { useGetAllCampusUsers } from '@/api/user-data/use-user-data';
import { useAuth } from '@/lib/auth';
import { useUser } from '@/lib/store/user-store';

// State interface to reduce parameter count
type UserStateProps = {
  setCampusUsers: React.Dispatch<React.SetStateAction<CampusUser[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setHasMorePages: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

// Parameters for fetch users function
type FetchUsersParams = {
  reset: boolean;
  stateProps: UserStateProps & {
    setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  };
  auth: {
    token: { access: string } | null;
    user: { campus_id: number } | null;
  };
  getAllCampusUsers: any;
  currentPage: number;
};

// User data fetching logic
function useInitialFetch() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campusUsers, setCampusUsers] = useState<CampusUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  return {
    refreshing,
    setRefreshing,
    loading,
    setLoading,
    campusUsers,
    setCampusUsers,
    errorMessage,
    setErrorMessage,
    currentPage,
    setCurrentPage,
    hasMorePages,
    setHasMorePages,
  };
}

// Handle API response data
function handleApiResponse(
  data: CampusUser[] | undefined,
  reset: boolean,
  stateProps: UserStateProps
) {
  if (!data) return;

  const { setCampusUsers, setErrorMessage, setHasMorePages, setCurrentPage } =
    stateProps;

  if (reset) {
    setCampusUsers(data);
  } else {
    // Only add new users that aren't already in the list
    setCampusUsers((prevUsers) => {
      const prevIds = new Set(prevUsers.map((u) => u.id));
      const uniqueNewUsers = data.filter((u) => !prevIds.has(u.id));
      return [...prevUsers, ...uniqueNewUsers];
    });
  }

  // Check if we have all users or need to set error
  if (data.length === 0) {
    setErrorMessage('No users found for this campus');
    setHasMorePages(false);
  } else if (data.length < 30) {
    // Less than page size means no more pages
    setHasMorePages(false);
  } else {
    // More pages available
    setCurrentPage((prev) => prev + 1);
  }
}

// Fetch users helper function
async function fetchUsers(params: FetchUsersParams) {
  const { reset, stateProps, auth, getAllCampusUsers, currentPage } = params;

  const {
    setCampusUsers,
    setCurrentPage,
    setErrorMessage,
    setHasMorePages,
    setRefreshing,
    setLoading,
  } = stateProps;

  if (!auth.token?.access || !auth.user) {
    setErrorMessage('No token or user data available');
    return;
  }

  if (reset) {
    setRefreshing(true);
    setCampusUsers([]);
    setCurrentPage(1);
    setHasMorePages(true);
    setErrorMessage(null);
  } else {
    setLoading(true);
  }

  try {
    const campusId = auth.user.campus_id;

    await getAllCampusUsers.mutateAsync({
      campusId,
      accessToken: auth.token.access,
      maxPages: reset ? 1 : currentPage,
      filters: { sort: 'login' },
    });

    handleApiResponse(getAllCampusUsers.data, reset, {
      setCampusUsers,
      setErrorMessage,
      setHasMorePages,
      setCurrentPage,
    });
  } catch (error) {
    console.error('Failed to fetch campus users:', error);
    setErrorMessage('Failed to fetch users. Please try again later.');
  } finally {
    setRefreshing(false);
    setLoading(false);
  }
}

// Handle fetching campus users
export function useCampusUsers() {
  const { token } = useAuth();
  const user = useUser.use.user();
  const getAllCampusUsers = useGetAllCampusUsers();

  const stateProps = useInitialFetch();
  const {
    refreshing,
    setRefreshing,
    loading,
    setLoading,
    campusUsers,
    setCampusUsers,
    errorMessage,
    setErrorMessage,
    currentPage,
    setCurrentPage,
    hasMorePages,
    setHasMorePages,
  } = stateProps;

  // Function to fetch campus users
  const fetchCampusUsers = async (reset = true) => {
    await fetchUsers({
      reset,
      stateProps: {
        setCampusUsers,
        setErrorMessage,
        setHasMorePages,
        setCurrentPage,
        setRefreshing,
        setLoading,
      },
      auth: { token, user },
      getAllCampusUsers,
      currentPage,
    });
  };

  const loadMore = () => {
    if (!loading && hasMorePages) {
      fetchCampusUsers(false);
    }
  };

  useEffect(() => {
    // Only fetch if user data is available
    if (user) {
      fetchCampusUsers(true);
    }
  }, [token, user]);

  return {
    campusUsers,
    refreshing,
    loading,
    fetchCampusUsers,
    loadMore,
    hasMorePages,
    isLoading:
      getAllCampusUsers.isPending && !refreshing && campusUsers.length === 0,
    errorMessage: campusUsers.length === 0 ? errorMessage : null,
    user,
  };
}

import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';

import type { CampusUser } from '@/api/user-data/type';
import { FocusAwareStatusBar, SafeAreaView, Text, View } from '@/components/ui';

import { useCampusUsers } from './fetch-users';

function UserListItem({ item, index }: { item: CampusUser; index: number }) {
  if (!item) return null;

  console.log('the item : ', item);
  // Extract promo year from created_at date
  const promoYear = item.created_at
    ? new Date(item.created_at).getFullYear().toString()
    : null;

  return (
    <View className="flex-row items-center border-b border-neutral-200 p-4">
      <Image
        source={{ uri: item.image?.link }}
        className="size-10 rounded-full"
      />

      <Text className="mr-4 w-8 text-center text-lg font-medium">
        {index + 1}
      </Text>

      <View className="flex-1">
        <Text className="font-bold">
          {item.login || item.user?.login || 'Unknown'}
        </Text>
        {item.user && (
          <Text className="text-neutral-500">
            {item.user.first_name} {item.user.last_name}
          </Text>
        )}
      </View>

      {promoYear && (
        <View className="mr-2 rounded-full bg-blue-100 px-2 py-1">
          <Text className="text-xs text-blue-700">{promoYear}</Text>
        </View>
      )}

      {item.campus && (
        <View className="items-end">
          <Text className="text-sm text-neutral-700">{item.campus.name}</Text>
          <Text className="text-xs text-neutral-500">{item.campus.city}</Text>
        </View>
      )}
    </View>
  );
}

function ErrorState({
  errorMessage,
  onRetry,
}: {
  errorMessage: string;
  onRetry: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="mb-4 text-center text-red-500">{errorMessage}</Text>
      <Text className="mb-4 text-center text-neutral-500">
        The 42 API might have restrictions on retrieving all users.
      </Text>
      <View className="rounded-md bg-blue-500 px-4 py-2" onTouchEnd={onRetry}>
        <Text className="font-bold text-white">Try Again</Text>
      </View>
    </View>
  );
}

// Promo filter component
function PromoFilter({
  selectedPromo,
  onSelectPromo,
  availablePromos,
}: {
  selectedPromo: string | null;
  onSelectPromo: (promo: string | null) => void;
  availablePromos: string[];
}) {
  return (
    <View className="border-b border-neutral-200 px-4 py-2">
      <Text className="mb-2 font-medium">Filter by Promo Year:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pb-2"
      >
        <View
          className={`mr-2 rounded-full ${
            selectedPromo === null ? 'bg-blue-500' : 'bg-neutral-200'
          } px-4 py-2`}
          onTouchEnd={() => onSelectPromo(null)}
        >
          <Text
            className={`${
              selectedPromo === null ? 'text-white' : 'text-neutral-700'
            }`}
          >
            All
          </Text>
        </View>

        {availablePromos.map((promo) => (
          <View
            key={promo}
            className={`mr-2 rounded-full ${
              selectedPromo === promo ? 'bg-blue-500' : 'bg-neutral-200'
            } px-4 py-2`}
            onTouchEnd={() => onSelectPromo(promo)}
          >
            <Text
              className={`${
                selectedPromo === promo ? 'text-white' : 'text-neutral-700'
              }`}
            >
              {promo}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Main screen header
function ScreenHeader() {
  return (
    <View className="flex-row items-center border-b border-neutral-200 p-4">
      <Text className="text-2xl font-bold">Campus Ranking</Text>
    </View>
  );
}

function LoadingState() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-neutral-500">Loading campus users...</Text>
    </View>
  );
}

function EmptyList() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-center text-neutral-500">
        No campus users found
      </Text>
    </View>
  );
}

function LoadMoreFooter({
  loading,
  hasMore,
  onLoadMore,
}: {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) {
    return (
      <View className="items-center py-4">
        <Text className="text-neutral-500">All users loaded</Text>
      </View>
    );
  }

  return (
    <View className="items-center py-4">
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <View
          className="rounded-md bg-blue-500 px-4 py-2"
          onTouchEnd={onLoadMore}
        >
          <Text className="font-bold text-white">Load More</Text>
        </View>
      )}
    </View>
  );
}

function UserList({
  campusUsers,
  refreshing,
  loading,
  fetchCampusUsers,
  loadMore,
  hasMorePages,
  selectedPromo,
}: {
  campusUsers: CampusUser[];
  refreshing: boolean;
  loading: boolean;
  fetchCampusUsers: (reset: boolean) => void;
  loadMore: () => void;
  hasMorePages: boolean;
  selectedPromo: string | null;
}) {
  // Filter users by promo year extracted from created_at
  const filteredUsers = selectedPromo
    ? campusUsers.filter((user) => {
        const userPromoYear = user.created_at
          ? new Date(user.created_at).getFullYear().toString()
          : null;
        return userPromoYear === selectedPromo;
      })
    : campusUsers;

  return (
    <FlatList
      data={filteredUsers}
      keyExtractor={(item) => `${item.id || Math.random()}`}
      renderItem={({ item, index }) => (
        <UserListItem item={item} index={index} />
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchCampusUsers(true)}
        />
      }
      ListEmptyComponent={<EmptyList />}
      ListFooterComponent={
        <LoadMoreFooter
          loading={loading}
          hasMore={hasMorePages}
          onLoadMore={loadMore}
        />
      }
      onEndReached={() => loadMore()}
      onEndReachedThreshold={0.5}
    />
  );
}

function UserNotAvailable() {
  return (
    <>
      <FocusAwareStatusBar />
      <SafeAreaView className="flex-1 bg-white">
        <ScreenHeader />
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-center text-neutral-500">
            User data not available. Please sign in again.
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}

function RankingContent({
  isLoading,
  errorMessage,
  fetchCampusUsers,
  campusUsers,
  refreshing,
  loading,
  loadMore,
  hasMorePages,
  selectedPromo,
  setSelectedPromo,
  availablePromos,
}: {
  isLoading: boolean;
  errorMessage: string | null;
  fetchCampusUsers: (reset: boolean) => void;
  campusUsers: CampusUser[];
  refreshing: boolean;
  loading: boolean;
  loadMore: () => void;
  hasMorePages: boolean;
  selectedPromo: string | null;
  setSelectedPromo: (promo: string | null) => void;
  availablePromos: string[];
}) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (errorMessage) {
    return (
      <ErrorState
        errorMessage={errorMessage}
        onRetry={() => fetchCampusUsers(true)}
      />
    );
  }

  return (
    <>
      <PromoFilter
        selectedPromo={selectedPromo}
        onSelectPromo={setSelectedPromo}
        availablePromos={availablePromos}
      />
      <UserList
        campusUsers={campusUsers}
        refreshing={refreshing}
        loading={loading}
        fetchCampusUsers={fetchCampusUsers}
        loadMore={loadMore}
        hasMorePages={hasMorePages}
        selectedPromo={selectedPromo}
      />
    </>
  );
}

export default function RankingScreen() {
  const {
    campusUsers,
    refreshing,
    loading,
    fetchCampusUsers,
    loadMore,
    hasMorePages,
    isLoading,
    errorMessage,
    user,
  } = useCampusUsers();

  // Track selected promo filter
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);

  // Extract available promo years from user created_at dates
  const availablePromos = React.useMemo(() => {
    const promoSet = new Set<string>();
    campusUsers.forEach((user) => {
      if (user.created_at) {
        const year = new Date(user.created_at).getFullYear().toString();
        promoSet.add(year);
      }
    });
    return Array.from(promoSet).sort();
  }, [campusUsers]);

  if (!user) {
    return <UserNotAvailable />;
  }

  return (
    <>
      <FocusAwareStatusBar />
      <SafeAreaView className="flex-1 bg-white">
        <ScreenHeader />
        <RankingContent
          isLoading={isLoading}
          errorMessage={errorMessage}
          fetchCampusUsers={fetchCampusUsers}
          campusUsers={campusUsers}
          refreshing={refreshing}
          loading={loading}
          loadMore={loadMore}
          hasMorePages={hasMorePages}
          selectedPromo={selectedPromo}
          setSelectedPromo={setSelectedPromo}
          availablePromos={availablePromos}
        />
      </SafeAreaView>
    </>
  );
}

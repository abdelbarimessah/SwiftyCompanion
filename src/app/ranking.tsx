import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';

import type { CampusUser } from '@/api/user-data/type';
import { useGetAllUserCampusUsers } from '@/api/user-data/use-user-data';
import { Text, View } from '@/components/ui';
import { useAuth } from '@/lib/auth';

function UserListItem({ item, index }: { item: CampusUser; index: number }) {
  const user = item.user;
  if (!user) return null;

  console.log('the user : ', user);

  return (
    <View className="flex-row items-center border-b border-neutral-200 p-4">
      <Text className="mr-4 w-8 text-center text-lg font-medium">
        {index + 1}
      </Text>

      <Image
        source={{ uri: user.image?.link }}
        className="mr-4 size-12 rounded-full"
        // defaultSource={require('@/assets/images/default-avatar.png')}
      />

      <View className="flex-1">
        <Text className="font-bold">{user.login}</Text>
        <Text className="text-neutral-500">
          {user.first_name} {user.last_name}
        </Text>
      </View>

      {item.campus && (
        <View className="items-end">
          <Text className="text-sm text-neutral-700">{item.campus.name}</Text>
          <Text className="text-xs text-neutral-500">{item.campus.city}</Text>
        </View>
      )}
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

function RankingScreen() {
  const { token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [campusUsers, setCampusUsers] = useState<CampusUser[]>([]);

  const getAllCampusUsers = useGetAllUserCampusUsers();

  const fetchCampusUsers = async () => {
    if (!token?.access) return;

    try {
      setRefreshing(true);

      const userId = 1;

      await getAllCampusUsers.mutateAsync({
        userId,
        accessToken: token.access,
        filters: {
          sort: 'user.login',
        },
      });

      if (getAllCampusUsers.data) {
        setCampusUsers(getAllCampusUsers.data);
      }
    } catch (error) {
      console.error('Failed to fetch campus users:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCampusUsers();
  }, [token]);

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: 'Campus Ranking',
          headerShadowVisible: false,
        }}
      />

      {getAllCampusUsers.isPending && !refreshing ? (
        <LoadingState />
      ) : (
        <FlatList
          data={campusUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <UserListItem item={item} index={index} />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchCampusUsers}
            />
          }
          ListEmptyComponent={<EmptyList />}
        />
      )}
    </View>
  );
}

export default RankingScreen;

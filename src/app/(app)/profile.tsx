import * as React from 'react';
import { useEffect } from 'react';

import {
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  View,
} from '@/components/ui';
import { useUser } from '@/lib/store/user-store';

export default function Profile() {
  const { user, hydrate } = useUser();
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  console.log('the current user is : ', user);
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <SafeAreaView className="flex-1">
          {/* <Typography /> */}
          <ProfileHeader />
          {/* <Colors />
          <Buttons />
          <Inputs /> */}
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

function ProfileHeader() {
  return <View className="bg-main-50"></View>;
}

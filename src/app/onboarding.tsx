import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();

  const router = useRouter();
  return (
    <View className="flex h-full items-center justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1 items-center justify-center">
        <Image
          className="size-[300px]"
          source={require('../../assets/ilustartions/onboarding-image.png')}
        ></Image>
      </View>
      <SafeAreaView className="mb-[90px]">
        <Button
          label="Let's Get Started "
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}

import * as React from 'react';

import {
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

export default function Clusters() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <SafeAreaView className="flex-1">
          <View className="py-4">
            <Text className="text-2xl font-bold">Clusters</Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

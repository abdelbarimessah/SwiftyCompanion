import * as React from 'react';

import { FocusAwareStatusBar, SafeAreaView, ScrollView } from '@/components/ui';

export default function Profile() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <SafeAreaView className="flex-1">
          {/* <Typography />
          <Colors />
          <Buttons />
          <Inputs /> */}
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

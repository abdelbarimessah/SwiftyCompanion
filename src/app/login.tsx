import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';

import { INTRA_REDIRECT_URI } from '@/api/intra-auth';
import { IntraAuthWebView } from '@/components';
import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
} from '@/components/ui';
import { useIntraAuth } from '@/lib/auth/intra-auth';

const { height, width } = Dimensions.get('window');

const LoadingOverlay = () => (
  <View className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
    <ActivityIndicator size="small" />
  </View>
);

export default function Login() {
  const [showWebview, setShowWebview] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const { getAuthUrl, exchangeCodeForToken, isLoading } = useIntraAuth();

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      if (!url.startsWith(INTRA_REDIRECT_URI || '')) return;

      const code = new URL(url).searchParams.get('code');
      if (code) {
        setShowWebview(false);
        exchangeCodeForToken(code);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => url && handleDeepLink({ url }));

    return () => subscription.remove();
  }, [exchangeCodeForToken]);

  const handleLogin = () => {
    setAuthUrl(getAuthUrl());
    setShowWebview(true);
  };

  const handleCodeReceived = (code: string) => {
    setShowWebview(false);
    exchangeCodeForToken(code);
  };

  return (
    <SafeAreaView
      style={{ height, width }}
      className="flex w-full items-center justify-center"
    >
      <FocusAwareStatusBar />
      {isLoading && <LoadingOverlay />}

      {showWebview ? (
        <IntraAuthWebView
          {...{ authUrl }}
          onClose={() => setShowWebview(false)}
          onCodeReceived={handleCodeReceived}
        />
      ) : (
        <Button label="Login with Intra" onPress={handleLogin} />
      )}
    </SafeAreaView>
  );
}

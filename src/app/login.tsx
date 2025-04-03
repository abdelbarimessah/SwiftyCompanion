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

export default function Login() {
  const [showWebview, setShowWebview] = useState(false);
  const { getAuthUrl, exchangeCodeForToken, isLoading } = useIntraAuth();
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      if (url.startsWith(INTRA_REDIRECT_URI)) {
        const parsedUrl = new URL(url);
        const code = parsedUrl.searchParams.get('code');
        if (code) {
          setShowWebview(false);
          exchangeCodeForToken(code);
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url && url.startsWith(INTRA_REDIRECT_URI)) {
        handleDeepLink({ url });
      }
    });

    return () => {
      // Linking.removeEventListener('url', handleDeepLink);
    };
  }, [exchangeCodeForToken]);

  const handleLogin = () => {
    const url = getAuthUrl();
    setAuthUrl(url);
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

      {isLoading && (
        <View className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <ActivityIndicator size="large" />
        </View>
      )}

      {!showWebview ? (
        <View className="items-center justify-center">
          <Button label="Login with Intra" onPress={handleLogin} />
        </View>
      ) : (
        <IntraAuthWebView
          authUrl={authUrl}
          onClose={() => setShowWebview(false)}
          onCodeReceived={handleCodeReceived}
        />
      )}
    </SafeAreaView>
  );
}

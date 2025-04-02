import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, View } from 'react-native';
import WebView from 'react-native-webview';

import { Button, FocusAwareStatusBar } from '@/components/ui';

const { height, width } = Dimensions.get('window');

const INTRA_CLIENT_ID =
  'u-s4t2ud-38667c824db9ed907490b4c69994a9ccb2f9a0d151da0a949822b31ea981e285';
const INTRA_CLIENT_SECRET =
  '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';
const INTRA_REDIRECT_URI = 'swiftycompanion://oauth';

const ExchangeCodeForToken = async (code: string) => {
  try {
    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: INTRA_CLIENT_ID,
        client_secret: INTRA_CLIENT_SECRET,
        code: code,
        redirect_uri: INTRA_REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Authentication successful:', data);
      // Store the token and fetch user info
      await fetchUserInfo(data.access_token);
    } else {
      console.error('Authentication failed:', data);
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error);
  }
};

const fetchUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const userData = await response.json();

    if (response.ok) {
      console.log('User information:', userData);
      // Here you can store the user data in your state/context/global store
      // Example:
      // signIn({
      //   access: accessToken,
      //   refresh: data.refresh_token,
      //   user: userData
      // });
      // router.push('/');
    } else {
      console.error('Failed to fetch user information:', userData);
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};
export default function Login() {
  const [showWebview, setShowWebview] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      if (url.startsWith(INTRA_REDIRECT_URI)) {
        const parsedUrl = new URL(url);
        const code = parsedUrl.searchParams.get('code');
        if (code) {
          setShowWebview(false);
          ExchangeCodeForToken(code);
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
  }, []);
  const handleLogin = () => {
    const url = `https://api.intra.42.fr/oauth/authorize?client_id=${INTRA_CLIENT_ID}&redirect_uri=${encodeURIComponent(INTRA_REDIRECT_URI)}&response_type=code&scope=public`;
    setAuthUrl(url);
    setShowWebview(true);
  };

  return (
    <SafeAreaView
      style={{ height, width }}
      className="flex w-full items-center justify-center"
    >
      <FocusAwareStatusBar />
      {!showWebview ? (
        <View className="items-center justify-center">
          <Button label="Login with Intra" onPress={handleLogin} />
        </View>
      ) : (
        <View className="w-full flex-1">
          <WebView
            source={{ uri: authUrl }}
            onNavigationStateChange={(navState) => {
              if (navState.url.startsWith(INTRA_REDIRECT_URI)) {
                const url = new URL(navState.url);
                const code = url.searchParams.get('code');
                if (code) {
                  setShowWebview(false);
                  ExchangeCodeForToken(code);
                }
              }
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            incognito={true}
          />
          <Button label="Close" onPress={() => setShowWebview(false)} />
        </View>
      )}
    </SafeAreaView>
  );
}

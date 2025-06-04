import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, View } from 'react-native';

import { INTRA_REDIRECT_URI } from '@/api/intra-auth';
import { IntraAuthWebView } from '@/components';
import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
  Text,
} from '@/components/ui';
import { useIntraAuth } from '@/lib/auth/intra-auth';

const { height, width } = Dimensions.get('window');

const LoadingOverlay = () => (
  <View className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
    <View className="rounded-2xl bg-white/90 p-6 shadow-md">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="mt-3 font-medium text-gray-700">Connecting...</Text>
    </View>
  </View>
);

// Login content component to reduce main component size
function LoginContent({ onLogin }: { onLogin: () => void }) {
  const handleResetOnboarding = () => {
    // Import and use the storage directly
    const { storage } = require('@/lib/storage');
    storage.set('IS_FIRST_TIME', true);
    alert('Onboarding reset! Restart the app to see onboarding screens.');
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-between px-8 py-10">
      <View />

      <View className="items-center">
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 280, height: 120 }}
          className="rounded-3xl"
        />
        <Text className="mb-6 text-center text-sm leading-6 text-gray-600">
          Access your Intra profile, track your progress, and connect with the
          42 community
        </Text>

        <View className="mb-10 h-px w-20 bg-gray-300" />
      </View>

      <View className="w-full">
        <Button
          label="Sign in with Intra"
          onPress={onLogin}
          size="lg"
          className="mb-5 bg-blue-500 shadow-lg"
        />

        <View className="flex-row items-center justify-center">
          <View className="h-px w-16 bg-gray-300" />
          <Text className="mx-3 text-xs text-gray-500">SECURE LOGIN</Text>
          <View className="h-px w-16 bg-gray-300" />
        </View>

        <Text className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>

        {/* Debug button to reset onboarding */}
        <Text
          className="mt-6 text-center text-xs text-blue-500 underline"
          onPress={handleResetOnboarding}
        >
          Reset Onboarding
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Main login component
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
    <View style={{ height, width }} className="flex-1">
      <FocusAwareStatusBar />

      <LinearGradient
        colors={['#f8fafc', '#f1f5f9']}
        className="absolute size-full"
      />

      {isLoading && <LoadingOverlay />}

      {showWebview ? (
        <SafeAreaView className="flex-1">
          <IntraAuthWebView
            authUrl={authUrl}
            onClose={() => setShowWebview(false)}
            onCodeReceived={handleCodeReceived}
          />
        </SafeAreaView>
      ) : (
        <LoginContent onLogin={handleLogin} />
      )}
    </View>
  );
}

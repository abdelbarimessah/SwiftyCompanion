// import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { WebView } from 'react-native-webview';

// import type { LoginFormProps } from '@/components/login-form';
// import { LoginForm } from '@/components/login-form';
import { Button, FocusAwareStatusBar } from '@/components/ui';
// import { useAuth } from '@/lib';

export default function Login() {
  const [showWebview, setShowWebview] = useState(false);
  // const router = useRouter();
  // const signIn = useAuth.use.signIn();

  // const onSubmit: LoginFormProps['onSubmit'] = (data) => {
  //   console.log(data);
  //   signIn({ access: 'access-token', refresh: 'refresh-token' });
  //   router.push('/');
  // };
  return (
    <SafeAreaView className="flex w-full items-center justify-center">
      <FocusAwareStatusBar />

      <Text className="text-[#fff]">hello from the Login screen</Text>

      <Button
        label="Login"
        onPress={() => {
          setShowWebview(true);
          console.log('the login of the user with intra');
          // setIsFirstTime(false);
          // router.replace('/login');
        }}
      />
      {showWebview && <WebView source={{ uri: 'https://www.google.com' }} />}
      {/* <LoginForm onSubmit={onSubmit} /> */}
    </SafeAreaView>
  );
}

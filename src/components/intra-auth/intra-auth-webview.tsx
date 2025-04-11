import * as React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

import { INTRA_REDIRECT_URI } from '@/api/intra-auth';

type IntraAuthWebViewProps = {
  authUrl: string;
  onClose: () => void;
  onCodeReceived: (code: string) => void;
};

export function IntraAuthWebView({
  authUrl,
  onCodeReceived,
}: IntraAuthWebViewProps) {
  return (
    <View className="w-full flex-1">
      <WebView
        source={{ uri: authUrl }}
        onNavigationStateChange={(navState) => {
          if (
            navState.url.startsWith(
              INTRA_REDIRECT_URI || 'swiftycompanion://oauth'
            )
          ) {
            const url = new URL(navState.url);
            const code = url.searchParams.get('code');
            if (code) {
              onCodeReceived(code);
            }
          }
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        incognito={true}
      />
    </View>
  );
}

import * as React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Pressable, View } from '@/components/ui';
import colors from '@/components/ui/colors';

type Tab = 'achievements' | 'projects';

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export function ProfileTabs({ activeTab, onTabChange }: Props) {
  const tabWidth = Dimensions.get('window').width / 2 - 15;

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = activeTab === 'achievements' ? 0 : tabWidth;

    return {
      transform: [
        {
          translateX: withTiming(translateX, {
            duration: 300,
            easing: Easing.bezier(0.25, 1, 0.5, 1),
          }),
        },
      ],
      width: tabWidth,
      height: 3,
      backgroundColor: colors.black,
      position: 'absolute',
      bottom: 0,
      borderRadius: 1.5,
    };
  });

  return (
    <View className="w-full rounded-t-xl bg-white shadow-sm">
      <View className="flex-row px-1 pt-1">
        <TabButton
          label="Achievements"
          isActive={activeTab === 'achievements'}
          onPress={() => onTabChange('achievements')}
        />
        <TabButton
          label="Projects"
          isActive={activeTab === 'projects'}
          onPress={() => onTabChange('projects')}
        />
      </View>
      <Animated.View style={indicatorStyle} />
    </View>
  );
}

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

function TabButton({ label, isActive, onPress }: TabButtonProps) {
  const textStyle = useAnimatedStyle(() => {
    return {
      fontWeight: '700',
      fontSize: 13,
      color: withTiming(isActive ? colors.neutral[900] : colors.neutral[400], {
        duration: 200,
      }),
    };
  });

  return (
    <Pressable
      className={`flex-1 items-center px-2 py-4 ${isActive ? 'opacity-100' : 'opacity-90'}`}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.neutral[50] : 'transparent',
          borderRadius: 8,
        },
      ]}
    >
      <Animated.Text style={textStyle}>{label}</Animated.Text>
    </Pressable>
  );
}

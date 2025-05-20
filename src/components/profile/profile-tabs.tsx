import * as React from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Pressable, View } from '@/components/ui';

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
      transform: [{ translateX: withTiming(translateX, { duration: 250 }) }],
      width: tabWidth,
      height: 2,
      backgroundColor: 'black',
      position: 'absolute',
      bottom: 0,
    };
  });

  return (
    <View className="w-full rounded-lg border-b border-[#f2f4f7] bg-white">
      <View className="flex-row">
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
      fontWeight: 'bold',
      color: withTiming(isActive ? 'black' : '#a8b1bd', { duration: 200 }),
    };
  });

  return (
    <Pressable className="flex-1 items-center py-3" onPress={onPress}>
      <Animated.Text style={textStyle}>{label}</Animated.Text>
    </Pressable>
  );
}

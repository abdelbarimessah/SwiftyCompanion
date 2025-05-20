import { Star } from 'lucide-react-native';
import * as React from 'react';

import { Title } from '@/components/title';
import { Text, View } from '@/components/ui';

type Achievement = {
  name: string;
  tier: string;
  kind: string;
};

type Props = {
  achievements: Achievement[];
};

export function AchievementsOverview({ achievements }: Props) {
  // Group achievements by kind
  const achievementsByKind = achievements.reduce(
    (acc, achievement) => {
      const { kind } = achievement;
      if (!acc[kind]) {
        acc[kind] = [];
      }
      acc[kind].push(achievement);
      return acc;
    },
    {} as Record<string, Achievement[]>
  );

  return (
    <View className="w-full rounded-lg border border-[#f2f4f7] bg-white p-4">
      <Title text="Achievements" />

      {Object.entries(achievementsByKind).map(([kind, kindAchievements]) => (
        <View key={kind} className="mb-4">
          <Text className="mb-2 text-lg font-bold capitalize">{kind}</Text>
          {kindAchievements.map((achievement, index) => (
            <AchievementItem
              key={`${achievement.name}-${index}`}
              achievement={achievement}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function AchievementItem({ achievement }: { achievement: Achievement }) {
  // Determine star color based on tier
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'easy':
        return '#22c55e'; // green
      case 'medium':
        return '#eab308'; // yellow
      case 'hard':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <View className="flex-row items-center border-b border-[#f2f4f7] p-2">
      <Star size={18} color={getTierColor(achievement.tier)} />
      <Text className="ml-2 flex-1">{achievement.name}</Text>
      <Text className="capitalize text-[#a8b1bd]">{achievement.tier}</Text>
    </View>
  );
}

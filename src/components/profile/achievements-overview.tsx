import {
  Award,
  BookOpen,
  Code,
  Medal,
  Star,
  Target,
  Trophy,
  Users,
} from 'lucide-react-native';
import * as React from 'react';

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
  // Filter out achievements with tier "none" and sort remaining by tier priority
  const filteredAchievements = achievements
    .filter((achievement) => achievement.tier !== 'none')
    .sort((a, b) => {
      const tierPriority = { hard: 1, medium: 2, easy: 3 };
      return (
        (tierPriority[a.tier as keyof typeof tierPriority] || 4) -
        (tierPriority[b.tier as keyof typeof tierPriority] || 4)
      );
    });

  // Group achievements by kind
  const achievementsByKind = filteredAchievements.reduce(
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
    <View className="w-full rounded-lg border border-[#f2f4f7] bg-white px-4 pt-4">
      <Text className="mb-3 text-sm font-bold text-black">Achievements</Text>
      {Object.entries(achievementsByKind).map(([kind, kindAchievements]) => (
        <View key={kind} className="mb-3">
          <Text className="text-sm font-bold capitalize text-[#a8b1bd]">
            {kind}
          </Text>
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

  const getKindIcon = (kind: string) => {
    switch (kind.toLowerCase()) {
      case 'project':
        return <Code size={14} color={getTierColor(achievement.tier)} />;
      case 'social':
        return <Users size={14} color={getTierColor(achievement.tier)} />;
      case 'pedagogy':
      case 'education':
        return <BookOpen size={14} color={getTierColor(achievement.tier)} />;
      case 'scolarity':
      case 'academic':
        return <Award size={14} color={getTierColor(achievement.tier)} />;
      case 'challenge':
        return <Target size={14} color={getTierColor(achievement.tier)} />;
      case 'skills':
        return <Medal size={14} color={getTierColor(achievement.tier)} />;
      case 'event':
        return <Trophy size={14} color={getTierColor(achievement.tier)} />;
      default:
        return <Star size={14} color={getTierColor(achievement.tier)} />;
    }
  };

  return (
    <View className=" flex-row items-center border-b border-[#f2f4f7] p-2">
      {getKindIcon(achievement.kind)}
      <Text className="ml-2 flex-1 text-base font-bold">
        {achievement.name}
      </Text>
      <Text className="text-sm capitalize text-[#a8b1bd]">
        {achievement.tier}
      </Text>
    </View>
  );
}

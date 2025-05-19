import { Image } from 'expo-image';
import { CircleUser, Medal } from 'lucide-react-native';
import * as React from 'react';

import { Text, View } from '@/components/ui';

type Props = {
  avatarUrl: string;
  displayName: string;
  login: string;
  location: string;
  country: string;
  title: string;
  level: number;
  wallet: number;
  correction: number;
  levelProgress: number;
};

export function ProfileHeader({
  avatarUrl,
  displayName,
  login,
  location,
  country,
  title,
  level,
  wallet,
  correction,
  levelProgress,
}: Props) {
  return (
    <View className="items-center">
      <GeneralInfo
        avatarUrl={avatarUrl}
        displayName={displayName}
        title={title}
        level={level}
        login={login}
        location={location}
        country={country}
      />
      <Stats level={level} wallet={wallet} correction={correction} />
      <LevelProgress levelProgress={levelProgress} level={level} />
    </View>
  );
}

type GeneralInfoProps = {
  avatarUrl: string;
  displayName: string;
  login: string;
  title: string;
  level: number;
  location: string;
  country: string;
};

function GeneralInfo({
  avatarUrl,
  displayName,
  login,
  title,
  level,
  location,
  country,
}: GeneralInfoProps) {
  console.log('avatarUrl', avatarUrl);

  return (
    <View className="border-1 w-full items-center rounded-s-lg border-x border-t border-[#f2f4f7] bg-white py-6">
      <View className="relative">
        <Image
          source={{ uri: avatarUrl }}
          className="size-32 rounded-full border-4 border-white"
          accessibilityLabel="Profile avatar"
        />
        <View className="absolute -bottom-2 left-1/4 z-10 -translate-x-1/2 rounded-full border-2 border-white bg-[#B18AFF] px-3 py-1">
          <Text className="text-xs font-bold text-white">
            Lvl {Math.floor(level)}
          </Text>
        </View>
      </View>
      <Text className="mt-4 text-2xl font-extrabold text-black dark:text-white">
        {displayName}
      </Text>
      <View className="flex-row items-center gap-[3px]">
        <CircleUser size={14} color="#a8b1bd" strokeWidth={2.5} />
        {/* <User size={16} color="#a8b1bd" strokeWidth={2.7} /> */}
        <Text className=" pb-px text-base font-bold tracking-wide text-[#a8b1bd]">
          {login}
        </Text>
      </View>
      <Text className="text-sm font-bold text-[#a8b1bd]">
        {location}
        {', '}
        {country}
      </Text>
      <View className="mt-2 flex-row items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
        <Medal size={12} color="#000" strokeWidth={2.7} />
        <Text className="text-sm font-bold text-black dark:text-white">
          {title} {login}
        </Text>
      </View>
    </View>
  );
}

type StatsProps = {
  level: number;
  wallet: number;
  correction: number;
};

function Stats({ level, wallet, correction }: StatsProps) {
  return (
    <View className="w-full flex-row justify-around gap-2 bg-[#f5f8fb] pb-2">
      <Stat label="Level" value={level} />
      <Stat label="Wallet" value={wallet} />
      <Stat label="Correction" value={correction} />
    </View>
  );
}

function LevelProgress({
  levelProgress,
  level,
}: {
  levelProgress: number;
  level: number;
}) {
  return (
    <View className="w-full rounded-lg border border-[#f2f4f7] bg-white p-3">
      <Text className="mb-1 text-sm font-bold text-black">Level Progress</Text>
      <View className="h-2 overflow-hidden rounded-full bg-neutral-200">
        <View
          className="h-2 bg-[#222222]"
          style={{ width: `${Math.min(levelProgress * 100, 100)}%` }}
        />
      </View>
      <View className="mt-1 flex-row justify-between">
        <Text className="text-xs font-bold text-[#a8b1bd]">
          Level {Math.floor(level)}
        </Text>
        <Text className="text-xs font-bold text-[#a8b1bd]">
          Level {Math.floor(level) + 1}
        </Text>
      </View>
    </View>
  );
}

type StatProps = { label: string; value: string | number };
function Stat({ label, value }: StatProps) {
  return (
    <View className="flex-1 items-center rounded-e-lg border-x border-b border-[#f2f4f7] bg-white pb-2 outline">
      <Text className="text-sm font-bold text-[#a8b1bd]">{label}</Text>
      <Text className="text-base font-bold text-black dark:text-white">
        {value}
      </Text>
    </View>
  );
}

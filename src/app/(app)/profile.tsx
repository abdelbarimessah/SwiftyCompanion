import * as React from 'react';
import { useEffect } from 'react';

import { ProfileHeader } from '@/components/profile/profile-header';
import { FocusAwareStatusBar, SafeAreaView, ScrollView } from '@/components/ui';
import { useUser } from '@/lib/store/user-store';

function transformUserData(user: any) {
  if (!user) return null;

  return {
    id: user.id,
    displayname: user.displayname,
    login: user.login,
    email: user.email,
    image: user.image.link,
    level: user.cursus_users[1]?.level || 0,
    wallet: user.wallet,
    correctionPoint: user.correction_point,
    campus: user.campus[0]?.name || '',
    country: user.campus[0]?.country || '',
    title: user.titles[0]?.name.split(' ')[0] || '',
    achievements: user.achievements.map((achievement: any) => ({
      name: achievement.name,
      tier: achievement.tier,
      kind: achievement.kind,
    })),
    completedProjects: user.projects_users.filter((p: any) => p['validated?'])
      .length,
    totalProjects: user.projects_users.length,
  };
}

export default function Profile() {
  const { user, hydrate } = useUser();
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const userData = transformUserData(user);

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="bg-[#f5f8fb] px-4">
        <SafeAreaView className="flex-1">
          {userData && (
            <ProfileHeader
              avatarUrl={userData.image}
              displayName={userData.displayname}
              login={userData.login}
              location={userData.campus}
              country={userData.country}
              title={userData.title}
              level={userData.level}
              wallet={userData.wallet}
              correction={userData.correctionPoint}
              levelProgress={userData.level % 1}
            />
          )}
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

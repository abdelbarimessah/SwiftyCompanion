import * as React from 'react';
import { useEffect, useState } from 'react';

import { AchievementsOverview } from '@/components/profile/achievements-overview';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { ProjectsOverview } from '@/components/profile/projects-overview';
import { FocusAwareStatusBar, SafeAreaView, ScrollView } from '@/components/ui';
import { TransformUserData } from '@/lib/profile/transform-user-data';
import { useUser } from '@/lib/store/user-store';
type Tab = 'achievements' | 'projects';

export default function Profile() {
  const { user, hydrate } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const userData = TransformUserData(user);
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="bg-[#f5f8fb] px-4">
        <SafeAreaView className="flex-1 gap-2">
          {userData && (
            <>
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
                currentLocation={userData.location}
              />

              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

              {activeTab === 'projects' && (
                <ProjectsOverview
                  completedProjects={userData.completedProjects}
                  inProgressProjects={userData.inProgressProjects}
                  totalProjects={userData.totalProjects}
                  projectsList={userData.projectsList}
                />
              )}

              {activeTab === 'achievements' && (
                <AchievementsOverview achievements={userData.achievements} />
              )}
            </>
          )}
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

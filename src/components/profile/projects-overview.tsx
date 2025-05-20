import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  Clock,
} from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';

import { Pressable, Text, View } from '@/components/ui';

type Project = {
  id: number;
  name: string;
  finalMark?: number;
  updatedAt: string;
  status: 'finished' | 'in_progress' | 'available';
};

type Props = {
  completedProjects: number;
  totalProjects: number;
  inProgressProjects?: number;
  projectsList?: Project[];
};

export function ProjectsOverview({
  completedProjects,
  totalProjects,
  inProgressProjects = 0,
  projectsList = [],
}: Props) {
  const availableProjects =
    totalProjects - completedProjects - inProgressProjects;
  const progressPercentage = Math.round(
    (completedProjects / totalProjects) * 100
  );
  const projectsByType = {
    completed: projectsList.filter((p) => p.status === 'finished'),
    inProgress: projectsList.filter((p) => p.status === 'in_progress'),
    available: projectsList.filter((p) => p.status === 'available'),
  };
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    completed: false,
    inProgress: false,
    available: false,
  });

  const toggleSection = (section: 'completed' | 'inProgress' | 'available') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <View className="mb-4 w-full rounded-lg border border-[#f2f4f7] bg-white p-4">
      <ProgressSection
        progressPercentage={progressPercentage}
        totalProjects={totalProjects}
      />
      <ProjectListSection
        type="completed"
        icon={<CheckCircle size={20} color="#22c55e" />}
        count={completedProjects}
        projects={projectsByType.completed}
        isExpanded={expandedSections.completed}
        onToggle={() => toggleSection('completed')}
        showMarks={true}
        bgColor="bg-green-50"
      />
      <ProjectListSection
        type="inProgress"
        icon={<Clock size={20} color="#eab308" />}
        count={inProgressProjects}
        projects={projectsByType.inProgress}
        isExpanded={expandedSections.inProgress}
        onToggle={() => toggleSection('inProgress')}
        showMarks={false}
        bgColor="bg-yellow-50"
      />
      <ProjectListSection
        type="available"
        icon={<CirclePlus size={20} color="#6b7280" />}
        count={availableProjects}
        projects={projectsByType.available}
        isExpanded={expandedSections.available}
        onToggle={() => toggleSection('available')}
        showMarks={false}
        bgColor="bg-neutral-50"
      />
    </View>
  );
}

type ProgressSectionProps = {
  totalProjects: number;
  progressPercentage: number;
};

function ProgressSection({
  progressPercentage,
  totalProjects,
}: ProgressSectionProps) {
  return (
    <>
      <Text className="mb-1 text-sm font-bold text-black">
        Projects Progress
      </Text>
      <View className="mb-[6px] h-2 overflow-hidden rounded-full bg-neutral-200">
        <View
          className="h-2 bg-[#222222]"
          style={{ width: `${progressPercentage}%` }}
        />
      </View>
      <View className=" mb-3 flex-row justify-between">
        <Text className="text-xs font-bold text-[#a8b1bd]">
          {totalProjects} projects
        </Text>
        <Text className="text-xs font-bold text-[#a8b1bd]">
          {progressPercentage}% complete
        </Text>
      </View>
    </>
  );
}

type ProjectListSectionProps = {
  type: 'completed' | 'inProgress' | 'available';
  icon: React.ReactNode;
  count: number;
  projects: Project[];
  isExpanded: boolean;
  onToggle: () => void;
  showMarks: boolean;
  bgColor: string;
};

function ProjectListSection({
  type,
  icon,
  count,
  projects,
  isExpanded,
  onToggle,
  showMarks,
  bgColor,
}: ProjectListSectionProps) {
  const labels = {
    completed: 'Completed',
    inProgress: 'In Progress',
    available: 'Available',
  };

  return (
    <>
      <ProjectStat
        icon={icon}
        label={labels[type]}
        value={count}
        bgColor={bgColor}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      {isExpanded && <ProjectList projects={projects} showMarks={showMarks} />}
    </>
  );
}

type ProjectStatProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
  isExpanded: boolean;
  onToggle: () => void;
};

function ProjectStat({
  icon,
  label,
  value,
  bgColor,
  isExpanded,
  onToggle,
}: ProjectStatProps) {
  return (
    <Pressable
      className={`mb-2 flex-row items-center justify-between rounded-md p-2 ${bgColor}`}
      onPress={onToggle}
    >
      <View className="flex-row items-center">
        {icon}
        <Text className="ml-2 font-bold text-black">{label}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="mr-2 font-bold text-black">{value}</Text>
        {isExpanded ? (
          <ChevronUp size={16} color="#000" />
        ) : (
          <ChevronDown size={16} color="#000" />
        )}
      </View>
    </Pressable>
  );
}

type ProjectListProps = {
  projects: Project[];
  showMarks: boolean;
};

function ProjectList({ projects, showMarks }: ProjectListProps) {
  return (
    <View className="mb-3 ml-2 border-l-2 border-neutral-200 pl-4">
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            showMark={showMarks}
          />
        ))
      ) : (
        <Text className="italic text-[#a8b1bd]">No projects to display</Text>
      )}
    </View>
  );
}

type ProjectItemProps = {
  project: Project;
  showMark: boolean;
};

function ProjectItem({ project, showMark }: ProjectItemProps) {
  const updatedDate = new Date(project.updatedAt);

  return (
    <View className="mb-2 border-b border-[#f2f4f7] pb-2">
      <Text className="font-bold text-black">{project.name}</Text>
      <View className="flex-row justify-between">
        <Text className="text-xs text-[#a8b1bd]">
          {updatedDate.toLocaleDateString()} {'-'}{' '}
          {formatTimeAgo(project.updatedAt)}
        </Text>
        {showMark && project.finalMark !== undefined && (
          <Text className="text-xs font-bold text-[#a8b1bd]">
            Mark: {project.finalMark}
          </Text>
        )}
      </View>
    </View>
  );
}

function formatTimeAgo(dateString: string) {
  const now = new Date();
  const updatedDate = new Date(dateString);
  const diffInSeconds = Math.floor(
    (now.getTime() - updatedDate.getTime()) / 1000
  );

  const intervals = {
    y: 31536000,
    m: 2592000,
    w: 604800,
    d: 86400,
    h: 3600,
    min: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval}${unit} ago`;
    }
  }

  return 'just now';
}

import * as React from 'react';
import { Circle, Line, Polygon, Svg, Text as SvgText } from 'react-native-svg';

import { Text, View } from '@/components/ui';

type Skill = {
  id: number;
  name: string;
  level: number;
};

type Props = {
  skills: Skill[];
};

export function SkillsOverview({ skills = [] }: Props) {
  const sortedSkills = [...skills].sort((a, b) => b.level - a.level);

  const maxLevel = Math.max(...skills.map((skill) => skill.level), 10);

  return (
    <View className="w-full rounded-lg border border-[#f2f4f7] bg-white p-4">
      <Text className="mb-3 text-base font-bold text-black">Skills</Text>

      {/* Radar Chart */}
      <View className="mb-6 items-center">
        <SkillsRadarChart
          skills={sortedSkills.slice(0, 5)}
          maxLevel={maxLevel}
        />
      </View>

      {/* Skill Bars */}
      <View className="mt-4">
        {sortedSkills.map((skill) => (
          <SkillBar
            key={skill.id}
            name={skill.name}
            level={skill.level}
            maxLevel={maxLevel}
          />
        ))}
      </View>
    </View>
  );
}
const centerX = 120;
const centerY = 120;
const radius = 100;

function SkillsRadarChart({
  skills,
  maxLevel,
}: {
  skills: Skill[];
  maxLevel: number;
}) {
  const angleStep = (2 * Math.PI) / skills.length;
  const skillPoints = skills.map((skill, index) => {
    const normalizedLevel = (skill.level / maxLevel) * radius;
    const angle = index * angleStep - Math.PI / 2; // Start from top
    return {
      x: centerX + normalizedLevel * Math.cos(angle),
      y: centerY + normalizedLevel * Math.sin(angle),
      angle,
      skill,
    };
  });
  const polygonPoints = skillPoints.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <View className="size-[240px]">
      <Svg height="240" width="240" viewBox="0 0 240 240">
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <Circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            stroke="#E5E7EB"
            strokeWidth="1"
            fill="none"
          />
        ))}
        {skillPoints.map((point, i) => (
          <React.Fragment key={i}>
            <Line
              x1={centerX}
              y1={centerY}
              x2={centerX + radius * Math.cos(point.angle)}
              y2={centerY + radius * Math.sin(point.angle)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <SvgText
              x={centerX + radius * 1.15 * Math.cos(point.angle)}
              y={centerY + radius * 1.15 * Math.sin(point.angle)}
              fontSize="10"
              fill="#6B7280"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {point.skill.name.length > 13
                ? `${point.skill.name.substring(0, 10)}...`
                : point.skill.name}
            </SvgText>
          </React.Fragment>
        ))}
        <Polygon
          points={polygonPoints}
          fill="#B18AFF30"
          stroke="#B18AFF"
          strokeWidth="2"
        />
        {skillPoints.map((p, i) => (
          <Circle key={`p-${i}`} cx={p.x} cy={p.y} r="4" fill="#B18AFF" />
        ))}
      </Svg>
    </View>
  );
}

function SkillBar({
  name,
  level,
  maxLevel,
}: {
  name: string;
  level: number;
  maxLevel: number;
}) {
  const percentage = Math.min(Math.round((level / maxLevel) * 100), 100);

  // Different colors based on skill level
  const getColor = (percent: number) => {
    if (percent >= 75) return '#22C55E'; // green
    if (percent >= 50) return '#B18AFF'; // purple
    if (percent >= 25) return '#EAB308'; // yellow
    return '#6B7280'; // gray
  };

  const barColor = getColor(percentage);

  return (
    <View className="mb-3">
      <View className="flex-row justify-between">
        <Text className="mb-1 text-sm font-medium text-gray-700">{name}</Text>
        <Text className="text-sm font-bold text-gray-700">
          {level.toFixed(1)}
        </Text>
      </View>
      <View className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <View
          className="h-full"
          style={{ backgroundColor: barColor, width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}

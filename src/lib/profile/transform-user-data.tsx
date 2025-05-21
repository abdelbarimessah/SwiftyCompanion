export function TransformUserData(user: any) {
  if (!user) return null;

  const projectsList = user.projects_users.map((project: any) => ({
    id: project.project.id,
    name: project.project.name,
    finalMark: project['validated?'] ? project.final_mark : undefined,
    updatedAt: project.updated_at,
    status: project['validated?']
      ? 'finished'
      : project.status === 'in_progress'
        ? 'in_progress'
        : 'available',
  }));

  // Extract skills from main cursus (cursus_id: 21)
  const mainCursus = user.cursus_users.find(
    (cursus: any) => cursus.cursus_id === 21
  );
  const skills = mainCursus?.skills || [];

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
    inProgressProjects: user.projects_users.filter(
      (p: any) => !p['validated?'] && p.status === 'in_progress'
    ).length,
    totalProjects: user.projects_users.length,
    projectsList,
    location: user.location || null,
    coalitions: user.coalitions,
    skills: skills,
  };
}

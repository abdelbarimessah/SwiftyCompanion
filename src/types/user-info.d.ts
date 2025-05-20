export type UserData = {
  id: number;
  displayname: string;
  login: string;
  email: string;
  image: string;
  level: number;
  wallet: number;
  correctionPoint: number;
  campus: string;
  grade: string;
  achievements: {
    name: string;
    tier: string;
    kind: string;
  }[];
  completedProjects: number;
  totalProjects: number;
  projectsList: {
    id: number;
    name: string;
    finalMark?: number;
    updatedAt: string;
    status: 'finished' | 'in_progress' | 'available';
  }[];
};

export type User = {
  id: number;
  displayname: string;
  login: string;
  email: string;
  image: {
    link: string;
    versions: {
      large: string;
      medium: string;
      micro: string;
      small: string;
    };
  };
  level: number;
  wallet: number;
  correction_point: number;
  campus: {
    name: string;
  }[];
  cursus_users: {
    level: number;
    grade: string;
  }[];
  achievements: {
    name: string;
    tier: string;
    kind: string;
  }[];
  projects_users: {
    'validated?': boolean;
    status: string;
    final_mark?: number;
    updated_at: string;
    project: {
      id: number;
      name: string;
    };
  }[];
  titles: {
    name: string;
  }[];
};

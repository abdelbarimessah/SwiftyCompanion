export type IntraTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
};

export type IntraUserResponse = {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  usual_first_name: string | null;
  url: string;
  phone: string;
  displayname: string;
  image: {
    link: string;
    versions: {
      large: string;
      medium: string;
      micro: string;
      small: string;
    };
  };
  wallet: number;
  correction_point: number;
  campus: any[];
  cursus_users: any[];
  achievements: any[];
  projects_users: any[];
  titles: any[];
  skills: any[];
};

export type ExchangeCodeVariables = {
  code: string;
};

export type Coalition = {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  cover_url: string;
  color: string;
  score: number;
  user_id: number;
};

export type GetUserCoalitionsVariables = {
  userId: number;
  accessToken: string;
};

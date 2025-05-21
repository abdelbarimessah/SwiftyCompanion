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
  campus_id: number;
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

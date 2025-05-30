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

export type Location = {
  id: number;
  begin_at: string;
  end_at: string;
  primary: boolean;
  floor: string | null;
  row: string | null;
  post: string | null;
  host: string;
  campus_id: number;
  user: {
    id: number;
    login: string;
    url: string;
  };
};

export type GetCampusLocationsVariables = {
  campusId: number;
  accessToken: string;
  page?: {
    number: number;
    size: number;
  };
};

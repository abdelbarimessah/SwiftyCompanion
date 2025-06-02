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

export type CampusUser = {
  id: number;
  user_id: number;
  campus_id: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  login?: string;
  image?: {
    link: string;
    versions?: Record<string, string>;
  };
  user?: {
    id: number;
    login: string;
    url: string;
    email: string;
    first_name: string;
    last_name: string;
    usual_full_name: string;
    usual_first_name: string | null;
    url_photo?: string | null;
    login_date?: string | null;
    phone?: string;
    displayname?: string;
    image: {
      link: string;
      versions?: Record<string, string>;
    };
    staff?: boolean;
    active?: boolean;
    alumni?: boolean;
    pool_month?: string;
    pool_year?: string;
    correction_point?: number;
    wallet?: number;
    anonymize_date?: string;
    data_erasure_date?: string;
    created_at?: string;
    updated_at?: string;
    kind?: string;
    location?: string | null;
    alumnized_at?: string | null;
  };
  campus?: {
    id: number;
    name: string;
    time_zone: string;
    language: {
      id: number;
      name: string;
      identifier: string;
    };
    users_count: number;
    country: string;
    city: string;
  };
};

export type GetUserCampusUsersVariables = {
  userId: number;
  accessToken: string;
  filters?: {
    sort?: string;
    filter?: string;
    range?: string;
    page?: string;
  };
};

export type GetCampusUsersVariables = {
  campusId: number;
  accessToken: string;
  maxPages?: number;
  filters?: {
    sort?: string;
    filter?: string;
    range?: string;
    page?: string;
  };
};

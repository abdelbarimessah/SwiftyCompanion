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

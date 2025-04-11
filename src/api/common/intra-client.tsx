// import { Env } from '@env';
import axios from 'axios';

// import { INTRA_API_URL } from '@/api/intra-auth';

const INTRA_API_URL = process.env.EXPO_PUBLIC_INTRA_API_URL;
export const intraClient = axios.create({
  baseURL: INTRA_API_URL,
});

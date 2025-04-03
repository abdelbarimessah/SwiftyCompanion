import { Env } from '@env';
import axios from 'axios';
export const intraClient = axios.create({
  baseURL: Env.INTRA_API_URL,
});

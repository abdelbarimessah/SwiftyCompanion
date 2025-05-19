import { create } from 'zustand';

import { type User } from '@/types/user-info';

import { storage } from '../storage';
import { createSelectors } from '../utils';

const USER_INFO_KEY = 'user_info';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  hydrate: () => void;
}

const _useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user) => {
    if (user) {
      storage.set(USER_INFO_KEY, JSON.stringify(user));
    } else {
      storage.delete(USER_INFO_KEY);
    }
    set({ user });
  },
  hydrate: () => {
    const userStr = storage.getString(USER_INFO_KEY);
    if (userStr) {
      set({ user: JSON.parse(userStr) });
    }
  },
}));

export const useUser = createSelectors(_useUser);

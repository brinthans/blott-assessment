import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    fullName: string;
    email: string;
    setUser: (fullName: string, email: string) => void;
    reset: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            fullName: '',
            email: '',
            setUser: (fullName, email) => set({ fullName, email }),
            reset: () => set({ fullName: '', email: '' }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

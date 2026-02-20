import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    pin: string | null;
    faceIdEnabled: boolean;
    onboardingComplete: boolean;
    isAuthenticated: boolean;
    setPin: (pin: string) => void;
    setFaceIdEnabled: (enabled: boolean) => void;
    completeOnboarding: () => void;
    setAuthenticated: (value: boolean) => void;
    reset: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            pin: null,
            faceIdEnabled: false,
            onboardingComplete: false,
            isAuthenticated: false,
            setPin: (pin) => set({ pin }),
            setFaceIdEnabled: (enabled) => set({ faceIdEnabled: enabled }),
            completeOnboarding: () => set({ onboardingComplete: true }),
            setAuthenticated: (value) => set({ isAuthenticated: value }),
            reset: () =>
                set({
                    pin: null,
                    faceIdEnabled: false,
                    onboardingComplete: false,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                pin: state.pin,
                faceIdEnabled: state.faceIdEnabled,
                onboardingComplete: state.onboardingComplete,
            }),
        }
    )
);

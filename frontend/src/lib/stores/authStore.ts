import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api';

interface User {
    id: string;
    email: string;
    full_name: string;
    credits: number;
    role: 'user' | 'admin';
    avatar_url?: string;
    company?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    updateCredits: (credits: number) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const formData = new URLSearchParams();
                    formData.append('username', email);
                    formData.append('password', password);

                    const response = await authApi.login({ username: email, password });
                    const { access_token } = response.data;

                    localStorage.setItem('token', access_token);
                    set({ token: access_token, isAuthenticated: true });

                    // Fetch user data
                    await get().fetchUser();
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (email: string, password: string, fullName: string) => {
                set({ isLoading: true });
                try {
                    await authApi.register({
                        email,
                        password,
                        full_name: fullName,
                    });

                    // Auto login after registration
                    await get().login(email, password);
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            fetchUser: async () => {
                try {
                    const response = await authApi.getMe();
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                    throw error;
                }
            },

            updateCredits: (credits: number) => {
                const user = get().user;
                if (user) {
                    set({ user: { ...user, credits } });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }),
        }
    )
);

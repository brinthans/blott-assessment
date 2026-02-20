import { create } from 'zustand';
import { fetchNews as fetchNewsApi, NewsArticle } from '@/services/newsApi';

interface NewsState {
    articles: NewsArticle[];
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    fetchNews: (category?: string, isRefresh?: boolean) => Promise<void>;
}

export const useNewsStore = create<NewsState>()((set) => ({
    articles: [],
    loading: true,
    refreshing: false,
    error: null,
    fetchNews: async (category = 'general', isRefresh = false) => {
        try {
            if (isRefresh) {
                set({ refreshing: true });
            } else {
                set({ loading: true });
            }
            set({ error: null });
            const articles = await fetchNewsApi(category);
            set({ articles });
        } catch (err: any) {
            set({ error: err.message || 'Something went wrong' });
        } finally {
            set({ loading: false, refreshing: false });
        }
    },
}));

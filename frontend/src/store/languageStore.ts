import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'hi';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: (en: string, hi?: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: 'en',
            setLanguage: (lang) => set({ language: lang }),
            toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'hi' : 'en' })),
            t: (en, hi) => {
                const currentLang = get().language;
                if (currentLang === 'hi' && hi) return hi;
                return en;
            },
        }),
        {
            name: 'language-storage',
        }
    )
);

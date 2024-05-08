import { create } from 'zustand'
import { THEMES_PRIME_REACT } from '@/utils/constant';

const useThemeStore = create(set => ({
  theme: 'primereact/resources/themes/lara-light-indigo/theme.css',
  randomTheme: () => set(() => {
    const rand = Math.floor(Math.random() * THEMES_PRIME_REACT.length);
    return { theme: THEMES_PRIME_REACT[rand] }
  }),
}));

export default useThemeStore;
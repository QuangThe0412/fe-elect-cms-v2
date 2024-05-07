import { create } from 'zustand'
import { THEMES_PRIME_REACT } from '@/utils/constant';

const useThemeStore = create(set => ({
  theme: 'primereact/resources/themes/lara-light-indigo/theme.css',
  randomTheme: () => set(() => ({
    theme: Math.floor(Math.random() * THEMES_PRIME_REACT.length)
  })),
}));

const useStore = create((set) => ({
  ...useThemeStore
}));


export default useStore;
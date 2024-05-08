import { create } from 'zustand'
import THEMES_PRIME_REACT from '@/utils/constant';

const useThemeStore = create(set => {
  const themes = Object.values(THEMES_PRIME_REACT);
  const rand = () => {
    return Math.floor(Math.random() * themes.length);
  };
  console.log(rand());
  return {
    theme: themes[rand()],
    randomTheme: () => set(() => {
      console.log(rand())
      return { theme: themes[rand()] };
    }),
  };
});

export default useThemeStore;
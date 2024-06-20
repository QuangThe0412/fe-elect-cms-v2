import { create } from 'zustand'

const useThemeStore = create((set, get) => {
  return {
    isDark: false,
    changeTheme: (state: boolean) => set(() => {
      return { isDark: !state };
    }),
  };
});

export default useThemeStore;
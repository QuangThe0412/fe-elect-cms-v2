import { create } from 'zustand'

const useThemeStore = create((set, get) => {
  return {
    isDark: true,
    changeTheme: (state: boolean) => set(() => {
      return { isDark: !state };
    }),
  };
});

export default useThemeStore;
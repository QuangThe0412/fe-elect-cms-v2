import { create } from 'zustand'

const useThemeStore = create((set, get) => {
  return {
    isLight: true,
    changeTheme: (state: boolean) => set(() => {
      return { isLight: !state };
    }),
  };
});

export default useThemeStore;
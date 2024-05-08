import { create } from 'zustand'
import useThemeStore from './theme.store';

const useStore = create((set,get) => ({
  // ...useThemeStore(set,get)
}));


export default useStore;
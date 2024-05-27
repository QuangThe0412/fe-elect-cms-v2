import RootRoutes from '@/components/routes';
import { useEffect } from 'react';
import { THEMES_PRIME_REACT } from '@/constants/theme';
import useThemeStore from '@/store/theme.store';

function App() {
  const isDark = useThemeStore((state: any) => state.isDark);

  useEffect(() => {
      isDark ? THEMES_PRIME_REACT.laraDarkIndigo() : THEMES_PRIME_REACT.laraLightIndigo();
  }, [isDark]);
  return (
    <RootRoutes />
  );
}

export default App;

import RootRoutes from './routes';
import { useEffect } from 'react';
import { THEMES_PRIME_REACT } from '@/constants/theme';
import useThemeStore from '@/store/theme.store'; import axios from 'axios';
import { tryGetAccessToken } from '@/services/handleApi';
import { apiUrl } from '@/constants/api';
import { paths } from '@/constants/api';

function App() {
  const isDark = useThemeStore((state: any) => state.isDark);

  useEffect(() => {
    isDark ? THEMES_PRIME_REACT.laraDarkIndigo() : THEMES_PRIME_REACT.laraLightIndigo();
  }, [isDark]);

  //config middleware axios
  const exceptUrls = [paths.login, paths.register, paths.refreshToken];
  axios.interceptors.request.use(async (config) => {
    config.baseURL = apiUrl;
    const url = config.url;
    if (url && exceptUrls.includes(url)) return config;

    config.headers.Authorization = await tryGetAccessToken() as string;
    return config;
  });

  return (
    <RootRoutes />
  );
}

export default App;

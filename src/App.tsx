import RootRoutes from './routes';
 import axios from 'axios';
import { tryGetAccessToken } from '@/services/handleApi';
import { apiUrl } from '@/constants/api';
import { paths } from '@/constants/api';
import { useEffect } from 'react';
import useThemeStore from '@/store/theme.store';
import { THEMES_PRIME_REACT } from '@/constants/theme';
require('primereact/resources/themes/lara-light-indigo/theme.css')

function App() {
  // const isLight = useThemeStore((state: any) => state.isLight);

  // useEffect(() => {
  //   isLight ? THEMES_PRIME_REACT.laraLightIndigo() : THEMES_PRIME_REACT.laraDarkIndigo();
  // }, [isLight]);

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

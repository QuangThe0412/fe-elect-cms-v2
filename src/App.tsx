
import '@/styles/App.css';
import "primereact/resources/primereact.min.css";
import '@/styles/prime.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { THEMES_PRIME_REACT } from '@/utils/constant';
import Dashboard from './components/Dashboard';
import MenuLeft from '@/components/MenuLeft';
import FloatButton from '@/components/FloatButton';
import useThemeStore from '@/store/theme.store';
import Header from '@/components/Header';
import Product from '@/components/Product';

function App() {
  const isLight = useThemeStore((state: any) => state.isLight);
  useEffect(() => {
    isLight ? THEMES_PRIME_REACT.laraLightIndigo() : THEMES_PRIME_REACT.laraDarkIndigo();
  }, [isLight]);

  return (
    <div className="App">
      <FloatButton />
      <div className='header-app'>
        <Header />
      </div>
      <div className='body-app'>
        <MenuLeft />
        <Routes >
          <Route path='/' element={<Dashboard />} />
          <Route path='/products' element={<Product />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

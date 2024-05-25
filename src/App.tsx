
import '@/styles/App.css';
import "primereact/resources/primereact.min.css";
import '@/styles/prime.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { THEMES_PRIME_REACT } from '@/utils/constant';
import Dashboard from '@/components/dashboards/Dashboard';
import FloatButton from '@/components/FloatButton';
import useThemeStore from '@/store/theme.store';
import Header from '@/components/Header';
import Product from '@/components/products/Product';
import Categories from '@/components/category/Category';
import 'primeicons/primeicons.css';

function App() {
  const isDark = useThemeStore((state: any) => state.isDark);
  useEffect(() => {
    isDark ? THEMES_PRIME_REACT.laraDarkIndigo() : THEMES_PRIME_REACT.laraLightIndigo();
  }, [isDark]);

  return (
    <div className="App">
      <FloatButton />
      <div className='header-app'>
        <Header />
      </div>
      <div className='body-app'>
        <Routes >
          <Route path='/' element={<Dashboard />} />
          <Route path='/products' element={<Product />} />
          <Route path='/categories' element={<Categories />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

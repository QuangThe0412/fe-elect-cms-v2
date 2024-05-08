
import './App.css';
import "primereact/resources/primereact.min.css";
import '@/styles/prime.css';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MenuLeft from '@/components/MenuLeft';
import FloatButton from '@/components/FloatButton';
import useThemeStore from '@/store/theme.store';
import { useEffect } from 'react';
import THEMES_PRIME_REACT from '@/utils/constant';

function App() {
  const isLight = useThemeStore((state: any) => state.isLight);
  useEffect(() => {
    console.log('change')
    console.log({isLight})
    isLight ? THEMES_PRIME_REACT.sohoLight() : THEMES_PRIME_REACT.sohoDark();
  }, [isLight]);
 
  return (
    <div className="App">
      <FloatButton />
      <MenuLeft />
      <Routes >
        <Route path='/' element={<Dashboard />} />
        {/* <Route path='/products' element={<Product />} /> */}
      </Routes>
    </div>
  );
}

export default App;

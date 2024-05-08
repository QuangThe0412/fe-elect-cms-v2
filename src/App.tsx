
import './App.css';
import "primereact/resources/primereact.min.css";
import '@/styles/prime.css';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MenuLeft from '@/components/MenuLeft';
import FloatButton from '@/components/FloatButton';
import useThemeStore from '@/store/theme.store';
import { useEffect } from 'react';

function App() {
  const theme = useThemeStore((state: any) => state.theme);
  console.log({theme})
  useEffect(() => {
    console.log('change')
    theme();
  }, [theme]);
 
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

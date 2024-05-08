
import './App.css';
// import "primereact/resources/themes/md-dark-deeppurple/theme.css";
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
  useEffect(() => {
    import(theme).then((themeModule) => {
      console.log(themeModule)
    });
  }, [theme]);
  // useEffect(() => {
  //   const importThemeDark = () => {
  //     require("primereact/resources/themes/md-dark-deeppurple/theme.css")
  //   };

  //   const importThemeLight = () => {
  //     require("primereact/resources/themes/md-dark-deeppurple/theme.css")
  //   };

  //   const rand = Math.round(Math.random() * 10) > 5;

  //   if(rand) {
  //     importThemeDark();
  //   }else {
  //     importThemeLight();
  //   }

  // }, []);

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

import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import '@/styles/prime.css';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MenuLeft from '@/components/MenuLeft';

function App() {
  return (
    <div className="App">
      <MenuLeft />
      <Routes >
        <Route path='/' element={<Dashboard />} />
        {/* <Route path='/products' element={<Product />} /> */}
      </Routes>
    </div>
  );
}

export default App;

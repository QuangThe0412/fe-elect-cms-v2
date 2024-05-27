
import Dashboard from '@/components/dashboards/Dashboard';
import FloatButton from '@/components/FloatButton';
import Header from '@/components/Header';
import Product from '@/components/products/Product';
import Categories from '@/components/category/Category';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { THEMES_PRIME_REACT } from '@/constants/theme';
import useThemeStore from '@/store/theme.store';

const AdminLayout = () => {
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
};

export default AdminLayout;

import Dashboard from '@/components/dashboards/Dashboard';
import FloatButton from '@/components/FloatButton';
import Header from '@/components/Header';
import Product from '@/components/products/Product';
import Categories from '@/components/category/Category';
import { Route, Routes } from 'react-router-dom';

const AdminLayout = () => {
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
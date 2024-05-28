
import Dashboard from '@/containers/dashboards/Dashboard';
import FloatButton from '@/containers/FloatButton';
import Header from '@/containers/Header';
import Product from '@/containers/products/Product';
import Categories from '@/containers/category/Category';
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
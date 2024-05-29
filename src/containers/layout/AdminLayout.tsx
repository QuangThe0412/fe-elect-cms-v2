
import Dashboard from '@/containers/dashboards/Dashboard';
import FloatButton from '@/containers/FloatButton';
import Header from '@/containers/Header';
import Product from '@/containers/products/Product';
import Categories from '@/containers/category/Category';
import { Outlet, Route, Routes } from 'react-router-dom';
import React from 'react';

const AdminLayout = ({ children }: any) => {
    return (
        <div className="App">
            <FloatButton />
            <div className='header-app'>
                <Header />
            </div>
            <div className='body-app'>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
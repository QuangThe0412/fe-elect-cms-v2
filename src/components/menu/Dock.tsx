
import { useState } from 'react';
import { Dock } from 'primereact/dock';
import { MenuItem } from 'primereact/menuitem';
import { BrowserRouter as Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import '@/styles/dock.css';
import productImage from '@/images/product.png';
import houseImage from '@/images/house.png';
import dashboardImage from '@/images/dashboard.png';
import permissionImage from '@/images/permission.png';
import customerImage from '@/images/customer.png';
import billImage from '@/images/bill.png';
import categoryImage from '@/images/category.png';
import costImage from '@/images/cost.png';

export default function DockMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);

    const items: MenuItem[] = [
        {
            label: 'DashBoard',
            icon: () => <img alt="DashBoard" src={dashboardImage} width="100%" />,
            command: () => {
                setActiveItem('/');
                navigate('/');
            },
        },
        {
            label: 'categoryImage',
            icon: () => <img alt="Test" src={categoryImage} width="100%" />,
            command: () => {
                setActiveItem('/categories');
                navigate('/categories');
            },
        },
        {
            label: 'Product',
            icon: () => <img alt="Product" src={productImage} width="100%" />,
            command: () => {
                setActiveItem('/products');
                navigate('/products');
            },
        },
        {
            label: 'Permission',
            icon: () => <img alt="Permission" src={permissionImage} width="100%" />,
            command: () => {
                setActiveItem('/permission');
                navigate('/permission');
            },
        },
        {
            label: 'customerImage',
            icon: () => <img alt="Test" src={customerImage} width="100%" />,
            command: () => {
                setActiveItem('/test');
                navigate('/test');
            },
        },
        {
            label: 'costImage',
            icon: () => <img alt="Test" src={costImage} width="100%" />,
            command: () => {
                setActiveItem('/test');
                navigate('/test');
            },
        },
        {
            label: 'billImage',
            icon: () => <img alt="Test" src={billImage} width="100%" />,
            command: () => {
                setActiveItem('/test');
                navigate('/test');
            },
        }
    ];

    return (
        <div className="card dock-demo">
            <Dock model={items} position={"top"} />
        </div>
    )
}

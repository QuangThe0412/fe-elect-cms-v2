
import { useEffect, useState } from 'react';
import { Dock } from 'primereact/dock';
import { MenuItem } from 'primereact/menuitem';
import { BrowserRouter as Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '@/styles/dock.css';
import productImage from '@/images/product.png';
import { Tooltip } from 'primereact/tooltip';
import dashboardImage from '@/images/dashboard.png';
import permissionImage from '@/images/permission.png';
import customerImage from '@/images/customer.png';
import billImage from '@/images/bill.png';
import categoryImage from '@/images/category.png';
import costImage from '@/images/cost.png';
import { paths } from '@/constants/api';
import { checkRoleAccess } from '@/utils/common';
import useAuth from '@/hooks/useAuth';

export default function DockMenu() {
    const navigate = useNavigate();
    const { userRole } = useAuth();
    const location = useLocation();
    // const [activeItem, setActiveItem] = useState(location.pathname);

    const HandleGoPath = (path: string) => {
        if (!checkRoleAccess(userRole, path)) {
            console.log('You do not have permission to access this page');
        } else {
            // setActiveItem(path);
            navigate('/loaimon/*');
        }
    };

    const items: MenuItem[] = [
        {
            label: 'Thống kê',
            icon: () => <img alt="DashBoard" src={dashboardImage} width="100%" />,
            command: () => {
                HandleGoPath(paths.dashboard);
            },
        },
        {
            label: 'Loại sản phẩm',
            icon: () => <img alt="Test" src={categoryImage} width="100%" />,
            command: () => {
                HandleGoPath(paths.category);
            },
        },
        {
            label: 'Sản phẩm',
            icon: () => <img alt="Product" src={productImage} width="100%" />,
            command: () => {
                HandleGoPath(paths.product);
            },
        },
        {
            label: 'Permission',
            icon: () => <img alt="Permission" src={permissionImage} width="100%" />,
            command: () => {
                HandleGoPath('/permission');
            },
        },
        {
            label: 'customerImage',
            icon: () => <img alt="Test" src={customerImage} width="100%" />,
            command: () => {
                HandleGoPath('/test');
            },
        },
        {
            label: 'costImage',
            icon: () => <img alt="Test" src={costImage} width="100%" />,
            command: () => {
                HandleGoPath('/test');
            },
        },
        {
            label: 'billImage',
            icon: () => <img alt="Test" src={billImage} width="100%" />,
            command: () => {
                HandleGoPath('/test');
            },
        }
    ];

    return (
        <div className="card dock-demo">
            <Tooltip className="dark-tooltip" target=".dock-advanced .p-dock-action" my="center+15 bottom-15" at="center top" showDelay={150} />
            <div className="dock-window dock-advanced">
                <Dock model={items} position={"top"} />
            </div>
        </div>
    )
}

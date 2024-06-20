import { useRef } from 'react';
import { Dock } from 'primereact/dock';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/constants/api';
import { checkRoleAccess } from '@/utils/common';
import useAuth from '@/hooks/useAuth';
import { Toast } from 'primereact/toast';
import '@/styles/dock.css';
import productImage from '@/images/product.png';
import { Tooltip } from 'primereact/tooltip';
import dashboardImage from '@/images/dashboard.png';
import permissionImage from '@/images/permission.png';
import customerImage from '@/images/customer.png';
import billImage from '@/images/bill.png';
import categoryImage from '@/images/category.png';
import costImage from '@/images/cost.png';
import discountImage from '@/images/discount.png';
import debtImage from '@/images/debt.png';
import importImage from '@/images/import.png';
import exportImage from '@/images/export.png';
import inventoryImage from '@/images/inventory.png';
import houseImage from '@/images/house.png';
import { RoleEnum } from '@/constants';

export default function DockMenu() {
    const navigate = useNavigate();
    const { userRole } = useAuth();
    const toast = useRef<Toast>(null);

    const HandleGoPath = (path: string) => {
        if (!checkRoleAccess(userRole, path)) {
            if (userRole.includes(RoleEnum.ADMIN)) {
                toast.current?.show({ severity: 'info', summary: 'Thông báo', detail: 'Tính năng đang phát triển!' });
                return;
            }
            toast.current?.show({ severity: 'error', summary: 'Thông báo', detail: 'Bạn không có quyền vào trang này!' });
        } else {
            navigate(path);
        }
    };

    const items: MenuItem[] = [
        {
            label: 'Bán hàng',
            icon: () => <img alt="Sale" src={houseImage} width="100%" />,
            data: paths.sale,
            command: () => {
                HandleGoPath(paths.sale);
            },
        },
        {
            label: 'Người dùng',
            icon: () => <img alt="User" src={permissionImage} width="100%" />,
            data: paths.user,
            command: () => {
                HandleGoPath(paths.user);
            },
        },
        {
            label: 'Thống kê',
            icon: () => <img alt="DashBoard" src={dashboardImage} width="100%" />,
            data: paths.dashboard,
            command: () => {
                HandleGoPath(paths.dashboard);
            },
        },
        {
            label: 'Loại sản phẩm',
            icon: () => <img alt="Category" src={categoryImage} width="100%" />,
            data: paths.category,
            command: () => {
                HandleGoPath(paths.category);
            },
        },
        {
            label: 'Sản phẩm',
            icon: () => <img alt="Product" src={productImage} width="100%" />,
            data: paths.product,
            command: () => {
                HandleGoPath(paths.product);
            },
        },
        {
            label: 'Khách hàng',
            icon: () => <img alt="Customer" src={customerImage} width="100%" />,
            data: paths.customer,
            command: () => {
                HandleGoPath(paths.customer);
            },
        },
        {
            label: 'Khuyến mãi',
            icon: () => <img alt="Discount" src={discountImage} width="100%" />,
            data: paths.discount,
            command: () => {
                HandleGoPath(paths.discount);
            },
        },
        {
            label: 'Hóa đơn',
            icon: () => <img alt="Order" src={billImage} width="100%" />,
            data: paths.order,
            command: () => {
                HandleGoPath(paths.order);
            },
        },
        {
            label: 'Công nợ',
            icon: () => <img alt="Test" src={debtImage} width="100%" />,
            data: paths.debt,
            command: () => {
                HandleGoPath(paths.debt);
            },
        },
        {
            label: 'Phiếu nhập',
            icon: () => <img alt="Test" src={importImage} width="100%" />,
            data: paths.import,
            command: () => {
                HandleGoPath(paths.import);
            },
        },
        // {
        //     label: 'Phiếu xuất',
        //     icon: () => <img alt="Test" src={exportImage} width="100%" />,
        // data :paths.export,
        //     command: () => {
        //         HandleGoPath(paths.export);
        //     },
        // },
        // {
        //     label: 'Báo giá',
        //     icon: () => <img alt="Test" src={costImage} width="100%" />,
        // data :paths.test,
        //     command: () => {
        //         HandleGoPath('/test');
        //     },
        // },
        // {
        //     label: 'Kiểm kê',
        //     icon: () => <img alt="Test" src={inventoryImage} width="100%" />,
        // data :paths.test,
        //     command: () => {
        //         HandleGoPath('/test');
        //     },
        // }
    ];

    const _items = items.filter((item) => checkRoleAccess(userRole, item.data as string));

    return (
        <div className="card dock-demo">
            <Toast ref={toast} />
            <Tooltip className="dark-tooltip" target=".dock-advanced .p-dock-action" my="center+15 bottom-15" at="center top" showDelay={150} />
            <div className="dock-window dock-advanced">
                <Dock model={_items} position={"top"} />
            </div>
        </div>
    )
}


import { useRef } from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';
import useThemeStore from '@/store/theme.store';
import { paths } from '@/constants/api';
import productImage from '@/images/product.png';
import dashboardImage from '@/images/dashboard.png';
import permissionImage from '@/images/permission.png';
import customerImage from '@/images/customer.png';
import billImage from '@/images/bill.png';
import categoryImage from '@/images/category.png';
import discountImage from '@/images/discount.png';
import debtImage from '@/images/debt.png';
import importImage from '@/images/import.png';
import houseImage from '@/images/house.png';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { checkRoleAccess } from '@/utils/common';
import { RoleEnum } from '@/constants';

export default function FloatButton() {
    const { changeTheme, isLight } = useThemeStore((state: any) => (
        { changeTheme: state.changeTheme, isLight: state.isLight }
    ));
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const { userRole } = useAuth();

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
        {
            label: 'Change Theme',
            icon: 'pi pi-sync',
            command: () => {
                changeTheme(isLight);
            }
        }
    ];

    return (
        <div className="float-button">
            <Toast ref={toast} />
            <SpeedDial model={items} direction="up" transitionDelay={80} showIcon="pi pi-bars" hideIcon="pi pi-times" buttonClassName="p-button-outlined" />
        </div>
    )
}

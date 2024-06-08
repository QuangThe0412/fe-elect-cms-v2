import { paths } from '@/constants/api';
import { RoleEnum } from '@/constants';
import { Register } from '@/containers/auth/Register';
import Products from '@/containers/products/Product';
import DashboardComponent from '@/containers/dashboards/Dashboard';
import Categories from '@/containers/category/Category';
import LoginComponent from '@/containers/auth/Login';
import User from '@/containers/user/User';
import CustomerComponent from '@/containers/customer/Customer';
import DiscountComponent from '@/containers/discount/Discount';
import Orders from '@/containers/order/Order';
import DebtComponent from '@/containers/debt/Debt';

export type RouteType = {
    path: string,
    component: any,
    roles: string[],
    isPublic?: boolean,
}

export const RouteArray: RouteType[] = [
    {
        path: paths.login,
        component: LoginComponent,
        roles: [RoleEnum.ADMIN, RoleEnum.CASHIER, RoleEnum.SALER, RoleEnum.INVENTORY, RoleEnum.GUEST],
        isPublic: true
    },
    {
        path: paths.register,
        component: Register,
        roles: [RoleEnum.ADMIN, RoleEnum.CASHIER, RoleEnum.SALER, RoleEnum.INVENTORY, RoleEnum.GUEST],
        isPublic: true
    },
    {
        path: paths.user,
        component: User,
        roles: [RoleEnum.ADMIN, RoleEnum.CASHIER, RoleEnum.SALER, RoleEnum.INVENTORY, RoleEnum.GUEST],
    },
    {
        path: paths.dashboard,
        component: DashboardComponent,
        roles: [RoleEnum.ADMIN]
    },
    {
        path: paths.category,
        component: Categories,
        roles: [RoleEnum.ADMIN]
    },
    {
        path: paths.product,
        component: Products,
        roles: [RoleEnum.ADMIN]
    },
    {
        path: paths.customer,
        component: CustomerComponent,
        roles: [RoleEnum.ADMIN]
    },
    {
        path: paths.discount,
        component: DiscountComponent,
        roles: [RoleEnum.ADMIN]
    },
    {
        path: paths.order,
        component: Orders,
        roles: [RoleEnum.ADMIN]
    },
    {
        path: paths.debt,
        component: DebtComponent,
        roles: [RoleEnum.ADMIN]
    },
]
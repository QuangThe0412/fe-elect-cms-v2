import { paths } from '@/constants/api';
import { userRoles } from '@/constants';
import Products from '@/containers/products/Product';
import DashboardComponent from '@/containers/dashboards/Dashboard';
import Categories from '@/containers/category/Category';
import LoginComponent from '@/containers/auth/Login';
import { Register } from '@/containers/auth/Register';

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
        roles: [],
        isPublic: true
    },
    {
        path: paths.register,
        component: Register,
        roles: [],
        isPublic: true
    },
    {
        path: paths.dashboard,
        component: DashboardComponent,
        roles: [userRoles.ADMIN, userRoles.SALER,userRoles.GUEST]
    },
    {
        path: paths.category,
        component: Categories,
        roles: [userRoles.ADMIN, userRoles.SALER,userRoles.GUEST]
    },
    {
        path: paths.product,
        component: Products,
        roles: [userRoles.ADMIN, userRoles.SALER]
    }
]
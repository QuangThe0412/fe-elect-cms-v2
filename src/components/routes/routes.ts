import { paths } from '@/constants/api';
import { userRoles } from '@/constants';
import Products from '@/components/products/Product';
import DashboardComponent from '@/components/dashboards/Dashboard';
import Categories from '@/components/category/Category';
import LoginComponent from '@/components/auth/Login';

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
        path: paths.dashboard,
        component: DashboardComponent,
        roles: [userRoles.ADMIN, userRoles.SALER]
    },
    {
        path: paths.category,
        component: Categories,
        roles: [userRoles.ADMIN, userRoles.SALER]
    },
    {
        path: paths.product,
        component: Products,
        roles: [userRoles.ADMIN, userRoles.SALER]
    }
]
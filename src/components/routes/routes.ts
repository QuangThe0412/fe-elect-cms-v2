import { paths } from '@/constants/api';
import { userRoles } from '@/constants';
import Products from '../products/Product';
import DashboardComponent from '../dashboards/Dashboard';
import Categories from '../category/Category';

export type RouteType = {
    path: string,
    component: any,
    roles: string[],
    isPublic?: boolean,
}

export const RouteArray: RouteType[] = [
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
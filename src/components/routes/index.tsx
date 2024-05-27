
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import PublicLayout from '@/components/layout/PublicLayout';
import useAuth from '@/hooks/useAuth';
import { RouteArray } from './routes';
import NotFound from '../notFound';
import { paths } from '@/constants/api';

const RootRoutes = () => {
    const { isAuthenticated, userRole } = useAuth();
    console.log('isAuthenticated', isAuthenticated);
    return (
        <BrowserRouter>
            <Routes>
                    <Route path="/" element={isAuthenticated ? <Navigate to={paths.dashboard} /> : <Navigate to={paths.login} />} />

                    {RouteArray.map(route => {
                        const AppLayout = route?.isPublic ? PublicLayout : AdminLayout;
                        if (!route?.isPublic && !isAuthenticated) {
                            return (
                                <Route path={route.path} key={route.path} element={<Navigate to={paths.login} />} />
                            )
                        }
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <AppLayout>
                                        <route.component />
                                    </AppLayout>
                                }
                            />
                        );
                    })}
                    <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
        </BrowserRouter>
    )
}

export default RootRoutes;
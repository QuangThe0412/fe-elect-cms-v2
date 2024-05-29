
import { setCookie,getCookie, JwtPayload } from '@/utils/cookie';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/constants';
import {getProfile} from '@/utils/cookie';

const useAuth = () => {
    const profile = getProfile() as JwtPayload;
    return {
        isAuthenticated: getCookie(ACCESS_COOKIE_NAME) ? true : false,
        userRole: profile?.user?.roles || [],
        profile: profile?.user || {},
    }
};

export default useAuth;
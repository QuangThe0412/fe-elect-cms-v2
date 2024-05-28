
import { setCookie,getCookie } from '@/utils/cookie';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/constants';
import {getRole} from '@/utils/cookie';

const useAuth = () => {

    return {
        isAuthenticated: getCookie(ACCESS_COOKIE_NAME) ? true : false,
        userRole: getRole()
    }
};

export default useAuth;
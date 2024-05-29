import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/constants';
import { paths } from '@/constants/api';
import { User } from '@/models';
import { eraseCookie } from '@/utils/cookie';
import axios from 'axios';

export class AuthService {
    static login(username: string, password: string) {
        return axios.post(paths.login, { username, password });
    }

    static register(user: User) {
        return axios.post(paths.register, user);
    }

    static refreshToken(refreshToken: string) {
        return axios.post(paths.refreshToken, { refreshToken });
    }

    static logout() {
        eraseCookie(ACCESS_COOKIE_NAME);
        eraseCookie(REFRESH_COOKIE_NAME);
    }
}
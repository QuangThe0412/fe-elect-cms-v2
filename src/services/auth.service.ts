import { paths } from '@/constants/api';
import { User } from '@/models';
import axios from 'axios';
import { apiUrl } from '@/constants/api';

export class AuthService {
    static login(username: string, password: string) {
        // Gửi yêu cầu đăng nhập đến máy chủ xác thực
        return axios.post(apiUrl + paths.login, { username, password });
    }

    static register(user: User) {
        // Gửi yêu cầu đăng ký đến máy chủ xác thực
        return axios.post(apiUrl + paths.register, user);
    }

    static refreshToken(refreshToken: string) {
        return axios.post(apiUrl + paths.refreshToken, { refreshToken });
    }

    static logout() {
        //remvoe token and refresh token
        console.log('logout');
        return;
    }
}
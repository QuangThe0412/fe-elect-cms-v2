import { paths } from '@/constants/api';
import { User } from '@/models';
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
        //remove token and refresh token
        console.log('logout');
        return;
    }
}
import { paths } from '@/constants/api';
import { typeFormChangePassword } from '@/containers/dialog/dialogChangePassword';
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

    static getProfile(idUser: string) {
        return axios.get(paths.getProfile, { params: { idUser } });
    }

    static updateProfile(user: User) {
        return axios.put(paths.updateProfile, user);
    }

    static changePassword(data : typeFormChangePassword) {
        return axios.put(paths.changePassword, data);
    }
}
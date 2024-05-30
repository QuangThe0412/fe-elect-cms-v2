import axios from 'axios';
import { paths } from '@/constants/api';
import { User } from '@/models/user';

export class UserService {
    static async getUsers() {
        return axios.get(paths.user);
    }

    static async createUser(user: User) {
        return axios.post(paths.user, user);
    }

    static async getUser(id: number) {
        return axios.get(`${paths.user}/${id}`);
    }

    static async updateUser(id: number, user: User) {
        return axios.put(`${paths.user}/${id}`, user);
    }

    static async toggleActiveUser(id: number) {
        return axios.delete(`${paths.user}/${id}`);
    }
}
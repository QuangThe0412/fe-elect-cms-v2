import axios from 'axios';

export class AuthService {
    login(username: string, password: string) {
        // Gửi yêu cầu đăng nhập đến máy chủ xác thực
        return axios.post('/api/login', { username, password });
    }

    register(username: string, password: string) {
        // Gửi yêu cầu đăng ký đến máy chủ xác thực
        return axios.post('/api/register', { username, password });
    }

    logout() {
        // Gửi yêu cầu đăng xuất đến máy chủ xác thực
        return axios.post('/api/logout');
    }
}
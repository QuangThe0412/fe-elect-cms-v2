import axios from 'axios';
import { paths } from '@/constants/api';

export class ThongKeService {
    static async getThongKe(dateFrom: Date, dateTo: Date) {
        return axios.get(paths.dashboard, {
            params: {
                dateFrom,
                dateTo
            }
        });
    }

    static async getThongKeByMonth() {
        return axios.get(paths.dashboard + '/by-month');
    }

    static async getThongKeByWeek() {
        return axios.get(paths.dashboard + '/by-week');
    }
}
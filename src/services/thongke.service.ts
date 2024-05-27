import axios from 'axios';
import { apiUrl } from '@/constants/api';
import { paths } from '@/constants/api';

export class ThongKeService {
    static getThongKe(dateFrom: Date, dateTo: Date) {
        return axios.get(apiUrl + paths.dashboard, {
            params: {
                dateFrom,
                dateTo
            }
        });
    }
}
import axios from 'axios';
import { apiUrl } from '@/utils/constant';

export class ThongKeService {
    static getThongKe(dateFrom: Date, dateTo: Date) {
        return axios.get(apiUrl + '/thongke', {
            params: {
                dateFrom,
                dateTo
            }
        });
    }
}
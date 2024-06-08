import axios from 'axios';
import { paths } from '@/constants/api';
import { DebtDetail } from '@/models';

export const DebtDetailService = {
    getDebtDetails() {
        return axios.get(paths.debtDetails);
    },

    createDebtDetail(debtDetail: DebtDetail) {
        return axios.post(paths.debtDetails, debtDetail);
    },

    updateDebtDetail(id: number, updatedDebtDetail: DebtDetail) {
        return axios.put(paths.debtDetails + `/${id}`, updatedDebtDetail);
    },

    deleteDebtDetail(id: number) {
        return axios.delete(paths.debtDetails + `/${id}`);
    },
}
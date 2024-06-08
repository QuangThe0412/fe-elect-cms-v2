import axios from 'axios';
import { paths } from '@/constants/api';
import { Debt } from '@/models';

export const DebtService = {
    getDebts() {
        return axios.get(paths.debt);
    },

    getDebt(id: number) {
        return axios.get(paths.debt + `/${id}`);
    },

    createDebt(debt: Debt) {
        return axios.post(paths.debt, debt);
    },

    updateDebt(id: number, updatedDebt: Debt) {
        return axios.put(paths.debt + `/${id}`, updatedDebt);
    },

    getAllDebtDetailsByIdDebt(idDebt: number) {
        return axios.get(paths.debt + `/${idDebt}` + paths.debtDetails);
    }
}
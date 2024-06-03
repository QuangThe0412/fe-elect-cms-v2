import axios from 'axios';
import { paths } from '@/constants/api';
import { Discount } from '@/models';

export const DiscountService = {
    getDiscounts() {
        return axios.get(paths.discount);
    },

    getDiscount(id: number) {
        return axios.get(paths.discount + `/${id}`);
    },

    createDiscount(discount: Discount) {
        return axios.post(paths.discount, discount);
    },

    updateDiscount(id: number, updatedDiscount: Discount) {
        return axios.put(paths.discount + `/${id}`, updatedDiscount);
    },

    toggleActiveDiscount(id: number) {
        return axios.delete(paths.discount + `/${id}`);
    },
}
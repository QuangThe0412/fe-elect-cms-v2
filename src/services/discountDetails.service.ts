import axios from 'axios';
import { paths } from '@/constants/api';
import { DiscountDetails } from '@/models';

export const DiscountDetailsService = {
    createDiscountDetail(discountDetail: DiscountDetails) {
        return axios.post(paths.discountDetails, discountDetail);
    },

    updateDiscountDetail(id: number, updatedDiscountDetail: DiscountDetails) {
        return axios.put(paths.discountDetails + `/${id}`, updatedDiscountDetail);
    },

    deletedDiscountDetail(id: number) {
        return axios.delete(paths.discountDetails + `/${id}`);
    },
}

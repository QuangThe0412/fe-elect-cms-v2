import { OrderDetail } from './../models/orderDetails';
import axios from 'axios';
import { paths } from '@/constants/api';

export const OrderDetailsService = {
    getOrderDetail(id: number) {
        return axios.get( paths.orderDetails + `/${id}`);
    },

    createOrderDetail(orderDetail: OrderDetail) {
        return axios.post( paths.orderDetails, orderDetail);
    },

    updateOrderDetail(id: number, updatedOrderDetail: OrderDetail) {
        return axios.put(paths.orderDetails + `/${id}`, updatedOrderDetail);
    },

    toggleActiveOrderDetail(id: number) {
        return axios.delete( paths.orderDetails + `/${id}`);
    },
}
    
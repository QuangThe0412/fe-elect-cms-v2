import axios from 'axios';
import { paths } from '@/constants/api';

export const OrderService = {
  getOrders() {
    return axios.get(paths.order);
  },
  updateStatusOrder(id: number, status: number) {
    return axios.put(paths.order + '/update-status' + `/${id}`, { status });
  },

  //get all order details by order id
  getOrderDetailsByIdOrder(idOrder: number) {
    return axios.get(paths.order + `/${idOrder}` + paths.orderDetails);
  },

};
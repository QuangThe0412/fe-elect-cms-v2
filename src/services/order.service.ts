import axios from 'axios';
import { paths } from '@/constants/api';
import { Order } from '@/models/order';

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

  createOrder(order: any ) { ////////=============== work on this
    return axios.post(paths.order, order);
  }
};
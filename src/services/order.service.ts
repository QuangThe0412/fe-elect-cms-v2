import axios from 'axios';
import { paths } from '@/constants/api';
import { STATUS_ENUM } from '@/constants';

export type _orderDetails = {
  IDMon: number;
  SoLuong?: number;
  DonGia?: number;
  ChietKhau?: number;
}

export interface _order {
  IDKhachHang?: number;
  CongNo?: number;
  TrangThai?: STATUS_ENUM;
  data: _orderDetails[];
}

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

  createOrderWithOrderDetails(data: _order) {
    return axios.post(paths.order, data);
  }
};
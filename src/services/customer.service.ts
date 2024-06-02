import axios from 'axios';
import { paths } from '@/constants/api';
import { Customer } from '@/models';

export const CustomerService = {
    getCustomers() {
        return axios.get( paths.customer);
    },

    getCustomer(id: number) {
        return axios.get( paths.customer + `/${id}`);
    },

    createCustomer(customer: Customer) {
        return axios.post( paths.customer, customer);
    },

    updateCustomer(id: number, updatedCustomer: Customer) {
        return axios.put(paths.customer + `/${id}`, updatedCustomer);
    },

    toggleActiveCustomer(id: number) {
        return axios.delete( paths.customer + `/${id}`);
    },
}
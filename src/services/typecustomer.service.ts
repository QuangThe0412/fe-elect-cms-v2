import axios from 'axios';
import { paths } from '@/constants/api';
import { TypeCustomer } from '@/models';

export const TypeCustomerService = {
    getTypeCustomers() {
        return axios.get( paths.customerType);
    },

    getTypeCustomer(id: number) {
        return axios.get( paths.customerType + `/${id}`);
    },

    createTypeCustomer(typeCustomer: TypeCustomer) {
        return axios.post( paths.customerType, typeCustomer);
    },

    updateTypeCustomer(id: number, updatedTypeCustomer: TypeCustomer) {
        return axios.put(paths.customerType + `/${id}`, updatedTypeCustomer);
    },

    toggleActiveTypeCustomer(id: number) {
        return axios.delete( paths.customerType + `/${id}`);
    },
}
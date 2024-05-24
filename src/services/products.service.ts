import axios from 'axios';
import { apiUrl } from '@/utils/constant';
import { Product } from '@/models';

export const ProductService = {
    getProducts() {
        return axios.get(apiUrl + '/mon');
    },

    getProduct(id: string) {
        return axios.get(`${apiUrl}/mon/${id}`);
    },

    createProduct(product: Product) {
        return axios.post(`${apiUrl}/mon`, product);
    },

    updateProduct(id: string, updatedProduct: Product) {
        return axios.put(`${apiUrl}/mon/${id}`, updatedProduct);
    },

    toggleActiveProduct(id: string) {
        return axios.delete(`${apiUrl}/mon/${id}`);
    },
}
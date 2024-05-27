import axios from 'axios';
import { apiUrl } from '@/constants/api';
import { paths } from '@/constants/api';

export const ProductService = {
    getProducts() {
        return axios.get(apiUrl + paths.product);
    },

    getProduct(id: string) {
        return axios.get(apiUrl + paths.product + `/${id}`);
    },

    createProduct(product: FormData) {
        return axios.post(apiUrl + paths.product, product);
    },

    updateProduct(id: string, updatedProduct: FormData) {
        return axios.put(apiUrl + paths.product + `/${id}`, updatedProduct);
    },

    toggleActiveProduct(id: string) {
        return axios.delete(apiUrl + paths.product + `/${id}`);
    },
}
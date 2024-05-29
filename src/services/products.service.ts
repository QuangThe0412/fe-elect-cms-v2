import axios from 'axios';
import { paths } from '@/constants/api';

export const ProductService = {
    getProducts() {
        return axios.get( paths.product);
    },

    getProduct(id: string) {
        return axios.get( paths.product + `/${id}`);
    },

    createProduct(product: FormData) {
        return axios.post( paths.product, product);
    },

    updateProduct(id: string, updatedProduct: FormData) {
        return axios.put(paths.product + `/${id}`, updatedProduct);
    },

    toggleActiveProduct(id: string) {
        return axios.delete( paths.product + `/${id}`);
    },
}
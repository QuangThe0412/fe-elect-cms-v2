import axios from 'axios';
import { apiUrl } from '@/utils/constant';
import { Category } from '@/models';

export class ProductService {
    getProducts() {
        return axios.get(apiUrl + '/loaimon');
    }

    getProduct(id: string) {
        return axios.get(`${apiUrl}/loaimon/${id}`);
    }

    createProduct(category: Category) {
        return axios.post(`${apiUrl}/loaimon`, category);
    }

    updateProduct(id: string, updatedCategory: Category) {
        return axios.put(`${apiUrl}/loaimon/${id}`, updatedCategory);
    }

    deleteProduct(id: string) {
        return axios.delete(`${apiUrl}/loaimon/${id}`);
    }
}
import axios from 'axios';
import { apiUrl } from '@/utils/constant';
import { Category } from '@/models';

export class CategoryService {
    static getCategories() {
        return axios.get(apiUrl + '/loaimon');
    }

    static getCategory(id: string) {
        return axios.get(`${apiUrl}/loaimon/${id}`);
    }

    static createCategory(category: Category) {
        return axios.post(`${apiUrl}/loaimon`, category);
    }

    static updateCategory(id: string, updatedCategory: Category) {
        return axios.put(`${apiUrl}/loaimon/${id}`, updatedCategory);
    }

    static toggleActiveCategory(id: string) {
        return axios.delete(`${apiUrl}/loaimon/${id}`);
    }
}
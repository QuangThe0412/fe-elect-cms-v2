import axios from 'axios';
import { apiUrl } from '@/constants/api';
import { Category } from '@/models';
import {paths} from '@/constants/api';

export class CategoryService {
    static getCategories() {
        return axios.get(apiUrl + paths.category);
    }

    static getCategory(id: string) {
        return axios.get(apiUrl + paths.category + `/${id}`);
    }

    static createCategory(category: Category) {
        return axios.post(apiUrl + paths.category, category);
    }

    static updateCategory(id: string, updatedCategory: Category) {
        return axios.put(apiUrl + paths.category + `/${id}`, updatedCategory);
    }

    static toggleActiveCategory(id: string) {
        return axios.delete(apiUrl + paths.category + `/${id}`);
    }
}
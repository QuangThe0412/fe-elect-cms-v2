import axios from 'axios';
import { Category } from '@/models';
import {paths} from '@/constants/api';

export class CategoryService {
    static getCategories() {
        return axios.get(paths.category);
    }

    static getCategory(id: string) {
        return axios.get(paths.category + `/${id}`);
    }

    static createCategory(category: Category) {
        return axios.post(paths.category, category);
    }

    static updateCategory(id: string, updatedCategory: Category) {
        return axios.put(paths.category + `/${id}`, updatedCategory);
    }

    static toggleActiveCategory(id: string) {
        return axios.delete(paths.category + `/${id}`);
    }
}
import axios from 'axios';
import { apiUrl } from '@/utils/constant';
import { CategoryGroup } from '@/models';

export class CategoryGroupService {
    static getCategoryGroups() {
        return axios.get(apiUrl + '/nhommon');
    }

    static getCategoryGroup(id: string) {
        return axios.get(`${apiUrl}/nhommon/${id}`);
    }

    static createCategoryGroup(category: FormData) {
        return axios.post(`${apiUrl}/nhommon`, category);
    }

    static updateCategoryGroup(id: string, updatedCategoryGroup: FormData) {
        return axios.put(`${apiUrl}/nhommon/${id}`, updatedCategoryGroup);
    }
}
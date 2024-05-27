import axios from 'axios';
import { apiUrl } from '@/constants/api';
import { CategoryGroup } from '@/models';
import { paths } from '@/constants/api';

export class CategoryGroupService {
    static getCategoryGroups() {
        return axios.get(apiUrl + paths.categoryGroup);
    }

    static getCategoryGroup(id: string) {
        return axios.get(apiUrl + paths.categoryGroup + `/${id}`);
    }

    static createCategoryGroup(category: CategoryGroup) {
        return axios.post(apiUrl + paths.categoryGroup, category);
    }

    static updateCategoryGroup(id: string, updatedCategoryGroup: CategoryGroup) {
        return axios.put(apiUrl + paths.categoryGroup + `/${id}`, updatedCategoryGroup);
    }
}